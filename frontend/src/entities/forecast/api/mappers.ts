import type { AgentStep } from "@/entities/agent";
import { isTurbineId } from "@/entities/turbine";

import type {
  ForecastPoint,
  ForecastRequest,
  ForecastResponse,
  ForecastSummary,
  TurbineForecast,
} from "../types/forecast";

import type {
  AgentStepDto,
  ForecastPointDto,
  ForecastRequestDto,
  ForecastResponseDto,
  ForecastSummaryDto,
  TurbineForecastDto,
} from "./dto";

export function mapForecastRequestToDto(request: ForecastRequest): ForecastRequestDto {
  return {
    language: request.language ?? "en",
    forecast_date: request.forecastDate,
    horizon_hours: request.horizonHours,
    turbine_ids: request.turbineIds,
  };
}

function mapPoint(dto: ForecastPointDto): ForecastPoint {
  return {
    timestamp: dto.timestamp,
    predictedPower: dto.predicted_power,
    windSpeed: dto.wind_speed,
    temperature: dto.temperature,
  };
}

function mapTurbine(dto: TurbineForecastDto): TurbineForecast | null {
  if (!isTurbineId(dto.turbine_id)) return null;
  return { turbineId: dto.turbine_id, points: dto.points.map(mapPoint) };
}

function mapSummary(dto: ForecastSummaryDto): ForecastSummary {
  return {
    averagePower: dto.average_power,
    maxPower: dto.max_power,
    minPower: dto.min_power,
    peakHour: dto.peak_hour,
  };
}

function mapAgentStep(dto: AgentStepDto): AgentStep {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status,
    message: dto.message,
    durationMs: dto.duration_ms ?? undefined,
  };
}

export function mapForecastResponseDto(dto: ForecastResponseDto): ForecastResponse {
  return {
    forecastDate: dto.forecast_date,
    horizonHours: dto.horizon_hours,
    generatedAt: dto.generated_at,
    status: dto.status,
    summary: dto.summary ? mapSummary(dto.summary) : null,
    turbines: dto.turbines.map(mapTurbine).filter((turbine): turbine is TurbineForecast => turbine !== null),
    agentSteps: dto.agent_steps.map(mapAgentStep),
    warnings: dto.warnings,
    explanation: dto.explanation,
    modelVersion: dto.model_version,
    weatherSource: dto.weather_source,
    explanationSource: dto.explanation_source,
  };
}
