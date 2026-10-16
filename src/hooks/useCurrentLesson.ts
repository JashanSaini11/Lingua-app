import { getLanguageByCode } from "@/data/languages";
import { getCurrentLesson } from "@/lib/learn";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";

// The lesson the learner is on, for the selected language.
// Undefined when no language is picked or the language has no lessons yet.
export function useCurrentLesson() {
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const completedLessonIds = useProgressStore(
    (state) => state.completedLessonIds,
  );

  const language = selectedLanguage
    ? getLanguageByCode(selectedLanguage)
    : undefined;

  return language ? getCurrentLesson(language, completedLessonIds) : undefined;
}
