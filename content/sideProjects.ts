export interface SideProject {
  name: string;
  year: string;
  stack: string[];
  oneLiner: string;
  url?: string;
}

export const sideProjects: SideProject[] = [
  {
    name: "IsItPhishy",
    year: "2020",
    stack: ["JavaScript", "React", "Firebase"],
    oneLiner:
      "A Google Chrome extension, built with five other students, that flags phishing emails in Gmail and reports a precision score.",
    url: "https://isitphishy.wixsite.com/website",
  },
  {
    name: "ACI Mobile Migration",
    year: "2018",
    stack: ["Java", "Kotlin"],
    oneLiner:
      "Migrated the Asian Culinary Institute's Android application from Java to Kotlin.",
  },
];
