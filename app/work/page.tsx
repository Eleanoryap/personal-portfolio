import type { Metadata } from "next";
import Link from "next/link";
import { PageChrome } from "@/components/PageChrome";
import { SectionLabel } from "@/components/SectionLabel";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Work — ${site.name}`,
  description: `Selected case studies by ${site.name}, ${site.role}.`,
};

export default function WorkIndexPage() {
  return (
    <>
      <PageChrome back={{ href: "/", label: site.name }} topRight="Index" />

      <main className="doc pt-28 pb-[24vh] sm:pt-32">
        <SectionLabel>Work</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Selected work
        </h1>

        <ol className="mt-10">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="border-t border-hairline py-8 last:border-b"
            >
              <Link href={`/work/${project.slug}`} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-2xl text-ink group-hover:text-signal sm:text-[1.75rem]">
                    {String(index + 1).padStart(2, "0")} · {project.name}
                  </h2>
                  <span className="shrink-0 font-mono text-xs text-ink-muted">
                    {project.years}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs tracking-[0.1em] text-ink-muted uppercase">
                  {project.client} · {project.methodology.split(" — ")[0]}
                </p>
                <p className="mt-3 max-w-prose text-ink-body">
                  {project.summary}
                </p>
                <span className="mt-3 inline-block font-mono text-sm text-signal">
                  Read the case study →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
