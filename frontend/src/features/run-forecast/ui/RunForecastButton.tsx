import { useTranslation } from "react-i18next";
import { ArrowRight, Send } from "lucide-react";

import { Button } from "@/shared/ui";

type RunForecastButtonProps = {
  onRun: () => void;
  isRunning: boolean;
  className?: string;
};

export function RunForecastButton({ onRun, isRunning, className }: RunForecastButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      size="lg"
      onClick={onRun}
      isLoading={isRunning}
      loadingText={t("Agent is running…")}
      icon={<Send className="size-[18px]" strokeWidth={1.7} aria-hidden />}
      trailingIcon={<ArrowRight className="ml-3 size-[18px]" strokeWidth={1.5} aria-hidden />}
      className={className}
    >
      {t("Run agent")}
    </Button>
  );
}
