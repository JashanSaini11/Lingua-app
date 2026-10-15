"""AI language teacher (voice only).

A realtime speech-to-speech LLM (Gemini by default, OpenAI optional) is the
brain, Stream Edge is the transport.

Run locally:   uv run agent.py run
Run as server: uv run agent.py serve
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, User
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

# Languages the learner can pick in the app, with the teacher persona for each.
TEACHERS: dict[str, str] = {
    "Spanish": "Sofía",
    "French": "Camille",
    "Japanese": "Yuki",
    "English": "Emma",
}

# The language the teacher SPEAKS. Change it with TEACHER_LANGUAGE in .env.
TEACHER_LANGUAGE = os.getenv("TEACHER_LANGUAGE", "English")
# The language the learner is studying. Change it with LEARNING_LANGUAGE in .env.
LEARNING_LANGUAGE = os.getenv("LEARNING_LANGUAGE", "Spanish")
# Which realtime LLM to use: "gemini" (free tier, GOOGLE_API_KEY) or "openai" (paid, OPENAI_API_KEY).
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()


def create_llm() -> LLM:
    # Realtime LLMs handle speech in and out, so no STT / TTS / turn detection is needed.
    if LLM_PROVIDER == "openai":
        return openai.Realtime(send_video=False)  # voice only
    return gemini.Realtime()


def build_instructions(
    teacher_language: str, learning_language: str, lesson: dict | None = None
) -> str:
    """The teacher prompt. `lesson` is the call's custom data sent by the Expo app."""
    lesson = lesson or {}
    teacher_name = lesson.get("teacherName") or TEACHERS.get(learning_language, "Alex")
    text = f"""You are {teacher_name}, a warm, patient and encouraging {learning_language} teacher in a language learning app. This is a voice-only lesson.

SPEAKING LANGUAGE
- Always speak to the learner in {teacher_language}. Use {teacher_language} for greetings, explanations, instructions, feedback and encouragement.
- Only use {learning_language} for the words and short phrases being taught. Say each one slowly, then explain its meaning in {teacher_language}.
- If the learner asks you to speak a different language (for example "speak in French" or "explain in Spanish"), call the change_speaking_language tool and switch to that language right away.

TEACHING STYLE
- Teach {learning_language} one small step at a time: one word or phrase, then ask the learner to repeat it.
- Listen to the learner's pronunciation. Praise what is right and gently correct what is not.
- Keep every reply short (one to three sentences) because this is a spoken conversation.
- Ask one question at a time and wait for the answer.
- Do not use emojis, markdown, lists or special characters. Everything you write is spoken aloud.
"""

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


async def load_lesson(call) -> dict:
    """Read the lesson the Expo app stored in the Stream call's custom data."""
    try:
        response = await call.get()
        return response.data.call.custom or {}
    except Exception:
        logger.exception("Could not read the call custom data, using the default lesson")
        return {}


async def create_agent(**kwargs) -> Agent:
    agent = Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id=AGENT_USER_ID),
        instructions=build_instructions(TEACHER_LANGUAGE, LEARNING_LANGUAGE),
        llm=create_llm(),
    )

    @agent.llm.register_function(
        description=(
            "Change the language the teacher speaks to the learner. "
            "Call this when the learner asks to be taught in a different language."
        )
    )
    async def change_speaking_language(language: str) -> dict:
        """language: the language to speak from now on, in English (e.g. "Spanish")."""
        logger.info("Teacher speaking language changed to %s", language)
        return {
            "speaking_language": language,
            "instruction": f"From now on speak to the learner in {language}. "
            f"Keep teaching {LEARNING_LANGUAGE} words and phrases as before.",
        }

    return agent


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)

    # The lesson must be applied BEFORE joining: the LLM reads its instructions on connect.
    lesson = await load_lesson(call)
    learning_language = lesson.get("languageName") or LEARNING_LANGUAGE
    logger.info("Teaching lesson %s (%s)", lesson.get("lessonTitle"), learning_language)
    agent.instructions = Instructions(
        input_text=build_instructions(TEACHER_LANGUAGE, learning_language, lesson)
    )
    agent.llm.set_instructions(agent.instructions)

    opening_line = lesson.get("openingLine")
    greeting = (
        f"Start the lesson by saying this opening line: {opening_line}"
        if opening_line
        else f"Greet the learner in {TEACHER_LANGUAGE}, introduce yourself as their "
        f"{learning_language} teacher, and ask if they are ready to start."
    )

    async with agent.join(call):
        await agent.simple_response(greeting)
        await agent.finish()


if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()
