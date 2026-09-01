import type { ReactNode } from "react";
import { SectionLabel } from "./SectionLabel";

interface SectionProps {
  id: string;
  /** Mono eyebrow, rendered with the `//////` prefix. Decorative. */
  label: string;
  title: string;
  /** Keep the heading for assistive tech but hide it visually. */
  hideTitle?: boolean;
  children: ReactNode;
}

export function Section({
  id,
  label,
  title,
  hideTitle = false,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-reveal
      className="py-11 sm:py-14"
    >
      <SectionLabel>{label}</SectionLabel>
      <h2
        id={headingId}
        className={
          hideTitle
            ? "sr-only"
            : "mt-1 font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl"
        }
      >
        {title}
      </h2>
      <div className={hideTitle ? "" : "mt-6"}>{children}</div>
    </section>
  );
}
