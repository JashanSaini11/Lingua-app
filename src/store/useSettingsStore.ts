import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type SettingsState = {
  themeMode: ThemeMode;
  // AsyncStorage is async, so the saved theme is not available on the first
  // render. The app waits for this flag before hiding the splash screen.
  hasHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
};

// Tells React Native which theme to use. "unspecified" gives control back to
// the phone, so "system" follows its light or dark setting again.
function applyThemeMode(mode: ThemeMode) {
  Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: "system",
      hasHydrated: false,
      setThemeMode: (mode) => {
        applyThemeMode(mode);
        set({ themeMode: mode });
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only the theme is saved, `hasHydrated` is rebuilt on every launch.
      partialize: (state) => ({ themeMode: state.themeMode }),
      // Apply the saved choice as soon as it is loaded.
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeMode(state.themeMode);
        }
        useSettingsStore.setState({ hasHydrated: true });
      },
    },
  ),
);
