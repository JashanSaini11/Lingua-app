// Design tokens: typography (Poppins).
// Keep in sync with the `--font-*` / `--text-*` variables in `src/global.css`.

// Font files loaded in `src/app/_layout.tsx`.
// The key is the font-family name used in CSS and in `fontFamily` styles.
export const fontAssets = {
  "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
};

export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

// Type scale from the design: size in px, unitless line height, font weight.
export const typography = {
  h1: { fontSize: 32, lineHeight: 1.2, fontFamily: fontFamily.bold }, // Page / Screen Title
  h2: { fontSize: 24, lineHeight: 1.3, fontFamily: fontFamily.semibold }, // Section Title
  h3: { fontSize: 20, lineHeight: 1.3, fontFamily: fontFamily.semibold }, // Card / Module Title
  h4: { fontSize: 16, lineHeight: 1.4, fontFamily: fontFamily.medium }, // Subheading
  bodyLarge: { fontSize: 16, lineHeight: 1.6, fontFamily: fontFamily.regular }, // Important content
  bodyMedium: { fontSize: 14, lineHeight: 1.6, fontFamily: fontFamily.regular }, // Body text
  bodySmall: { fontSize: 13, lineHeight: 1.6, fontFamily: fontFamily.regular }, // Supporting text
  caption: { fontSize: 11, lineHeight: 1.4, fontFamily: fontFamily.regular }, // Labels, meta text
} as const;

export type TypographyName = keyof typeof typography;
