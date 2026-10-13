import { getLessonsByLanguage, getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import type { Language, Lesson, LessonStatus } from "@/types/learning";

export type LessonWithStatus = { lesson: Lesson; status: LessonStatus };

// Builds what the lessons screen needs: the unit the learner is in and
// its lessons with a status. Nothing is locked, so every lesson can be opened.
export function getLearnContent(
  language: Language,
  completedLessonIds: string[],
) {
  const isDone = (lessonId: string) => completedLessonIds.includes(lessonId);
  const languageLessons = getLessonsByLanguage(language.code);

  // The next lesson to take. Falls back to the first one when all are done.
  const currentLesson =
    languageLessons.find((lesson) => !isDone(lesson.id)) ?? languageLessons[0];

  const unit = getUnitsByLanguage(language.code).find(
    (item) => item.id === currentLesson?.unitId,
  );

  if (!unit) {
    return null;
  }

  const items: LessonWithStatus[] = getLessonsByUnit(unit.id).map((lesson) => ({
    lesson,
    status: isDone(lesson.id)
      ? "completed"
      : lesson.id === currentLesson.id
        ? "in-progress"
        : "not-started",
  }));

  return {
    unit,
    items,
    completedCount: items.filter((item) => item.status === "completed").length,
  };
}
