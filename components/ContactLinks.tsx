import type { SiteLink } from "@/content/site";
import { SignalLink } from "./SignalLink";

function displayHref(href: string) {
  return href
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export function ContactLinks({ links }: { links: SiteLink[] }) {
  return (
    <ul className="border-t border-hairline">
      {links.map((link) => (
        <li key={link.label} className="border-b border-hairline">
          <SignalLink
            href={link.href}
            variant="bare"
            className="flex items-baseline justify-between gap-4 py-3 font-mono text-sm"
          >
            <span className="tracking-[0.15em] text-ink-muted uppercase">
              {link.label}
            </span>
            <span className="min-w-0 truncate text-signal">
              {displayHref(link.href)} →
            </span>
          </SignalLink>
        </li>
      ))}
    </ul>
  );
}
