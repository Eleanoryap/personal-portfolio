export interface SiteLink {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  role: string;
  location: string;
  statement: string;
  reflection: string;
  contact: string;
  links: SiteLink[];
}

export const site: Site = {
  name: "Eleanor Yap",
  role: "Frontend Engineer",
  location: "Singapore",
  statement:
    "I'm a software engineer at ST Engineering with a full-stack foundation and a pull toward front-end architecture. I build responsive web applications in Svelte and TypeScript, translate Figma into pixel-accurate and accessible interfaces, and work closely with UI/UX designers to close the gap between implementation and experience.",
  reflection:
    "Both projects shaped how I think about frontend work. SIRMS taught me to understand users and their operational context before building anything. CPOS sharpened the engineering — modern tooling, Agile delivery, and closer collaboration with UI/UX. Across both, in Waterfall and in Agile, I've worked toward a user-first mindset, bridging business, design, and engineering through collaboration, and building solutions meant to be maintainable and reusable rather than merely functional. It's what drew me to frontend and UI/UX-focused development: building products that solve real user problems with a good experience.",
  contact:
    "The best way to reach me is by email. I'm open to frontend and UI/UX-focused roles.",
  links: [
    { label: "Email", href: "mailto:eleanoryap15@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/eleanor-yap/" },
    // TODO: add GitHub once a public profile URL is available.
    // TODO: add Résumé once a public copy (without the phone number) is hosted in /public.
  ],
};
