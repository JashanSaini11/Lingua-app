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
AGENT_API_SECRET=... # any long random string, see "Security" below
```

Set `LLM_PROVIDER=openai` in `.env` to use OpenAI instead of the default Gemini.

```bash
cd vision-agent
uv sync
uv run agent.py run     # console mode, opens a browser demo
uv run agent.py serve   # HTTP server (GET /health, /ready)
```

## How the teacher behaves

- The teacher speaks **English** by default (`TEACHER_LANGUAGE` in `.env`) and teaches only
  the lesson the learner opened. The language being taught comes from the lesson.
- It never switches language mid-lesson. If the learner asks, it politely stays on topic.
- It greets the learner by first name and by their local time of day, like
  "Good evening, Alex!". The app sends the first name and the phone's UTC offset when it
  creates the call.
- Each teacher has her own Gemini voice (`TEACHER_VOICES` in `agent.py`). Set `GEMINI_VOICE`
  to use one voice for everyone.
- After each learner attempt the teacher silently calls the `report_progress` tool with its
  current 1 to 5 scores for speaking, pronunciation and grammar. The newest scores are saved in
  the call's custom data (`feedback`) and shown live on the lesson screen, so they exist even
  when the learner ends the call early.
- When every item is practiced, the teacher recaps, says goodbye and calls `finish_lesson`. That saves
  the final scores and sets `lessonOver` in the call's custom data. The app then ends the call by
  itself a few seconds later (so the goodbye can finish), and the learner gets the lesson XP.
- Everything the teacher says is written to the Stream chat channel `messaging:{call_id}`.
  The Expo server adds the learner to that channel when it creates the call, and the lesson
  screen shows the teacher's latest message live in the speech bubble.
- If the lesson cannot be loaded, the teacher says sorry and leaves instead of guessing.

## Cost and safety limits

Set in `.env` (defaults shown in `.env.example`):

| Setting | What it does |
| --- | --- |
| `MAX_SESSION_MINUTES` | A lesson call is closed after this many minutes |
| `MAX_CONCURRENT_SESSIONS` | How many lessons can run at once |
| one teacher per call | Hardcoded: `max_sessions_per_call=1`, so a double tap cannot add two teachers |

The agent also leaves by itself 60 seconds after the learner leaves the call.

## Security

`serve` mode checks the `x-agent-secret` header against `AGENT_API_SECRET` for starting,
stopping and viewing sessions. The Expo server sends it automatically. Put the same value in
both `.env` files. If it is empty the server has no auth, which is only fine on localhost.

## How the app uses it

1. Start the agent server: `uv run agent.py serve` (listens on `http://127.0.0.1:8000`).
2. The Expo server (`VISION_AGENT_URL` in the root `.env`) proxies two routes to it:
   - `POST /api/agent/start` -> `POST /calls/{call_id}/sessions`
   - `POST /api/agent/stop` -> `DELETE /calls/{call_id}/sessions/{session_id}`
3. `/api/stream/call` stores the lesson in the Stream call's custom data (title, goals,
   vocabulary, phrases, opening line, teacher prompt, learner first name, UTC offset).
   `join_call` in `agent.py` reads it and builds the teacher prompt before the agent joins.

The agent user id (`language-teacher`) is added to the call as an `admin` member so it can
publish audio.
