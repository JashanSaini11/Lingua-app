import { Image } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ProfileIcon, type ProfileTint } from "@/components/ProfileIcon";
import { images } from "@/constants/images";
import { useThemeColors } from "@/hooks/useThemeColors";

type ProfileRowProps = {
  icon: ImageSourcePropType;
  tint: ProfileTint;
  title: string;
  subtitle: string;
  divider?: boolean; // line above the row, for every row but the first
  onPress?: () => void; // when set, the row is tappable and shows a chevron
  children?: ReactNode; // extra controls shown under the row, like choices
};

// One row of a settings card. Rows without `onPress` only show information.
export function ProfileRow({
  icon,
  tint,
  title,
  subtitle,
  divider = false,
  onPress,
  children,
}: ProfileRowProps) {
  const theme = useThemeColors();

  return (
    <View className={divider ? "profile-row--divider" : undefined}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!onPress}
        onPress={onPress}
        className="profile-row"
      >
        <ProfileIcon icon={icon} tint={tint} />
        <View className="ml-4 flex-1">
          <Text className="font-poppins-medium text-body-md text-text-primary">
            {title}
          </Text>
          <Text
            className="typography--caption text-text-secondary"
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
        {onPress && (
          <Image
            source={images.chevronForward}
            tintColor={theme.textSecondary}
            style={{ width: 20, height: 20 }}
          />
        )}
      </TouchableOpacity>
      {children && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
}
