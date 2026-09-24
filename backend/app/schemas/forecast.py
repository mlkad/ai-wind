from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.core.constants import (
    ALLOWED_TURBINE_SETS,
    FORECAST_DATE_MAX,
    FORECAST_DATE_MIN,
    HorizonHours,
    TurbineId,
)
from app.schemas.agent import AgentStep


class ForecastRequest(BaseModel):
    language: Literal["en", "ru"] = "en"
    forecast_date: date = Field(examples=["2026-02-01"])
    horizon_hours: HorizonHours = Field(examples=[24])
    turbine_ids: list[TurbineId] = Field(min_length=1, examples=[[1, 2]])

    @field_validator("forecast_date")
    @classmethod
    def _date_in_range(cls, value: date) -> date:
        if not FORECAST_DATE_MIN <= value <= FORECAST_DATE_MAX:
            raise ValueError(
                f"forecast_date must be between {FORECAST_DATE_MIN.isoformat()} "
                f"and {FORECAST_DATE_MAX.isoformat()}"
            )
        return value

    @field_validator("turbine_ids")
    @classmethod
    def _allowed_turbine_set(cls, value: list[TurbineId]) -> list[TurbineId]:
        normalized = sorted(set(value))
        if tuple(normalized) not in ALLOWED_TURBINE_SETS:
            raise ValueError("turbine_ids must be [1], [2] or [1, 2]")
        return normalized


class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_power: float = Field(ge=0.0, le=1.0)
    wind_speed: float
    temperature: float


class TurbineForecast(BaseModel):
    turbine_id: TurbineId
    points: list[ForecastPoint]


class ForecastSummary(BaseModel):
    average_power: float
    max_power: float
    min_power: float
    peak_hour: datetime


class WeatherProvenance(BaseModel):
    source: str
    run_init: datetime
    available_at: datetime
    sha256: str


class ForecastResponse(BaseModel):
    forecast_date: date
    horizon_hours: HorizonHours
    generated_at: datetime
    status: Literal["completed", "failed"]
    # None when the pipeline failed before producing a forecast.
    summary: ForecastSummary | None
    turbines: list[TurbineForecast]
    agent_steps: list[AgentStep]
    warnings: list[str]
    explanation: str
    model_version: str | None = None
    weather_source: str | None = None
    weather_provenance: dict[int, WeatherProvenance] = Field(default_factory=dict)
    # "llm" when the explanation was written by the LLM, "template" for the built-in fallback.
    explanation_source: Literal["llm", "template"] | None = None
