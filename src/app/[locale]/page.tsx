import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  BackgroundRangeAnchorMarker,
  BackgroundSingleAnchorMarker,
} from "@/components/background-anchors";
import { FullScreenHero } from "@/components/full-screen-hero";
import { routing, type AppLocale } from "@/i18n/routing";

const centeredAnchorMarkerClassName =
  "pointer-events-none block h-0 w-0 self-center overflow-hidden opacity-0";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

function resolveLocale(locale: string): AppLocale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const locale = resolveLocale((await params).locale);

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-10 lg:px-14">
      <BackgroundSingleAnchorMarker id="page-entry" />

      <BackgroundRangeAnchorMarker
        edge="start"
        id="hero-band"
        className={centeredAnchorMarkerClassName}
      />
      <BackgroundSingleAnchorMarker
        id="hero-glow"
        className={centeredAnchorMarkerClassName}
      />

      <FullScreenHero
        actions={{
          downloadCv: t("firstScreen.actions.downloadCv"),
          projects: t("firstScreen.actions.projects"),
        }}
        name={t("firstScreen.name")}
        navigation={{
          about: t("firstScreen.navigation.about"),
          contact: t("firstScreen.navigation.contact"),
          projects: t("firstScreen.navigation.projects"),
        }}
        navigationLabel={t("firstScreen.navigationLabel")}
        role={t("firstScreen.role")}
        stack={t("firstScreen.stack")}
        stackLabel={t("firstScreen.stackLabel")}
      />
    </main>
  );
}
