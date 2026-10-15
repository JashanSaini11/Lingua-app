import { useAuth, useUser } from "@clerk/expo";
import {
  CallingState,
  useStreamVideoClient,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { createLessonCall, getStreamUserInfo } from "@/lib/stream";

// What the audio lesson screen shows:
// idle -> starting (server creates the call) -> connecting (joining)
// -> joined <-> reconnecting -> ended, or error at any step.
export type CallStatus =
  | "idle"
  | "starting"
  | "connecting"
  | "joined"
  | "reconnecting"
  | "ended"
  | "error";

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/permission|NotAllowed/i.test(message)) {
    return "Microphone access is off. Allow it in Settings and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

// Owns one audio-only Stream call for one lesson: start, mute and end.
export function useAudioLessonCall(lessonId: string) {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();
  const { user } = useUser();

  const callRef = useRef<Call | undefined>(undefined);
  const stopListeningRef = useRef<(() => void) | undefined>(undefined);

  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMicOn, setIsMicOn] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Stops listening to the call and leaves it, once.
  const leaveCall = useCallback(async () => {
    const call = callRef.current;
    callRef.current = undefined;
    stopListeningRef.current?.();
    stopListeningRef.current = undefined;

    if (call && call.state.callingState !== CallingState.LEFT) {
      await call.leave().catch((leaveError) => console.error(leaveError));
    }
  }, []);

  // Never leave a call running when the screen closes.
  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, [leaveCall]);

  const start = useCallback(async () => {
    if (!client || !user) {
      setError("Still connecting to the lesson server. Try again in a moment.");
      setStatus("error");
      return;
    }

    // Starting again after an error or an ended call: drop the old call first.
    await leaveCall();
    setError(undefined);
    setStatus("starting");

    try {
      // 1. Our server creates the call for this lesson and this user.
      const { callId, callType } = await createLessonCall(
        await getToken(),
        lessonId,
        getStreamUserInfo(user),
      );

      // 2. The app joins it. `reuseInstance` returns the same Call if it exists.
      const call = client.call(callType, callId, { reuseInstance: true });
      callRef.current = call;

      // Keep the screen in sync with the call.
      const callingStateSub = call.state.callingState$.subscribe((state) => {
        if (state === CallingState.JOINING) setStatus("connecting");
        if (state === CallingState.JOINED) setStatus("joined");
        if (
          state === CallingState.RECONNECTING ||
          state === CallingState.MIGRATING ||
          state === CallingState.OFFLINE
        ) {
          setStatus("reconnecting");
        }
        if (state === CallingState.RECONNECTING_FAILED) {
          setError("The connection was lost. Please start the call again.");
          setStatus("error");
        }
      });
      const micSub = call.microphone.state.status$.subscribe((micStatus) =>
        setIsMicOn(micStatus === "enabled"),
      );
      stopListeningRef.current = () => {
        callingStateSub.unsubscribe();
        micSub.unsubscribe();
      };

      setStatus("connecting");
      await call.join();
      // Audio only: we turn the microphone on and never touch the camera.
      await call.microphone.enable();
    } catch (startError) {
      await leaveCall();
      setError(getErrorMessage(startError));
      setStatus("error");
    }
  }, [client, getToken, leaveCall, lessonId, user]);

  const toggleMic = useCallback(async () => {
    try {
      await callRef.current?.microphone.toggle();
      setError(undefined);
    } catch (micError) {
      setError(getErrorMessage(micError));
    }
  }, []);

  const end = useCallback(async () => {
    await leaveCall();
    setIsMicOn(false);
    setStatus("ended");
  }, [leaveCall]);

  return { status, isMicOn, error, start, toggleMic, end };
}
