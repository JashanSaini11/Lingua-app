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
// while the teacher is still joining, failed to join, or left the call later
// (for example when the session time limit is reached).
export type AgentStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed"
  | "left";

// Scores from 1 to 5 that the AI teacher reports at the end of the lesson.
export type LessonFeedback = {
  speaking: number;
  pronunciation: number;
  grammar: number;
};

// How long we wait for the teacher to show up in the call.
const AGENT_JOIN_TIMEOUT_MS = 30_000;

// The learner only earns the lesson XP after talking with the teacher this long.
export const MIN_LESSON_SECONDS = 60;

// The mic stays open a moment after the button is released. The AI decides
// the learner has finished by hearing a short silence, so cutting the mic
// instantly can make it answer late or not at all.
const MIC_RELEASE_DELAY_MS = 400;

type CallInfo = { callType: string; callId: string };
type AgentSession = CallInfo & { sessionId: string };

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/permission|NotAllowed/i.test(message)) {
    return "Microphone access is off. Allow it in Settings and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

// Reads the scores the teacher saved in the call's custom data, if any.
function readFeedback(
  custom: Record<string, unknown>,
): LessonFeedback | undefined {
  const feedback = custom.feedback as Partial<LessonFeedback> | undefined;
  if (
    typeof feedback?.speaking === "number" &&
    typeof feedback.pronunciation === "number" &&
    typeof feedback.grammar === "number"
  ) {
    return {
      speaking: feedback.speaking,
      pronunciation: feedback.pronunciation,
      grammar: feedback.grammar,
    };
  }
  return undefined;
}

// Owns one audio-only Stream call for one lesson: start, push to talk and end.
// It also starts the AI teacher in the same call and stops it again.
export function useAudioLessonCall(lessonId: string) {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();
  const { user } = useUser();

  const callRef = useRef<Call | undefined>(undefined);
  const callInfoRef = useRef<CallInfo | undefined>(undefined);
  const stopListeningRef = useRef<(() => void) | undefined>(undefined);
  const agentWatchRef = useRef<(() => void) | undefined>(undefined);
  const agentSessionRef = useRef<AgentSession | undefined>(undefined);
  // When the teacher showed up. Used to decide if the lesson earns XP.
  const agentConnectedAtRef = useRef<number | undefined>(undefined);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // The unmount cleanup always needs the latest getToken.
  const getTokenRef = useRef(getToken);

  const [status, setStatus] = useState<CallStatus>("idle");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [isMicOn, setIsMicOn] = useState(false);
  const [feedback, setFeedback] = useState<LessonFeedback | undefined>();
  // True when the teacher says the lesson is over (recap and goodbye are done).
  const [isLessonOver, setIsLessonOver] = useState(false);
  // The id of the running call. The transcript hook uses it to find the chat channel.
  const [callId, setCallId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  // Stops listening to the call and leaves it, once.
  const leaveCall = useCallback(async () => {
    const call = callRef.current;
    callRef.current = undefined;
    stopListeningRef.current?.();
    stopListeningRef.current = undefined;
    agentWatchRef.current?.();
    agentWatchRef.current = undefined;
    clearTimeout(releaseTimerRef.current);

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

  // After the teacher joined, notice when it disappears from the call.
  const watchAgentLeaving = useCallback(
    (call: Call, agentUserId: string) => {
      agentWatchRef.current?.();
      const subscription = call.state.participants$.subscribe((participants) => {
        if (callRef.current !== call) return;
        // While reconnecting, the list can be briefly empty. That is not a leave.
        if (call.state.callingState !== CallingState.JOINED) return;
        if (participants.some((p) => p.userId === agentUserId)) return;

        subscription.unsubscribe();
        agentWatchRef.current = undefined;
        setAgentStatus("left");
        // The server session is over or about to be, forget it.
        stopAgentSession();
      });
      agentWatchRef.current = () => subscription.unsubscribe();
    },
    [stopAgentSession],
  );

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
        if (callRef.current === call) {
          agentConnectedAtRef.current ??= Date.now();
          setAgentStatus("connected");
          watchAgentLeaving(call, agentUserId);
        }
      } catch (agentError) {
        console.error(agentError);
        // Free the half-started session on the server before showing the error.
        await stopAgentSession();
        if (callRef.current === call) setAgentStatus("failed");
      }
    },
    [stopAgentSession, watchAgentLeaving],
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
    setFeedback(undefined);
    setIsLessonOver(false);
    setAgentStatus("idle");
    agentConnectedAtRef.current = undefined;
    setStatus("starting");

    try {
      // 1. Our server creates the call for this lesson and this user.
      const { callId, callType } = await createLessonCall(
        await getToken(),
        lessonId,
        getStreamUserInfo(user),
      );
      callInfoRef.current = { callType, callId };
      setCallId(callId);

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
      // The teacher saves its scores in the call's custom data while it teaches,
      // and marks the lesson as over when it has said goodbye.
      const customSub = call.state.custom$.subscribe((custom) => {
        const scores = readFeedback(custom);
        if (scores) setFeedback(scores);
        if (custom.lessonOver === true) setIsLessonOver(true);
      });
      stopListeningRef.current = () => {
        callingStateSub.unsubscribe();
        micSub.unsubscribe();
        customSub.unsubscribe();
      };

      setStatus("connecting");
      await call.join();
      // Push to talk: the mic stays closed until the learner holds the button,
      // so background noise never reaches the AI teacher. Turning it on and off
      // once asks for the microphone permission now, not in the middle of a hold.
      await call.microphone.enable();
      await call.microphone.disable();

      // 3. The learner is in the call, now the AI teacher joins the same call.
      // Not awaited: the learner can start talking while the teacher connects.
      connectAgent(call, callType, callId);
    } catch (startError) {
      await stopAgentSession();
      await leaveCall();
      setCallId(undefined);
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

  // Calls the teacher again after it failed to join or left the call.
  const retryAgent = useCallback(async () => {
    const call = callRef.current;
    const info = callInfoRef.current;
    if (!call || !info) return;

    await stopAgentSession();
    await connectAgent(call, info.callType, info.callId);
  }, [connectAgent, stopAgentSession]);

  // Mic changes run one after the other, so a quick press and release always
  // ends with the mic closed, even if turning it on was still in progress.
  const micQueueRef = useRef<Promise<void>>(Promise.resolve());

  const setMic = useCallback((on: boolean) => {
    micQueueRef.current = micQueueRef.current.then(async () => {
      const microphone = callRef.current?.microphone;
      if (!microphone) return;
      try {
        if (on) await microphone.enable();
        else await microphone.disable();
        setError(undefined);
      } catch (micError) {
        setError(getErrorMessage(micError));
      }
    });
  }, []);

  // Called when the learner presses and releases the talk button.
  const startTalking = useCallback(() => {
    // Pressing again right after a release keeps the mic open.
    clearTimeout(releaseTimerRef.current);
    setMic(true);
  }, [setMic]);

  const stopTalking = useCallback(() => {
    clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = setTimeout(
      () => setMic(false),
      MIC_RELEASE_DELAY_MS,
    );
  }, [setMic]);

  // Ends the call. Returns true when the learner talked with the teacher long
  // enough to earn the lesson XP, so a quick start and stop gives nothing.
  const end = useCallback(async (): Promise<boolean> => {
    const connectedAt = agentConnectedAtRef.current;
    const earnedXp =
      connectedAt !== undefined &&
      Date.now() - connectedAt >= MIN_LESSON_SECONDS * 1000;

    await stopAgentSession();
    await leaveCall();
    agentConnectedAtRef.current = undefined;
    setIsMicOn(false);
    setAgentStatus("idle");
    setCallId(undefined);
    setStatus("ended");
    return earnedXp;
  }, [leaveCall, stopAgentSession]);

  return {
    status,
    agentStatus,
    isMicOn,
    feedback,
    isLessonOver,
    callId,
    error,
    start,
    retryAgent,
    startTalking,
    stopTalking,
    end,
  };
}
