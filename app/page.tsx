import { Container } from "@/components/Container";
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
        <header className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {site.role} · {site.location}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink sm:text-6xl">
            {site.name}
          </h1>
        </header>

        <PageSection id="statement" title="Statement" hideTitle>
          <p className="text-lg leading-relaxed text-ink-body sm:text-xl">
            {site.statement}
          </p>
        </PageSection>

        <PageSection id="work" title="Selected work" eyebrow="Manifest">
          <WorkManifest projects={projects} />
        </PageSection>

        {projectOne ? (
          <PageSection
            id={projectOne.slug}
            title={projectOne.name}
            eyebrow="Project one"
          >
            <ProjectBrief project={projectOne} />
          </PageSection>
        ) : null}

        {projectTwo ? (
          <PageSection
            id={projectTwo.slug}
            title={projectTwo.name}
            eyebrow="Project two"
          >
            <ProjectBrief project={projectTwo} />
          </PageSection>
        ) : null}

        <PageSection id="reflection" title="Reflection">
          <p className="text-ink-body">
            Placeholder reflection. A short passage on what the work above has
            in common — a point of view on interface craft, constraints, and the
            handoff between design and engineering. Real copy comes next.
          </p>
        </PageSection>

        <PageSection id="short-hops" title="Short hops" eyebrow="Side projects">
          <ShortHops items={sideProjects} />
        </PageSection>

        <PageSection id="contact" title="Contact">
          <p className="mb-4 text-ink-body">
            Placeholder contact line. The best way to reach out and what for.
          </p>
          <ContactLinks links={site.links} />
        </PageSection>

        <footer className="border-t border-hairline py-10">
          <p className="font-mono text-xs text-ink-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
        </footer>
      </Container>
    </main>
  );
}
