import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";
import { TurbineMark } from "@/shared/ui";

import { useApiHealth } from "../model/useApiHealth";

const STATES = {
  online: { label: "Server online", dot: "bg-sage" },
  offline: { label: "Server offline", dot: "bg-status-critical" },
  checking: { label: "Connecting to server", dot: "bg-ink-subtle animate-pulse-soft" },
} as const;

/** Round badge (where a profile avatar would sit) showing backend connectivity. */
export function ApiStatus() {
  const { t } = useTranslation();
  const { isSuccess, isError } = useApiHealth();
  const state = isSuccess ? STATES.online : isError ? STATES.offline : STATES.checking;

  return (
    <span
      role="status"
      title={t(state.label)}
      className="relative grid size-10 place-items-center rounded-full border border-line-strong bg-[#141510]"
    >
      <TurbineMark className="h-5 w-4" />
      <span className="sr-only">{t(state.label)}</span>
      <span
        aria-hidden
        className={cn("absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-canvas", state.dot)}
      />
    </span>
  );
}
