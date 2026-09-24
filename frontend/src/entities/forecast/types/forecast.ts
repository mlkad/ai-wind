import type { AgentStep } from "@/entities/agent";
import type { TurbineId } from "@/entities/turbine";
import type { IsoDate, IsoDateTime } from "@/shared/types";

export type HorizonHours = 24 | 48;

export type ForecastRequest = {
  language?: "en" | "ru";
  forecastDate: IsoDate;
  horizonHours: HorizonHours;
  turbineIds: TurbineId[];
};

export type ForecastPoint = {
  timestamp: IsoDateTime;
  predictedPower: number;
  windSpeed: number;
  temperature: number;
};

export type TurbineForecast = {
  turbineId: TurbineId;
  points: ForecastPoint[];
};

export type ForecastSummary = {
  averagePower: number;
  maxPower: number;
  minPower: number;
  peakHour: IsoDateTime;
};

export type ForecastStatus = "completed" | "failed";

/** Who wrote the explanation: the LLM, or the built-in template fallback. */
export type ExplanationSource = "llm" | "template";

export type ForecastResponse = {
  forecastDate: IsoDate;
  horizonHours: HorizonHours;
  generatedAt: IsoDateTime;
  status: ForecastStatus;
  /** null when the agent pipeline failed before producing a forecast. */
  summary: ForecastSummary | null;
  turbines: TurbineForecast[];
  agentSteps: AgentStep[];
  warnings: string[];
  explanation: string;
  modelVersion: string | null;
  weatherSource: string | null;
  explanationSource: ExplanationSource | null;
};
