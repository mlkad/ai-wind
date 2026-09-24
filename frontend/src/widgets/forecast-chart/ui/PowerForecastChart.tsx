import { useTranslation } from "react-i18next";
import { Activity, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

import { buildChartRows, type ForecastResponse } from "@/entities/forecast";
import { TURBINES, type TurbineId } from "@/entities/turbine";
import { EASE_OUT_EXPO } from "@/shared/config";
import { Card, CardHeader, EmptyState, SegmentedControl, Skeleton, type SegmentOption } from "@/shared/ui";
import { ChartLegend } from "@/shared/ui/chart";

import { PowerChart } from "./PowerChart";

type SeriesFilter = "1" | "2" | "both";

const FILTER_OPTIONS: readonly SegmentOption<SeriesFilter>[] = [
  { value: "1", label: "Turbine 1" },
  { value: "2", label: "Turbine 2" },
  { value: "both", label: "Both" },
];

type PowerForecastChartProps = {
  forecast: ForecastResponse | undefined;
  isLoading: boolean;
};

export function PowerForecastChart({ forecast, isLoading }: PowerForecastChartProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<SeriesFilter>("both");
  const turbines = forecast?.turbines ?? [];
  const rows = useMemo(() => buildChartRows(turbines, "predictedPower"), [turbines]);
  const available = turbines.map((turbine) => turbine.turbineId);
  const visible: TurbineId[] =
    filter === "both" ? available : available.filter((id) => String(id) === filter).slice(0, 1);
  const turbineIds = visible.length > 0 ? visible : available;
  const hasData = rows.length > 0 && forecast !== undefined;

  return (
    <Card aria-labelledby="power-title" active={isLoading} className="flex h-full flex-col">
      <CardHeader
        titleId="power-title"
        title={t("Power forecast")}
        description={t("Normalized active power by turbine")}
        icon={<Sparkle className="size-5" strokeWidth={1.4} aria-hidden />}
        action={
          available.length > 1 ? (
            <SegmentedControl
              value={filter}
              options={FILTER_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
              onValueChange={setFilter}
              ariaLabel={t("Visible turbines")}
              variant="subtle"
              size="sm"
              className="w-auto"
            />
          ) : null
        }
      />
      <div className="min-h-[240px] flex-1">
        {isLoading ? (
          <Skeleton className="h-full min-h-[240px]" />
        ) : hasData ? (
          <motion.div
            key={forecast.generatedAt}
            className="h-full min-h-[240px]"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          >
            <PowerChart rows={rows} turbineIds={turbineIds} horizonHours={forecast.horizonHours} />
          </motion.div>
        ) : (
          <EmptyState
            icon={<Activity className="size-6" strokeWidth={1.4} aria-hidden />}
            title={forecast?.status === "failed" ? t("Forecast failed") : t("No forecast yet")}
            description={
              forecast?.status === "failed"
                ? t("The agent stopped before producing a forecast. See Agent activity for details.")
                : t("Choose a date, turbines and horizon, then run the agent.")
            }
          />
        )}
      </div>
      {hasData ? (
        <ChartLegend
          className="mt-3 justify-center"
          items={turbineIds.map((id) => ({
            key: String(id),
            label: t(TURBINES[id].name),
            color: TURBINES[id].color,
            shape: TURBINES[id].marker,
          }))}
        />
      ) : null}
    </Card>
  );
}
