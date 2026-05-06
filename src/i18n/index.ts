import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import fr from "./locales/fr";
import nl from "./locales/nl";
import de from "./locales/de";
import sv from "./locales/sv";
import ru from "./locales/ru";
import da from "./locales/da";
import no from "./locales/no";

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      nl: { translation: nl },
      de: { translation: de },
      sv: { translation: sv },
      ru: { translation: ru },
      da: { translation: da },
      no: { translation: no },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "nl", "de", "sv", "ru", "da", "no"],
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
  });

export default i18n;
