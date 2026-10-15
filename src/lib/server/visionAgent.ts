// Server only. Talks to the Python Vision Agent server (vision-agent/).
// The mobile app never calls it directly, it goes through our API routes.

// Must match AGENT_USER_ID in vision-agent/agent.py.
export const AGENT_USER_ID = "language-teacher";
export const AGENT_USER_NAME = "AI Language Teacher";

function getAgentUrl(): string {
  return process.env.VISION_AGENT_URL ?? "http://127.0.0.1:8000";
}

// Asks the agent server to join the call. Returns the agent session id.
export async function startAgentSession(
  callType: string,
  callId: string,
): Promise<string> {
  const response = await fetch(`${getAgentUrl()}/calls/${callId}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ call_type: callType }),
  });
  if (!response.ok) {
    throw new Error(`Vision Agent returned ${response.status}`);
  }
  const { session_id } = (await response.json()) as { session_id: string };
  return session_id;
}

// Asks the agent to leave the call. A session that is already gone is fine.
export async function stopAgentSession(
  callId: string,
  sessionId: string,
): Promise<void> {
  const response = await fetch(
    `${getAgentUrl()}/calls/${callId}/sessions/${sessionId}`,
    { method: "DELETE" },
  );
  if (!response.ok && response.status !== 404) {
    throw new Error(`Vision Agent returned ${response.status}`);
  }
}
