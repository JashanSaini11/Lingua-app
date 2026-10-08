import { getFlagUrl } from "@/lib/flags";
import type { Language, LanguageCode } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagUrl: getFlagUrl("es"),
    learners: "28.4M learners",
    greeting: "¡Hola!",
    hello: "Hola",
    teacherName: "Sofía",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flagUrl: getFlagUrl("fr"),
    learners: "19.4M learners",
    greeting: "Bonjour !",
    hello: "Bonjour",
    teacherName: "Camille",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagUrl: getFlagUrl("ja"),
    learners: "12.7M learners",
    greeting: "こんにちは！",
    hello: "こんにちは",
    teacherName: "Yuki",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flagUrl: getFlagUrl("en"),
    learners: "35.2M learners",
    greeting: "Hello!",
    hello: "Hello",
    teacherName: "Emma",
  },
];

export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return languages.find((language) => language.code === code);
}
