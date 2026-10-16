import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { Lesson, LessonStatus } from "@/types/learning";

type LessonCardProps = {
  lesson: Lesson;
  status: LessonStatus;
  flagUrl: string; // flag of the language being learned
  onPress: () => void;
};

export function LessonCard({
  lesson,
  status,
  flagUrl,
  onPress,
}: LessonCardProps) {
  const theme = useThemeColors();
  const isInProgress = status === "in-progress";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`lesson-card ${isInProgress ? "lesson-card--in-progress" : ""}`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`typography--body-sm ${isInProgress ? "text-lingua-deep-purple" : "text-text-secondary"}`}
        >
          Lesson {lesson.order}
        </Text>
        <Text className="font-poppins-medium text-h4 text-text-primary">
          {lesson.title}
        </Text>

        {isInProgress && (
          <Text className="typography--body-sm text-lingua-deep-purple">
            In progress
          </Text>
        )}
        {status === "not-started" && (
          <Text className="typography--body-sm text-text-secondary">
            {lesson.estimatedMinutes} min • {lesson.xpReward} XP
          </Text>
        )}
      </View>

      {status === "completed" && (
        <View className="lesson-card__check">
          <Image source={images.check} style={{ width: 14, height: 14 }} />
        </View>
      )}
      {/* Country flag with the lesson emoji on top */}
      {isInProgress && (
        <View className="size-[50px]">
          <Image
            source={{ uri: flagUrl }}
            contentFit="cover"
            className="lesson-card__image"
          />
          <View className="lesson-card__badge">
            <Text className="text-[14px]">{lesson.emoji}</Text>
          </View>
        </View>
      )}
      {status === "not-started" && (
        <Image
          source={images.chevronForward}
          tintColor={theme.textSecondary}
          style={{ width: 20, height: 20 }}
        />
      )}
    </TouchableOpacity>
  );
}
