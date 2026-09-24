import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { WEATHER_SOURCE_LABELS, type ExplanationSource, type ForecastResponse } from "@/entities/forecast";
import { baseTransition } from "@/shared/config";
import { cn, formatRelativeTime } from "@/shared/lib";
import { Card, CardHeader, Skeleton } from "@/shared/ui";

import { deriveInsightTags, type InsightTag } from "../model/insightTags";

type AiExplanationProps = {
  forecast: ForecastResponse | undefined;
  isLoading: boolean;
};

const SOURCE_LABELS: Record<ExplanationSource, string> = {
  llm: "LLM (OpenAI)",
  template: "Template (LLM disabled)",
};

const TAG_TONES: Record<InsightTag["tone"], string> = {
  neutral: "border-line-strong text-ink-muted",
  good: "border-sage/30 text-sage",
  warning: "border-gold/35 text-gold",
};

export function AiExplanation({ forecast, isLoading }: AiExplanationProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const tags = forecast ? deriveInsightTags(forecast) : [];

  return (
    <Card aria-labelledby="explanation-title" className="flex h-full flex-col">
      <CardHeader
        titleId="explanation-title"
        title={t("AI explanation")}
        icon={<Sparkles className="size-5" strokeWidth={1.4} aria-hidden />}
        className="mb-3"
        action={
          forecast ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={detailsId}
              aria-label={open ? t("Hide details") : t("Show details")}
              className="grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-panel-soft hover:text-ink"
            >
              <ArrowRight className={cn("size-[18px] transition-transform", open && "rotate-90")} strokeWidth={1.5} />
            </button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      ) : forecast ? (
        <>
          <motion.p
            key={forecast.generatedAt}
            className="text-[13.5px] leading-[1.65] text-ink/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...baseTransition, delay: 0.1 }}
          >
            {forecast.explanation}
          </motion.p>

          <ul className="mt-auto flex flex-wrap gap-2 pt-4" aria-label={t("Key insights")}>
            {tags.map((tag) => (
              <li key={tag.key} className={cn("rounded-full border px-3 py-1 text-[12px]", TAG_TONES[tag.tone])}>
                {tag.label}
              </li>
            ))}
          </ul>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                id={detailsId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3 border-t border-line pt-3">
                  {forecast.warnings.length > 0 ? (
                    <ul className="space-y-1.5" aria-label={t("Warnings")}>
                      {forecast.warnings.map((warning) => (
                        <li key={warning} className="flex gap-2 text-[12.5px] text-ink/85">
                          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden />
                          <span>
                            <span className="sr-only">{t("Warning:")}</span>
                            {warning}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[11.5px]">
                    <dt className="text-ink-subtle">{t("Text source")}</dt>
                    <dd className="text-ink-muted">{t(SOURCE_LABELS[forecast.explanationSource ?? "template"])}</dd>
                    <dt className="text-ink-subtle">{t("Model")}</dt>
                    <dd className="font-mono text-[11px] break-all text-ink-muted">
                      {forecast.modelVersion ?? t("not available")}
                    </dd>
                    <dt className="text-ink-subtle">{t("Weather")}</dt>
                    <dd className="text-ink-muted">
                      {forecast.weatherSource
                        ? t(WEATHER_SOURCE_LABELS[forecast.weatherSource] ?? forecast.weatherSource)
                        : t("not available")}
                    </dd>
                    <dt className="text-ink-subtle">{t("Generated")}</dt>
                    <dd className="text-ink-muted">{formatRelativeTime(forecast.generatedAt)}</dd>
                  </dl>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <p className="text-[13.5px] leading-relaxed text-ink-muted">
          {t(
            "Run the agent to explain expected generation, connect it to the wind, highlight low-output windows and flag operational anomalies.",
          )}
        </p>
      )}
    </Card>
  );
}
