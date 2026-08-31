export interface SideProject {
  name: string;
  year: string;
  stack: string[];
  oneLiner: string;
  url?: string;
}

export const sideProjects: SideProject[] = [
  {
    name: "Placeholder Side Project",
    year: "2025",
    stack: ["TypeScript", "Vite"],
    oneLiner: "Placeholder one-liner describing a small thing that was built.",
    url: "https://example.com/placeholder",
  },
  {
    name: "Placeholder Experiment",
    year: "2024",
    stack: ["React", "Canvas"],
    oneLiner: "Placeholder one-liner for a weekend experiment.",
  },
];
