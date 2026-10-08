import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ContinueLearningCard } from "@/components/ContinueLearningCard";
import { DailyGoalCard } from "@/components/DailyGoalCard";
import { PlanItemRow } from "@/components/PlanItemRow";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { getLanguageByCode } from "@/data/languages";
import { getHomeContent } from "@/lib/home";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const { xp, dailyGoalXp, streakDays, level, completedLessonIds } =
    useProgressStore();

  const language = selectedLanguage
    ? getLanguageByCode(selectedLanguage)
    : undefined;

  // The tabs layout already sends users without a language to /language.
  if (!language) {
    return null;
  }

  const { unitNumber, plan } = getHomeContent(
    language,
    completedLessonIds,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: flag (opens language picker), greeting, streak, bell */}
          <View className="mt-3 h-11 flex-row items-center">
            <Link href="/language" asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: language.flagUrl }}
                  contentFit="cover"
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                />
              </TouchableOpacity>
            </Link>

            <Text className="ml-3 flex-1 font-poppins-semibold text-h4 text-text-primary">
              {language.hello}, {user?.firstName ?? "friend"}! 👋
            </Text>

            <Image
              source={images.streakFire}
              style={{ width: 28, height: 28 }}
            />
            <Text className="ml-2 font-poppins-medium text-h4 text-text-primary">
              {streakDays}
            </Text>
            <Image
              source={images.bell}
              tintColor={colors.textPrimary}
              style={{ width: 26, height: 26, marginLeft: 22 }}
            />
          </View>

          <DailyGoalCard xp={xp} target={dailyGoalXp} />

          <ContinueLearningCard
            languageName={language.name}
            level={level}
            unitNumber={unitNumber}
            onContinue={() => router.push("/learn")}
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
