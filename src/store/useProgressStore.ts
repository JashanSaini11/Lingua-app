import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getLessonById } from "@/data/lessons";
import { getAchievementStats, unlockAchievements } from "@/lib/achievements";
import { addDays, getToday, getYesterday } from "@/lib/date";

// What the learner did on one day. It starts fresh when a new day begins.
export type DailyProgress = {
  date: string; // "2026-10-16", the day this record belongs to
  xp: number; // XP earned that day
  lessonIds: string[]; // lessons finished that day, newest last
  practiced: boolean; // finished a practice session that day
};

type ProgressState = {
  dailyGoalXp: number; // XP needed to reach the daily goal
  dailyProgress: DailyProgress;
  streakDays: number; // days in a row with activity, up to `lastActiveDate`
  lastActiveDate: string | null;
  activeDates: string[]; // recent days with activity, shown in the week strip
  completedLessonIds: string[];
  totalXp: number; // all XP ever earned, shown on the profile
  practiceSessions: number; // practice sessions finished
  unlockedAchievements: Record<string, string>; // achievement id -> day it was earned
  setDailyGoalXp: (xp: number) => void;
  // Saves a finished lesson. XP is only added the first time it is finished.
  completeLesson: (lessonId: string, xpReward: number) => void;
  // Saves a finished practice session and adds its XP.
  completePractice: (xp: number) => void;
};

const emptyDay = (date: string): DailyProgress => ({
  date,
  xp: 0,
  lessonIds: [],
  practiced: false,
});

// A record saved on an earlier day is not today's, so today starts empty.
export function getTodayProgress(daily: DailyProgress): DailyProgress {
  const today = getToday();
  return daily.date === today ? daily : emptyDay(today);
}

// The streak is only alive if the learner was active today or yesterday.
export function getCurrentStreak(
  streakDays: number,
  lastActiveDate: string | null,
): number {
  return lastActiveDate === getToday() || lastActiveDate === getYesterday()
    ? streakDays
    : 0;
}

// Changes today's record and moves the streak, for any kind of activity.
function recordActivity(
  state: ProgressState,
  change: (day: DailyProgress) => DailyProgress,
) {
  const today = getToday();
  const streakDays =
    state.lastActiveDate === today
      ? state.streakDays
      : state.lastActiveDate === getYesterday()
        ? state.streakDays + 1
        : 1;

  return {
    dailyProgress: change(getTodayProgress(state.dailyProgress)),
    streakDays,
    lastActiveDate: today,
    activeDates: state.activeDates.includes(today)
      ? state.activeDates
      : [...state.activeDates, today].slice(-60),
  };
}

// Adds the achievements the learner has just earned to a change of the state.
// Every action ends with this, so an achievement is saved the moment it is reached.
function withAchievements(
  state: ProgressState,
  changes: Partial<ProgressState>,
): Partial<ProgressState> {
  const next = { ...state, ...changes };
  const stats = getAchievementStats({
    completedLessonIds: next.completedLessonIds,
    practiceSessions: next.practiceSessions,
    streakDays: next.streakDays,
    totalXp: next.totalXp,
    todayXp: getTodayProgress(next.dailyProgress).xp,
    dailyGoalXp: next.dailyGoalXp,
  });

  return {
    ...changes,
    unlockedAchievements: unlockAchievements(
      next.unlockedAchievements,
      stats,
      getToday(),
    ),
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      dailyGoalXp: 20,
      dailyProgress: emptyDay(getToday()),
      streakDays: 0,
      lastActiveDate: null,
      activeDates: [],
      completedLessonIds: [],
      totalXp: 0,
      practiceSessions: 0,
      unlockedAchievements: {},
      setDailyGoalXp: (xp) =>
        set((state) => withAchievements(state, { dailyGoalXp: xp })),
      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          const isFirstTime = !state.completedLessonIds.includes(lessonId);
          return withAchievements(state, {
            ...recordActivity(state, (day) => ({
              ...day,
              xp: day.xp + (isFirstTime ? xpReward : 0),
              lessonIds: [
                ...day.lessonIds.filter((id) => id !== lessonId),
                lessonId,
              ],
            })),
            completedLessonIds: isFirstTime
              ? [...state.completedLessonIds, lessonId]
              : state.completedLessonIds,
            totalXp: state.totalXp + (isFirstTime ? xpReward : 0),
          });
        }),
      completePractice: (xp) =>
        set((state) =>
          withAchievements(state, {
            ...recordActivity(state, (day) => ({
              ...day,
              xp: day.xp + xp,
              practiced: true,
            })),
            totalXp: state.totalXp + xp,
            practiceSessions: state.practiceSessions + 1,
          }),
        ),
    }),
    {
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Version 1 added total XP, practice sessions and achievements. Progress
      // saved before that gets them filled in from the lessons already finished.
      // Version 2 added the days with activity, built from the saved streak.
      version: 2,
      migrate: (saved, version) => {
        const old = saved as ProgressState;
        const withDays: ProgressState = {
          ...old,
          activeDates:
            version >= 2 || !old.lastActiveDate
              ? (old.activeDates ?? [])
              : Array.from({ length: old.streakDays ?? 0 }, (_, index) =>
                  addDays(old.lastActiveDate as string, -index),
                ).reverse(),
        };
        if (version >= 1) {
          return withDays;
        }

        const completedLessonIds = old.completedLessonIds ?? [];
        const totalXp = completedLessonIds.reduce(
          (sum, id) => sum + (getLessonById(id)?.xpReward ?? 0),
          0,
        );
        const dailyGoalXp = old.dailyGoalXp ?? 20;

        return {
          ...withDays,
          totalXp,
          practiceSessions: 0,
          unlockedAchievements: unlockAchievements(
            {},
            getAchievementStats({
              completedLessonIds,
              practiceSessions: 0,
              streakDays: old.streakDays ?? 0,
              totalXp,
              todayXp: old.dailyProgress?.xp ?? 0,
              dailyGoalXp,
            }),
            getToday(),
          ),
        };
      },
    },
  ),
);
