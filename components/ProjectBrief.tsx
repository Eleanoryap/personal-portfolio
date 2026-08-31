import type { Project } from "@/content/projects";
import { MetaTable } from "./MetaTable";
import { SignalLink } from "./SignalLink";

export function ProjectBrief({ project }: { project: Project }) {
  return (
    <article>
      <MetaTable
        rows={[
          ["Client", project.client],
          ["Years", project.years],
          ["Method", project.methodology],
          ["Stack", project.stack.join(", ")],
        ]}
      />

      <p className="mt-6 max-w-prose text-ink-body">{project.summary}</p>

      <p className="mt-6 font-mono text-sm">
        <SignalLink href={`/work/${project.slug}`}>
          Read the case study →
        </SignalLink>
      </p>
    </article>
  );
}
