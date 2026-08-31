import Link from "next/link";
import type { ReactNode } from "react";

interface SignalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** "text" underlines on hover; "bare" leaves decoration to the caller. */
  variant?: "text" | "bare";
}

/**
 * The single home for primary-link styling, so `--signal` stays reserved
 * for links (and markers) as the token spec requires.
 */
export function SignalLink({
  href,
  children,
  className = "",
  variant = "text",
}: SignalLinkProps) {
  const base =
    variant === "text"
      ? "text-signal underline decoration-transparent underline-offset-4 hover:decoration-signal"
      : "text-signal";
  const cls = `${base} ${className}`.trim();

  // Route within the app only for clean paths; let files and external
  // targets fall through to a plain anchor.
  const isRoute = href.startsWith("/") && !href.includes(".");
  if (isRoute) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  const isExternal = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={cls}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
