import { getLessonsByLanguage, getLessonsByUnit } from "@/data/lessons";
import type { LanguageCode, PracticeQuestion } from "@/types/learning";

export const XP_PER_CORRECT_ANSWER = 2;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Builds a new practice session from the unit's lessons:
// "What does this word mean?" questions plus the lessons' own multiple-choice
// activities. The order and the wrong answers change every time.
export function buildPracticeQuestions(
  unitId: string,
  languageCode: LanguageCode,
  count = 8,
): PracticeQuestion[] {
  const unitLessons = getLessonsByUnit(unitId);
  const allTranslations = getLessonsByLanguage(languageCode)
    .flatMap((lesson) => lesson.vocabulary)
    .map((item) => item.translation);

  const wordQuestions: PracticeQuestion[] = unitLessons
    .flatMap((lesson) => lesson.vocabulary)
    .map((item) => {
      const wrongAnswers = shuffle(
        [...new Set(allTranslations)].filter(
          (translation) => translation !== item.translation,
        ),
      ).slice(0, 3);

      return {
        id: item.id,
        emoji: item.emoji,
        prompt: `What does "${item.word}" mean?`,
        options: shuffle([item.translation, ...wrongAnswers]),
        correctAnswer: item.translation,
      };
    });

  const activityQuestions: PracticeQuestion[] = unitLessons
    .flatMap((lesson) => lesson.activities)
    .flatMap((activity) =>
      activity.type === "multiple-choice"
        ? [
            {
              id: activity.id,
              prompt: activity.prompt,
              options: shuffle(activity.options),
              correctAnswer: activity.correctAnswer,
            },
          ]
        : [],
    );

  // A word can appear as both kinds of question, so keep one per prompt.
  const seenPrompts = new Set<string>();
  const unique = shuffle([...wordQuestions, ...activityQuestions]).filter(
    (question) => {
      if (seenPrompts.has(question.prompt)) {
        return false;
      }
      seenPrompts.add(question.prompt);
      return true;
    },
  );

  return unique.slice(0, count);
}
