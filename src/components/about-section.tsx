type AboutSectionCard = {
  title: string;
  stack: string;
  description: string;
};

type AboutSectionProps = {
  title: string;
  description: string;
  cards: readonly [AboutSectionCard, AboutSectionCard, AboutSectionCard];
};

const cardClassName =
  "group flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.045] sm:p-6";

export function AboutSection({
  title,
  description,
  cards,
}: AboutSectionProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-b border-white/8 py-14 sm:py-20 lg:py-24"
    >
      <div className="max-w-3xl">
        <h2
          id="about-title"
          className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-white"
        >
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-[0.98rem] leading-7 text-zinc-300 sm:text-[1.05rem] sm:leading-8">
          {description}
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:mt-11 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className={cardClassName}>
            <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-white">
              {card.title}
            </h3>
            <p className="mt-4 border-l border-accent/25 pl-3 font-mono text-[0.78rem] leading-6 text-zinc-300 sm:text-[0.82rem]">
              {card.stack}
            </p>
            <p className="mt-5 text-[0.95rem] leading-7 text-zinc-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
