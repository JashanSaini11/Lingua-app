import { achievements } from "@/data/achievements";
import { getKnownWordCount } from "@/lib/learn";
import type { AchievementStat } from "@/types/learning";

// The numbers achievements are measured against.
export type AchievementStats = Record<AchievementStat, number>;

type ProgressSnapshot = {
  completedLessonIds: string[];
  practiceSessions: number;
  streakDays: number;
  totalXp: number;
  todayXp: number;
  dailyGoalXp: number;
};

// Turns the saved progress into the stats an achievement is measured against.
export function getAchievementStats(progress: ProgressSnapshot): AchievementStats {
  return {
    lessons: progress.completedLessonIds.length,
    practice: progress.practiceSessions,
    streak: progress.streakDays,
    words: getKnownWordCount(progress.completedLessonIds),
    xp: progress.totalXp,
    goal: progress.todayXp >= progress.dailyGoalXp ? 1 : 0,
  };
}

// Adds every achievement that was just reached, with today's date, and keeps
// the ones already earned. The same object is returned when nothing is new.
export function unlockAchievements(
  unlocked: Record<string, string>,
  stats: AchievementStats,
  date: string,
): Record<string, string> {
  const reached = achievements.filter(
    (item) => !unlocked[item.id] && stats[item.stat] >= item.target,
  );

  if (reached.length === 0) {
    return unlocked;
  }

  const next = { ...unlocked };
  for (const item of reached) {
    next[item.id] = date;
  }
  return next;
}
