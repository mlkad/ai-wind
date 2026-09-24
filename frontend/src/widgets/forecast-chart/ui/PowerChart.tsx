import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { hourlyTicks, seriesKey, type ChartRow } from "@/entities/forecast";
import { TURBINES, type TurbineId } from "@/entities/turbine";
import { palette } from "@/shared/config";
import { formatDayHour, formatFixed, formatTimeTick } from "@/shared/lib";
import { ChartTooltipCard } from "@/shared/ui/chart";

const Y_TICKS = [0, 0.5, 1];
const AXIS_TICK = { fill: palette.inkMuted, fontSize: 11.5 };

type PowerChartProps = {
  rows: ChartRow[];
  turbineIds: TurbineId[];
  horizonHours: number;
};

function PowerTooltip({
  active,
  label,
  rowsByTimestamp,
  turbineIds,
}: Pick<TooltipContentProps<number, string>, "active" | "label"> & {
  rowsByTimestamp: Map<string, ChartRow>;
  turbineIds: TurbineId[];
}) {
  const { t } = useTranslation();
  if (!active || typeof label !== "string") return null;
  const row = rowsByTimestamp.get(label);
  if (!row) return null;
  const items = turbineIds.flatMap((id) => {
    const value = row[seriesKey(id)];
    if (value === undefined) return [];
    const turbine = TURBINES[id];
    return [
      {
        key: turbine.name,
        label: t(turbine.name),
        color: turbine.color,
        shape: turbine.marker,
        value: formatFixed(value, 2),
      },
    ];
  });
  return <ChartTooltipCard title={formatDayHour(label)} items={items} />;
}

export function PowerChart({ rows, turbineIds, horizonHours }: PowerChartProps) {
  const { t } = useTranslation();
  const rowsByTimestamp = useMemo(() => new Map(rows.map((row) => [row.timestamp, row])), [rows]);
  const ticks = useMemo(() => hourlyTicks(rows, horizonHours > 24 ? 8 : 4), [rows, horizonHours]);
  const showDots = rows.length <= 24;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={rows} margin={{ top: 8, right: 10, bottom: 0, left: -14 }}>
        <defs>
          {turbineIds.map((id) => (
            <linearGradient key={id} id={`power-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TURBINES[id].color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={TURBINES[id].color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke={palette.grid} />
        <XAxis
          dataKey="timestamp"
          ticks={ticks}
          tickFormatter={formatTimeTick}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: palette.axis }}
          tickMargin={12}
          minTickGap={10}
        />
        <YAxis
          domain={[0, 1]}
          ticks={Y_TICKS}
          allowDataOverflow
          tickFormatter={(value: number) => formatFixed(value, 1)}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: palette.axis }}
          width={44}
        />
        <Tooltip
          cursor={{ stroke: palette.axis, strokeWidth: 1 }}
          content={(props) => (
            <PowerTooltip
              active={props.active}
              label={props.label}
              rowsByTimestamp={rowsByTimestamp}
              turbineIds={turbineIds}
            />
          )}
        />
        {turbineIds.map((id) => {
          const turbine = TURBINES[id];
          const filled = turbine.marker === "dot";
          return (
            <Area
              key={id}
              type="monotone"
              dataKey={seriesKey(id)}
              name={t(turbine.name)}
              stroke={turbine.color}
              strokeWidth={1.8}
              fill={`url(#power-fill-${id})`}
              dot={
                showDots
                  ? { r: 2.6, strokeWidth: 1.4, stroke: turbine.color, fill: filled ? turbine.color : palette.surface }
                  : false
              }
              activeDot={{
                r: 4.5,
                strokeWidth: 1.6,
                stroke: turbine.color,
                fill: filled ? turbine.color : palette.surface,
              }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
