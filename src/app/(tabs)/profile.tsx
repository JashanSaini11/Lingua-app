import { useAuth, useUser } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EditNameModal } from "@/components/EditNameModal";
import { ProfileIcon } from "@/components/ProfileIcon";
import { ProfileRow } from "@/components/ProfileRow";
import { ProfileStatCard } from "@/components/ProfileStatCard";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { achievements } from "@/data/achievements";
import { getLanguageByCode } from "@/data/languages";
import { useThemeColors } from "@/hooks/useThemeColors";
import { getAchievementStats } from "@/lib/achievements";
import { getProfileContent } from "@/lib/profile";
import { posthog, posthogLogger } from "@/lib/posthog";
import { useLanguageStore } from "@/store/useLanguageStore";
import {
  getCurrentStreak,
  getTodayProgress,
  useProgressStore,
} from "@/store/useProgressStore";
import { type ThemeMode, useSettingsStore } from "@/store/useSettingsStore";

const themeOptions = [
  { mode: "light", label: "Light", icon: images.sun },
  { mode: "dark", label: "Dark", icon: images.moon },
  { mode: "system", label: "System", icon: images.smartphone },
] as const;

const themeLabels: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "Follows your phone",
};

const goalOptions = [10, 20, 30, 50];

// "2026-10-16" -> "Oct 16"
function formatDay(day: string) {
  return new Date(`${day}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const setDailyGoalXp = useProgressStore((state) => state.setDailyGoalXp);
  const dailyProgress = useProgressStore((state) => state.dailyProgress);
  const totalXp = useProgressStore((state) => state.totalXp);
  const practiceSessions = useProgressStore((state) => state.practiceSessions);
  const unlockedAchievements = useProgressStore(
    (state) => state.unlockedAchievements,
  );
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );
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
  const { level, levelName, wordsKnown } = getProfileContent(
    language,
    completedLessonIds,
    today,
  );

  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName ?? user?.username ?? email?.split("@")[0] ?? "Learner";
  const handle = user?.username ?? email?.split("@")[0] ?? "learner";
  const joined = user?.createdAt?.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // How far the learner is on every achievement (for the progress bars).
  // Earned achievements come first, newest earned first.
  const stats = getAchievementStats({
    completedLessonIds,
    practiceSessions,
    streakDays,
    totalXp,
    todayXp: today.xp,
    dailyGoalXp,
  });
  const sortedAchievements = [...achievements].sort((first, second) =>
    (unlockedAchievements[second.id] ?? "").localeCompare(
      unlockedAchievements[first.id] ?? "",
    ),
  );
  const earnedCount = achievements.filter(
    (item) => unlockedAchievements[item.id],
  ).length;

  // Testing only: forget the saved language. The tabs layout then sends us
  // back to the language screen because `selectedLanguage` is empty again.
  const clearStorage = async () => {
    // Reset the store first, then wipe AsyncStorage so the empty value
    // the store just saved is removed as well.
    useLanguageStore.setState({ selectedLanguage: null });
    await AsyncStorage.clear();
  };

  const handleSignOut = async () => {
    posthog?.capture("user_signed_out");
    posthogLogger?.info("user sign out requested");
    await signOut();
    posthog?.reset();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.profileBackground }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mt-3 h-11 justify-center">
            <Text className="typography--h2 text-text-primary">Profile</Text>
          </View>

          {/* Identity card: language, avatar, name, member since */}
          <View className="profile-card mt-3 items-center px-4 pb-5 pt-4">
            <Link href="/language" asChild>
              <TouchableOpacity
                activeOpacity={0.8}
                className="h-9 flex-row items-center rounded-full bg-surface px-4"
              >
                <Image
                  source={{ uri: language.flagUrl }}
                  contentFit="cover"
                  style={{ width: 20, height: 20, borderRadius: 10 }}
                />
                <Text className="ml-2 font-poppins-medium text-body-md text-text-primary">
                  {language.name} ({level} {levelName})
                </Text>
                <Image
                  source={images.chevronForward}
                  tintColor={theme.textSecondary}
                  style={{
                    width: 16,
                    height: 16,
                    marginLeft: 4,
                    transform: [{ rotate: "90deg" }],
                  }}
                />
              </TouchableOpacity>
            </Link>

            {/* Avatar with a purple ring and an edit badge */}
            <View className="mt-4 size-[84px] items-center justify-center rounded-full border-[3px] border-lingua-deep-purple">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  contentFit="cover"
                  style={{ width: 72, height: 72, borderRadius: 36 }}
                />
              ) : (
                <View className="size-[72px] items-center justify-center rounded-full bg-surface">
                  <Text className="typography--h2 text-text-primary">
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel="Edit your name"
                onPress={() => setIsEditingName(true)}
                hitSlop={8}
                className="absolute -bottom-1 -right-1 size-7 items-center justify-center rounded-full border-2 border-card bg-lingua-deep-purple"
              >
                <Image
                  source={images.pencil}
                  tintColor={colors.white}
                  style={{ width: 13, height: 13 }}
                />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 font-poppins-bold text-[20px] text-text-primary">
              {name}
            </Text>
            <Text className="typography--body-sm text-text-secondary">
              @{handle}
            </Text>

            {joined && (
              <View className="mt-3 h-7 flex-row items-center rounded-full bg-tint-purple px-3">
                <Text className="font-poppins-semibold text-caption text-lingua-deep-purple">
                  Joined {joined}
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View className="mt-3 flex-row gap-3">
            <ProfileStatCard
              icon={images.flame}
              tint="orange"
              value={String(streakDays)}
              label="Day Streak"
            />
            <ProfileStatCard
              icon={images.zap}
              tint="purple"
              value={totalXp.toLocaleString("en-US")}
              label="Total XP"
            />
          </View>
          <View className="mt-3 flex-row gap-3">
            <ProfileStatCard
              icon={images.circleCheck}
              tint="green"
              value={String(completedLessonIds.length)}
              label="Lessons Done"
            />
            <ProfileStatCard
              icon={images.bookOpen}
              tint="blue"
              value={String(wordsKnown)}
              label="Words Known"
            />
          </View>

          {/* Achievements: earned ones are colored, the others show progress */}
          <View className="mb-3 mt-6 flex-row items-center justify-between">
            <Text className="typography--h3 text-text-primary">Achievements</Text>
            <Text className="font-poppins-medium text-body-md text-text-secondary">
              {earnedCount} / {achievements.length}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // Bleeds to the screen edges so the cards scroll under the margin.
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {sortedAchievements.map((item) => {
              const earnedOn = unlockedAchievements[item.id];
              const current = Math.min(stats[item.stat], item.target);

              return (
                <View
                  key={item.id}
                  className="profile-card w-[132px] items-center px-2 py-4"
                >
                  <ProfileIcon
                    icon={images[item.icon]}
                    tint={item.tint}
                    size="lg"
                    locked={!earnedOn}
                  />
                  <Text
                    className={`mt-2 font-poppins-semibold text-body-sm text-text-primary ${earnedOn ? "" : "opacity-60"}`}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="typography--caption text-center text-text-secondary"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  {earnedOn ? (
                    <Text className="mt-2 font-poppins-medium text-caption text-success">
                      Earned {formatDay(earnedOn)}
                    </Text>
                  ) : (
                    <>
                      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                        <View
                          className="h-full rounded-full bg-lingua-purple"
                          style={{ width: `${(current / item.target) * 100}%` }}
                        />
                      </View>
                      <Text className="typography--caption mt-1 text-text-secondary">
                        {current} / {item.target}
                      </Text>
                    </>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Learning settings */}
          <Text className="mb-2 mt-6 font-poppins-semibold text-caption tracking-widest text-text-secondary">
            LEARNING SETTINGS
          </Text>
          <View className="profile-card overflow-hidden">
            <ProfileRow
              icon={images.globe}
              tint="blue"
              title="Language & Level"
              subtitle={`${language.name} • ${levelName} ${level}`}
              onPress={() => router.push("/language")}
            />
            <ProfileRow
              divider
              icon={images.target}
              tint="orange"
              title="Daily Goal"
              subtitle={`${dailyGoalXp} XP per day`}
              onPress={() => setIsGoalOpen((value) => !value)}
            >
              {isGoalOpen && (
                <View className="flex-row gap-2">
                  {goalOptions.map((xp) => (
                    <TouchableOpacity
                      key={xp}
                      activeOpacity={0.8}
                      accessibilityState={{ selected: dailyGoalXp === xp }}
                      onPress={() => setDailyGoalXp(xp)}
                      className={`profile-option ${dailyGoalXp === xp ? "profile-option--active" : ""}`}
                    >
                      <Text
                        className={`font-poppins-medium text-body-md ${dailyGoalXp === xp ? "text-white" : "text-text-primary"}`}
                      >
                        {xp} XP
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ProfileRow>
            <ProfileRow
              divider
              icon={images.moon}
              tint="purple"
              title="Appearance"
              subtitle={themeLabels[themeMode]}
            >
              <View className="flex-row gap-2">
                {themeOptions.map((option) => {
                  const isActive = themeMode === option.mode;
                  return (
                    <TouchableOpacity
                      key={option.mode}
                      activeOpacity={0.8}
                      accessibilityState={{ selected: isActive }}
                      onPress={() => setThemeMode(option.mode)}
                      className={`profile-option ${isActive ? "profile-option--active" : ""}`}
                    >
                      <Image
                        source={option.icon}
                        tintColor={isActive ? colors.white : theme.textSecondary}
                        style={{ width: 16, height: 16 }}
                      />
                      <Text
                        className={`ml-1.5 font-poppins-medium text-body-sm ${isActive ? "text-white" : "text-text-primary"}`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ProfileRow>
          </View>

          {/* Account */}
          <Text className="mb-2 mt-6 font-poppins-semibold text-caption tracking-widest text-text-secondary">
            ACCOUNT
          </Text>
          <View className="profile-card overflow-hidden">
            <ProfileRow
              icon={images.user}
              tint="green"
              title="Signed in as"
              subtitle={email ?? name}
            />
          </View>

          {/* Signing out sends the user back to onboarding. */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignOut}
            className="profile-logout"
          >
            <Image
              source={images.logOut}
              tintColor={colors.error}
              style={{ width: 20, height: 20 }}
            />
            <Text className="ml-2 font-poppins-semibold text-h4 text-error">
              Log Out
            </Text>
          </TouchableOpacity>

          <Text className="typography--caption mt-6 text-center text-text-secondary">
            Lingua for {Platform.OS === "ios" ? "iOS" : "Android"} • v
            {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
          <Text className="typography--caption text-center text-text-secondary">
            Crafted with ❤️ for joyful language learning
          </Text>

          {__DEV__ && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={clearStorage}
              className="mt-4 items-center"
            >
              <Text className="typography--caption text-lingua-deep-purple">
                Clear storage (test)
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

      {isEditingName && <EditNameModal onClose={() => setIsEditingName(false)} />}
    </View>
  );
}
