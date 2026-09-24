import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { BookOpen, House, Wind, type LucideIcon } from "lucide-react";

import { LanguageSwitcher } from "@/shared/i18n/LanguageSwitcher";
import { cn } from "@/shared/lib";
import { TurbineMark, WindScape } from "@/shared/ui";

type NavItem = { label: string; icon: LucideIcon; to: "/forecast" | "/about" };

// Only pages that exist and work are listed.
const NAV_ITEMS: readonly NavItem[] = [
  { label: "Forecast", icon: House, to: "/forecast" },
  { label: "Methodology", icon: BookOpen, to: "/about" },
];

const itemBase = "flex h-[46px] items-center gap-3.5 rounded-[12px] border px-4 text-[14.5px] transition-colors";

export function Logo() {
  const { t } = useTranslation();
  return (
    <Link to="/forecast" aria-label={t("WindAI: home")} className="flex items-center gap-3">
      <TurbineMark className="h-11 w-9" />
      <span>
        <span className="block font-display text-[24px] leading-none text-ink">WindAI</span>
        <span className="mt-1.5 block text-[8px] leading-[1.7] tracking-[0.24em] whitespace-nowrap text-ink-muted uppercase">
          {t("Clean energy")}
          <br />
          {t("Brighter tomorrow")}
        </span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col overflow-hidden border-r border-line bg-sidebar lg:flex">
      <div className="px-6 pt-7">
        <Logo />
      </div>

      <nav aria-label={t("Main navigation")} className="mt-10 flex flex-col gap-1.5 px-[18px]">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <Link
            key={t(label)}
            to={to}
            className={cn(itemBase, "border-transparent text-ink-muted hover:text-ink")}
            activeProps={{
              className: "!border-line-strong bg-gradient-to-r from-[#24231b] to-[#1a1a14] !text-ink",
            }}
          >
            <Icon className="size-[18px] text-cream/75" strokeWidth={1.5} aria-hidden />
            {t(label)}
          </Link>
        ))}
      </nav>
      <div className="px-6 pt-6">
        <LanguageSwitcher />
      </div>

      <div className="relative mt-auto h-[330px]">
        <WindScape variant="sidebar" className="absolute inset-0 h-full w-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-sidebar via-transparent to-sidebar/85" />
        <div className="absolute inset-x-6 bottom-7">
          <p className="flex items-start gap-3 text-[14px] leading-snug text-ink">
            <Wind className="mt-0.5 size-5 shrink-0 text-cream/70" strokeWidth={1.4} aria-hidden />
            {t("Sustainable energy for a brighter tomorrow.")}
          </p>
          <p className="mt-4 border-l border-line-strong pl-3 text-[9.5px] leading-[1.7] tracking-[0.3em] text-ink-subtle uppercase">
            WindAI
            <br />
            2026
          </p>
        </div>
      </div>
    </aside>
  );
}
