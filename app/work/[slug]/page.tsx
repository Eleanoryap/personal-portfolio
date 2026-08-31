import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
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
        <p className="pt-16 font-mono text-xs">
          <Link href="/" className="text-signal">
            ← {site.name}
          </Link>
        </p>

        <article className="pb-24">
          <header className="border-b border-hairline py-10">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              Case study
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              {project.name}
            </h1>
            <p className="mt-4 text-ink-body">{project.summary}</p>
          </header>

          <dl className="grid grid-cols-1 gap-y-2 border-b border-hairline py-8 font-mono text-xs text-ink-muted sm:grid-cols-[7rem_1fr] sm:gap-x-4">
            <dt className="uppercase tracking-widest">Client</dt>
            <dd className="text-ink-body">{project.client}</dd>
            <dt className="uppercase tracking-widest">Years</dt>
            <dd className="text-ink-body">{project.years}</dd>
            <dt className="uppercase tracking-widest">Methodology</dt>
            <dd className="text-ink-body">{project.methodology}</dd>
            <dt className="uppercase tracking-widest">Stack</dt>
            <dd className="text-ink-body">{project.stack.join(", ")}</dd>
          </dl>

          {project.decisions.length > 0 ? (
            <section
              aria-labelledby="decisions-heading"
              className="border-b border-hairline py-10"
            >
              <h2
                id="decisions-heading"
                className="text-2xl tracking-tight text-ink"
              >
                Decisions
              </h2>
              <ul className="mt-6 flex flex-col gap-6">
                {project.decisions.map((decision) => (
                  <li key={decision.title}>
                    <h3 className="font-display text-base text-ink">
                      {decision.title}
                    </h3>
                    <p className="mt-1 text-ink-body">{decision.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.challenges.length > 0 ? (
            <section
              aria-labelledby="challenges-heading"
              className="border-b border-hairline py-10"
            >
              <h2
                id="challenges-heading"
                className="text-2xl tracking-tight text-ink"
              >
                Challenges
              </h2>
              <ul className="mt-6 flex flex-col gap-6">
                {project.challenges.map((challenge) => (
                  <li key={challenge.title}>
                    <h3 className="font-display text-base text-ink">
                      {challenge.title}
                    </h3>
                    <p className="mt-1 text-ink-body">{challenge.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </Container>
    </main>
  );
}
