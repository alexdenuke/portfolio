import type { ReactNode } from "react";

type ContactItemKind = "email" | "telegram" | "github" | "resume";

type ContactItem = {
  kind: ContactItemKind;
  label: string;
  value: string;
  featured?: boolean;
};

type ContactSectionProps = {
  title: string;
  description: string;
  primaryCta: string;
  items: readonly [ContactItem, ContactItem, ContactItem, ContactItem];
  headingMarker?: ReactNode;
};

const primaryCtaClassName =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-accent/35 bg-accent px-6 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:border-accent-strong hover:bg-accent-strong";

const secondaryCardClassName =
  "flex min-h-[9.25rem] flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.045] sm:p-6";

const featuredCardClassName =
  "flex min-h-[9.25rem] flex-col rounded-[1.5rem] border border-accent/18 bg-accent/[0.06] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-accent/28 hover:bg-accent/[0.085] sm:p-6";

function trimLeadingSymbol(value: string, symbol: string) {
  return value.startsWith(symbol) ? value.slice(symbol.length) : value;
}

function trimLeadingPrefix(value: string, prefix: string) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function resolveHref(kind: ContactItemKind, value: string) {
  switch (kind) {
    case "email":
      return value.startsWith("mailto:") ? value : `mailto:${value}`;
    case "telegram":
      if (value.startsWith("http")) {
        return value;
      }

      return `https://t.me/${trimLeadingSymbol(trimLeadingPrefix(value, "t.me/"), "@")}`;
    case "github":
      return value.startsWith("http") ? value : `https://${value}`;
    case "resume":
      return value;
  }
}

function isExternal(kind: ContactItemKind) {
  return kind === "telegram" || kind === "github";
}

export function ContactSection({
  title,
  description,
  primaryCta,
  items,
  headingMarker,
}: ContactSectionProps) {
  const primaryEmail = items.find((item) => item.kind === "email")?.value;
  const primaryHref = primaryEmail
    ? resolveHref("email", primaryEmail)
    : "mailto:alex@example.com";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="py-14 sm:py-20 lg:py-24"
    >
      {headingMarker}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8">
        <div className="max-w-2xl">
          <h2
            id="contact-title"
            className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-white"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-zinc-300 sm:text-[1.05rem] sm:leading-8">
            {description}
          </p>

          <a href={primaryHref} className={`${primaryCtaClassName} mt-8 sm:mt-9`}>
            {primaryCta}
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const href = resolveHref(item.kind, item.value);
            const external = isExternal(item.kind);

            return (
              <a
                key={item.kind}
                href={href}
                className={item.featured ? featuredCardClassName : secondaryCardClassName}
                download={item.kind === "resume"}
                rel={external ? "noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/58">
                  {item.label}
                </span>
                <span className="mt-4 break-words text-[1.02rem] leading-7 text-white sm:text-[1.08rem]">
                  {item.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
