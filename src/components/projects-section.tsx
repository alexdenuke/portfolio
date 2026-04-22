import type { ReactNode } from "react";
import {
  ProjectsGrid,
  type ProjectCard,
  type ProjectsSectionLabels,
} from "@/components/projects-grid";

type ProjectsSectionProps = {
  title: string;
  subtitle: string;
  labels: ProjectsSectionLabels;
  projects: readonly [ProjectCard, ProjectCard, ProjectCard, ProjectCard];
  headingMarker?: ReactNode;
};

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

      <ProjectsGrid labels={labels} projects={projects} />
    </section>
  );
}
