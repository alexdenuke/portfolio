import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  BackgroundRangeAnchorMarker,
  BackgroundSingleAnchorMarker,
} from "@/components/background-anchors";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { FullScreenHero } from "@/components/full-screen-hero";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
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

function trimLeadingSymbol(value: string, symbol: string) {
  return value.startsWith(symbol) ? value.slice(symbol.length) : value;
}

function resolveContactHref(kind: "email" | "telegram" | "github", value: string) {
  switch (kind) {
    case "email":
      return `mailto:${value}`;
    case "telegram":
      return `https://t.me/${trimLeadingSymbol(value, "@")}`;
    case "github":
      return value.startsWith("http") ? value : `https://${value}`;
  }
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
  const emailValue = t("contact.items.email.value");
  const telegramValue = t("contact.items.telegram.value");
  const githubValue = t("contact.items.github.value");

  return (
    <>
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

        <BackgroundRangeAnchorMarker
          edge="start"
          id="about-band"
          className={centeredAnchorMarkerClassName}
        />
        <AboutSection
          title={t("about.title")}
          description={t("about.description")}
          topBoundaryMarker={
            <BackgroundRangeAnchorMarker
              edge="end"
              id="about-band"
              className={centeredAnchorMarkerClassName}
            />
          }
          cards={[
            {
              title: t("about.cards.frontend.title"),
              stack: t("about.cards.frontend.stack"),
              description: t("about.cards.frontend.description"),
            },
            {
              title: t("about.cards.backend.title"),
              stack: t("about.cards.backend.stack"),
              description: t("about.cards.backend.description"),
            },
            {
              title: t("about.cards.deploy.title"),
              stack: t("about.cards.deploy.stack"),
              description: t("about.cards.deploy.description"),
            },
          ]}
        />

        <ProjectsSection
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
          headingMarker={
            <BackgroundSingleAnchorMarker
              id="projects-heading-glow"
              className={centeredAnchorMarkerClassName}
            />
          }
          labels={{
            viewProject: t("projects.actions.viewProject"),
            openLive: t("projects.actions.openLive"),
            preview: t("projects.actions.preview"),
            screenshots: t("projects.actions.screenshots"),
            statuses: {
              live: t("projects.statuses.live"),
              preview: t("projects.statuses.preview"),
              archived: t("projects.statuses.archived"),
              private: t("projects.statuses.private"),
            },
          }}
          projects={[
            {
              title: t("projects.items.sladkoru.title"),
              description: t("projects.items.sladkoru.description"),
              role: t("projects.items.sladkoru.role"),
              stack: t("projects.items.sladkoru.stack"),
              status: "live",
              preview: "commerce",
            },
            {
              title: t("projects.items.dashboardPro.title"),
              description: t("projects.items.dashboardPro.description"),
              role: t("projects.items.dashboardPro.role"),
              stack: t("projects.items.dashboardPro.stack"),
              status: "preview",
              preview: "dashboard",
            },
            {
              title: t("projects.items.studioLanding.title"),
              description: t("projects.items.studioLanding.description"),
              role: t("projects.items.studioLanding.role"),
              stack: t("projects.items.studioLanding.stack"),
              status: "archived",
              preview: "landing",
            },
            {
              title: t("projects.items.logisticsPanel.title"),
              description: t("projects.items.logisticsPanel.description"),
              role: t("projects.items.logisticsPanel.role"),
              stack: t("projects.items.logisticsPanel.stack"),
              status: "private",
              preview: "logistics",
            },
          ]}
        />
        <ContactSection
          title={t("contact.title")}
          description={t("contact.description")}
          primaryCta={t("contact.primaryCta")}
          headingMarker={
            <BackgroundSingleAnchorMarker
              id="contact-heading-glow"
              className={centeredAnchorMarkerClassName}
            />
          }
          items={[
            {
              kind: "email",
              label: t("contact.items.email.label"),
              value: emailValue,
              featured: true,
            },
            {
              kind: "telegram",
              label: t("contact.items.telegram.label"),
              value: telegramValue,
              featured: true,
            },
            {
              kind: "github",
              label: t("contact.items.github.label"),
              value: githubValue,
            },
            {
              kind: "resume",
              label: t("contact.items.resume.label"),
              value: t("contact.items.resume.value"),
            },
          ]}
        />
      </main>

      <SiteFooter
        name={t("footer.name")}
        subtitle={t("footer.subtitle")}
        copyright={t("footer.copyright")}
        navigationAriaLabel={t("footer.navigationAriaLabel")}
        navigationItems={[
          { label: t("firstScreen.navigation.about"), href: "#about" },
          { label: t("firstScreen.navigation.projects"), href: "#projects" },
          { label: t("firstScreen.navigation.contact"), href: "#contact" },
        ]}
        externalItems={[
          {
            label: t("contact.items.github.label"),
            href: resolveContactHref("github", githubValue),
            external: true,
          },
          {
            label: t("contact.items.telegram.label"),
            href: resolveContactHref("telegram", telegramValue),
            external: true,
          },
          {
            label: t("contact.items.email.label"),
            href: resolveContactHref("email", emailValue),
          },
        ]}
      />
    </>
  );
}
