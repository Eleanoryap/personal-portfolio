import type { SideProject } from "@/content/sideProjects";

export function ShortHops({ items }: { items: SideProject[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={`${item.name}-${item.year}`}>
          <h3 className="font-display text-base text-ink">
            {item.url ? (
              <a href={item.url} className="text-signal">
                {item.name}
              </a>
            ) : (
              item.name
            )}
            <span className="ml-2 font-mono text-xs font-normal text-ink-muted">
              {item.year}
            </span>
          </h3>
          <p className="mt-1 text-sm text-ink-body">{item.oneLiner}</p>
          <p className="mt-1 font-mono text-xs text-ink-muted">
            {item.stack.join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
