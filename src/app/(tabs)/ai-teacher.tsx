import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useThemeColors } from "@/hooks/useThemeColors";

// Pressing the AI Teacher tab opens the current lesson directly (see the tabs
// layout), so this screen only shows when there is no lesson to open yet.
export default function AiTeacherScreen() {
  const router = useRouter();
  const lesson = useCurrentLesson();
  const theme = useThemeColors();

  return (
    <View
      className="items-center justify-center px-10"
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <Image
        source={images.mascotTeacher}
        contentFit="contain"
        style={{ width: 160, height: 160 }}
      />
      <Text className="typography--h3 mt-4 text-center text-text-primary">
        {lesson ? "Ready for your AI class?" : "Your AI teacher is getting ready"}
      </Text>
      <Text className="typography--body-md mt-1 text-center text-text-secondary">
        {lesson
          ? lesson.title
          : "Lessons for this language are coming soon."}
      </Text>

      {lesson && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/lesson/[id]",
              params: { id: lesson.id, tab: "ai-teacher" },
            })
          }
          className="practice-button mt-6 px-8"
        >
          <Text className="font-poppins-semibold text-h4 text-white">
            Start AI class
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
