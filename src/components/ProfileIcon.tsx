import { Image } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import { View } from "react-native";

import { colors } from "@/constants/theme";

export type ProfileTint = "orange" | "purple" | "yellow" | "blue" | "green" | "red";

// The icon color that goes with each soft background (`profile-icon--*`).
const iconColors: Record<ProfileTint, string> = {
  orange: colors.streak,
  purple: colors.linguaDeepPurple,
  yellow: "#D99A00",
  blue: colors.linguaBlue,
  green: colors.success,
  red: colors.error,
};

type ProfileIconProps = {
  icon: ImageSourcePropType;
  tint: ProfileTint;
  size?: "md" | "lg"; // 40px or 48px
  locked?: boolean; // greyed out, for achievements not earned yet
};

// A round colored badge with an icon, used across the profile screen.
export function ProfileIcon({
  icon,
  tint,
  size = "md",
  locked = false,
}: ProfileIconProps) {
  const isLarge = size === "lg";

  return (
    <View
      className={`profile-icon profile-icon--${tint} rounded-full ${isLarge ? "size-12" : "size-10"} ${locked ? "opacity-40" : ""}`}
    >
      <Image
        source={icon}
        tintColor={iconColors[tint]}
        style={{ width: isLarge ? 24 : 20, height: isLarge ? 24 : 20 }}
      />
    </View>
  );
}
