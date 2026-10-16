import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef, useState } from "react";
import { StreamChat, type Channel } from "stream-chat";

import { fetchStreamToken, streamApiKey } from "@/lib/stream";

// Live captions of the lesson: what the AI teacher says and what the learner says.
// The Vision Agent writes both to the Stream chat channel that has the same id
// as the call. We watch that channel and keep the latest message of each side,
// which grows while that person is still talking.
export function useTeacherTranscript(callId: string | undefined) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  // `getToken` from Clerk changes on every render. If it was an effect
  // dependency, each new message would re-run the effect and call
  // channel.watch() again, until Stream answers "Too many requests".
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // The text is saved together with its call id, so the text of an old call
  // is never shown in a new one.
  const [transcript, setTranscript] = useState<{
    callId: string;
    teacherText: string | undefined;
    learnerText: string | undefined;
  }>();

  useEffect(() => {
    if (!callId || !userId) return;

    let cancelled = false;
    let channel: Channel | undefined;

    // The channel only has two members: the learner and the teacher.
    // Everything that is not from the learner is the teacher.
    const readLatestTexts = () => {
      const messages = (channel?.state.messages ?? []).filter(
        (message) => message.text,
      );
      setTranscript({
        callId,
        teacherText: messages.findLast((message) => message.user?.id !== userId)
          ?.text,
        learnerText: messages.findLast((message) => message.user?.id === userId)
          ?.text,
      });
    };

    const connect = async () => {
      try {
        const chat = StreamChat.getInstance(streamApiKey);
        // The same user token works for Stream Video and Stream Chat.
        if (chat.userID !== userId) {
          await chat.connectUser({ id: userId }, async () =>
            fetchStreamToken(await getTokenRef.current()),
          );
        }
        if (cancelled) return;

        channel = chat.channel("messaging", callId);
        await channel.watch();
        if (cancelled) {
          await channel.stopWatching();
          return;
        }

        readLatestTexts();
        channel.on("message.new", readLatestTexts);
        channel.on("message.updated", readLatestTexts);
      } catch (transcriptError) {
        // The transcript is a bonus. The lesson works without it.
        console.error("Live transcript failed", transcriptError);
      }
    };
    connect();

    return () => {
      cancelled = true;
      channel?.off("message.new", readLatestTexts);
      channel?.off("message.updated", readLatestTexts);
      channel?.stopWatching().catch(() => undefined);
    };
  }, [callId, userId]);

  const current = transcript?.callId === callId ? transcript : undefined;
  return {
    teacherText: current?.teacherText,
    learnerText: current?.learnerText,
  };
}
