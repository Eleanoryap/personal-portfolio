import type { ReactNode } from "react";

/** Mono eyebrow in the terminal idiom: `////// Label`. Decorative. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="section-label" aria-hidden="true">
      {"////// "}
      {children}
    </p>
  );
}
