import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard } from "@/components/LessonCard";
import { PracticeTab } from "@/components/PracticeTab";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { getLanguageByCode } from "@/data/languages";
import { getLearnContent } from "@/lib/learn";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";

type LearnTab = "lessons" | "practice";

export default function LearnScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<LearnTab>("lessons");
  const [isSaved, setIsSaved] = useState(false);
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );

  const language = selectedLanguage
    ? getLanguageByCode(selectedLanguage)
    : undefined;

  // The tabs layout already sends users without a language to /language.
  if (!language) {
    return null;
  }

  const content = getLearnContent(language, completedLessonIds);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  // Friendly empty state for a language without lessons.
  if (!content) {
    return (
      <View
        className="items-center justify-center px-10"
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <Image
          source={images.mascotWelcome}
          contentFit="contain"
          style={{ width: 160, height: 160 }}
        />
        <Text className="typography--h3 mt-4 text-center text-text-primary">
          Lessons are coming soon
        </Text>
        <Text className="typography--body-md mt-1 text-center text-text-secondary">
          We are still preparing {language.name} lessons for you.
        </Text>
      </View>
    );
  }

  const { unit, items, completedCount } = content;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: back, unit title and progress, bookmark */}
          <View className="mt-2 h-14 flex-row items-center px-5">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goBack}
              className="h-11 w-10 justify-center"
            >
              <Image
                source={images.chevronBack}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>

            <View className="ml-2 flex-1">
              <Text
                className="font-poppins-semibold text-[18px] text-text-primary"
                numberOfLines={1}
              >
                {unit.title}
              </Text>
              <Text className="typography--body-sm text-text-secondary">
                Unit {unit.order} • {completedCount} / {items.length} lessons
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setIsSaved((value) => !value)}
              className="h-11 w-10 items-end justify-center"
            >
              <Image
                source={images.bookmark}
                tintColor={isSaved ? colors.linguaPurple : colors.textPrimary}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>
          </View>

          {/* Unit picture with the mascot */}
          <View className="mt-2 h-[200px] w-full overflow-hidden bg-surface">
            <Image
              source={{ uri: unit.image }}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <View
              pointerEvents="none"
              className="absolute bottom-0 left-[26%] size-[190px]"
            >
              <Image
                source={images.mascotWelcome}
                contentFit="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>

          {/* Lessons / Practice tabs */}
          <View className="lesson-tabs">
            {(["lessons", "practice"] as const).map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() => setTab(item)}
                className={`lesson-tabs__tab ${tab === item ? "lesson-tabs__tab--active" : ""}`}
              >
                <Text
                  className={`font-poppins-medium text-h4 ${tab === item ? "text-lingua-deep-purple" : "text-text-primary"}`}
                >
                  {item === "lessons" ? "Lessons" : "Practice"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === "lessons" ? (
            <View className="mt-4 px-5">
              {items.map(({ lesson, status }) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  status={status}
                  flagUrl={language.flagUrl}
                  onPress={() =>
                    router.push({
                      pathname: "/lesson/[id]",
                      params: { id: lesson.id },
                    })
                  }
                />
              ))}
            </View>
          ) : (
            <PracticeTab unitId={unit.id} languageCode={language.code} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
