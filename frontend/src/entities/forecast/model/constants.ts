import type { HorizonHours } from "../types/forecast";

export const FORECAST_DATE_MIN = "2026-01-31";
export const FORECAST_DATE_MAX = "2026-02-28";
export const DEFAULT_FORECAST_DATE = FORECAST_DATE_MIN;

export const HORIZON_OPTIONS: readonly HorizonHours[] = [24, 48];
export const DEFAULT_HORIZON: HorizonHours = 24;

export const WEATHER_SOURCE_LABELS: Record<string, string> = {
  mock: "Synthetic demo weather",
  open_meteo: "Open-Meteo, Single Runs archive",
  archive: "Open-Meteo, saved Single Runs archive",
};
