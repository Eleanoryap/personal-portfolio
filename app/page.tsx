import { HomeChrome } from "@/components/HomeChrome";
import { Section } from "@/components/Section";
import { TerminalRule } from "@/components/TerminalRule";
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
    <>
      <HomeChrome />

      <main className="doc doc--hero pb-[28vh]">
        <Section id="statement" label="Statement" title="Statement" hideTitle>
          <p className="manifesto">{site.statement}</p>
        </Section>

        <TerminalRule />

        <Section id="work" label="Manifest" title="Selected work">
          <WorkManifest projects={projects} />
        </Section>

        {projectOne ? (
          <>
            <TerminalRule />
            <Section
              id={projectOne.slug}
              label="Case study"
              title={projectOne.name}
            >
              <ProjectBrief project={projectOne} />
            </Section>
          </>
        ) : null}

        {projectTwo ? (
          <>
            <TerminalRule />
            <Section
              id={projectTwo.slug}
              label="Case study"
              title={projectTwo.name}
            >
              <ProjectBrief project={projectTwo} />
            </Section>
          </>
        ) : null}

        <TerminalRule />

        <Section id="reflection" label="Reflection" title="Reflection">
          <p className="max-w-prose text-ink-body">{site.reflection}</p>
        </Section>

        <TerminalRule />

        <Section id="short-hops" label="Side projects" title="Short hops">
          <ShortHops items={sideProjects} />
        </Section>

        <TerminalRule />

        <Section id="contact" label="Contact" title="Contact">
          <p className="mb-6 max-w-prose text-ink-body">{site.contact}</p>
          <ContactLinks links={site.links} />
        </Section>
      </main>
    </>
  );
}
