export interface AboutRole {
  org: string;
  title: string;
  years: string;
  points: string[];
}

export interface AboutStudy {
  qualification: string;
  institution: string;
  years: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface About {
  bio: string[];
  experience: AboutRole[];
  education: AboutStudy[];
  skills: SkillGroup[];
}

// NOTE: start years for the pre-2021 roles are taken from the résumé's
// margin and are approximate — Eleanor to confirm exact ranges.
export const about: About = {
  bio: [
    "I'm a software engineer at ST Engineering with a full-stack foundation and a pull toward front-end architecture. Day to day I build responsive web applications in Svelte and TypeScript, translate Figma into pixel-accurate, accessible interfaces, and work closely with UI/UX designers.",
    "I started in security and data — IT controls audits at Ernst & Young, then a security developer role building tooling against information leakage — before moving into full-stack product work on aviation systems for the Civil Aviation Authority of Singapore and Changi Airport Group. Along the way the frontend is consistently the part I reach for.",
    "What I care about: understanding users and their operational context before building, keeping interfaces simple and consistent for people who aren't necessarily tech-savvy, and writing components that stay maintainable and reusable rather than merely functional.",
  ],
  experience: [
    {
      org: "ST Engineering — Aviation Business Unit",
      title: "Software Engineer",
      years: "2021 – Present",
      points: [
        "End-to-end work on SIRMS for the Civil Aviation Authority of Singapore — feature development, production support, infrastructure, database administration — and now leading the frontend of the Version 2 revamp onto Svelte, TypeScript and PostgreSQL.",
        "Frontend delivery on CPOS for Changi Airport Group — translating Figma into responsive, reusable Svelte components and integrating APIs in an Agile team.",
        "Improved SIRMS performance by roughly 85% through profiling and optimisation; managed MSSQL availability-group clusters and overnight production releases.",
        "Guided junior engineers and helped set up infrastructure — databases, servers, load balancers, networking.",
      ],
    },
    {
      org: "Infotect Security",
      title: "Security Developer",
      years: "≈ 2020 – 2021",
      points: [
        "Built software to prevent information leakage and system defacement.",
        "Applied secure-coding practices and contributed to internal security tooling.",
      ],
    },
    {
      org: "GroupStar",
      title: "Mobile Developer Intern",
      years: "≈ 2018",
      points: [
        "Developed and maintained Android application features, fixed bugs, and shipped updates to the Google Play Store.",
      ],
    },
    {
      org: "Ernst & Young",
      title: "Data & Risk Analysis Intern",
      years: "≈ 2017",
      points: [
        "Conducted IT General Controls audits for clients.",
        "Built SQL and Tableau visualisations for risk-analysis reporting.",
      ],
    },
  ],
  education: [
    {
      qualification: "BSc Computer Science (Digital Systems Security)",
      institution:
        "Singapore Institute of Management – University of Wollongong",
      years: "2018 – 2020",
    },
    {
      qualification: "Diploma in Information Technology",
      institution: "Nanyang Polytechnic",
      years: "2015 – 2018",
    },
  ],
  skills: [
    {
      label: "Frontend",
      items: [
        "Svelte",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "AngularJS",
        "jQuery",
      ],
    },
    {
      label: "Backend & data",
      items: [
        "Node.js",
        "TypeORM",
        "PostgreSQL",
        "Microsoft SQL Server",
        "MySQL",
        "Java",
        "C#",
      ],
    },
    {
      label: "Tooling",
      items: [
        "Figma",
        "Git / GitLab",
        "JIRA",
        "Docker",
        "AWS",
        "CI/CD",
        "Linux",
      ],
    },
    {
      label: "Design & media",
      items: ["Adobe Photoshop", "Adobe XD", "After Effects", "Premiere Pro"],
    },
  ],
};
