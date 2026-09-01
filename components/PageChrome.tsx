import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface PageChromeProps {
  /** Top-left back link. */
  back: { href: string; label: string };
  /** Top-right slot (hidden under 40rem). */
  topRight?: ReactNode;
  /** Bottom-left slot (hidden under 40rem). */
  bottomLeft?: ReactNode;
  /** Sits above the theme toggle, bottom-right (hidden under 40rem). */
  meta?: ReactNode;
}

/** Static corner furniture for every page except the homepage. */
export function PageChrome({
  back,
  topRight,
  bottomLeft,
  meta,
}: PageChromeProps) {
  return (
    <div className="chrome chrome--case">
      <p className="brand brand--case">
        <Link href={back.href}>← {back.label}</Link>
      </p>

      {topRight ? (
        <p className="chrome__fx chrome__fx--tr">{topRight}</p>
      ) : null}

      {bottomLeft ? (
        <p className="chrome__fx chrome__fx--bl">{bottomLeft}</p>
      ) : null}

      <div className="chrome__fx chrome__fx--br flex flex-col items-end gap-1.5">
        {meta ? <span className="chrome__meta">{meta}</span> : null}
        <ThemeToggle />
      </div>
    </div>
  );
}
