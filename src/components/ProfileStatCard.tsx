import type { ImageSourcePropType } from "react-native";
import { Text, View } from "react-native";

import { ProfileIcon, type ProfileTint } from "@/components/ProfileIcon";

type ProfileStatCardProps = {
  icon: ImageSourcePropType;
  tint: ProfileTint;
  value: string;
  label: string;
};

export function ProfileStatCard({
  icon,
  tint,
  value,
  label,
}: ProfileStatCardProps) {
  return (
    <View className="profile-stat">
      <ProfileIcon icon={icon} tint={tint} />
      <View className="ml-3 flex-1">
        <Text className="font-poppins-bold text-[20px] leading-7 text-text-primary">
          {value}
        </Text>
        <Text
          className="typography--caption text-text-secondary"
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
