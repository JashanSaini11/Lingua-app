import { getClerkUserId } from "@/lib/server/clerkAuth";
import { getStreamServerClient } from "@/lib/server/stream";

// POST /api/stream/token
// Gives the signed-in Clerk user a Stream token. The Stream user id is the
// Clerk user id from the verified session, never something the app sends.
export async function POST(request: Request) {
  const userId = await getClerkUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const token = getStreamServerClient().generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });
    return Response.json({ token });
  } catch (error) {
    console.error("Stream token failed", error);
    return Response.json(
      { error: "Could not create a Stream token." },
      { status: 500 },
    );
  }
}
