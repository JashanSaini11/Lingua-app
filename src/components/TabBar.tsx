import { Image } from "expo-image";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";

const BAR_HEIGHT = 76;
const CIRCLE_SIZE = 56;

// One entry per tab route. The key must match the file name in app/(tabs).
const tabs = {
  index: { label: "Home", icon: images.tabHome },
  learn: { label: "Learn", icon: images.tabLearn },
  "ai-teacher": { label: "AI Teacher", icon: images.tabAiTeacher },
  chat: { label: "Chat", icon: images.tabChat },
  profile: { label: "Profile", icon: images.tabProfile },
} as const;

type TabName = keyof typeof tabs;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [tabWidth, setTabWidth] = useState(0);
  const circleX = useSharedValue(0);

  // Slide the circle to the center of the active tab.
  useEffect(() => {
    circleX.value = withTiming(
      state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2,
      { duration: 250 },
    );
  }, [state.index, tabWidth, circleX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleX.value }],
  }));

  return (
    <View
      className="bg-transparent px-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View
        className="flex-row rounded-[28px] bg-white"
        style={[styles.bar, { height: BAR_HEIGHT }]}
        onLayout={(event) =>
          setTabWidth(event.nativeEvent.layout.width / state.routes.length)
        }
      >
        {tabWidth > 0 && (
          <Animated.View style={[styles.circle, circleStyle]} />
        )}

        {state.routes.map((route, index) => {
          const tab = tabs[route.name as TabName];
          const isActive = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              onPress={onPress}
              className="flex-1 items-center justify-center"
            >
              <Image
                source={tab.icon}
                tintColor={isActive ? colors.background : colors.textSecondary}
                style={{ width: 26, height: 26 }}
              />
              {!isActive && (
                <Text className="mt-1 font-poppins-medium text-caption text-text-secondary">
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Shadows and animated views use StyleSheet instead of className.
const styles = StyleSheet.create({
  // Sits at left 0 and is moved with translateX; top centers it in the bar.
  circle: {
    position: "absolute",
    left: 0,
    top: (BAR_HEIGHT - CIRCLE_SIZE) / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.linguaDeepPurple,
  },
  bar: Platform.select({
    ios: {
      shadowColor: "#0d132b",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    default: { elevation: 8 },
  }),
});
