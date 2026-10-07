const countryByLanguage: Record<string, string> = {
  en: "us",
  english: "us",
  es: "es",
  spanish: "es",
  fr: "fr",
  french: "fr",
  ja: "jp",
  japanese: "jp",
};

// Widths flagcdn serves for PNG flags.
type FlagWidth = 20 | 40 | 80 | 160 | 320 | 640;

// Accepts a language code ("ja"), a language name ("Japanese") or a country code ("us").
export function getFlagUrl(codeOrName: string, width: FlagWidth = 80): string {
  const key = codeOrName.trim().toLowerCase();
  const countryCode = countryByLanguage[key] ?? key;

  return `https://flagcdn.com/w${width}/${countryCode}.png`;
}
