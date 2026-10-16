import { Text, View } from "react-native";

import type { VocabularyItem } from "@/types/learning";

type WordOfDayCardProps = {
  word: VocabularyItem;
};

// One word to learn today, with how to say it.
export function WordOfDayCard({ word }: WordOfDayCardProps) {
  return (
    <View className="home-card home-card--plain mt-6 p-5">
      <Text className="font-poppins-semibold text-caption tracking-widest text-text-secondary">
        WORD OF THE DAY
      </Text>

      <View className="mt-3 flex-row items-center">
        <View className="size-14 items-center justify-center rounded-2xl bg-tint-purple">
          <Text className="text-[28px]">{word.emoji}</Text>
        </View>
        <View className="ml-4 flex-1">
          <Text
            className="font-poppins-bold text-h3 text-text-primary"
            numberOfLines={1}
          >
            {word.word}
          </Text>
          <Text
            className="typography--body-sm text-lingua-deep-purple"
            numberOfLines={1}
          >
            {word.pronunciation}
          </Text>
          <Text
            className="typography--body-md text-text-secondary"
            numberOfLines={1}
          >
            {word.translation}
          </Text>
        </View>
      </View>
    </View>
  );
}
