import { Image } from "expo-image";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

const BAR_HEIGHT = 76;
const CIRCLE_SIZE = 56;

// One entry per tab route. The key must match the file name in app/(tabs).
const tabs = {
  index: { label: "Home", icon: images.tabHome },
  learn: { label: "Learn", icon: images.tabLearn },
  "ai-teacher": { label: "AI Teacher", icon: images.tabAiTeacher },
  profile: { label: "Profile", icon: images.tabProfile },
} as const;

export type TabName = keyof typeof tabs;

type TabBarViewProps = {
  activeTab: TabName;
  onTabPress: (name: TabName) => void;
};

// The visual bar. It is separate from the router so screens outside the tabs
// (like the audio lesson) can show the same bar.
export function TabBarView({ activeTab, onTabPress }: TabBarViewProps) {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const [tabWidth, setTabWidth] = useState(0);
  const circleX = useSharedValue(0);
  const hasPlacedCircle = useRef(false);

  const tabNames = Object.keys(tabs) as TabName[];
  const activeIndex = tabNames.indexOf(activeTab);

  // Slide the circle to the center of the active tab.
  useEffect(() => {
    if (tabWidth === 0) {
      return;
    }
    const x = activeIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;

    // First placement is instant so the circle does not slide in on mount.
    circleX.value = hasPlacedCircle.current ? withTiming(x, { duration: 250 }) : x;
    hasPlacedCircle.current = true;
  }, [activeIndex, tabWidth, circleX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleX.value }],
  }));

  return (
    <View
      className="bg-background px-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View
        className="flex-row rounded-[28px] bg-card"
        style={[styles.bar, { height: BAR_HEIGHT }]}
        onLayout={(event) =>
          setTabWidth(event.nativeEvent.layout.width / tabNames.length)
        }
      >
        {tabWidth > 0 && (
          <Animated.View style={[styles.circle, circleStyle]} />
        )}

        {tabNames.map((name) => {
          const tab = tabs[name];
          const isActive = activeTab === name;

          return (
            <TouchableOpacity
              key={name}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabPress(name)}
              className="flex-1 items-center justify-center"
            >
              <Image
                source={tab.icon}
                tintColor={isActive ? colors.white : theme.textSecondary}
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

// The bar used by the tabs layout. It connects TabBarView to the tab navigator.
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  const onTabPress = (name: TabName) => {
    const route = state.routes.find((item) => item.name === name);
    if (!route) {
      return;
    }

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (activeRoute.name !== name && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <TabBarView activeTab={activeRoute.name as TabName} onTabPress={onTabPress} />
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
