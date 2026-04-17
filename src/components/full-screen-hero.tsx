import { LanguageSwitcher } from "@/components/language-switcher";

type FullScreenHeroProps = {
  navigationLabel: string;
  navigation: {
    about: string;
    projects: string;
    contact: string;
  };
  role: string;
  name: string;
  stackLabel: string;
  stack: string;
  actions: {
    downloadCv: string;
    projects: string;
  };
};

const navLinkClassName =
  "font-mono text-[0.66rem] uppercase tracking-[0.18em] text-white/62 transition-colors hover:text-white sm:text-[0.72rem] sm:tracking-[0.24em]";

const primaryCtaClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent/35 bg-accent px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.26em] text-black transition-colors hover:border-accent-strong hover:bg-accent-strong sm:w-auto";

const secondaryCtaClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.26em] text-white/82 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:w-auto";

export function FullScreenHero({
  navigationLabel,
  navigation,
  role,
  name,
  stackLabel,
  stack,
  actions,
}: FullScreenHeroProps) {
  return (
    <section className="flex min-h-[100svh] flex-col border-b border-white/8 py-5 sm:py-8">
      <div className="flex justify-end">
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-3 sm:gap-6">
          <nav
            aria-label={navigationLabel}
            className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-6"
          >
            <a className={navLinkClassName} href="#about">
              {navigation.about}
            </a>
            <a className={navLinkClassName} href="#projects">
              {navigation.projects}
            </a>
            <a className={navLinkClassName} href="#contact">
              {navigation.contact}
            </a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          <h1 className="max-w-4xl text-[clamp(3rem,14vw,7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
            {name}
          </h1>

          <p className="mt-4 text-[clamp(1rem,4.2vw,1.65rem)] font-medium text-white sm:mt-5">
            {role}
          </p>

          <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-center sm:mt-7 sm:gap-3 sm:px-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-accent/90">
              {stackLabel}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span className="text-[0.875rem] leading-6 text-zinc-300 sm:text-base">
              {stack}
            </span>
          </div>

          <div className="mt-7 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
            <a
              className={primaryCtaClassName}
              download
              href="/alexey-belov-cv.pdf"
            >
              {actions.downloadCv}
            </a>
            <a className={secondaryCtaClassName} href="#projects">
              {actions.projects}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
