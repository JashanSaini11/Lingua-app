import type { useUser } from "@clerk/expo";

import { apiPost } from "@/lib/api";

// The API key is public. The secret stays on the server (src/lib/server).
export const streamApiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export type StreamUserInfo = {
  id: string;
  name: string;
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
    { lessonId, userName: user.name, userImage: user.image },
  );
}
