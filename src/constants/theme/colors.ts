// Design tokens: colors.
// Keep in sync with the `--color-*` variables in `src/global.css`.
// In className use the CSS names (e.g. `bg-lingua-purple`); use this object
// only where a raw value is needed (icons, StatusBar, navigation options).

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

  // Neutrals
  textPrimary: "#0D132B",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",

  // Speech bubbles (onboarding)
  bubbleBlue: "#EAF3FF",
  bubbleIndigo: "#F3F4FF",
  bubbleIndigoText: "#3B30E0",
  bubbleCoral: "#FDEEEA",
  bubbleCoralText: "#E5483C",
} as const;

export type ColorName = keyof typeof colors;
