import Link from "next/link";
import type { Project } from "@/content/projects";

/** A ruled register of the case studies — one row per project. */
export function WorkManifest({ projects }: { projects: Project[] }) {
  return (
    <ol className="border-t border-hairline">
      {projects.map((project, index) => (
        <li key={project.slug} className="border-b border-hairline">
          <Link
            href={`/work/${project.slug}`}
            className="group grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-4 py-5"
          >
            <span className="font-mono text-xs text-ink-muted group-hover:text-signal">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="font-display text-lg text-ink group-hover:text-signal">
                {project.name}
              </span>
              <span className="mt-1 block font-mono text-xs text-ink-muted">
                {project.client} · {project.methodology.split(" — ")[0]}
              </span>
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {project.years}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
