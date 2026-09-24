import { useTranslation } from "react-i18next";
import { ChartColumn, SunMedium } from "lucide-react";
import type { ReactNode } from "react";

import type { ForecastResponse } from "@/entities/forecast";
import { formatDay, formatFixed, formatHour } from "@/shared/lib";
import { AnimatedNumber, Skeleton } from "@/shared/ui";

type ForecastSummaryProps = {
  forecast: ForecastResponse | undefined;
  isLoading: boolean;
};

const formatPower = (value: number) => formatFixed(value, 2);

function Row({ label, value, extra }: { label: string; value: ReactNode; extra?: ReactNode }) {
  return (
    <div className="flex h-[38px] items-center gap-3 border-b border-line px-4 last:border-b-0">
      <dt className="flex-1 text-[12.5px] text-ink-muted">{label}</dt>
      <dd className="text-[15px] text-ink tabular-nums">{value}</dd>
      <span className="flex w-14 justify-end">{extra}</span>
    </div>
  );
}

/** Forecast Summary section (rendered inside the right-column card). */
export function ForecastSummary({ forecast, isLoading }: ForecastSummaryProps) {
  const { t } = useTranslation();
  const summary = forecast?.summary ?? null;
  const placeholder = isLoading ? <Skeleton className="h-4 w-12" /> : "…";

  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" className="mb-3.5 flex items-center gap-3 font-display text-[19px] text-ink">
        <ChartColumn className="size-5 text-cream/80" strokeWidth={1.4} aria-hidden />
        {t("Forecast summary")}
      </h2>
      <dl className="field rounded-[12px]">
        <Row
          label={t("Average power")}
          value={summary ? <AnimatedNumber value={summary.averagePower} format={formatPower} /> : placeholder}
          extra={
            summary ? (
              <span
                className="rounded-md bg-sage/[0.12] px-1.5 py-0.5 text-[10.5px] text-sage tabular-nums"
                title={t("Share of rated capacity")}
              >
                {Math.round(summary.averagePower * 100)}
                {t("% rated")}
              </span>
            ) : null
          }
        />
        <Row
          label={t("Peak hour")}
          value={
            summary ? (
              <span>
                <span className="mr-1.5 text-[11px] text-ink-subtle">{formatDay(summary.peakHour)}</span>
                {formatHour(summary.peakHour)}
              </span>
            ) : (
              placeholder
            )
          }
          extra={<SunMedium className="size-[18px] text-cream/80" strokeWidth={1.4} aria-hidden />}
        />
        <Row
          label={t("Maximum")}
          value={summary ? <AnimatedNumber value={summary.maxPower} format={formatPower} /> : placeholder}
        />
        <Row
          label={t("Minimum")}
          value={summary ? <AnimatedNumber value={summary.minPower} format={formatPower} /> : placeholder}
        />
      </dl>
    </section>
  );
}
