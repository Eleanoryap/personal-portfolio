import type { ReactNode } from "react";

/**
 * Two-column layout primitive: a narrow left gutter carrying a mono marker
 * (waypoint number, glyph) and the content column. The gutter collapses
 * below `lg`, where the marker is surfaced inline by the caller instead.
 */
export function GutterRow({
  marker,
  children,
  className = "",
}: {
  marker?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`lg:grid lg:grid-cols-[3.5rem_1fr] lg:gap-x-8 ${className}`}
    >
      <div
        aria-hidden="true"
        className="hidden font-mono text-xs text-ink-muted lg:block"
      >
        {marker}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
