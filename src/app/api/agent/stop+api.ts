import { getClerkUserId } from "@/lib/server/clerkAuth";
import { isCallCreator } from "@/lib/server/stream";
import { stopAgentSession } from "@/lib/server/visionAgent";

// POST /api/agent/stop  { callId, callType, sessionId }
// Asks the Vision Agent server to make the AI teacher leave the call.
export async function POST(request: Request) {
  const userId = await getClerkUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const {
    callId,
    callType = "default",
    sessionId,
  } = (await request.json().catch(() => ({}))) as {
    callId?: string;
    callType?: string;
    sessionId?: string;
  };
  if (!callId || !sessionId || !(await isCallCreator(userId, callType, callId))) {
    return Response.json({ error: "Call not found." }, { status: 404 });
  }

  try {
    await stopAgentSession(callId, sessionId);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Vision Agent stop failed", error);
    return Response.json(
      { error: "Could not stop the AI teacher." },
      { status: 502 },
    );
  }
}
