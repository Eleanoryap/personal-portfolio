import Link from "next/link";
import { HomeChrome } from "@/components/HomeChrome";
import { PathProgress } from "@/components/PathProgress";
import { ReplayIntro } from "@/components/ReplayIntro";
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

      <div className="relative">
        <PathProgress />
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

          <footer className="mt-4 border-t border-hairline pt-8 pb-16 font-mono text-xs text-ink-muted">
            <nav
              className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-[0.14em]"
              aria-label="Site"
            >
              <Link href="/about" className="hover:text-signal">
                About
              </Link>
              <Link href="/work" className="hover:text-signal">
                Work
              </Link>
              <a href="#statement" className="hover:text-signal">
                Top
              </a>
              <ReplayIntro />
            </nav>
            <p className="mt-4">
              © {new Date().getFullYear()} {site.name} · {site.location}
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
