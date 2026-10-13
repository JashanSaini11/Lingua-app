import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";
import { buildPracticeQuestions, XP_PER_CORRECT_ANSWER } from "@/lib/practice";
import { usePracticeStore } from "@/store/usePracticeStore";
import { useProgressStore } from "@/store/useProgressStore";
import type { LanguageCode, PracticeQuestion } from "@/types/learning";

type PracticeTabProps = {
  unitId: string;
  languageCode: LanguageCode;
};

type Phase = "intro" | "quiz" | "result";

export function PracticeTab({ unitId, languageCode }: PracticeTabProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const addXp = useProgressStore((state) => state.addXp);
  const sessionsCompleted = usePracticeStore((state) => state.sessionsCompleted);
  const bestScore = usePracticeStore((state) => state.bestScores[unitId]);
  const recordSession = usePracticeStore((state) => state.recordSession);

  const start = () => {
    const next = buildPracticeQuestions(unitId, languageCode);
    if (next.length === 0) {
      return;
    }
    setQuestions(next);
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setPhase("quiz");
  };

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const choose = (option: string) => {
    // The first tap is the answer, it cannot be changed afterwards.
    if (selected !== null) {
      return;
    }
    setSelected(option);
    if (option === question.correctAnswer) {
      setCorrectCount((count) => count + 1);
    }
  };

  const next = () => {
    if (!isLast) {
      setIndex((value) => value + 1);
      setSelected(null);
      return;
    }
    addXp(correctCount * XP_PER_CORRECT_ANSWER);
    recordSession(unitId, correctCount, questions.length);
    setPhase("result");
  };

  if (phase === "quiz" && question) {
    return (
      <View className="mt-5 px-5">
        {/* Progress bar */}
        <View className="h-2 overflow-hidden rounded-full bg-surface">
          <View
            className="h-full rounded-full bg-lingua-purple"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </View>
        <Text className="typography--body-sm mt-2 text-text-secondary">
          Question {index + 1} of {questions.length}
        </Text>

        <View className="my-5 items-center">
          {question.emoji && (
            <Text className="mb-2 text-[48px] leading-[60px]">
              {question.emoji}
            </Text>
          )}
          <Text className="typography--h3 text-center text-text-primary">
            {question.prompt}
          </Text>
        </View>

        {question.options.map((option) => {
          const isCorrect = option === question.correctAnswer;
          const state =
            selected === null
              ? ""
              : isCorrect
                ? "practice-option--correct"
                : option === selected
                  ? "practice-option--wrong"
                  : "";

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              onPress={() => choose(option)}
              className={`practice-option ${state}`}
            >
              <Text className="font-poppins-medium text-body-lg text-text-primary">
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={selected === null}
          onPress={next}
          className={`practice-button mt-3 ${selected === null ? "practice-button--disabled" : ""}`}
        >
          <Text className="font-poppins-semibold text-h4 text-white">
            {isLast ? "Finish" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === "result") {
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <View className="mt-8 items-center px-5">
        <Image
          source={images.mascotWelcome}
          contentFit="contain"
          style={{ width: 150, height: 150 }}
        />
        <Text className="typography--h2 mt-2 text-text-primary">
          {score >= 80 ? "Great job!" : score >= 50 ? "Good work!" : "Keep going!"}
        </Text>
        <Text className="typography--body-lg mt-1 text-text-secondary">
          You got {correctCount} of {questions.length} right
        </Text>

        <View className="mt-5 flex-row gap-3">
          <View className="items-center rounded-2xl bg-surface px-6 py-3">
            <Text className="font-poppins-bold text-h3 text-lingua-deep-purple">
              {score}%
            </Text>
            <Text className="typography--caption text-text-secondary">Score</Text>
          </View>
          <View className="items-center rounded-2xl bg-surface px-6 py-3">
            <Text className="font-poppins-bold text-h3 text-lingua-deep-purple">
              +{correctCount * XP_PER_CORRECT_ANSWER}
            </Text>
            <Text className="typography--caption text-text-secondary">XP</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={start}
          className="practice-button mt-8 w-full"
        >
          <Text className="font-poppins-semibold text-h4 text-white">
            Practice again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setPhase("intro")}
          className="mt-4 h-10 justify-center"
        >
          <Text className="font-poppins-semibold text-h4 text-lingua-deep-purple">
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mt-5 px-5">
      <View className="items-center rounded-3xl bg-bubble-indigo px-6 py-6">
        <Image
          source={images.treasure}
          contentFit="contain"
          style={{ width: 96, height: 96 }}
        />
        <Text className="typography--h3 mt-2 text-center text-text-primary">
          Practice your words
        </Text>
        <Text className="typography--body-md mt-1 text-center text-text-secondary">
          Answer quick questions about this unit and earn {XP_PER_CORRECT_ANSWER}{" "}
          XP for every correct answer.
        </Text>

        <View className="mt-4 flex-row gap-3">
          <View className="items-center rounded-2xl bg-white px-5 py-2">
            <Text
              className="font-poppins-bold text-h4 text-lingua-deep-purple"
            >
              {bestScore !== undefined ? `${bestScore}%` : "--"}
            </Text>
            <Text className="typography--caption text-text-secondary">
              Best score
            </Text>
          </View>
          <View className="items-center rounded-2xl bg-white px-5 py-2">
            <Text
              className="font-poppins-bold text-h4 text-lingua-deep-purple"
            >
              {sessionsCompleted}
            </Text>
            <Text className="typography--caption text-text-secondary">
              Sessions
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={start}
        className="practice-button mt-5"
      >
        <Text className="font-poppins-semibold text-h4 text-white">
          Start practice
        </Text>
      </TouchableOpacity>
    </View>
  );
}
