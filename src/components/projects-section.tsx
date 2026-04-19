import type { ReactNode } from "react";

type ProjectStatus = "live" | "preview" | "archived" | "private";
type ProjectPreviewVariant = "commerce" | "dashboard" | "landing" | "logistics";

type ProjectCard = {
  title: string;
  description: string;
  role: string;
  stack: string;
  status: ProjectStatus;
  preview: ProjectPreviewVariant;
};

type ProjectsSectionProps = {
  title: string;
  subtitle: string;
  labels: {
    viewProject: string;
    openLive: string;
    preview: string;
    screenshots: string;
    statuses: Record<ProjectStatus, string>;
  };
  projects: readonly [ProjectCard, ProjectCard, ProjectCard, ProjectCard];
  headingMarker?: ReactNode;
};

const cardClassName =
  "flex h-full flex-col rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.045] sm:p-6";

const primaryCtaClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-accent/35 bg-accent px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-black transition-colors hover:border-accent-strong hover:bg-accent-strong";

const secondaryCtaClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/78 transition-colors hover:border-white/18 hover:bg-white/[0.06] hover:text-white";

const statusClassNames: Record<ProjectStatus, string> = {
  live: "border border-accent/20 bg-accent/10 text-accent-strong",
  preview: "border border-slate-300/14 bg-slate-300/8 text-slate-200",
  archived: "border border-white/10 bg-white/[0.05] text-zinc-300",
  private: "border border-white/10 bg-black/15 text-zinc-400",
};

const previewAccentClassNames: Record<ProjectPreviewVariant, string> = {
  commerce: "bg-accent/12",
  dashboard: "bg-sky-300/10",
  landing: "bg-white/8",
  logistics: "bg-zinc-200/8",
};

function getSecondaryActionLabel(
  status: ProjectStatus,
  labels: ProjectsSectionProps["labels"],
) {
  switch (status) {
    case "live":
      return labels.openLive;
    case "preview":
      return labels.preview;
    case "archived":
      return labels.screenshots;
    case "private":
      return null;
  }
}

function PreviewShell({
  accentClassName,
  children,
}: {
  accentClassName: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative h-44 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02] sm:h-48"
    >
      <div
        className={`absolute right-5 top-4 h-16 w-16 rounded-full blur-2xl ${accentClassName}`}
      />
      <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-2 border-b border-white/8 px-4">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/14" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="ml-2 h-2 w-20 rounded-full bg-white/8" />
      </div>

      <div className="relative flex h-full flex-col px-4 pb-4 pt-14 sm:px-5 sm:pb-5">
        {children}
      </div>
    </div>
  );
}

function ProjectPreview({ variant }: { variant: ProjectPreviewVariant }) {
  const accentClassName = previewAccentClassNames[variant];

  switch (variant) {
    case "commerce":
      return (
        <PreviewShell accentClassName={accentClassName}>
          <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
            <div className="rounded-[1rem] border border-white/10 bg-black/15 p-3">
              <div className="h-2 w-16 rounded-full bg-accent/40" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] p-2">
                  <div className="h-10 rounded-[0.7rem] bg-white/[0.06]" />
                  <div className="mt-2 h-2 w-4/5 rounded-full bg-white/12" />
                  <div className="mt-1.5 h-2 w-2/5 rounded-full bg-accent/30" />
                </div>
                <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] p-2">
                  <div className="h-10 rounded-[0.7rem] bg-white/[0.06]" />
                  <div className="mt-2 h-2 w-3/4 rounded-full bg-white/12" />
                  <div className="mt-1.5 h-2 w-1/2 rounded-full bg-accent/24" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="h-2 w-1/2 rounded-full bg-white/12" />
                <div className="mt-2 h-6 rounded-full bg-accent/18" />
              </div>
              <div className="flex-1 rounded-[1rem] border border-white/10 bg-white/[0.03] p-3">
                <div className="h-2 w-2/3 rounded-full bg-white/12" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded-full bg-white/10" />
                  <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  <div className="h-2 w-3/5 rounded-full bg-accent/24" />
                </div>
              </div>
            </div>
          </div>
        </PreviewShell>
      );
    case "dashboard":
      return (
        <PreviewShell accentClassName={accentClassName}>
          <div className="flex h-full flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[0.9rem] border border-white/10 bg-white/[0.03] p-2.5"
                >
                  <div className="h-2 w-3/5 rounded-full bg-white/12" />
                  <div className="mt-2 h-6 rounded-full bg-sky-300/16" />
                </div>
              ))}
            </div>

            <div className="flex flex-1 gap-3">
              <div className="flex-1 rounded-[1rem] border border-white/10 bg-white/[0.03] p-3">
                <div className="h-2 w-1/3 rounded-full bg-white/12" />
                <div className="mt-4 flex h-[4.5rem] items-end gap-2 sm:h-[5.2rem]">
                  <span
                    className="w-full rounded-t-[0.7rem] bg-sky-300/18"
                    style={{ height: "48%" }}
                  />
                  <span
                    className="w-full rounded-t-[0.7rem] bg-sky-300/28"
                    style={{ height: "74%" }}
                  />
                  <span
                    className="w-full rounded-t-[0.7rem] bg-accent/34"
                    style={{ height: "88%" }}
                  />
                  <span
                    className="w-full rounded-t-[0.7rem] bg-sky-300/20"
                    style={{ height: "62%" }}
                  />
                </div>
              </div>

              <div className="w-[34%] rounded-[1rem] border border-white/10 bg-black/15 p-3">
                <div className="h-2 w-2/3 rounded-full bg-white/12" />
                <div className="mt-3 space-y-2">
                  <div className="h-7 rounded-[0.75rem] bg-white/[0.05]" />
                  <div className="h-7 rounded-[0.75rem] bg-white/[0.05]" />
                  <div className="h-7 rounded-[0.75rem] bg-accent/14" />
                </div>
              </div>
            </div>
          </div>
        </PreviewShell>
      );
    case "landing":
      return (
        <PreviewShell accentClassName={accentClassName}>
          <div className="flex h-full flex-col gap-3">
            <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="h-2 w-1/4 rounded-full bg-white/12" />
              <div className="mt-3 h-3 w-4/5 rounded-full bg-white/14" />
              <div className="mt-2 h-3 w-3/5 rounded-full bg-white/10" />
              <div className="mt-4 inline-flex h-8 w-28 rounded-full bg-accent/20" />
            </div>
            <div className="grid flex-1 grid-cols-3 gap-2">
              <div className="rounded-[0.95rem] border border-white/10 bg-white/[0.03]" />
              <div className="rounded-[0.95rem] border border-white/10 bg-white/[0.03]" />
              <div className="rounded-[0.95rem] border border-white/10 bg-black/15 p-2">
                <div className="h-full rounded-[0.75rem] border border-white/8 border-dashed" />
              </div>
            </div>
          </div>
        </PreviewShell>
      );
    case "logistics":
      return (
        <PreviewShell accentClassName={accentClassName}>
          <div className="flex h-full gap-3">
            <div className="flex-1 rounded-[1rem] border border-white/10 bg-white/[0.03] p-3">
              <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr] gap-2">
                <div className="h-2 rounded-full bg-white/12" />
                <div className="h-2 rounded-full bg-white/10" />
                <div className="h-2 rounded-full bg-white/10" />
              </div>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1.2fr_0.7fr_0.7fr] items-center gap-2 rounded-[0.85rem] bg-black/15 px-2 py-2"
                  >
                    <div className="h-2 rounded-full bg-white/10" />
                    <div className="h-2 w-3/4 rounded-full bg-white/10" />
                    <div className="h-2 w-2/3 rounded-full bg-accent/22" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[30%] rounded-[1rem] border border-white/10 bg-black/15 p-3">
              <div className="h-2 w-3/4 rounded-full bg-white/12" />
              <div className="mt-3 space-y-2">
                <div className="h-7 rounded-full bg-accent/16" />
                <div className="h-7 rounded-full bg-white/[0.05]" />
                <div className="h-7 rounded-full bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </PreviewShell>
      );
  }
}

export function ProjectsSection({
  title,
  subtitle,
  labels,
  projects,
  headingMarker,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="border-b border-white/8 py-14 sm:py-20 lg:py-24"
    >
      {headingMarker}

      <div className="max-w-3xl">
        <h2
          id="projects-title"
          className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-white"
        >
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-[0.98rem] leading-7 text-zinc-300 sm:text-[1.05rem] sm:leading-8">
          {subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
        {projects.map((project) => {
          const secondaryActionLabel = getSecondaryActionLabel(
            project.status,
            labels,
          );

          return (
            <article key={project.title} className={cardClassName}>
              <ProjectPreview variant={project.preview} />

              <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-white">
                    {project.title}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.2em] ${statusClassNames[project.status]}`}
                  >
                    {labels.statuses[project.status]}
                  </span>
                </div>

                <p className="mt-4 text-[0.97rem] leading-7 text-zinc-400">
                  {project.description}
                </p>

                <p className="mt-4 font-mono text-[0.78rem] leading-6 text-zinc-300">
                  {project.role}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.split(", ").map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[0.68rem] leading-5 text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className={primaryCtaClassName}>
                    {labels.viewProject}
                  </button>
                  {secondaryActionLabel ? (
                    <button type="button" className={secondaryCtaClassName}>
                      {secondaryActionLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
