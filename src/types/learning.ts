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
  teacherName: string; // AI teacher shown in video/audio/chat lessons
};

export type Unit = {
  id: string;
  languageCode: LanguageCode;
  order: number; // position inside the language path (1, 2, 3...)
  title: string;
  emoji: string; // shown next to the unit title
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

export type Lesson = {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  order: number; // position inside the unit
  title: string;
  emoji: string; // lesson icon on the path
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
