import type { LanguageCode, Unit } from "@/types/learning";

export const units: Unit[] = [
  // Spanish
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Hello, Spanish!",
    emoji: "👋",
    description: "Greet people and introduce yourself.",
  },
  {
    id: "es-unit-2",
    languageCode: "es",
    order: 2,
    title: "Food & Drinks",
    emoji: "🌮",
    description: "Order a snack and a drink at a café.",
  },

  // French
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Bonjour, France!",
    emoji: "🗼",
    description: "Say hello and be polite.",
  },

  // Japanese
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Konnichiwa!",
    emoji: "🌸",
    description: "Greet people and say thank you.",
  },
];

export function getUnitsByLanguage(languageCode: LanguageCode): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
