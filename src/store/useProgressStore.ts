import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProgressState = {
  xp: number; // XP earned today
  dailyGoalXp: number; // XP needed to reach today's goal
  streakDays: number;
  level: string; // CEFR level shown on the home screen
  completedLessonIds: string[];
  // Saves a finished lesson and adds its XP. Does nothing if already done.
  completeLesson: (lessonId: string, xpReward: number) => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 0,
      dailyGoalXp: 20,
      streakDays: 0,
      level: "A1",
      completedLessonIds: [],
      completeLesson: (lessonId, xpReward) =>
        set((state) =>
          state.completedLessonIds.includes(lessonId)
            ? state
            : {
                xp: state.xp + xpReward,
                completedLessonIds: [...state.completedLessonIds, lessonId],
              },
        ),
    }),
    {
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
