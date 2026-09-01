import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";
import { SectionLabel } from "@/components/SectionLabel";
import { SignalLink } from "@/components/SignalLink";
import { TerminalRule } from "@/components/TerminalRule";
import { about } from "@/content/about";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: about.bio[0],
};

export default function AboutPage() {
  return (
    <>
      <PageChrome back={{ href: "/", label: site.name }} topRight="About" />

      <main className="doc pt-28 pb-[24vh] sm:pt-32">
        <SectionLabel>About</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {site.name}
        </h1>

        <div className="mt-6 flex flex-col gap-4">
          {about.bio.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="max-w-prose text-ink-body"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <TerminalRule />

        <section aria-labelledby="experience-heading">
          <SectionLabel>Experience</SectionLabel>
          <h2
            id="experience-heading"
            className="mt-1 font-display text-2xl tracking-tight text-ink"
          >
            Where I&rsquo;ve worked
          </h2>
          <ol className="mt-6">
            {about.experience.map((role) => (
              <li
                key={`${role.org}-${role.years}`}
                className="border-t border-hairline py-6 last:border-b"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg text-ink">
                    {role.title}
                  </h3>
                  <span className="font-mono text-xs text-ink-muted">
                    {role.years}
                  </span>
                </div>
                <p className="font-mono text-xs tracking-[0.1em] text-ink-muted uppercase">
                  {role.org}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {role.points.map((point) => (
                    <li
                      key={point.slice(0, 24)}
                      className="max-w-prose text-sm text-ink-body"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <TerminalRule />

        <section aria-labelledby="education-heading">
          <SectionLabel>Education</SectionLabel>
          <h2
            id="education-heading"
            className="mt-1 font-display text-2xl tracking-tight text-ink"
          >
            Where I studied
          </h2>
          <ul className="mt-6">
            {about.education.map((study) => (
              <li
                key={study.qualification}
                className="border-t border-hairline py-5 last:border-b"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-base text-ink">
                    {study.qualification}
                  </h3>
                  <span className="font-mono text-xs text-ink-muted">
                    {study.years}
                  </span>
                </div>
                <p className="font-mono text-xs tracking-[0.1em] text-ink-muted uppercase">
                  {study.institution}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <TerminalRule />

        <section aria-labelledby="skills-heading">
          <SectionLabel>Skills</SectionLabel>
          <h2
            id="skills-heading"
            className="mt-1 font-display text-2xl tracking-tight text-ink"
          >
            What I work with
          </h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {about.skills.map((group) => (
              <div key={group.label}>
                <dt className="font-mono text-xs tracking-[0.1em] text-ink-muted uppercase">
                  {group.label}
                </dt>
                <dd className="mt-2 text-ink-body">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <TerminalRule />

        <p className="font-mono text-sm">
          <SignalLink href="/work">→ Selected work</SignalLink>
        </p>
      </main>
    </>
  );
}
