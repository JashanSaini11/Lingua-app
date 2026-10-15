import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef, useState } from "react";
import { StreamChat, type Channel } from "stream-chat";

import { fetchStreamToken, streamApiKey } from "@/lib/stream";

// Live text of what the AI teacher is saying.
// The Vision Agent writes every sentence it speaks to the Stream chat channel
// that has the same id as the call. We watch that channel and keep the latest
// teacher message, which grows while the teacher is still talking.
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
    text: string | undefined;
  }>();

  useEffect(() => {
    if (!callId || !userId) return;

    let cancelled = false;
    let channel: Channel | undefined;

    // The channel only has two members: the learner and the teacher.
    // Everything that is not from the learner is the teacher.
    const readLatestTeacherText = () => {
      const messages = channel?.state.messages ?? [];
      const latest = messages.findLast(
        (message) => message.user?.id !== userId && message.text,
      );
      setTranscript({ callId, text: latest?.text });
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

        readLatestTeacherText();
        channel.on("message.new", readLatestTeacherText);
        channel.on("message.updated", readLatestTeacherText);
      } catch (transcriptError) {
        // The transcript is a bonus. The lesson works without it.
        console.error("Live transcript failed", transcriptError);
      }
    };
    connect();

    return () => {
      cancelled = true;
      channel?.off("message.new", readLatestTeacherText);
      channel?.off("message.updated", readLatestTeacherText);
      channel?.stopWatching().catch(() => undefined);
    };
  }, [callId, userId]);

  return {
    teacherText:
      transcript && transcript.callId === callId ? transcript.text : undefined,
  };
}
