import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";

type SpinnerProps = {
  size?: "sm" | "md";
  className?: string;
  label?: string;
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  const { t } = useTranslation();
  return (
    <span
      role="status"
      aria-label={label ?? t("Loading")}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
        size === "sm" ? "size-4" : "size-5",
        className,
      )}
    />
  );
}
