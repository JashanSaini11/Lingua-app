import { useColorScheme } from "react-native";

import { themeColors } from "@/constants/theme";

// The neutral colors of the current theme, for places where className cannot
// be used (screen backgrounds on SafeAreaView, icon tints, placeholders).
export function useThemeColors() {
  const scheme = useColorScheme();
  return themeColors[scheme === "dark" ? "dark" : "light"];
}
