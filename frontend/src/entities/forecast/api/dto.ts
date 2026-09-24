/** Wire format of the WindAI backend (snake_case). Never used outside the api layer. */
import type { AgentStepId, AgentStepStatus } from "@/entities/agent";

export type ForecastRequestDto = {
  language?: "en" | "ru";
  forecast_date: string;
  horizon_hours: 24 | 48;
  turbine_ids: number[];
};

export type ForecastPointDto = {
  timestamp: string;
  predicted_power: number;
  wind_speed: number;
  temperature: number;
};

export type TurbineForecastDto = {
  turbine_id: number;
  points: ForecastPointDto[];
};

export type ForecastSummaryDto = {
  average_power: number;
  max_power: number;
  min_power: number;
  peak_hour: string;
};

export type AgentStepDto = {
  id: AgentStepId;
  title: string;
  status: AgentStepStatus;
  message: string;
  duration_ms: number | null;
};

export type ForecastResponseDto = {
  forecast_date: string;
  horizon_hours: 24 | 48;
  generated_at: string;
  status: "completed" | "failed";
  summary: ForecastSummaryDto | null;
  turbines: TurbineForecastDto[];
  agent_steps: AgentStepDto[];
  warnings: string[];
  explanation: string;
  model_version: string | null;
  weather_source: string | null;
  explanation_source: "llm" | "template" | null;
};
