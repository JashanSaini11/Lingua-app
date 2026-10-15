import type { useUser } from "@clerk/expo";

import { apiPost } from "@/lib/api";

// The API key is public. The secret stays on the server (src/lib/server).
export const streamApiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export type StreamUserInfo = {
  id: string;
  name: string;
  // Only the real first name. The AI teacher says it out loud, so we never
  // pass an email prefix or a username here.
  firstName?: string;
  image?: string;
};

// The Stream user id is the Clerk user id, the same one the server reads
// from the verified Clerk token when it creates tokens and calls.
export function getStreamUserInfo(user: ClerkUser): StreamUserInfo {
  return {
    id: user.id,
    name:
      user.fullName ??
      user.username ??
      user.primaryEmailAddress?.emailAddress.split("@")[0] ??
      "Learner",
    firstName: user.firstName ?? user.fullName?.split(" ")[0] ?? undefined,
    image: user.imageUrl,
  };
}

export async function fetchStreamToken(
  clerkToken: string | null,
): Promise<string> {
  const { token } = await apiPost<{ token: string }>(
    "/api/stream/token",
    clerkToken,
  );
  return token;
}

export function createLessonCall(
  clerkToken: string | null,
  lessonId: string,
  user: StreamUserInfo,
) {
  return apiPost<{ callId: string; callType: string }>(
    "/api/stream/call",
    clerkToken,
    {
      lessonId,
      userName: user.name,
      firstName: user.firstName,
      userImage: user.image,
      // So the teacher can say good morning, afternoon or evening for the learner's time.
      utcOffsetMinutes: -new Date().getTimezoneOffset(),
    },
  );
}

// Asks our server to make the AI teacher join the call.
export function startAgent(
  clerkToken: string | null,
  callType: string,
  callId: string,
) {
  return apiPost<{ sessionId: string; agentUserId: string }>(
    "/api/agent/start",
    clerkToken,
    { callType, callId },
  );
}

// Asks our server to make the AI teacher leave the call.
export function stopAgent(
  clerkToken: string | null,
  callType: string,
  callId: string,
  sessionId: string,
) {
  return apiPost<{ ok: boolean }>("/api/agent/stop", clerkToken, {
    callType,
    callId,
    sessionId,
  });
}
