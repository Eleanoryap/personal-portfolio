import type { Project } from "@/content/projects";

/**
 * Reads out the shape of a case study at a glance — a ruled line with a node
 * per parameter. The decisions node runs hot in the signal colour.
 */
export function BlueprintStrip({ project }: { project: Project }) {
  const nodes: Array<{ label: string; value: string; hot?: boolean }> = [
    { label: "Years", value: project.years },
    { label: "Method", value: project.methodology.split(" — ")[0] },
    { label: "Stack", value: `×${project.stack.length}` },
    { label: "Decisions", value: `×${project.decisions.length}`, hot: true },
    { label: "Challenges", value: `×${project.challenges.length}` },
  ];

  return (
    <dl className="blueprint">
      {nodes.map((node) => (
        <div
          key={node.label}
          className={`blueprint__node${node.hot ? " blueprint__node--hot" : ""}`}
        >
          <dt>{node.label}</dt>
          <dd>
            <b>{node.value}</b>
          </dd>
        </div>
      ))}
    </dl>
  );
}
