const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// The colors that change between the light and dark theme must stay dynamic,
// so they are not inlined at build time. Keep in sync with `src/global.css`.
const themeVariables = [
  "text-primary",
  "text-secondary",
  "border",
  "surface",
  "background",
  "card",
  "profile-bg",
  "tint-selected",
  "tint-purple",
  "tint-orange",
  "tint-yellow",
  "tint-blue",
  "tint-green",
  "tint-red",
  "goal-card",
  "goal-track",
].map((name) => `--color-${name}`);

module.exports = withNativewind(config, {
  inlineVariables: { exclude: themeVariables },
});
