import type { SiteLink } from "@/content/site";

export function ContactLinks({ links }: { links: SiteLink[] }) {
  return (
    <ul className="flex flex-col gap-2 font-mono text-sm">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className="text-signal">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
