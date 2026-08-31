export interface ProjectDecision {
  title: string;
  detail: string;
}

export interface ProjectChallenge {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  name: string;
  client: string;
  years: string;
  methodology: string;
  stack: string[];
  summary: string;
  decisions: ProjectDecision[];
  challenges: ProjectChallenge[];
}

export const projects: Project[] = [
  {
    slug: "project-one",
    name: "Placeholder Project One",
    client: "Placeholder Client",
    years: "2024",
    methodology: "Placeholder methodology — discovery, prototyping, delivery.",
    stack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    summary:
      "Placeholder summary. A short paragraph describing the problem, the shape of the work, and the outcome. Real copy comes next.",
    decisions: [],
    challenges: [],
  },
  {
    slug: "project-two",
    name: "Placeholder Project Two",
    client: "Placeholder Client",
    years: "2023–2024",
    methodology: "Placeholder methodology — research, design system, build.",
    stack: ["React", "TypeScript", "Vite", "CSS Modules"],
    summary:
      "Placeholder summary. A short paragraph describing the problem, the shape of the work, and the outcome. Real copy comes next.",
    decisions: [],
    challenges: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
