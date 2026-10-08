import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import type { Language, PlanItem } from "@/types/learning";

// Builds what the home screen needs from the lesson data:
// the unit to continue and today's plan.
export function getHomeContent(
  language: Language,
  completedLessonIds: string[],
) {
  const lessons = getLessonsByLanguage(language.code);
  const isDone = (lessonId: string) => completedLessonIds.includes(lessonId);

  // The next lesson to take. Falls back to the first one when all are done.
  const currentLesson = lessons.find((lesson) => !isDone(lesson.id)) ?? lessons[0];
  const lastDoneLesson = lessons.findLast((lesson) => isDone(lesson.id));

  const unit = getUnitsByLanguage(language.code).find(
    (item) => item.id === currentLesson?.unitId,
  );

  // Languages without lessons yet (like English) have an empty plan.
  const plan: PlanItem[] = currentLesson
    ? [
        {
          id: "lesson",
          kind: "lesson",
          title: "Lesson",
          subtitle: (lastDoneLesson ?? currentLesson).title,
          done: lastDoneLesson !== undefined,
        },
        {
          id: "conversation",
          kind: "conversation",
          title: "AI Conversation",
          subtitle: `Talk with ${language.teacherName}`,
          done: false,
        },
        {
          id: "words",
          kind: "words",
          title: "New words",
          subtitle: `${currentLesson.vocabulary.length} words`,
          done: false,
        },
      ]
    : [];

  return { unitNumber: unit?.order ?? 1, plan };
}
