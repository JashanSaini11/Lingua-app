import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import {
  useAudioLessonCall,
  type AgentStatus,
  type CallStatus,
} from "@/hooks/useAudioLessonCall";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useTeacherTranscript } from "@/hooks/useTeacherTranscript";
import { posthog } from "@/lib/posthog";
import { getCurrentStreak, useProgressStore } from "@/store/useProgressStore";

// Where each bottom tab goes when it is pressed from this screen.
const tabRoutes = {
  index: "/",
  learn: "/learn",
  "ai-teacher": "/ai-teacher",
  profile: "/profile",
} as const;

// The AI teacher scores the learner from 1 to 5 at the end of the lesson.
const feedbackRows = [
  { label: "Speaking", key: "speaking" },
  { label: "Pronunciation", key: "pronunciation" },
  { label: "Grammar", key: "grammar" },
] as const;

const scoreLabels: Record<number, { value: string; color: string }> = {
  5: { value: "Excellent", color: "text-success" },
  4: { value: "Great", color: "text-info" },
  3: { value: "Good", color: "text-lingua-deep-purple" },
  2: { value: "Keep going", color: "text-streak" },
  1: { value: "Needs practice", color: "text-error" },
};

// Text and dot color for each call state. While joined, the mic state is shown.
const statusLabels: Record<CallStatus, { label: string; dot: string }> = {
  idle: { label: "Ready to start", dot: "bg-text-secondary" },
  starting: { label: "Starting call…", dot: "bg-warning" },
  connecting: { label: "Connecting…", dot: "bg-warning" },
  joined: { label: "Live", dot: "bg-success" },
  reconnecting: { label: "Reconnecting…", dot: "bg-warning" },
  ended: { label: "Call ended", dot: "bg-text-secondary" },
  error: { label: "Call failed", dot: "bg-error" },
};

// Text and dot color for the AI teacher, shown while the learner is in a call.
const agentLabels: Record<AgentStatus, { label: string; dot: string }> = {
  idle: { label: "AI teacher: waiting", dot: "bg-text-secondary" },
  connecting: { label: "AI teacher: joining…", dot: "bg-warning" },
  connected: { label: "AI teacher: connected", dot: "bg-success" },
  failed: { label: "AI teacher: failed to join", dot: "bg-error" },
  left: { label: "AI teacher: left the call", dot: "bg-error" },
};

// Label of the button that starts a call, only for the states that show it.
const startLabels: Partial<Record<CallStatus, string>> = {
  idle: "Start call",
  ended: "Call again",
  error: "Try again",
};


// After the teacher says the lesson is over, the call stays open this long so
// the goodbye can finish playing before the call ends by itself.
const AUTO_END_DELAY_MS = 6000;

const getNow = () => Date.now();


export default function AudioLessonScreen() {
  const router = useRouter();
  // `tab` says which bottom tab opened this screen: the AI Teacher tab or Learn.
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const lesson = getLessonById(id);
  const currentLesson = useCurrentLesson();
  const theme = useThemeColors();
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const streakDays = useProgressStore((state) =>
    getCurrentStreak(state.streakDays, state.lastActiveDate),
  );
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );

  const { user } = useUser();
  const {
    status,
    agentStatus,
    isMicOn,
    feedback,
    isLessonOver,
    callId,
    error,
    start,
    retryAgent,
    startTalking,
    stopTalking,
    end,
  } = useAudioLessonCall(id);
  const { teacherText, learnerText } = useTeacherTranscript(callId);

  const [lineIndex, setLineIndex] = useState(0);
  const [result, setResult] = useState<"xp" | "repeat" | "short" | undefined>();

  const startedAtRef = useRef(0);
  const lastLineIndexRef = useRef(0);
  const isCompletedRef = useRef(false);
  const isEndingRef = useRef(false);
  // Always points to the latest endCall, so the auto end never uses old values.
  const endCallRef = useRef<() => Promise<void>>(async () => {});
  const lessonId = lesson?.id;
  const lessonLanguageCode = lesson?.languageCode ?? null;
  const lessonNumber = lesson?.order ?? null;

  useEffect(() => {
    lastLineIndexRef.current = lineIndex;
  }, [lineIndex]);

  useEffect(() => {
    if (!lessonId) return;

    startedAtRef.current = getNow();
    isCompletedRef.current = false;
    posthog?.capture("lesson_started", {
      lesson_id: lessonId,
      language: lessonLanguageCode,
      lesson_number: lessonNumber,
    });

    // Leaving the screen before the lesson is completed counts as abandoned.
    return () => {
      if (isCompletedRef.current) return;
      posthog?.capture("lesson_abandoned", {
        lesson_id: lessonId,
        time_into_lesson_seconds: Math.round(
          (getNow() - startedAtRef.current) / 1000,
        ),
        last_question_index: lastLineIndexRef.current,
      });
    };
  }, [lessonId, lessonLanguageCode, lessonNumber]);

  const isInCall = status === "joined" || status === "reconnecting";

  const endCall = async () => {
    if (!isInCall) {
      router.back();
      return;
    }
    if (!lesson || isEndingRef.current) return;
    isEndingRef.current = true;
    const wasCompleted = completedLessonIds.includes(lesson.id);
    const earned = await end();
    if (earned) {
      completeLesson(lesson.id, lesson.xpReward);
      isCompletedRef.current = true;
      posthog?.capture("lesson_completed", {
        lesson_id: lesson.id,
        language: lesson.languageCode,
        lesson_number: lesson.order,
        duration_seconds: Math.round((getNow() - startedAtRef.current) / 1000),
        xp_earned: wasCompleted ? 0 : lesson.xpReward,
      });
    }
    setResult(!earned ? "short" : wasCompleted ? "repeat" : "xp");
  };

  useEffect(() => {
    endCallRef.current = endCall;
  });

  // The teacher finished the lesson: end the call for the learner.
  useEffect(() => {
    if (!isLessonOver) return;
    const timer = setTimeout(() => endCallRef.current(), AUTO_END_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLessonOver]);

  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;
  const userName =
    user?.fullName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ??
    "Learner";

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

  // AI Teacher always means the lesson the learner is on. If this screen is
  // already that tab, nothing happens, so a running call is not interrupted.
  const onTabPress = (name: TabName) => {
    if (name !== "ai-teacher") {
      router.dismissTo(tabRoutes[name]);
    } else if (tab !== "ai-teacher") {
      if (currentLesson) {
        router.replace({
          pathname: "/lesson/[id]",
          params: { id: currentLesson.id, tab: "ai-teacher" },
        });
      } else {
        router.dismissTo(tabRoutes[name]);
      }
    }
  };

  const nextLine = () => setLineIndex((lineIndex + 1) % teacherLines.length);

  // While the teacher is talking, the bubble shows what it really says.
  // Before that (or if the transcript is unavailable) it shows the lesson phrases.
  const liveText = isInCall ? teacherText : undefined;
  const isBusy = status === "starting" || status === "connecting";
  const startLabel = startLabels[status];
  const statusInfo =
    status === "joined" && isLessonOver
      ? { label: "Lesson finished", dot: "bg-success" }
      : status === "joined" && isMicOn
        ? { label: "Listening…", dot: "bg-success" }
        : statusLabels[status];

  const startCall = () => {
    isEndingRef.current = false;
    setResult(undefined);
    start();
  };

  const canRetryAgent =
    isInCall && (agentStatus === "failed" || agentStatus === "left");

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Header: back, teacher status, streak, end call */}
        <View className="mt-2 h-14 flex-row items-center px-5">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.back()}
            className="h-11 w-10 justify-center"
          >
            <Image
              source={images.chevronBack}
              tintColor={theme.textPrimary}
              style={{ width: 26, height: 26 }}
            />
          </TouchableOpacity>

          <View className="ml-2 flex-1">
            <Text className="font-poppins-semibold text-[18px] text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center">
              <View className={`size-2.5 rounded-full ${statusInfo.dot}`} />
              <Text className="typography--body-sm ml-2 text-text-secondary">
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <View className="audio-pill">
            <Image
              source={images.headphones}
              tintColor={theme.textPrimary}
              style={{ width: 22, height: 22 }}
            />
          </View>
          <View className="audio-pill ml-2 px-3">
            <Text className="font-poppins-medium text-h4 text-text-primary">
              {streakDays}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={status === "starting"}
            accessibilityLabel="End call"
            onPress={endCall}
            className={`audio-pill audio-pill--danger ml-2 ${status === "starting" ? "opacity-40" : ""}`}
          >
            <Image
              source={images.phoneHangup}
              tintColor={colors.white}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
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
            <View className="flex-row items-center rounded-2xl bg-card/90 p-3">
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
                className="absolute -top-1.5 right-1/4 size-5 rotate-45 bg-card"
                style={styles.shadow}
              />
              <View
                className="flex-row items-center rounded-3xl bg-card px-5 py-4"
                style={styles.shadow}
              >
                <View className="flex-1">
                  <Text className="font-poppins-medium text-[18px] leading-7 text-text-primary">
                    {liveText ?? line.text}
                  </Text>
                  {!liveText && line.translation && (
                    <Text className="font-poppins-medium text-[18px] leading-7 text-text-secondary">
                      {line.translation}
                    </Text>
                  )}
                </View>
                {!liveText && (
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
                )}
              </View>
            </View>
          </View>

          {/* Learner info and call status */}
          <View className="audio-call">
            <View className="audio-call__user">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  contentFit="cover"
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
              ) : (
                <View className="size-11 items-center justify-center rounded-full bg-surface">
                  <Text className="font-poppins-semibold text-h4 text-text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text
                  className="font-poppins-semibold text-body-md text-text-primary"
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  className="typography--body-sm text-text-secondary"
                  numberOfLines={1}
                >
                  {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
                </Text>
              </View>
              <View className="audio-call__status">
                {isBusy ? (
                  <ActivityIndicator size="small" color={colors.warning} />
                ) : (
                  <View className={`size-2 rounded-full ${statusInfo.dot}`} />
                )}
                <Text className="typography--caption ml-2 text-text-primary">
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {isInCall && (
              <View className="audio-call__agent">
                {agentStatus === "connecting" ? (
                  <ActivityIndicator size="small" color={colors.warning} />
                ) : (
                  <View
                    className={`size-2 rounded-full ${agentLabels[agentStatus].dot}`}
                  />
                )}
                <Text className="typography--caption ml-2 text-text-primary">
                  {agentLabels[agentStatus].label}
                </Text>
              </View>
            )}

            {/* Live caption of what the learner says */}
            {isInCall && learnerText && (
              <Text
                className="typography--body-sm mt-3 text-text-secondary"
                numberOfLines={2}
              >
                You: {learnerText}
              </Text>
            )}

            {canRetryAgent && (
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel="Call the teacher again"
                onPress={retryAgent}
                className="practice-button mt-4"
              >
                <Text className="font-poppins-semibold text-h4 text-white">
                  Call the teacher again
                </Text>
              </TouchableOpacity>
            )}

            {error && <Text className="audio-call__error">{error}</Text>}

            {status === "ended" && result && (
              <Text className="typography--body-sm mt-3 text-center text-text-secondary">
                {result === "xp" && `Lesson complete! +${lesson.xpReward} XP`}
                {result === "repeat" && "Nice practice! You already earned the XP for this lesson."}
                {result === "short" &&
                  "Talk with your teacher for at least a minute to earn XP."}
              </Text>
            )}

            {startLabel && (
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel={startLabel}
                onPress={startCall}
                className="practice-button mt-4"
              >
                <Text className="font-poppins-semibold text-h4 text-white">
                  {startLabel}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Hold to talk: the mic is only open while the button is pressed */}
          <View className={`audio-talk ${isInCall ? "" : "audio-talk--disabled"}`}>
            <View
              className={`audio-talk__ring ${isMicOn ? "audio-talk__ring--active" : ""}`}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={!isInCall}
                accessibilityLabel="Hold to talk"
                onPressIn={startTalking}
                onPressOut={stopTalking}
                className={`audio-talk__button ${isMicOn ? "audio-talk__button--active" : ""}`}
              >
                <Image
                  source={images.mic}
                  tintColor={colors.white}
                  style={{ width: 36, height: 36 }}
                />
              </TouchableOpacity>
            </View>
            <Text
              className={`audio-talk__hint ${isMicOn ? "audio-talk__hint--active" : ""}`}
            >
              {isMicOn
                ? "Listening… release when done"
                : isInCall
                  ? "Hold to talk"
                  : "Start the call to talk"}
            </Text>
          </View>

          {/* Lesson feedback */}
          <View className="audio-feedback" style={styles.shadow}>
            {feedbackRows.map((item, index) => {
              // Until the teacher reports its scores, show a dash.
              const score = feedback ? scoreLabels[feedback[item.key]] : undefined;
              return (
                <View
                  key={item.key}
                  className={`audio-feedback__item ${index > 0 ? "audio-feedback__item--divider" : ""}`}
                >
                  <Text className="audio-feedback__label" numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text
                    className={`audio-feedback__value ${score?.color ?? "text-text-secondary"}`}
                    numberOfLines={1}
                  >
                    {score?.value ?? "—"}
                  </Text>
                </View>
              );
            })}
          </View>
          {!feedback && (
            <Text className="typography--caption mt-3 text-center text-text-secondary">
              Your scores appear as you speak with your teacher.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* The tab that opened this lesson stays highlighted (Learn by default). */}
      <TabBarView
        activeTab={tab === "ai-teacher" ? "ai-teacher" : "learn"}
        onTabPress={onTabPress}
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
