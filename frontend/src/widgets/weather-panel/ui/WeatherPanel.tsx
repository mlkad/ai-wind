import { useTranslation } from "react-i18next";
import { Cloud } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

import { buildSiteAverageRows, type ForecastResponse } from "@/entities/forecast";
import { baseTransition } from "@/shared/config";
import { Card, CardHeader, EmptyState, SegmentedControl, Skeleton, type SegmentOption } from "@/shared/ui";

import { WeatherChart, type WeatherMetric } from "./WeatherChart";

const TABS: readonly SegmentOption<WeatherMetric>[] = [
  { value: "wind", label: "Wind" },
  { value: "temperature", label: "Temperature" },
];

type WeatherPanelProps = {
  forecast: ForecastResponse | undefined;
  isLoading: boolean;
};

export function WeatherPanel({ forecast, isLoading }: WeatherPanelProps) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<WeatherMetric>("wind");
  const turbines = forecast?.turbines ?? [];
  const rows = useMemo(
    () => buildSiteAverageRows(turbines, metric === "wind" ? "windSpeed" : "temperature"),
    [turbines, metric],
  );
  const hasData = rows.length > 0 && forecast !== undefined;

  return (
    <Card aria-labelledby="weather-title" className="flex h-full flex-col">
      <CardHeader
        titleId="weather-title"
        title={t("Weather forecast")}
        description={t("Hourly weather conditions at the site")}
        icon={<Cloud className="size-5" strokeWidth={1.4} aria-hidden />}
        action={
          <SegmentedControl
            value={metric}
            options={TABS.map((option) => ({ ...option, label: t(option.label) }))}
            onValueChange={setMetric}
            ariaLabel={t("Weather variable")}
            variant="subtle"
            size="sm"
            className="w-auto"
          />
        }
      />
      <div className="min-h-[150px] flex-1">
        {isLoading ? (
          <Skeleton className="h-full min-h-[150px]" />
        ) : hasData ? (
          <motion.div
            key={`${forecast.generatedAt}-${metric}`}
            className="h-full min-h-[150px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={baseTransition}
          >
            <WeatherChart metric={metric} rows={rows} horizonHours={forecast.horizonHours} />
          </motion.div>
        ) : (
          <EmptyState
            className="min-h-[150px] py-4"
            icon={<Cloud className="size-6" strokeWidth={1.4} aria-hidden />}
            title={t("Weather not loaded")}
            description={t("The agent fetches hourly wind speed and temperature during a run.")}
          />
        )}
      </div>
    </Card>
  );
}
