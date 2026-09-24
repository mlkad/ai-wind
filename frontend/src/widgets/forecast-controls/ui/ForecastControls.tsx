import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import type { ForecastParams } from "@/entities/forecast";
import { RunForecastButton } from "@/features/run-forecast";
import { ForecastDateField } from "@/features/select-forecast-date";
import { HorizonField } from "@/features/select-horizon";
import { TurbineSelectField } from "@/features/select-turbine";
import { baseTransition } from "@/shared/config";
import { WindScape } from "@/shared/ui";

type ForecastControlsProps = {
  params: ForecastParams;
  onParamsChange: (patch: Partial<ForecastParams>) => void;
  onRun: () => void;
  isRunning: boolean;
  /** Top-right slot over the hero (date, clock, status) — filled by the page. */
  topRight?: ReactNode;
};

export function ForecastControls({ params, onParamsChange, onRun, isRunning, topRight }: ForecastControlsProps) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="hero-title" className="relative -mx-4 sm:-mx-6">
      {/* Cinematic backdrop: fades into the canvas on the left (behind the headline) and at the bottom. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <WindScape variant="hero" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-canvas from-15% via-canvas/70 to-transparent md:w-[60%]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
        {/* Photographic vignette: darkens the top edge and top-right corner so the labels there stay legible. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-canvas/70 to-transparent" />
        <div className="absolute top-0 right-0 h-3/4 w-[34%] bg-[radial-gradient(ellipse_at_top_right,rgb(11_13_9/0.82),rgb(11_13_9/0.45)_45%,transparent_75%)]" />
      </div>

      <div className="relative px-4 pt-6 sm:px-6 lg:pt-7">
        <div className="flex items-start justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={baseTransition}>
            <p className="eyebrow">{t("AI for a sustainable tomorrow")}</p>
            <span aria-hidden className="mt-3 block h-px w-8 bg-line-strong" />
          </motion.div>
          {topRight ? <div className="hidden lg:block">{topRight}</div> : null}
        </div>

        <div className="mt-6 flex items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...baseTransition, delay: 0.08 }}
          >
            <h1
              id="hero-title"
              className="font-display text-[clamp(56px,4.3vw,100px)] leading-[1.02] font-[380] tracking-[-0.015em] text-ink"
            >
              {t("Forecasting")}
              <br />
              <span className="text-cream-gradient">{t("a cleaner tomorrow")}</span>
            </h1>
            <p className="mt-5 max-w-[480px] text-[16px] leading-relaxed text-ink/80 2xl:text-[17px]">
              {t("Agentic AI for wind power forecasting. From weather to insights in seconds.")}
            </p>
          </motion.div>

          <div className="hidden shrink-0 self-stretch flex-col justify-between pb-6 text-right xl:flex">
            <div>
              <p className="text-[11px] tracking-[0.42em] text-ink/85 uppercase">{t("Kazakhstan")}</p>
              <p className="mt-3 text-[9px] leading-[1.8] tracking-[0.3em] text-ink/80 uppercase">
                {t("Clean energy")}
                <br />
                {t("Brighter future")}
              </p>
            </div>
            <p className="flex items-center justify-end gap-4 text-[9px] leading-[1.8] tracking-[0.3em] text-ink/80 uppercase [text-shadow:0_1px_8px_rgb(11_13_9/0.9)]">
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span className="text-left">
                {t("Wind brings")}
                <br />
                {t("possibility")}
              </span>
            </p>
          </div>
        </div>

        <motion.div
          className="panel mt-9 grid gap-3 rounded-[18px] p-3.5 md:grid-cols-2 xl:grid-cols-[1.25fr_1.2fr_0.95fr_1.15fr]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...baseTransition, delay: 0.16 }}
        >
          <ForecastDateField
            value={params.forecastDate}
            onChange={(forecastDate) => onParamsChange({ forecastDate })}
            disabled={isRunning}
          />
          <TurbineSelectField
            value={params.turbineSelection}
            onChange={(turbineSelection) => onParamsChange({ turbineSelection })}
            disabled={isRunning}
          />
          <HorizonField
            value={params.horizonHours}
            onChange={(horizonHours) => onParamsChange({ horizonHours })}
            disabled={isRunning}
          />
          <RunForecastButton onRun={onRun} isRunning={isRunning} className="h-[62px] w-full" />
        </motion.div>
      </div>
    </section>
  );
}
