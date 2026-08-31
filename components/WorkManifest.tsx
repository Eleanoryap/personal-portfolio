import Link from "next/link";
import type { Project } from "@/content/projects";

export function WorkManifest({ projects }: { projects: Project[] }) {
  return (
    <ol className="border-b border-hairline">
      {projects.map((project, index) => (
        <li key={project.slug} className="border-t border-hairline">
          <Link
            href={`/work/${project.slug}`}
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 py-4 text-signal"
          >
            <span className="font-mono text-xs text-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-lg text-ink">
              {project.name}
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {project.years}
            </span>
            <span className="col-start-2 font-mono text-xs text-ink-muted">
              {project.client} · {project.methodology.split(" — ")[0]}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
