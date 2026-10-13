import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PracticeState = {
  sessionsCompleted: number;
  bestScores: Record<string, number>; // unit id -> best score in percent
  // Saves a finished session and keeps the best score of the unit.
  recordSession: (unitId: string, correct: number, total: number) => void;
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      sessionsCompleted: 0,
      bestScores: {},
      recordSession: (unitId, correct, total) =>
        set((state) => {
          const score = total > 0 ? Math.round((correct / total) * 100) : 0;
          return {
            sessionsCompleted: state.sessionsCompleted + 1,
            bestScores: {
              ...state.bestScores,
              [unitId]: Math.max(state.bestScores[unitId] ?? 0, score),
            },
          };
        }),
    }),
    {
      name: "practice-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
