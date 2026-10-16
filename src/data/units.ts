import { getPlaceholderImage } from "@/lib/placeholder";
import type { LanguageCode, Unit } from "@/types/learning";

export const units: Unit[] = [
  // Spanish
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    level: "A1",
    title: "Hello, Spanish!",
    emoji: "👋",
    image: getPlaceholderImage("es-unit-1", 800, 400),
    description: "Greet people and introduce yourself.",
  },
  {
    id: "es-unit-2",
    languageCode: "es",
    order: 2,
    level: "A1",
    title: "Food & Drinks",
    emoji: "🌮",
    image: getPlaceholderImage("es-unit-2", 800, 400),
    description: "Order a snack and a drink at a café.",
  },

  // French
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    level: "A1",
    title: "Bonjour, France!",
    emoji: "🗼",
    image: getPlaceholderImage("fr-unit-1", 800, 400),
    description: "Say hello and be polite.",
  },

  // Japanese
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    level: "A1",
    title: "Konnichiwa!",
    emoji: "🌸",
    image: getPlaceholderImage("ja-unit-1", 800, 400),
    description: "Greet people and say thank you.",
  },

  // English
  {
    id: "en-unit-1",
    languageCode: "en",
    order: 1,
    level: "A1",
    title: "Hello, English!",
    emoji: "👋",
    image: getPlaceholderImage("en-unit-1", 800, 400),
    description: "Greet people and handle everyday situations.",
  },
];

export function getUnitsByLanguage(languageCode: LanguageCode): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
