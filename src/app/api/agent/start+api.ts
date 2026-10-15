import { getClerkUserId } from "@/lib/server/clerkAuth";
import { isCallCreator } from "@/lib/server/stream";
import { AGENT_USER_ID, startAgentSession } from "@/lib/server/visionAgent";

// POST /api/agent/start  { callId, callType }
// Asks the Vision Agent server to join the learner's call as the AI teacher.
export async function POST(request: Request) {
  const userId = await getClerkUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const { callId, callType = "default" } = (await request
    .json()
    .catch(() => ({}))) as { callId?: string; callType?: string };
  if (!callId || !(await isCallCreator(userId, callType, callId))) {
    return Response.json({ error: "Call not found." }, { status: 404 });
  }

  try {
    const sessionId = await startAgentSession(callType, callId);
    return Response.json({ sessionId, agentUserId: AGENT_USER_ID });
  } catch (error) {
    console.error("Vision Agent start failed", error);
    return Response.json(
      { error: "The AI teacher could not join. Is the agent server running?" },
      { status: 502 },
    );
  }
}
