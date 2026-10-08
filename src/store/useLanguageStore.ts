import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

type LanguageState = {
  selectedLanguage: LanguageCode | null; // null until the user picks one
  // AsyncStorage is async, so the saved value is not available on the first
  // render. The app waits for this flag before deciding where to send the user.
  hasHydrated: boolean;
  setSelectedLanguage: (code: LanguageCode) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setSelectedLanguage: (code) => set({ selectedLanguage: code }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only the language is saved, `hasHydrated` is rebuilt on every launch.
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      onRehydrateStorage: () => () => {
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
