import { i18n } from "@/shared/i18n";
import type { ForecastResponse } from "@/entities/forecast";

export type InsightTag = {
  key: string;
  label: string;
  tone: "neutral" | "good" | "warning";
};

function generationLevel(average: number): string {
  if (average >= 0.6) return i18n.t("High generation");
  if (average >= 0.3) return i18n.t("Moderate generation");
  return i18n.t("Low generation");
}

/** Short, factual tags derived from the agent's response (no invented signals). */
export function deriveInsightTags(forecast: ForecastResponse): InsightTag[] {
  const tags: InsightTag[] = [];
  if (forecast.summary) {
    tags.push({ key: "level", label: generationLevel(forecast.summary.averagePower), tone: "neutral" });
  }

  const recompute = forecast.agentSteps.find((step) => step.id === "recompute");
  if (recompute?.status === "completed")
    tags.push({ key: "recompute", label: i18n.t("Forecast recomputed"), tone: "warning" });
  else if (recompute?.status === "failed")
    tags.push({ key: "recompute", label: i18n.t("Recompute failed"), tone: "warning" });
  else if (recompute?.status === "skipped" && forecast.status === "completed")
    tags.push({ key: "recompute", label: i18n.t("Self-check passed"), tone: "good" });

  const warnings = forecast.warnings.length;
  tags.push(
    warnings === 0
      ? { key: "warnings", label: i18n.t("No anomalies"), tone: "good" }
      : { key: "warnings", label: i18n.t("warningCount", { count: warnings }), tone: "warning" },
  );
  return tags;
}
