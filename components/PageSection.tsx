import type { ReactNode } from "react";
import { GutterRow } from "./GutterRow";

interface PageSectionProps {
  id: string;
  title: string;
  /** Waypoint number shown in the gutter (and inline on small screens). */
  index?: string;
  /** Mono eyebrow label above the heading. */
  label?: string;
  /** Visually hide the heading while keeping it for assistive tech. */
  hideTitle?: boolean;
  children: ReactNode;
}

export function PageSection({
  id,
  title,
  index,
  label,
  hideTitle = false,
  children,
}: PageSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-t border-hairline py-12 sm:py-16"
    >
      <GutterRow marker={index}>
        {label ? (
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
            {index ? <span className="lg:hidden">{index} · </span> : null}
            {label}
          </p>
        ) : null}
        <h2
          id={headingId}
          className={
            hideTitle
              ? "sr-only"
              : "font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl"
          }
        >
          {title}
        </h2>
        <div className={hideTitle ? "" : "mt-6"}>{children}</div>
      </GutterRow>
    </section>
  );
}
