import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import en from "./locales/en";

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "nl", label: "NL", name: "Nederlands" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "sv", label: "SV", name: "Svenska" },
  { code: "da", label: "DA", name: "Dansk" },
  { code: "no", label: "NO", name: "Norsk" },
  { code: "ru", label: "RU", name: "Русский" },
] as const;

// EN is bundled synchronously as the fallback so we never show empty strings.
// The other 7 locales are lazy-loaded on demand; Vite turns each import() into its own chunk.
const lazyLocales: Record<string, () => Promise<{ default: unknown }>> = {
  fr: () => import("./locales/fr"),
  nl: () => import("./locales/nl"),
  de: () => import("./locales/de"),
  sv: () => import("./locales/sv"),
  da: () => import("./locales/da"),
  no: () => import("./locales/no"),
  ru: () => import("./locales/ru"),
};

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend(async (language: string, _namespace: string) => {
      const loader = lazyLocales[language];
      if (!loader) return {};
      const mod = await loader();
      return mod.default as Record<string, unknown>;
    })
  )
  .use(initReactI18next)
  .init({
    // Bundle EN synchronously; other locales come through the backend on demand.
    partialBundledLanguages: true,
    resources: {
      en: { translation: en },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "nl", "de", "sv", "ru", "da", "no"],
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
  });

export default i18n;
