import type { SideProject } from "@/content/sideProjects";
import { SignalLink } from "./SignalLink";

export function ShortHops({ items }: { items: SideProject[] }) {
  return (
    <ul className="border-t border-hairline">
      {items.map((item) => (
        <li
          key={`${item.name}-${item.year}`}
          className="border-b border-hairline py-5"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-base text-ink">
              {item.url ? (
                <SignalLink href={item.url}>{item.name}</SignalLink>
              ) : (
                item.name
              )}
            </h3>
            <span className="shrink-0 font-mono text-xs text-ink-muted">
              {item.year}
            </span>
          </div>
          <p className="mt-2 max-w-prose text-sm text-ink-body">
            {item.oneLiner}
          </p>
          <p className="mt-2 font-mono text-xs text-ink-muted">
            {item.stack.join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
