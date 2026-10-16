import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ContinueLearningCard } from "@/components/ContinueLearningCard";
import { DailyGoalCard } from "@/components/DailyGoalCard";
import { PlanItemRow } from "@/components/PlanItemRow";
import { WeekStreakCard } from "@/components/WeekStreakCard";
import { WordOfDayCard } from "@/components/WordOfDayCard";
import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getHomeContent, getWordOfTheDay } from "@/lib/home";
import { posthog, posthogLogger } from "@/lib/posthog";
import { useLanguageStore } from "@/store/useLanguageStore";
import {
  getCurrentStreak,
  getTodayProgress,
  useProgressStore,
} from "@/store/useProgressStore";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const dailyProgress = useProgressStore((state) => state.dailyProgress);
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
  const activeDates = useProgressStore((state) => state.activeDates);
  const streakDays = useProgressStore((state) =>
    getCurrentStreak(state.streakDays, state.lastActiveDate),
  );

  const language = selectedLanguage
    ? getLanguageByCode(selectedLanguage)
    : undefined;

  // The tabs layout already sends users without a language to /language.
  if (!language) {
    return null;
  }

  const today = getTodayProgress(dailyProgress);
  const { unitNumber, level, currentLesson, plan } = getHomeContent(
    language,
    completedLessonIds,
    today,
  );
  const wordOfTheDay = getWordOfTheDay(language);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: flag (opens language picker), greeting, streak, bell */}
          <View className="mt-3 h-12 flex-row items-center">
            <Link href="/language" asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: language.flagUrl }}
                  contentFit="cover"
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                />
              </TouchableOpacity>
            </Link>

            {/* The name gets its own line, so a long name is shortened with "…"
                instead of being cut or pushing the streak away. */}
            <View className="ml-3 mr-3 flex-1">
              <Text
                className="typography--body-sm text-text-secondary"
                numberOfLines={1}
              >
                {language.hello}! 👋
              </Text>
              <Text
                className="font-poppins-semibold text-h4 text-text-primary"
                numberOfLines={1}
              >
                {user?.firstName ?? "friend"}
              </Text>
            </View>

            <View
              className="home-streak"
              accessibilityLabel={`${streakDays} day streak`}
            >
              <Image
                source={images.streakFire}
                style={{ width: 22, height: 22 }}
              />
              <Text className="ml-1 font-poppins-semibold text-body-md text-text-primary">
                {streakDays} {streakDays === 1 ? "day" : "days"}
              </Text>
            </View>
            <Image
              source={images.bell}
              tintColor={theme.textPrimary}
              style={{ width: 26, height: 26, marginLeft: 14 }}
            />
          </View>

          <DailyGoalCard xp={today.xp} target={dailyGoalXp} />

          <ContinueLearningCard
            languageName={language.name}
            level={level}
            unitNumber={unitNumber}
            lessonNumber={currentLesson?.order ?? 1}
            lessonTitle={currentLesson?.title ?? ""}
            onContinue={() => {
              posthog?.capture("learning_continued", {
                language_code: selectedLanguage,
                unit_number: unitNumber,
                lesson_id: currentLesson?.id,
                level,
              });
              posthogLogger?.info("learning session continued", {
                language_code: selectedLanguage,
                unit_number: unitNumber,
                lesson_id: currentLesson?.id,
                level,
              });
              // Straight to the lesson the learner is on.
              if (currentLesson) {
                router.push({
                  pathname: "/lesson/[id]",
                  params: { id: currentLesson.id },
                });
              } else {
                router.push("/learn");
              }
            }}
          />

          {/* Today's plan */}
          {plan.length > 0 && (
            <>
              <View className="mb-3 mt-6 flex-row items-center justify-between">
                <Text className="font-poppins-semibold text-h4 text-text-primary">
                  Today&apos;s plan
                </Text>
                <Link href="/learn" asChild>
                  <TouchableOpacity activeOpacity={0.6}>
                    <Text className="font-poppins-semibold text-h4 text-lingua-deep-purple">
                      View all
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {plan.map((item) => (
                <PlanItemRow key={item.id} item={item} />
              ))}
            </>
          )}

          <WeekStreakCard activeDates={activeDates} streakDays={streakDays} />

          {wordOfTheDay && <WordOfDayCard word={wordOfTheDay} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
