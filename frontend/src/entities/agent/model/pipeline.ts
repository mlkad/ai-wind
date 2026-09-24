import { i18n } from "@/shared/i18n";

import type { AgentStep, AgentStepId } from "../types/agent";

type PipelineStage = {
  id: AgentStepId;
  title: string;
  description: string;
};

/**
 * The agent's plan, shown before a run has produced real step results.
 * Titles match the backend; statuses always come from the backend response.
 */
export const AGENT_PIPELINE: readonly PipelineStage[] = [
  {
    id: "fetch_weather",
    title: "Fetch weather forecast",
    description: "Hourly wind speed and temperature for each turbine",
  },
  {
    id: "validate_weather",
    title: "Validate weather data",
    description: "Schema, continuity, physical ranges and missing values",
  },
  { id: "prepare_features", title: "Prepare model inputs", description: "Input tables matching the ML model contract" },
  { id: "run_model", title: "Run ML model", description: "Hourly normalized power for each turbine" },
  { id: "validate_prediction", title: "Validate prediction", description: "NaN, [0, 1] bounds, horizon and anomalies" },
  { id: "analyze_result", title: "Analyze result", description: "Self-check: clipping, fallback weather and physics" },
  { id: "recompute", title: "Recompute forecast", description: "One rerun with refreshed inputs, only when needed" },
  {
    id: "generate_explanation",
    title: "Generate explanation",
    description: "A plain-language summary of the forecast",
  },
];

/** Localized step title by stable backend id. */
export function stepTitle(id: AgentStepId, fallback: string): string {
  return i18n.t(AGENT_PIPELINE.find((stage) => stage.id === id)?.title ?? fallback);
}

export function planAsPendingSteps(): AgentStep[] {
  return AGENT_PIPELINE.map((stage) => ({
    id: stage.id,
    title: i18n.t(stage.title),
    status: "pending",
    message: i18n.t(stage.description),
  }));
}
