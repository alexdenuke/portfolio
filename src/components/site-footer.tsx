type FooterNavItem = {
  label: string;
  href: string;
};

type FooterExternalItem = {
  label: string;
  href: string;
  external?: boolean;
};

type SiteFooterProps = {
  name: string;
  subtitle: string;
  copyright: string;
  navigationAriaLabel: string;
  navigationItems: readonly [FooterNavItem, FooterNavItem, FooterNavItem];
  externalItems: readonly [FooterExternalItem, FooterExternalItem, FooterExternalItem];
};

const textLinkClassName =
  "text-sm text-white/68 transition-colors hover:text-white sm:text-[0.95rem]";

export function SiteFooter({
  name,
  subtitle,
  copyright,
  navigationAriaLabel,
  navigationItems,
  externalItems,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-10 sm:py-8 lg:px-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.15rem]">
              {name}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-[0.95rem]">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8 lg:justify-end">
            <nav
              aria-label={navigationAriaLabel}
              className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5"
            >
              {navigationItems.map((item) => (
                <a key={item.href} href={item.href} className={textLinkClassName}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5">
              {externalItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={textLinkClassName}
                  rel={item.external ? "noreferrer" : undefined}
                  target={item.external ? "_blank" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 pt-4">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-white/42 sm:text-[0.7rem]">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
