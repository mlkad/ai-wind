import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getLocale } from "@/shared/i18n";
import { LanguageSwitcher } from "@/shared/i18n/LanguageSwitcher";
import { TurbineMark } from "@/shared/ui";

import { ApiStatus } from "./ApiStatus";

const dateFormatter = () =>
  new Intl.DateTimeFormat(getLocale(), { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeFormatter = () => new Intl.DateTimeFormat(getLocale(), { hour: "2-digit", minute: "2-digit", hour12: false });

/** "Ср, 23 сент. 2026" — capitalised weekday, without the trailing "г.". */
function formatHeaderDate(date: Date): string {
  const text = dateFormatter()
    .format(date)
    .replace(/\s*г\.$/, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/** Top-right cluster over the hero: local date, clock and API status. */
export function Header() {
  useTranslation();
  const now = useNow(15_000);
  return (
    <div className="flex items-center gap-5 text-[12.5px] text-ink/80">
      <time dateTime={now.toISOString()} className="hidden tabular-nums sm:block">
        {formatHeaderDate(now)}
      </time>
      <span className="text-[14px] text-ink tabular-nums">{timeFormatter().format(now)}</span>
      <ApiStatus />
    </div>
  );
}

/** Compact bar for screens without the sidebar. */
export function MobileHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center flex-wrap gap-3 justify-between border-b border-line bg-sidebar/90 px-4 py-3 backdrop-blur lg:hidden">
      <Link to="/forecast" className="flex items-center gap-2" aria-label={t("WindAI: home")}>
        <TurbineMark className="h-7 w-6" />
        <span className="font-display text-xl text-ink">WindAI</span>
      </Link>
      <nav aria-label={t("Main navigation")} className="flex gap-1 text-[13px]">
        <Link
          to="/forecast"
          className="rounded-lg px-2.5 py-1 text-ink-muted"
          activeProps={{ className: "bg-panel-soft !text-ink" }}
        >
          {t("Forecast")}
        </Link>
        <Link
          to="/about"
          className="rounded-lg px-2.5 py-1 text-ink-muted"
          activeProps={{ className: "bg-panel-soft !text-ink" }}
        >
          {t("Methodology")}
        </Link>
      </nav>
      <LanguageSwitcher />
    </div>
  );
}
