import { getHomeContent } from "@/lib/home";
import { getKnownWordCount } from "@/lib/learn";
import type { DailyProgress } from "@/store/useProgressStore";
import type { Language } from "@/types/learning";

const levelNames: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
};

// Builds what the profile screen needs from the lesson data and progress:
// the level ("A1") with its name ("Beginner") and how many words the learner knows.
export function getProfileContent(
  language: Language,
  completedLessonIds: string[],
  today: DailyProgress,
) {
  const { level } = getHomeContent(language, completedLessonIds, today);

  return {
    level,
    levelName: levelNames[level] ?? "",
    wordsKnown: getKnownWordCount(completedLessonIds),
  };
}
