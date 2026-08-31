import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectBrief({ project }: { project: Project }) {
  return (
    <article>
      <dl className="grid grid-cols-1 gap-y-2 font-mono text-xs text-ink-muted sm:grid-cols-[6rem_1fr] sm:gap-x-4">
        <dt className="uppercase tracking-widest">Client</dt>
        <dd className="text-ink-body">{project.client}</dd>
        <dt className="uppercase tracking-widest">Years</dt>
        <dd className="text-ink-body">{project.years}</dd>
        <dt className="uppercase tracking-widest">Method</dt>
        <dd className="text-ink-body">{project.methodology}</dd>
        <dt className="uppercase tracking-widest">Stack</dt>
        <dd className="text-ink-body">{project.stack.join(", ")}</dd>
      </dl>

      <p className="mt-6 text-ink-body">{project.summary}</p>

      <p className="mt-6">
        <Link
          href={`/work/${project.slug}`}
          className="text-signal font-mono text-sm"
        >
          Read the case study →
        </Link>
      </p>
    </article>
  );
}
