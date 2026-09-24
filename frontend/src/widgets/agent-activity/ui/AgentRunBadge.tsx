import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/ui";

export type AgentRunState = "idle" | "running" | "revealing" | "completed" | "failed";

type AgentRunBadgeProps = {
  state: AgentRunState;
};

const DOT = "size-1.5 rounded-full";

export function AgentRunBadge({ state }: AgentRunBadgeProps) {
  const { t } = useTranslation();
  switch (state) {
    case "idle":
      return (
        <Badge>
          <span aria-hidden className={`${DOT} bg-ink-subtle`} />
          {t("Idle")}
        </Badge>
      );
    case "running":
    case "revealing":
      return (
        <Badge tone="accent">
          <span aria-hidden className={`${DOT} animate-pulse-soft bg-cream`} />
          {t("Running")}
        </Badge>
      );
    case "completed":
      return (
        <Badge tone="good">
          <span aria-hidden className={`${DOT} bg-sage`} />
          {t("Completed")}
        </Badge>
      );
    case "failed":
      return (
        <Badge tone="critical">
          <span aria-hidden className={`${DOT} bg-status-critical`} />
          {t("Failed")}
        </Badge>
      );
  }
}
