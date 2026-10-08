import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";

type ContinueLearningCardProps = {
  languageName: string;
  level: string;
  unitNumber: number;
  onContinue: () => void;
};

export function ContinueLearningCard({
  languageName,
  level,
  unitNumber,
  onContinue,
}: ContinueLearningCardProps) {
  return (
    <View className="home-card home-card--continue mt-5 h-[167px] justify-center pl-5">
      {/* The picture is bigger than the card and moved down and right,
          so the hill is cut by the card edge like the design. */}
      <View
        pointerEvents="none"
        className="absolute -bottom-[22px] -right-[21px] size-[184px]"
      >
        <Image
          source={images.palace}
          contentFit="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      <Text className="typography--body-md text-white/90">Continue learning</Text>
      <Text className="font-poppins-bold text-h3 text-white">{languageName}</Text>
      <Text className="typography--body-md text-white/90">
        {level} • Unit {unitNumber}
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onContinue}
        className="mt-3 h-9 items-center justify-center self-start rounded-xl bg-white px-4"
      >
        <Text className="font-poppins-semibold text-body-md text-lingua-deep-purple">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
