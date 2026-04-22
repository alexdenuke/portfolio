"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ProjectStatus = "live" | "preview" | "archived" | "private";

export type ProjectCard = {
  title: string;
  description: string;
  role: string;
  stack: string;
  status: ProjectStatus;
  previewImage: string;
  screenshots?: readonly string[];
  actionHref?: string;
};

export type ProjectsSectionLabels = {
  openLive: string;
  preview: string;
  screenshots: string;
  statuses: Record<ProjectStatus, string>;
  details: {
    role: string;
    stack: string;
    close: string;
  };
};

type ProjectsGridProps = {
  labels: ProjectsSectionLabels;
  projects: readonly [ProjectCard, ProjectCard, ProjectCard, ProjectCard];
};

const overviewCardClassName =
  "group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.045] focus-within:border-accent/32 sm:p-4";

const modalCtaClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-accent/35 bg-accent px-4 py-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:border-accent-strong hover:bg-accent-strong";

const statusClassNames: Record<ProjectStatus, string> = {
  live: "border border-accent/20 bg-accent/10 text-accent-strong",
  preview: "border border-slate-300/14 bg-slate-300/8 text-slate-200",
  archived: "border border-white/10 bg-white/[0.05] text-zinc-300",
  private: "border border-white/10 bg-black/15 text-zinc-400",
};

function restoreWindowScroll(scrollY: number) {
  window.scrollTo({
    left: 0,
    top: scrollY,
    behavior: "instant",
  });
}

function getStackItems(stack: string) {
  return stack.split(", ").filter(Boolean);
}

function getSecondaryActionLabel(
  status: ProjectStatus,
  labels: ProjectsSectionLabels,
) {
  switch (status) {
    case "live":
      return labels.openLive;
    case "preview":
      return labels.preview;
    case "archived":
      return labels.screenshots;
    case "private":
      return labels.screenshots;
  }
}

function getProjectAction(project: ProjectCard, labels: ProjectsSectionLabels) {
  const label = getSecondaryActionLabel(project.status, labels);

  if (!label) {
    return null;
  }

  if (project.actionHref) {
    return {
      href: project.actionHref,
      label,
      type: "link" as const,
    };
  }

  if (project.screenshots?.length) {
    return {
      label,
      type: "screenshots" as const,
    };
  }

  return null;
}

function ProjectImage({
  alt,
  src,
  priority,
}: {
  alt: string;
  src: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.025]"
    />
  );
}

function ProjectOverviewCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectCard;
  index: number;
  onOpen: (project: ProjectCard) => void;
}) {
  const titleId = `project-card-title-${index}`;
  const stackItems = getStackItems(project.stack);
  const visibleStackItems = stackItems.slice(0, 4);
  const hiddenStackItemsCount = stackItems.length - visibleStackItems.length;

  return (
    <article className={overviewCardClassName}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-labelledby={titleId}
        className="absolute inset-0 z-10 rounded-[1.6rem] outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={(event) => {
          event.currentTarget.blur();
          onOpen(project);
        }}
      />

      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02]">
        <ProjectImage
          alt=""
          priority={index === 0}
          src={project.previewImage}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/[0.02]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-black/28 text-sm text-white/76 backdrop-blur-sm transition-colors group-hover:border-accent/32 group-hover:text-accent-strong"
        >
          +
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <h3
          id={titleId}
          className="text-[1.28rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.38rem]"
        >
          {project.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleStackItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[0.66rem] leading-5 text-zinc-300"
            >
              {item}
            </span>
          ))}
          {hiddenStackItemsCount > 0 ? (
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[0.66rem] leading-5 text-zinc-400">
              +{hiddenStackItemsCount}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectModal({
  labels,
  project,
  onClose,
}: {
  labels: ProjectsSectionLabels;
  project: ProjectCard | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const screenshotsRef = useRef<HTMLElement>(null);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);
  const projectAction = project ? getProjectAction(project, labels) : null;
  const activeScreenshot = project?.screenshots?.[activeScreenshotIndex];

  useEffect(() => {
    setActiveScreenshotIndex(0);
  }, [project]);

  useLayoutEffect(() => {
    if (!project) {
      return;
    }

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousHtmlOverflow = documentElement.style.overflow;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = previousBodyPaddingRight
        ? `calc(${previousBodyPaddingRight} + ${scrollbarWidth}px)`
        : `${scrollbarWidth}px`;
    }

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      restoreWindowScroll(scrollY);
      window.requestAnimationFrame(() => restoreWindowScroll(scrollY));
    };
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (project && !dialog.open) {
      dialog.showModal();
    }

    if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  function requestClose() {
    const dialog = dialogRef.current;

    if (dialog?.open) {
      dialog.close();
      return;
    }

    onClose();
  }

  function scrollToScreenshots() {
    setActiveScreenshotIndex(0);
    screenshotsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={project ? "project-modal-title" : undefined}
      aria-modal="true"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto overscroll-contain bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-6"
      onClick={requestClose}
      onClose={onClose}
    >
      {project ? (
        <div className="flex min-h-full items-center justify-center">
          <article
            className="relative w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#080a0b]/95 p-4 shadow-2xl shadow-black/40 sm:p-5 lg:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={labels.details.close}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/35 text-xl leading-none text-white/72 backdrop-blur-sm transition-colors hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
              onClick={requestClose}
            >
              x
            </button>

            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02]">
              <ProjectImage alt="" src={project.previewImage} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>

            <div className="grid gap-7 px-1 pb-1 pt-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3
                    id="project-modal-title"
                    className="text-[clamp(1.65rem,4vw,2.6rem)] font-semibold tracking-[-0.04em] text-white"
                  >
                    {project.title}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.2em] ${statusClassNames[project.status]}`}
                  >
                    {labels.statuses[project.status]}
                  </span>
                </div>

                <p className="mt-5 text-[0.98rem] leading-7 text-zinc-300 sm:text-[1.04rem] sm:leading-8">
                  {project.description}
                </p>

                {projectAction ? (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {projectAction.type === "link" ? (
                      <a
                        className={modalCtaClassName}
                        href={projectAction.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {projectAction.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={modalCtaClassName}
                        onClick={scrollToScreenshots}
                      >
                        {projectAction.label}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-white/48">
                    {labels.details.role}
                  </p>
                  <p className="mt-3 text-[1rem] leading-7 text-white">
                    {project.role}
                  </p>
                </div>

                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-white/48">
                    {labels.details.stack}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getStackItems(project.stack).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[0.68rem] leading-5 text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {project.screenshots?.length ? (
              <section
                ref={screenshotsRef}
                aria-labelledby="project-screenshots-title"
                className="mt-7 border-t border-white/8 px-1 pt-6"
              >
                <h4
                  id="project-screenshots-title"
                  className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/48"
                >
                  {labels.screenshots}
                </h4>

                <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02]">
                  <div className="relative aspect-[16/9]">
                    {activeScreenshot ? (
                      <Image
                        src={activeScreenshot}
                        alt={`${project.title} screenshot ${activeScreenshotIndex + 1}`}
                        fill
                        sizes="(min-width: 1024px) 896px, 100vw"
                        className="object-cover object-top"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {project.screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot}
                      type="button"
                      aria-label={`${labels.screenshots} ${index + 1}`}
                      className={`relative h-16 min-w-28 overflow-hidden rounded-[0.85rem] border bg-white/[0.02] transition-colors sm:h-20 sm:min-w-36 ${
                        index === activeScreenshotIndex
                          ? "border-accent/45"
                          : "border-white/10 hover:border-white/18"
                      }`}
                      onClick={() => setActiveScreenshotIndex(index)}
                    >
                      <Image
                        src={screenshot}
                        alt=""
                        fill
                        sizes="144px"
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      ) : null}
    </dialog>
  );
}

export function ProjectsGrid({ labels, projects }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(
    null,
  );

  return (
    <>
      <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectOverviewCard
            key={project.title}
            project={project}
            index={index}
            onOpen={setSelectedProject}
          />
        ))}
      </div>

      <ProjectModal
        labels={labels}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
