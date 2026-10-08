import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";

type DailyGoalCardProps = {
  xp: number;
  target: number;
};

export function DailyGoalCard({ xp, target }: DailyGoalCardProps) {
  // Width of the filled part of the bar, as a percentage (max 100).
  const progress = Math.min(xp / target, 1) * 100;

  return (
    <View className="home-card home-card--goal mt-6 h-[119px] flex-row items-center pl-5">
      <View className="flex-1">
        <Text className="typography--body-md text-text-primary">Daily goal</Text>

        <View className="flex-row items-baseline">
          <Text className="typography--h1 text-text-primary">{xp}</Text>
          <Text className="typography--body-lg ml-2 text-text-secondary">
            / {target} XP
          </Text>
        </View>

        <View className="mt-2 h-2 overflow-hidden rounded-full bg-goal-track">
          <View
            className="h-full rounded-full bg-streak"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <Image
        source={images.treasure}
        contentFit="contain"
        style={{ width: 104, height: 104, marginHorizontal: 10 }}
      />
    </View>
  );
}
