import { useTranslation } from "react-i18next";

import type { Language } from "./index";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t("Interface language")}
      className="inline-flex shrink-0 rounded-lg border border-line-strong bg-panel-soft p-1"
    >
      {(["en", "ru"] as const).map((language: Language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-label={language === "en" ? "English" : "Русский"}
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => void i18n.changeLanguage(language)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${i18n.resolvedLanguage === language ? "bg-cream text-canvas" : "text-ink-muted hover:text-ink"}`}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
