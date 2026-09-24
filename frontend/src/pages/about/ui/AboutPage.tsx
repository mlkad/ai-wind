import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, CloudSun, Cpu, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { AGENT_PIPELINE } from "@/entities/agent";
import { Card, Reveal } from "@/shared/ui";

type Pillar = { icon: ReactNode; title: string; text: string };

const PILLARS: Pillar[] = [
  {
    icon: <CloudSun className="size-4" aria-hidden />,
    title: "Weather service",
    text: "Fetches hourly weather for each turbine and prepares the model inputs. Both the dashboard and backtest use archived Open-Meteo Single Runs (ECMWF IFS) available at the forecast origin.",
  },
  {
    icon: <Cpu className="size-4" aria-hidden />,
    title: "ML adapter",
    text: "One interface to the model: predict_power(turbine_id, weather, horizon_hours, forecast_origin). Each forecast uses a CatBoost model trained only on earlier data.",
  },
  {
    icon: <ShieldCheck className="size-4" aria-hidden />,
    title: "Quality checks",
    text: "Each step checks its output: schema, hourly continuity, physical ranges, NaN and [0, 1] bounds. The agent repairs data, raises warnings or stops.",
  },
];

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-4xl py-12 sm:py-16">
      <Reveal>
        <p className="eyebrow">{t("Methodology")}</p>
        <h1 className="mt-3 font-display text-[40px] leading-tight text-ink sm:text-[52px]">
          {t("An agent that runs the full forecasting cycle")}
        </h1>
        <p className="mt-4 text-ink-muted">
          {t(
            "WindAI forecasts hourly normalized active power for two wind turbines, 24–48 hours ahead. The agent manages data retrieval, validation, prediction, self-checks and explanation, reporting what actually happened at each step.",
          )}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <Card className="mt-10">
          <h2 className="flex items-center gap-2.5 font-display text-[22px] text-ink">
            <BrainCircuit className="size-4 text-accent" aria-hidden />
            {t("Agent pipeline")}
          </h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {AGENT_PIPELINE.map((stage, index) => (
              <li key={stage.id} className="flex gap-3 rounded-xl border border-line bg-panel-soft p-3.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-cream/30 bg-cream/[0.06] text-xs text-cream tabular-nums">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{t(stage.title)}</span>
                  <span className="block text-[13px] text-ink-muted">{t(stage.description)}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <Reveal key={t(pillar.title)} delay={0.18 + index * 0.06}>
            <Card className="h-full">
              <span className="text-cream/80">{pillar.icon}</span>
              <h3 className="mt-3 font-display text-[19px] text-ink">{t(pillar.title)}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{t(pillar.text)}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <Link
          to="/forecast"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-cream hover:text-cream-strong"
        >
          {t("Run a forecast")}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Reveal>
    </div>
  );
}
