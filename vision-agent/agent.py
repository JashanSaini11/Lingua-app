"""AI language teacher (voice only).

A realtime speech-to-speech LLM (Gemini by default, OpenAI optional) is the
brain, Stream Edge is the transport.

Run locally:   uv run agent.py run
Run as server: uv run agent.py serve
"""

import asyncio
import hmac
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Header, HTTPException
from vision_agents.core import Agent, AgentLauncher, Runner, ServeOptions, User
from vision_agents.core.instructions import Instructions
from vision_agents.core.llm.llm import LLM
from vision_agents.plugins import gemini, getstream, openai

# Load the parent .env (shared with the Expo app) first, then an optional
# vision-agent/.env that can override it. Must run before creating the agent.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

logger = logging.getLogger(__name__)

# Must match AGENT_USER_ID in src/lib/server/visionAgent.ts. The Expo server adds this user
# to the call as an admin, so the agent is allowed to publish audio.
AGENT_USER_ID = "language-teacher"

# Teacher personas (names come from the lesson) and the Gemini voice for each.
TEACHERS: dict[str, str] = {
    "Spanish": "Sofía",
    "French": "Camille",
    "Japanese": "Yuki",
    "English": "Emma",
}
TEACHER_VOICES: dict[str, str] = {
    "Sofía": "Aoede",
    "Camille": "Leda",
    "Yuki": "Zephyr",
    "Emma": "Sulafat",
}

# The language the teacher SPEAKS. Change it with TEACHER_LANGUAGE in .env.
TEACHER_LANGUAGE = os.getenv("TEACHER_LANGUAGE", "English")
# Which realtime LLM to use: "gemini" (free tier, GOOGLE_API_KEY) or "openai" (paid, OPENAI_API_KEY).
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

# Cost and safety limits, all configurable in .env.
MAX_SESSION_MINUTES = float(os.getenv("MAX_SESSION_MINUTES", "15"))
MAX_CONCURRENT_SESSIONS = int(os.getenv("MAX_CONCURRENT_SESSIONS", "5"))
# Shared secret the Expo server sends in the x-agent-secret header.
# Leave it empty for local development only.
AGENT_API_SECRET = os.getenv("AGENT_API_SECRET", "")


def create_llm() -> LLM:
    # Realtime LLMs handle speech in and out, so no STT / TTS / turn detection is needed.
    if LLM_PROVIDER == "openai":
        return openai.Realtime(send_video=False)  # voice only
    return gemini.Realtime()


def set_teacher_voice(llm: LLM, teacher_name: str) -> None:
    """Give each teacher her own Gemini voice. Must run before the agent joins."""
    voice = os.getenv("GEMINI_VOICE") or TEACHER_VOICES.get(teacher_name)
    if LLM_PROVIDER != "gemini" or not voice:
        return
    try:
        # The plugin only takes its config when it is created, and the voice
        # depends on the lesson, so we update the config before it connects.
        llm._base_config["speech_config"]["voice_config"]["prebuilt_voice_config"][
            "voice_name"
        ] = voice
    except (AttributeError, KeyError, TypeError):
        logger.warning("Could not set the teacher voice, using the default voice")


def get_time_of_day(utc_offset_minutes: object) -> tuple[str, str] | None:
    """The learner's local time of day, like ("evening", "Good evening").

    The app sends its UTC offset, so this is the time where the learner is
    right now, at the moment the teacher joins.
    """
    if isinstance(utc_offset_minutes, bool) or not isinstance(
        utc_offset_minutes, (int, float)
    ):
        return None
    if abs(utc_offset_minutes) > 14 * 60:
        return None

    hour = (datetime.now(timezone.utc) + timedelta(minutes=utc_offset_minutes)).hour
    if 5 <= hour < 12:
        return "morning", "Good morning"
    if 12 <= hour < 17:
        return "afternoon", "Good afternoon"
    if 17 <= hour < 24:
        return "evening", "Good evening"
    return "late at night", "Hello"


def build_instructions(teacher_language: str, lesson: dict | None = None) -> str:
    """The teacher prompt. `lesson` is the call's custom data sent by the Expo app."""
    lesson = lesson or {}
    learning_language = lesson.get("languageName") or "language"
    teacher_name = lesson.get("teacherName") or TEACHERS.get(learning_language, "Alex")
    text = f"""You are {teacher_name}, a real, friendly {learning_language} teacher talking with one learner in a live voice lesson. Sound like a warm, energetic human, not a robot or a textbook.

STAY ON TOPIC
- You only teach {learning_language}, and only the lesson described below. Use only the goals, vocabulary and phrases listed for this lesson.
- Never teach unrelated topics, extra vocabulary from other lessons, or any other language.
- If the learner goes off topic or asks you to switch languages, answer kindly in one short sentence and steer back to the lesson. Do not switch languages.

HOW YOU SPEAK
- Speak mostly in {teacher_language}. Use {teacher_language} for greetings, explanations, instructions, feedback and encouragement.
- Bring in {learning_language} only for the lesson words and phrases. Say each one slowly and clearly, then give its meaning in {teacher_language}, like "Hola, that means hello."
- Talk the way people really talk: short, natural sentences with contractions like "let's", "you're", "that's" and "don't".
- Keep every reply to one or two conversational sentences. Never give long explanations.
- Sound upbeat and caring. Use gentle encouragement like "Nice try!", "You're getting it!" or "Great job!", and vary your wording so you never repeat the same praise twice in a row.
- Do not use emojis, markdown, lists, labels or special characters. Everything you write is spoken aloud.

HOW YOU TEACH
- Go one small step at a time: introduce one word or phrase, then ask the learner to repeat it.
- Listen carefully to what the learner says. React to their actual answer: praise what was right, gently fix what was off by saying the correct version once, then ask them to try again.
- Adapt to the learner. If they struggle, slow down and break the word into smaller parts. If they're doing well, move on to the next item.
- Ask only one question at a time, then stop and wait for their answer.
- The learner uses push-to-talk, so they speak in short bursts and are silent in between. Never fill the silence or answer for them, just wait.
- When all the lesson items are practiced, celebrate their progress, give a short recap, and then call the report_progress tool once with honest scores based on what you heard.
"""

    learner_name = lesson.get("learnerName")
    time_of_day = get_time_of_day(lesson.get("utcOffsetMinutes"))
    if learner_name or time_of_day:
        text += "\nTHE LEARNER\n"
        if learner_name:
            text += (
                f"- Their name is {learner_name}. Use it now and then like a real teacher "
                "would, for example when you praise them, but not in every reply.\n"
            )
        if time_of_day:
            text += (
                f"- It is {time_of_day[0]} where they are right now, so greet them "
                "that way and never mention another time of day.\n"
            )

    if lesson.get("lessonTitle"):
        text += f"\nTODAY'S LESSON: {lesson['lessonTitle']}\n"

    goals = lesson.get("goals") or []
    if goals:
        text += "\nGOALS (by the end the learner can):\n"
        text += "".join(f"- {goal}\n" for goal in goals)

    vocabulary = lesson.get("vocabulary") or []
    if vocabulary:
        text += "\nVOCABULARY TO TEACH (word, meaning, pronunciation):\n"
        text += "".join(
            f"- {item.get('word')} = {item.get('translation')} ({item.get('pronunciation', '')})\n"
            for item in vocabulary
        )

    phrases = lesson.get("phrases") or []
    if phrases:
        text += "\nPHRASES TO PRACTICE:\n"
        text += "".join(
            f"- {item.get('text')} = {item.get('translation')}\n" for item in phrases
        )

    if lesson.get("teacherPrompt"):
        text += f"\nLESSON INSTRUCTIONS:\n{lesson['teacherPrompt']}\n"

    return text


def build_greeting(teacher_language: str, lesson: dict) -> str:
    """What the teacher is asked to do the moment she joins the call."""
    learner_name = lesson.get("learnerName")
    time_of_day = get_time_of_day(lesson.get("utcOffsetMinutes"))
    hello = time_of_day[1] if time_of_day else "Hello"
    hello = f"{hello}, {learner_name}!" if learner_name else f"{hello}!"

    opening_line = lesson.get("openingLine")
    if opening_line:
        return (
            f'Start the lesson now. First greet the learner by saying "{hello}" '
            "Then say the rest of this opening line warmly, in your own natural words. "
            "Skip any plain hello or hi at its start, because you already greeted them, "
            f"but keep greetings in the language being taught: {opening_line} "
            "Then stop and wait for the learner to answer. Do not teach anything yet."
        )
    return (
        f'Start the lesson now. Greet the learner in {teacher_language} by saying "{hello}" '
        "Introduce yourself as their teacher in one sentence and ask if they're ready to begin. "
        "Then stop and wait for their answer."
    )


async def load_lesson(call, attempts: int = 3) -> dict:
    """Read the lesson the Expo app stored in the Stream call's custom data.

    Returns an empty dict when the lesson cannot be loaded, so the teacher
    never teaches the wrong lesson.
    """
    for attempt in range(1, attempts + 1):
        try:
            response = await call.get()
            lesson = response.data.call.custom or {}
            if lesson.get("lessonTitle"):
                return lesson
            logger.warning("The call has no lesson data (attempt %s)", attempt)
        except Exception:
            logger.exception("Could not read the call custom data (attempt %s)", attempt)
        await asyncio.sleep(0.5 * attempt)
    return {}


# A score from 1 to 5 for each skill, reported by the teacher at the end.
def clamp_score(value: object) -> int:
    try:
        return max(1, min(5, int(value)))  # type: ignore[call-overload]
    except (TypeError, ValueError):
        return 3


async def create_agent(**kwargs) -> Agent:
    # The lesson is not known yet. join_call replaces these instructions
    # with the real lesson before the agent joins.
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id=AGENT_USER_ID),
        instructions=build_instructions(TEACHER_LANGUAGE),
        llm=create_llm(),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)

    # The lesson must be applied BEFORE joining: the LLM reads its instructions on connect.
    lesson = await load_lesson(call)
    if not lesson:
        # Never teach a guessed lesson. Apologise out loud, then leave.
        async with agent.join(call):
            await agent.simple_response(
                f"In {TEACHER_LANGUAGE}, say in one short sentence that something went "
                "wrong while loading the lesson, and ask the learner to close it and try again."
            )
            await asyncio.sleep(8)
        return

    logger.info(
        "Teaching lesson %s (%s) to %s",
        lesson.get("lessonTitle"),
        lesson.get("languageName"),
        lesson.get("learnerName") or "an unnamed learner",
    )
    agent.instructions = Instructions(
        input_text=build_instructions(TEACHER_LANGUAGE, lesson)
    )
    agent.llm.set_instructions(agent.instructions)
    set_teacher_voice(agent.llm, lesson.get("teacherName", ""))

    # The teacher calls this once at the end. The scores are stored in the call's
    # custom data, and the app shows them on the lesson screen.
    @agent.llm.register_function(
        description=(
            "Report how the learner did. Call this exactly once, at the very end of the "
            "lesson, after your recap. Each score is a whole number from 1 (needs a lot "
            "of practice) to 5 (excellent)."
        )
    )
    async def report_progress(speaking: int, pronunciation: int, grammar: int) -> dict:
        """speaking, pronunciation and grammar: whole numbers from 1 to 5."""
        feedback = {
            "speaking": clamp_score(speaking),
            "pronunciation": clamp_score(pronunciation),
            "grammar": clamp_score(grammar),
        }
        try:
            await call.update(custom={**lesson, "feedback": feedback})
        except Exception:
            logger.exception("Could not save the lesson feedback")
        return {"saved": True}

    async with agent.join(call):
        await agent.simple_response(build_greeting(TEACHER_LANGUAGE, lesson))
        await agent.finish()


def require_agent_secret(x_agent_secret: str | None = Header(default=None)) -> None:
    """FastAPI dependency: only our Expo server may start or stop the teacher."""
    if not AGENT_API_SECRET:
        return
    if not hmac.compare_digest(x_agent_secret or "", AGENT_API_SECRET):
        raise HTTPException(status_code=401, detail="Invalid agent secret")


if __name__ == "__main__":
    if not AGENT_API_SECRET:
        logger.warning("AGENT_API_SECRET is empty: the agent server has no auth")

    launcher = AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
        # One teacher per lesson call, a time limit, and a cap on parallel lessons.
        max_sessions_per_call=1,
        max_session_duration_seconds=MAX_SESSION_MINUTES * 60,
        max_concurrent_sessions=MAX_CONCURRENT_SESSIONS,
    )
    Runner(
        launcher,
        serve_options=ServeOptions(
            can_start_session=require_agent_secret,
            can_close_session=require_agent_secret,
            can_view_session=require_agent_secret,
        ),
    ).cli()
