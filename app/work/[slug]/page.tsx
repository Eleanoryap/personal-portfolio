import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlueprintStrip } from "@/components/BlueprintStrip";
import { CaseChrome } from "@/components/CaseChrome";
import { SectionLabel } from "@/components/SectionLabel";
import { SignalLink } from "@/components/SignalLink";
import { TerminalRule } from "@/components/TerminalRule";
import {
  getProject,
  projects,
  type ProjectChallenge,
  type ProjectDecision,
} from "@/content/projects";
import { site } from "@/content/site";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: `Not found — ${site.name}` };
  }

  return {
    title: `${project.name} — ${site.name}`,
    description: project.summary,
  };
}

function EntryList({
  heading,
  id,
  entries,
}: {
  heading: string;
  id: string;
  entries: Array<ProjectDecision | ProjectChallenge>;
}) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby={`${id}-heading`} data-reveal>
      <TerminalRule />
      <SectionLabel>{heading}</SectionLabel>
      <h2 id={`${id}-heading`} className="sr-only">
        {heading}
      </h2>
      <ol className="mt-2">
        {entries.map((entry, i) => (
          <li
            key={entry.title}
            className="grid grid-cols-[1.75rem_1fr] gap-4 border-t border-hairline py-5"
          >
            <span className="pt-1 font-mono text-xs text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-base text-ink">{entry.title}</h3>
              <p className="mt-2 text-ink-body">{entry.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const position = projects.findIndex((p) => p.slug === slug);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <CaseChrome
        projectName={project.name}
        client={project.client}
        years={project.years}
        index={position + 1}
        total={projects.length}
      />

      <main className="doc pt-28 pb-[24vh] sm:pt-32">
        <article>
          <div data-reveal>
            <SectionLabel>Case study</SectionLabel>
            <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {project.name}
            </h1>

            <BlueprintStrip project={project} />

            <p className="text-lg text-ink-body">{project.summary}</p>
          </div>

          <EntryList
            heading="Decisions"
            id="decisions"
            entries={project.decisions}
          />
          <EntryList
            heading="Challenges"
            id="challenges"
            entries={project.challenges}
          />

          <TerminalRule />

          <p className="font-mono text-sm">
            <SignalLink href={`/work/${next.slug}`}>
              → Next · {next.name}
            </SignalLink>
          </p>
        </article>
      </main>
    </>
  );
}
