// Design tokens: colors.
// Keep in sync with the `--color-*` variables in `src/global.css`.
// In className use the CSS names (e.g. `bg-lingua-purple`); use these objects
// only where a raw value is needed (icons, StatusBar, navigation options).
//
// `colors` holds the values that look the same in light and dark mode.
// Neutrals that change with the theme live in `themeColors`: read them with
// the `useThemeColors()` hook, never from `colors`.

export const colors = {
  // Primary
  linguaPurple: "#6C4EF5",
  linguaDeepPurple: "#5B3BF6",
  linguaBlue: "#4D8BFF",
  linguaGreen: "#21C16B",

  // Semantic
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // Neutrals that do not change with the theme
  white: "#FFFFFF",

  // Speech bubbles (onboarding)
  bubbleBlue: "#EAF3FF",
  bubbleIndigo: "#F3F4FF",
  bubbleIndigoText: "#3B30E0",
  bubbleCoral: "#FDEEEA",
  bubbleCoralText: "#E5483C",

  // Home screen
  coral: "#F26D6D",
} as const;

// Neutrals for each theme (the dark ones are used when the phone or the
// user's choice is dark).
export const themeColors = {
  light: {
    background: "#FFFFFF",
    profileBackground: "#F8F7FF",
    card: "#FFFFFF",
    surface: "#F6F7FB",
    border: "#E5E7EB",
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
  },
  dark: {
    background: "#0B1020",
    profileBackground: "#0B1020",
    card: "#151B30",
    surface: "#1C2340",
    border: "#2A3250",
    textPrimary: "#F3F4F8",
    textSecondary: "#9AA3B5",
  },
} as const;

export type ColorName = keyof typeof colors;
