import { Container } from "@/components/Container";
import { GutterRow } from "@/components/GutterRow";
import { PageSection } from "@/components/PageSection";
import { WorkManifest } from "@/components/WorkManifest";
import { ProjectBrief } from "@/components/ProjectBrief";
import { ShortHops } from "@/components/ShortHops";
import { ContactLinks } from "@/components/ContactLinks";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { sideProjects } from "@/content/sideProjects";

export default function HomePage() {
  const [projectOne, projectTwo] = projects;

  return (
    <main>
      <Container>
        <header className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <GutterRow marker="00">
            <p className="font-mono text-xs tracking-[0.2em] text-ink-muted uppercase">
              {site.role}
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-5 font-mono text-xs text-ink-muted">
              {site.location}
            </p>
          </GutterRow>
        </header>

        <PageSection id="statement" title="Statement" index="01" hideTitle>
          <p className="max-w-prose text-lg leading-relaxed text-ink-body sm:text-xl">
            {site.statement}
          </p>
        </PageSection>

        <PageSection
          id="work"
          title="Selected work"
          index="02"
          label="Manifest"
        >
          <WorkManifest projects={projects} />
        </PageSection>

        {projectOne ? (
          <PageSection
            id={projectOne.slug}
            title={projectOne.name}
            index="03"
            label="Case study"
          >
            <ProjectBrief project={projectOne} />
          </PageSection>
        ) : null}

        {projectTwo ? (
          <PageSection
            id={projectTwo.slug}
            title={projectTwo.name}
            index="04"
            label="Case study"
          >
            <ProjectBrief project={projectTwo} />
          </PageSection>
        ) : null}

        <PageSection id="reflection" title="Reflection" index="05">
          <p className="max-w-prose text-ink-body">
            Placeholder reflection. A short passage on what the work above has
            in common — a point of view on interface craft, constraints, and the
            handoff between design and engineering. Real copy comes next.
          </p>
        </PageSection>

        <PageSection
          id="short-hops"
          title="Short hops"
          index="06"
          label="Side projects"
        >
          <ShortHops items={sideProjects} />
        </PageSection>

        <PageSection id="contact" title="Contact" index="07">
          <p className="mb-6 max-w-prose text-ink-body">
            Placeholder contact line. The best way to reach out and what for.
          </p>
          <ContactLinks links={site.links} />
        </PageSection>

        <footer className="border-t border-hairline py-10">
          <GutterRow marker="—">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
              <span>
                © {new Date().getFullYear()} {site.name}
              </span>
              <span>{site.location}</span>
            </div>
          </GutterRow>
        </footer>
      </Container>
    </main>
  );
}
