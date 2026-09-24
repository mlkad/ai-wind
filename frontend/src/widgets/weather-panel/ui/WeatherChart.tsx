import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { hourlyTicks, type SiteRow } from "@/entities/forecast";
import { palette } from "@/shared/config";
import { formatDayHour, formatFixed, formatTimeTick } from "@/shared/lib";
import { ChartTooltipCard } from "@/shared/ui/chart";

export type WeatherMetric = "wind" | "temperature";

const AXIS_TICK = { fill: palette.inkMuted, fontSize: 11.5 };
const META: Record<WeatherMetric, { label: string; unit: string }> = {
  wind: { label: "Wind speed", unit: "m/s" },
  temperature: { label: "Temperature", unit: "°C" },
};

type WeatherChartProps = {
  metric: WeatherMetric;
  rows: SiteRow[];
  horizonHours: number;
};

function WeatherTooltip({
  active,
  label,
  byTimestamp,
  metric,
}: Pick<TooltipContentProps<number, string>, "active" | "label"> & {
  byTimestamp: Map<string, number>;
  metric: WeatherMetric;
}) {
  const { t } = useTranslation();
  if (!active || typeof label !== "string") return null;
  const value = byTimestamp.get(label);
  if (value === undefined) return null;
  const { label: name, unit } = META[metric];
  return (
    <ChartTooltipCard
      title={formatDayHour(label)}
      items={[
        {
          key: metric,
          label: t(name),
          color: metric === "wind" ? palette.barActive : palette.cream,
          shape: "dot",
          value: `${formatFixed(value, 1)} ${unit}`,
        },
      ]}
    />
  );
}

export function WeatherChart({ metric, rows, horizonHours }: WeatherChartProps) {
  const { t } = useTranslation();
  const byTimestamp = useMemo(() => new Map(rows.map((row) => [row.timestamp, row.value])), [rows]);
  const ticks = useMemo(
    () =>
      hourlyTicks(
        rows.map((row) => ({ timestamp: row.timestamp })),
        horizonHours > 24 ? 8 : 4,
      ),
    [rows, horizonHours],
  );
  const common = {
    data: rows,
    margin: { top: 6, right: 6, bottom: 0, left: -18 },
  };
  const xAxis = (
    <XAxis
      dataKey="timestamp"
      ticks={ticks}
      tickFormatter={formatTimeTick}
      tick={AXIS_TICK}
      tickLine={false}
      axisLine={{ stroke: palette.axis }}
      tickMargin={10}
      minTickGap={10}
    />
  );
  const tooltip = (
    <Tooltip
      cursor={metric === "wind" ? false : { stroke: palette.axis, strokeWidth: 1 }}
      content={(props) => (
        <WeatherTooltip active={props.active} label={props.label} byTimestamp={byTimestamp} metric={metric} />
      )}
    />
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      {metric === "wind" ? (
        <BarChart {...common} barCategoryGap="22%">
          <CartesianGrid vertical={false} stroke={palette.grid} />
          {xAxis}
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} tickCount={3} allowDecimals={false} />
          {tooltip}
          <Bar
            dataKey="value"
            name={t("Wind speed")}
            fill={palette.bar}
            radius={[2, 2, 0, 0]}
            activeBar={{ fill: palette.barActive }}
            animationDuration={800}
          />
        </BarChart>
      ) : (
        <LineChart {...common}>
          <CartesianGrid vertical={false} stroke={palette.grid} />
          {xAxis}
          <YAxis
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={40}
            tickCount={3}
            domain={["dataMin - 2", "dataMax + 2"]}
            allowDecimals={false}
          />
          {tooltip}
          <Line
            type="monotone"
            dataKey="value"
            name={t("Temperature")}
            stroke={palette.cream}
            strokeWidth={1.8}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 1.6, stroke: palette.cream, fill: palette.surface }}
            animationDuration={800}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
