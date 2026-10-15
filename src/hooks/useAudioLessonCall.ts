import { useAuth, useUser } from "@clerk/expo";
import {
  CallingState,
  useStreamVideoClient,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  createLessonCall,
  getStreamUserInfo,
  startAgent,
  stopAgent,
} from "@/lib/stream";

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

// The AI teacher has its own state: the learner can already be in the call
// while the teacher is still joining, or failed to join.
export type AgentStatus = "idle" | "connecting" | "connected" | "failed";

// How long we wait for the teacher to show up in the call.
const AGENT_JOIN_TIMEOUT_MS = 30_000;

type AgentSession = { callType: string; callId: string; sessionId: string };

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/permission|NotAllowed/i.test(message)) {
    return "Microphone access is off. Allow it in Settings and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

// Owns one audio-only Stream call for one lesson: start, mute and end.
// It also starts the AI teacher in the same call and stops it again.
export function useAudioLessonCall(lessonId: string) {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();
  const { user } = useUser();

  const callRef = useRef<Call | undefined>(undefined);
  const stopListeningRef = useRef<(() => void) | undefined>(undefined);
  const agentSessionRef = useRef<AgentSession | undefined>(undefined);
  // The unmount cleanup always needs the latest getToken.
  const getTokenRef = useRef(getToken);

  const [status, setStatus] = useState<CallStatus>("idle");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
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

  // Asks the server to make the AI teacher leave. Safe to call more than once.
  const stopAgentSession = useCallback(async () => {
    const session = agentSessionRef.current;
    agentSessionRef.current = undefined;
    if (!session) return;

    try {
      await stopAgent(
        await getTokenRef.current(),
        session.callType,
        session.callId,
        session.sessionId,
      );
    } catch (stopError) {
      console.error(stopError);
    }
  }, []);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // Never leave a call or the AI teacher running when the screen closes.
  useEffect(() => {
    return () => {
      stopAgentSession();
      leaveCall();
    };
  }, [leaveCall, stopAgentSession]);

  // Starts the AI teacher and waits until it shows up as a participant.
  // A failure here does not end the call, it only marks the teacher as failed.
  const connectAgent = useCallback(
    async (call: Call, callType: string, callId: string) => {
      setAgentStatus("connecting");
      try {
        const { sessionId, agentUserId } = await startAgent(
          await getTokenRef.current(),
          callType,
          callId,
        );
        agentSessionRef.current = { callType, callId, sessionId };

        // The learner may have ended the call while the teacher was starting.
        if (callRef.current !== call) {
          await stopAgentSession();
          return;
        }

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            subscription.unsubscribe();
            reject(new Error("The AI teacher took too long to join."));
          }, AGENT_JOIN_TIMEOUT_MS);
          const subscription = call.state.participants$.subscribe(
            (participants) => {
              if (participants.some((p) => p.userId === agentUserId)) {
                clearTimeout(timer);
                subscription.unsubscribe();
                resolve();
              }
            },
          );
        });
        if (callRef.current === call) setAgentStatus("connected");
      } catch (agentError) {
        console.error(agentError);
        if (callRef.current === call) setAgentStatus("failed");
      }
    },
    [stopAgentSession],
  );

  const start = useCallback(async () => {
    if (!client || !user) {
      setError("Still connecting to the lesson server. Try again in a moment.");
      setStatus("error");
      return;
    }

    // Starting again after an error or an ended call: drop the old call first.
    await stopAgentSession();
    await leaveCall();
    setError(undefined);
    setAgentStatus("idle");
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

      // 3. The learner is in the call, now the AI teacher joins the same call.
      // Not awaited: the learner can start talking while the teacher connects.
      connectAgent(call, callType, callId);
    } catch (startError) {
      await stopAgentSession();
      await leaveCall();
      setError(getErrorMessage(startError));
      setStatus("error");
    }
  }, [
    client,
    connectAgent,
    getToken,
    leaveCall,
    lessonId,
    stopAgentSession,
    user,
  ]);

  const toggleMic = useCallback(async () => {
    try {
      await callRef.current?.microphone.toggle();
      setError(undefined);
    } catch (micError) {
      setError(getErrorMessage(micError));
    }
  }, []);

  const end = useCallback(async () => {
    await stopAgentSession();
    await leaveCall();
    setIsMicOn(false);
    setAgentStatus("idle");
    setStatus("ended");
  }, [leaveCall, stopAgentSession]);

  return { status, agentStatus, isMicOn, error, start, toggleMic, end };
}
