import type { ReactNode } from "react";

interface PageSectionProps {
  id: string;
  title: string;
  /** Visually hide the heading while keeping it for assistive tech. */
  hideTitle?: boolean;
  eyebrow?: string;
  children: ReactNode;
}

export function PageSection({
  id,
  title,
  hideTitle = false,
  eyebrow,
  children,
}: PageSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-t border-hairline py-14 sm:py-20"
    >
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs tracking-widest text-ink-muted uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={headingId}
        className={
          hideTitle ? "sr-only" : "text-2xl tracking-tight text-ink sm:text-3xl"
        }
      >
        {title}
      </h2>
      <div className={hideTitle ? "" : "mt-6"}>{children}</div>
    </section>
  );
}
