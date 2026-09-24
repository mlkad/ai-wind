import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ru from "./ru.json";

export type Language = "en" | "ru";
export const LANGUAGE_STORAGE_KEY = "windai.language";

function savedLanguage(): Language {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "ru" ? "ru" : "en";
  } catch {
    return "en";
  }
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: savedLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
});

export function getLanguage(): Language {
  return i18n.resolvedLanguage === "ru" ? "ru" : "en";
}

export function getLocale(): string {
  return getLanguage() === "ru" ? "ru-RU" : "en-GB";
}

function syncDocument() {
  const language = getLanguage();
  document.documentElement.lang = language;
  document.title = i18n.t("WindAI · wind power forecast");
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", i18n.t("WindAI: agentic AI for hourly wind power forecasting."));
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
}

i18n.on("languageChanged", syncDocument);
syncDocument();

export { i18n };
