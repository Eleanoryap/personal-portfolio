export interface SiteLink {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  role: string;
  location: string;
  statement: string;
  links: SiteLink[];
}

export const site: Site = {
  name: "Placeholder Name",
  role: "Frontend Engineer",
  location: "Placeholder City, Country",
  statement:
    "Placeholder statement. One or two sentences on how this person thinks about interface work, the seam between engineering and design, and what they care about building. Real copy comes next.",
  links: [
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "GitHub", href: "https://github.com/placeholder" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/placeholder" },
    { label: "Résumé", href: "/placeholder-resume.pdf" },
  ],
};
