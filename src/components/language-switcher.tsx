"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

function getButtonClassName(isActive: boolean) {
  return [
    "rounded-full px-3 py-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.12em] transition-colors",
    isActive
      ? "bg-accent text-black"
      : "text-white/52 hover:bg-white/[0.06] hover:text-white",
  ].join(" ");
}

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav
      aria-label={t("label")}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
    >
      {routing.locales.map((candidateLocale) => {
        const isActive = candidateLocale === locale;

        return (
          <Link
            key={candidateLocale}
            href={pathname}
            locale={candidateLocale}
            aria-current={isActive ? "page" : undefined}
            className={getButtonClassName(isActive)}
            title={t(`localeLabel.${candidateLocale}`)}
          >
            {candidateLocale}
          </Link>
        );
      })}
    </nav>
  );
}
