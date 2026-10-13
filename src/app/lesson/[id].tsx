import { Image } from "expo-image";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabBarView, type TabName } from "@/components/TabBar";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { useProgressStore } from "@/store/useProgressStore";

// Where each bottom tab goes when it is pressed from this screen.
const tabRoutes = {
  index: "/",
  learn: "/learn",
  "ai-teacher": "/ai-teacher",
  chat: "/chat",
  profile: "/profile",
} as const;

// Lesson feedback is hardcoded until the AI teacher can score the learner.
const feedback = [
  { label: "Speaking", value: "Excellent", color: "text-success" },
  { label: "Pronunciation", value: "Great", color: "text-info" },
  { label: "Grammar", value: "Good", color: "text-lingua-deep-purple" },
];

// AI Teacher audio lesson. Every lesson from the Learn screen opens here.
// This is audio only: the teacher is shown as a picture, there is no video call.
export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const streakDays = useProgressStore((state) => state.streakDays);

  const [isMicOn, setIsMicOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;

  if (!lesson || !language) {
    return <Redirect href="/learn" />;
  }

  // What the teacher says: the opening line, then each phrase of the lesson.
  const teacherLines = [
    { text: lesson.aiTeacher.openingLine, translation: undefined },
    ...lesson.phrases.map((phrase) => ({
      text: phrase.text,
      translation: phrase.translation,
    })),
  ];
  const line = teacherLines[lineIndex];

  const nextLine = () => setLineIndex((lineIndex + 1) % teacherLines.length);

  // Ending the call finishes the lesson and gives the XP.
  const endCall = () => {
    completeLesson(lesson.id, lesson.xpReward);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header: back, teacher status, streak, bell */}
        <View className="mt-2 h-14 flex-row items-center px-5">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.back()}
            className="h-11 w-10 justify-center"
          >
            <Image
              source={images.chevronBack}
              style={{ width: 26, height: 26 }}
            />
          </TouchableOpacity>

          <View className="ml-2 flex-1">
            <Text className="font-poppins-semibold text-[18px] text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center">
              <View
                className={`size-2.5 rounded-full ${isMicOn ? "bg-success" : "bg-text-secondary"}`}
              />
              <Text className="typography--body-sm ml-2 text-text-secondary">
                {isMicOn ? "Online" : "Mic muted"}
              </Text>
            </View>
          </View>

          <View className="audio-pill">
            <Image
              source={images.headphones}
              tintColor={colors.textPrimary}
              style={{ width: 22, height: 22 }}
            />
          </View>
          <View className="audio-pill ml-2 px-3">
            <Text className="font-poppins-medium text-h4 text-text-primary">
              {streakDays}
            </Text>
          </View>
          <View className="audio-pill ml-2">
            <Image
              source={images.bell}
              tintColor={colors.textPrimary}
              style={{ width: 22, height: 22 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Teacher card: lesson info on top, mascot in the middle, speech bubble below */}
          <View className="audio-card">
            <View className="flex-row items-center rounded-2xl bg-white/90 p-3">
              <Image
                source={{ uri: language.flagUrl }}
                contentFit="cover"
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
              <View className="ml-3 flex-1">
                <Text
                  className="font-poppins-semibold text-body-md text-text-primary"
                  numberOfLines={1}
                >
                  {language.name} with {language.teacherName} • {lesson.title}
                </Text>
                <Text
                  className="typography--body-sm text-text-secondary"
                  numberOfLines={1}
                >
                  🎯 {lesson.goals[0]}
                </Text>
              </View>
            </View>

            {/* The mascot gets its own space, so nothing covers it */}
            <View className="min-h-[200px] flex-1 py-2">
              <Image
                source={images.mascotTeacher}
                contentFit="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <View className="mt-3">
              <View
                className="absolute -top-1.5 right-1/4 size-5 rotate-45 bg-white"
                style={styles.shadow}
              />
              <View
                className="flex-row items-center rounded-3xl bg-white px-5 py-4"
                style={styles.shadow}
              >
                <View className="flex-1">
                  <Text className="font-poppins-medium text-[18px] leading-7 text-text-primary">
                    {line.text}
                  </Text>
                  {showSubtitles && line.translation && (
                    <Text className="font-poppins-medium text-[18px] leading-7 text-text-secondary">
                      {line.translation}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  activeOpacity={0.6}
                  accessibilityLabel="Next phrase"
                  onPress={nextLine}
                  className="ml-3 size-11 items-center justify-center"
                >
                  <Image
                    source={images.volume}
                    tintColor={colors.linguaDeepPurple}
                    style={{ width: 28, height: 28 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Call controls */}
          <View className="mt-5 flex-row">
            <View className="audio-control">
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel={isMicOn ? "Mute mic" : "Unmute mic"}
                onPress={() => setIsMicOn((value) => !value)}
                className={`audio-control__button ${isMicOn ? "" : "audio-control__button--off"}`}
              >
                <Image
                  source={isMicOn ? images.mic : images.micOff}
                  tintColor={isMicOn ? colors.textPrimary : colors.error}
                  style={{ width: 28, height: 28 }}
                />
              </TouchableOpacity>
              <Text className="audio-control__label">Mic</Text>
            </View>

            <View className="audio-control">
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel="Subtitles"
                onPress={() => setShowSubtitles((value) => !value)}
                className={`audio-control__button ${showSubtitles ? "" : "audio-control__button--off"}`}
              >
                <Image
                  source={images.translate}
                  tintColor={
                    showSubtitles ? colors.textPrimary : colors.textSecondary
                  }
                  style={{ width: 28, height: 28 }}
                />
              </TouchableOpacity>
              <Text className="audio-control__label">Subtitles</Text>
            </View>

            <View className="audio-control">
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel="End call"
                onPress={endCall}
                className="audio-control__button audio-control__button--danger"
              >
                <Image
                  source={images.phoneHangup}
                  tintColor={colors.background}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
              <Text className="audio-control__label">End Call</Text>
            </View>
          </View>

          {/* Lesson feedback */}
          <View className="audio-feedback" style={styles.shadow}>
            {feedback.map((item, index) => (
              <View
                key={item.label}
                className={`audio-feedback__item ${index > 0 ? "audio-feedback__item--divider" : ""}`}
              >
                <Text className="audio-feedback__label" numberOfLines={1}>
                  {item.label}
                </Text>
                <Text
                  className={`audio-feedback__value ${item.color}`}
                  numberOfLines={1}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Learn stays highlighted because this lesson was opened from Learn. */}
      <TabBarView
        activeTab="learn"
        onTabPress={(name: TabName) => router.dismissTo(tabRoutes[name])}
      />
    </View>
  );
}

// Shadows use StyleSheet because iOS and Android need different properties.
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: "#0d132b",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    default: { elevation: 6 },
  }) ?? {},
});
