import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";

import { SeriesMarker } from "./SeriesMarker";

export type ChartLegendItem = {
  key: string;
  label: string;
  color: string;
  shape: "dot" | "ring";
};

type ChartLegendProps = {
  items: ChartLegendItem[];
  className?: string;
};

export function ChartLegend({ items, className }: ChartLegendProps) {
  const { t } = useTranslation();
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-7 gap-y-1", className)} aria-label={t("Chart legend")}>
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-2 text-[13px] text-ink-muted">
          <SeriesMarker color={item.color} shape={item.shape} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
