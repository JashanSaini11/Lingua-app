// Server only. Talks to the Python Vision Agent server (vision-agent/).
// The mobile app never calls it directly, it goes through our API routes.

// Must match AGENT_USER_ID in vision-agent/agent.py.
export const AGENT_USER_ID = "language-teacher";
export const AGENT_USER_NAME = "AI Language Teacher";

// A stuck agent server must not hang the request forever.
const AGENT_REQUEST_TIMEOUT_MS = 10_000;

function getAgentUrl(): string {
  return process.env.VISION_AGENT_URL ?? "http://127.0.0.1:8000";
}

// The agent server only accepts requests that carry this shared secret.
// It must match AGENT_API_SECRET in the vision-agent .env (empty = no auth, local only).
function getAgentHeaders(): Record<string, string> {
  const secret = process.env.AGENT_API_SECRET;
  return {
    "Content-Type": "application/json",
    ...(secret ? { "x-agent-secret": secret } : {}),
  };
}

// Asks the agent server to join the call. Returns the agent session id.
export async function startAgentSession(
  callType: string,
  callId: string,
): Promise<string> {
  const response = await fetch(`${getAgentUrl()}/calls/${callId}/sessions`, {
    method: "POST",
    headers: getAgentHeaders(),
    body: JSON.stringify({ call_type: callType }),
    signal: AbortSignal.timeout(AGENT_REQUEST_TIMEOUT_MS),
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
    {
      method: "DELETE",
      headers: getAgentHeaders(),
      signal: AbortSignal.timeout(AGENT_REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok && response.status !== 404) {
    throw new Error(`Vision Agent returned ${response.status}`);
  }
}
