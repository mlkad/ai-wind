import { useTranslation } from "react-i18next";
import { WindScape } from "@/shared/ui";

/** Atmospheric closing card of the dashboard grid. */
export function BrandCard() {
  const { t } = useTranslation();
  return (
    <div className="relative h-full min-h-[200px] overflow-hidden rounded-[18px] border border-line">
      <WindScape variant="card" className="absolute inset-0 h-full w-full" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-canvas/85 via-canvas/35 to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex-1" />
        <div>
          <p className="font-display text-[21px] leading-[1.2] text-ink">
            {t("Nature’s power")}
            <br />
            {t("guided by")}
            <br />
            {t("AI.")}
          </p>
          <span aria-hidden className="mt-4 block h-px w-8 bg-line-strong" />
        </div>
        <p className="absolute right-6 bottom-5 font-display text-[16px] text-ink/85">WindAI</p>
      </div>
    </div>
  );
}
