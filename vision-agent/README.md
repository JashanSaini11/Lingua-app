# vision-agent

Voice-only AI language teacher built with [Vision Agents](https://visionagents.ai).
LLM: Gemini Realtime (free tier) or OpenAI Realtime (paid). Transport: Stream Edge.

## Setup

Keys are read from the parent `../.env` (shared with the Expo app):

```
STREAM_API_KEY=...
STREAM_API_SECRET=...
GOOGLE_API_KEY=...   # free key: https://aistudio.google.com/apikey
# OPENAI_API_KEY=... # only if LLM_PROVIDER=openai (paid)
```

Set `LLM_PROVIDER=openai` in `.env` to use OpenAI instead of the default Gemini.

```bash
cd vision-agent
uv sync
uv run agent.py run     # console mode, opens a browser demo
uv run agent.py serve   # HTTP server (GET /health, /ready)
```

## Changing the language

The teacher speaks **English** by default and teaches the learning language through English.

| What | How |
| --- | --- |
| Language the teacher speaks | `TEACHER_LANGUAGE=Spanish` in `.env` |
| Language being taught | `LEARNING_LANGUAGE=French` in `.env` |
| Mid-lesson | The learner says "please speak in Spanish" and the teacher switches (`change_speaking_language` tool) |

## How the app uses it

1. Start the agent server: `uv run agent.py serve` (listens on `http://127.0.0.1:8000`).
2. The Expo server (`VISION_AGENT_URL` in the root `.env`) proxies two routes to it:
   - `POST /api/agent/start` -> `POST /calls/{call_id}/sessions`
   - `POST /api/agent/stop` -> `DELETE /calls/{call_id}/sessions/{session_id}`
3. `/api/stream/call` stores the lesson in the Stream call's custom data (title, goals,
   vocabulary, phrases, opening line, teacher prompt). `join_call` in `agent.py` reads it
   and builds the teacher prompt before the agent joins.

The agent user id (`language-teacher`) is added to the call as an `admin` member so it can
publish audio. Keep the agent server private (localhost or a private network): it has no auth of its own.
