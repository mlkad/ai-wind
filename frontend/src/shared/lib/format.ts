import { getLocale, i18n } from "@/shared/i18n";

/** Backend timestamps are wall-clock ISO strings; no site-timezone conversion is applied. */
export function parseTimestamp(value: string): Date {
  return new Date(value);
}

export function formatHour(value: string): string {
  return new Intl.DateTimeFormat(getLocale(), { hour: "2-digit", minute: "2-digit", hour12: false }).format(
    parseTimestamp(value),
  );
}

export function formatDay(value: string): string {
  return new Intl.DateTimeFormat(getLocale(), { day: "numeric", month: "short" }).format(parseTimestamp(value));
}

export function formatDayHour(value: string): string {
  return `${formatDay(value)}, ${formatHour(value)}`;
}

/** Parse calendar dates locally to avoid changing the forecast date across timezones. */
export function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat(getLocale(), { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${isoDate}T00:00:00`),
  );
}

export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${formatFixed(value * 100, fractionDigits)}%`;
}

export function formatFixed(value: number, fractionDigits = 2): string {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatDuration(ms: number): string {
  return ms < 1000
    ? i18n.t("{{value}} ms", { value: ms })
    : i18n.t("{{value}} s", { value: formatFixed(ms / 1000, 2) });
}

export function formatRelativeTime(isoDateTime: string, now: Date = new Date()): string {
  const seconds = Math.round((now.getTime() - new Date(isoDateTime).getTime()) / 1000);
  if (seconds < 10) return i18n.t("just now");
  const formatter = new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto" });
  if (seconds < 60) return formatter.format(-seconds, "second");
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? formatter.format(-minutes, "minute") : new Date(isoDateTime).toLocaleString(getLocale());
}
