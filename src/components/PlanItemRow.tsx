import { Image } from "expo-image";
import { type ImageSourcePropType, Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import type { PlanItem, PlanItemKind } from "@/types/learning";

// Icon and icon color for each kind of plan item.
const kinds: Record<
  PlanItemKind,
  { icon: ImageSourcePropType; tone: "purple" | "coral" }
> = {
  lesson: { icon: images.tabLearn, tone: "purple" },
  conversation: { icon: images.headphones, tone: "purple" },
  words: { icon: images.words, tone: "coral" },
};

export function PlanItemRow({ item }: { item: PlanItem }) {
  const { icon, tone } = kinds[item.kind];

  return (
    <View className="plan-item">
      <View className={`plan-item__icon plan-item__icon--${tone}`}>
        <Image
          source={icon}
          tintColor={colors.background}
          style={{ width: 24, height: 24 }}
        />
      </View>

      <View className="ml-4 flex-1">
        <Text className="font-poppins-semibold text-body-lg text-text-primary">
          {item.title}
        </Text>
        <Text className="typography--body-md text-text-secondary">
          {item.subtitle}
        </Text>
      </View>

      <View
        className={`plan-item__check ${item.done ? "plan-item__check--done" : ""}`}
      >
        {item.done && (
          <Image source={images.check} style={{ width: 14, height: 14 }} />
        )}
      </View>
    </View>
  );
}
