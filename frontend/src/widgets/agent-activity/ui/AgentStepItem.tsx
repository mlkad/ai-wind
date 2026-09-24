import { i18n } from "@/shared/i18n";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

import { AGENT_PIPELINE, stepTitle, type AgentStep } from "@/entities/agent";
import { baseTransition } from "@/shared/config";
import { cn, formatDuration } from "@/shared/lib";

import { StepStatusIcon } from "./StepStatusIcon";

const STATUS_LABELS: Record<AgentStep["status"], string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  skipped: "Skipped",
};

type AgentStepItemProps = {
  step: AgentStep;
  index: number;
  isLast: boolean;
};

function describe(step: AgentStep): string {
  // Unexecuted steps show the plan; executed steps show the backend's real message.
  if (step.status === "pending" || step.status === "running") {
    return i18n.t(AGENT_PIPELINE.find((stage) => stage.id === step.id)?.description ?? "");
  }
  return step.message;
}

export function AgentStepItem({ step, index, isLast }: AgentStepItemProps) {
  const { t } = useTranslation();
  const isMuted = step.status === "pending" || step.status === "skipped";
  const description = describe(step);

  return (
    <motion.li
      className="relative flex gap-3.5 pb-2.5 last:pb-0"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...baseTransition, delay: index * 0.04 }}
    >
      {!isLast ? (
        <span aria-hidden className="absolute top-[28px] bottom-0.5 left-[12.5px] w-px bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 bg-sage/50"
            initial={false}
            animate={{ height: step.status === "completed" ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </span>
      ) : null}

      <StepStatusIcon status={step.status} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className={cn("text-[13.5px] leading-snug", isMuted ? "text-ink-muted" : "text-ink")}>
            {stepTitle(step.id, step.title)}
            <span className="sr-only">, {t(STATUS_LABELS[step.status])}</span>
          </p>
          {step.durationMs !== undefined ? (
            <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
              {formatDuration(step.durationMs)}
            </span>
          ) : null}
        </div>
        <p
          title={description}
          className={cn(
            "mt-0.5 line-clamp-1 text-[11.5px] leading-snug",
            step.status === "failed" ? "text-[#d99a8b]" : "text-ink-subtle",
          )}
        >
          {description}
        </p>
      </div>
    </motion.li>
  );
}
