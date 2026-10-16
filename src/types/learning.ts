import type { images } from "@/constants/images";

// Types for the hardcoded learning content in `src/data/`.
// Hierarchy: Language -> Unit -> Lesson -> (vocabulary, phrases, activities).

export type LanguageCode = "en" | "es" | "fr" | "ja";

export type Language = {
  code: LanguageCode;
  name: string; // "Spanish"
  nativeName: string; // "Español"
  flagUrl: string; // from getFlagUrl() in lib/flags.ts
  learners: string; // shown on the language screen, e.g. "28.4M learners"
  greeting: string; // "¡Hola!"
  hello: string; // "Hola" (no punctuation, used in "Hola, Alex!")
  teacherName: string; // AI teacher shown in video/audio/chat lessons
};

export type Unit = {
  id: string;
  languageCode: LanguageCode;
  order: number; // position inside the language path (1, 2, 3...)
  level: string; // CEFR level shown on the home screen, e.g. "A1"
  title: string;
  emoji: string; // shown next to the unit title
  image: string; // picture at the top of the lessons screen
  description: string;
};

export type LessonType = "video" | "audio" | "chat" | "review";

export type VocabularyItem = {
  id: string;
  emoji: string; // makes the word easier to remember
  word: string; // in the target language
  translation: string; // in English
  pronunciation: string; // simple guide, e.g. "OH-lah"
  example?: string;
};

export type Phrase = {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
};

// Activities are a union keyed by `type`, so TypeScript knows which fields exist.
export type MultipleChoiceActivity = {
  id: string;
  type: "multiple-choice";
  prompt: string;
  options: string[];
  correctAnswer: string; // must match one of `options`
};

export type TranslationActivity = {
  id: string;
  type: "translation";
  prompt: string; // sentence to translate
  answer: string; // expected translation
};

export type SpeakingActivity = {
  id: string;
  type: "speaking";
  prompt: string;
  targetText: string; // what the learner should say out loud
  translation: string;
};

export type Activity =
  | MultipleChoiceActivity
  | TranslationActivity
  | SpeakingActivity;

// Everything the backend needs to start an AI teacher session for this lesson.
// The mobile app only sends the lesson id; the server reads these prompts.
export type AiTeacherPrompt = {
  openingLine: string; // first thing the teacher says
  instructions: string; // system-style prompt for the Vision Agent
};

// One multiple-choice question in a practice session.
export type PracticeQuestion = {
  id: string;
  emoji?: string; // shown above the prompt for vocabulary questions
  prompt: string;
  options: string[];
  correctAnswer: string; // must match one of `options`
};

// How a lesson card looks on the lessons screen.
export type LessonStatus = "completed" | "in-progress" | "not-started";

// One row of "Today's plan" on the home screen.
export type PlanItemKind = "lesson" | "words";

export type PlanItem = {
  id: string;
  kind: PlanItemKind; // decides the icon and its color
  title: string;
  subtitle: string;
  done: boolean;
};

export type Lesson = {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  order: number; // position inside the unit
  title: string;
  emoji: string; // lesson icon on the path
  image: string; // lesson picture shown on its card
  description: string;
  type: LessonType;
  xpReward: number;
  estimatedMinutes: number;
  goals: string[]; // "By the end you can..."
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacher: AiTeacherPrompt;
};

// What an achievement is measured against (see `lib/achievements.ts`).
export type AchievementStat =
  | "lessons" // lessons finished
  | "practice" // practice sessions finished
  | "streak" // days in a row with activity
  | "words" // words learned
  | "xp" // total XP earned
  | "goal"; // 1 once today's daily goal is reached

export type Achievement = {
  id: string;
  title: string; // "Word Collector"
  description: string; // what to do, shown until it is earned
  icon: keyof typeof images; // name of an icon in constants/images.ts
  tint: "orange" | "purple" | "yellow" | "blue" | "green" | "red";
  stat: AchievementStat;
  target: number; // earned when the stat reaches this number
};
