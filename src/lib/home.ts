import { getLessonById, getLessonsByLanguage, getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { getToday } from "@/lib/date";
import type { DailyProgress } from "@/store/useProgressStore";
import type { Language, PlanItem } from "@/types/learning";

// Builds what the home screen needs from the lesson data and today's progress:
// the unit to continue and today's plan.
export function getHomeContent(
  language: Language,
  completedLessonIds: string[],
  today: DailyProgress,
) {
  const lessons = getLessonsByLanguage(language.code);

  // The next lesson to take. Falls back to the first one when all are done.
  const currentLesson =
    lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
    lessons[0];

  const units = getUnitsByLanguage(language.code);
  const unit =
    units.find((item) => item.id === currentLesson?.unitId) ?? units[0];

  // The lesson finished today, if any. It replaces the "next lesson" text.
  const lastLessonToday = getLessonById(today.lessonIds.at(-1) ?? "");

  // The practice session asks about every word of the unit.
  const wordCount = currentLesson
    ? getLessonsByUnit(currentLesson.unitId).flatMap(
        (lesson) => lesson.vocabulary,
      ).length
    : 0;

  // Languages without lessons yet (like English) have an empty plan.
  const plan: PlanItem[] = currentLesson
    ? [
        {
          id: "lesson",
          kind: "lesson",
          title: "Lesson",
          subtitle: (lastLessonToday ?? currentLesson).title,
          done: lastLessonToday !== undefined,
        },
        {
          id: "words",
          kind: "words",
          title: "New words",
          subtitle: `${wordCount} words`,
          done: today.practiced,
        },
      ]
    : [];

  return {
    unitNumber: unit?.order ?? 1,
    level: unit?.level ?? "A1",
    currentLesson,
    plan,
  };
}

// A new word every day, picked from the language's lessons. It is the same all
// day long and changes at midnight, so nothing has to be saved.
export function getWordOfTheDay(language: Language) {
  const words = getLessonsByLanguage(language.code).flatMap(
    (lesson) => lesson.vocabulary,
  );
  if (words.length === 0) {
    return undefined;
  }

  const daysSince1970 = Math.floor(
    new Date(getToday()).getTime() / (24 * 60 * 60 * 1000),
  );
  return words[daysSince1970 % words.length];
}
