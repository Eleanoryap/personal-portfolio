import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { GutterRow } from "@/components/GutterRow";
import { MetaTable } from "@/components/MetaTable";
import { SignalLink } from "@/components/SignalLink";
import { getProject, projects } from "@/content/projects";
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

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <Container>
        <div className="border-b border-hairline py-6">
          <GutterRow>
            <SignalLink
              href="/"
              variant="bare"
              className="font-mono text-xs tracking-[0.2em] uppercase"
            >
              ← Index
            </SignalLink>
          </GutterRow>
        </div>

        <article>
          <header className="border-b border-hairline py-12 sm:py-16">
            <GutterRow marker="00">
              <p className="font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
                Case study
              </p>
              <h1 className="mt-4 font-display text-[2.25rem] leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-prose text-lg text-ink-body">
                {project.summary}
              </p>
            </GutterRow>
          </header>

          <div className="border-b border-hairline py-10">
            <GutterRow marker="01">
              <p className="mb-4 font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
                Parameters
              </p>
              <MetaTable
                rows={[
                  ["Client", project.client],
                  ["Years", project.years],
                  ["Methodology", project.methodology],
                  ["Stack", project.stack.join(", ")],
                ]}
              />
            </GutterRow>
          </div>

          {project.decisions.length > 0 ? (
            <section
              aria-labelledby="decisions-heading"
              className="border-b border-hairline py-12 sm:py-16"
            >
              <GutterRow marker="02">
                <h2
                  id="decisions-heading"
                  className="font-display text-2xl tracking-tight text-ink sm:text-3xl"
                >
                  Decisions
                </h2>
                <ol className="mt-6 border-t border-hairline">
                  {project.decisions.map((decision, index) => (
                    <li
                      key={decision.title}
                      className="flex gap-4 border-b border-hairline py-5"
                    >
                      <span className="font-mono text-xs text-ink-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base text-ink">
                          {decision.title}
                        </h3>
                        <p className="mt-2 max-w-prose text-ink-body">
                          {decision.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </GutterRow>
            </section>
          ) : null}

          {project.challenges.length > 0 ? (
            <section
              aria-labelledby="challenges-heading"
              className="border-b border-hairline py-12 sm:py-16"
            >
              <GutterRow marker="03">
                <h2
                  id="challenges-heading"
                  className="font-display text-2xl tracking-tight text-ink sm:text-3xl"
                >
                  Challenges
                </h2>
                <ol className="mt-6 border-t border-hairline">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={challenge.title}
                      className="flex gap-4 border-b border-hairline py-5"
                    >
                      <span className="font-mono text-xs text-ink-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base text-ink">
                          {challenge.title}
                        </h3>
                        <p className="mt-2 max-w-prose text-ink-body">
                          {challenge.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </GutterRow>
            </section>
          ) : null}

          <div className="py-12">
            <GutterRow>
              <SignalLink href="/" className="font-mono text-sm">
                ← Back to index
              </SignalLink>
            </GutterRow>
          </div>
        </article>
      </Container>
    </main>
  );
}
