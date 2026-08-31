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
    slug: "sirms",
    name: "SIRMS",
    client: "Civil Aviation Authority of Singapore",
    years: "2021–2025",
    methodology: "Waterfall — user workshops, design, delivery",
    stack: [
      "Svelte",
      "TypeScript",
      "PostgreSQL",
      "Node.js",
      "TypeORM",
      "SurveyJS",
    ],
    summary:
      "SIRMS, the Safety Information Reporting Management System, is a web application for the Civil Aviation Authority of Singapore that lets air traffic controllers, search-and-rescue teams, and fault reporters log incidents, open cases, and keep stakeholders informed by SMS or email. I had end-to-end involvement — feature development, production support, infrastructure, and database administration — and now lead the frontend of the Version 2 revamp, moving the stack from AngularJS, jQuery, and MSSQL onto Svelte, TypeScript, and PostgreSQL, and integrating an in-house SurveyJS-based form designer for customisable report templates.",
    decisions: [
      {
        title: "Sized the SMS panel to match its priority",
        detail:
          "Not every log sends an SMS, and the form is the real task, so I kept the SMS section deliberately compact. When a teammate felt it was too small, I held the line — the layout should keep users focused on completing the report first.",
      },
      {
        title: "Named actions for the state they act on",
        detail:
          'Buttons read "Save draft" and "Submit log" rather than a generic "Save" and "Submit", so long-serving users are never unsure which state a log is in or what a click will do. The same naming discipline carried through to pages, components, modals, and database tables and columns.',
      },
      {
        title: "Made status legible at a glance",
        detail:
          "Each case status has its own colour, and explicit indicators show whether an SMS actually sent and whether a log is included in the report — so users confirm state by looking, not by guessing.",
      },
      {
        title: "Guarded irreversible actions",
        detail:
          "Anything that could not be undone got a confirmation step, to prevent accidental actions and data loss.",
      },
      {
        title: "Used a two-column form layout where it earned its place",
        detail:
          "Single-column forms are usually easier to scan, but several report templates carry many fields and users are time-constrained, so a two-column layout cut scrolling and completion time.",
      },
      {
        title: "Matched input types to the data",
        detail:
          "A two-option field became a toggle instead of a dropdown; dropdowns are searchable and context-aware, auto-filtering by things like the user's site; conditional fields appear only when relevant; validation is immediate, with specific messages beside each field and Next/Submit disabled until required fields are filled.",
      },
      {
        title: "Framed design feedback as suggestions",
        detail:
          "Comments on designs were phrased to open a discussion rather than close it off, unless something was a firm requirement — which kept the review collaborative.",
      },
    ],
    challenges: [
      {
        title: "Balancing conflicting requirements",
        detail:
          "Several users share each role and their feedback often conflicted. Rather than building every request as-is, I worked with the BA and UI/UX designer to find the underlying pain point and standardise one solution.",
      },
      {
        title: "Adopting an unfamiliar form platform",
        detail:
          "Integrating the in-house SurveyJS-based form designer meant learning its components and understanding how far it could stretch to meet business requirements.",
      },
      {
        title: "Working within platform constraints",
        detail:
          "Some requested functionality simply was not available in the form designer. Instead of assuming it was impossible, I worked with the product team to learn the platform's real limits, explore alternatives, and flag potential enhancements.",
      },
    ],
  },
  {
    slug: "cpos",
    name: "CPOS",
    client: "Changi Airport Group",
    years: "2025",
    methodology: "Agile — iterative delivery in sprints",
    stack: [
      "Svelte",
      "TypeScript",
      "Node.js",
      "TypeORM",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Figma",
    ],
    summary:
      "CPOS is a real-time flight and ground-operations web application for Changi Airport Group, used by ground operators, gate planners, airlines, and other operational teams to monitor flights and tows moving through gates and runways. On a larger team and in an Agile setting I focused primarily on the frontend — building responsive, reusable components from Figma with close attention to spacing, typography, and interaction — while also contributing backend services in Node.js and TypeORM. It was where I picked up Svelte and TypeScript.",
    decisions: [
      {
        title: "Reconsidered the scrolling ticker tape",
        detail:
          "The Figma design had the ticker scrolling continuously, which is distracting across a long monitoring shift and raised performance and accessibility questions. I proposed alternatives that kept the intent — a slower scroll, pause-on-hover, or a paginated version instead of constant motion.",
      },
      {
        title: "Made airline visibility database-configurable",
        detail:
          "Rather than hardcoding which airline sees what, I helped build airline-based visibility driven by the database, so access and permissions can change without a code deploy.",
      },
      {
        title: "Built shared components once",
        detail:
          "Components like the multiselect dropdown were built a single time and reused across forms, so the experience stayed uniform everywhere it appeared.",
      },
      {
        title: "Proposed alternatives when a design was not feasible",
        detail:
          "A Figma design can look right but raise technical or usability issues on closer inspection. Instead of implementing it as-is, I proposed alternatives that preserved the intended feel while improving usability, and flagged inconsistent labels and page names so the app read as one product.",
      },
    ],
    challenges: [
      {
        title: "Learning a new stack while shipping",
        detail:
          "I joined a Svelte and TypeScript project with no dedicated ramp-up period and had to learn the framework and its conventions while delivering production features — working through it by reading the existing codebase, learning from teammates, and applying things immediately.",
      },
      {
        title: "Requirements that kept moving",
        detail:
          "In an Agile environment I learned to design modular, reusable components that adapted with minimal rework, and to clarify the reasoning behind a change with the BAs before building anything.",
      },
      {
        title: "Supporting a genuinely diverse user base",
        detail:
          "Ground operators, gate planners, and airline representatives each needed a different view of the same time-sensitive data — a gate change had to reflect instantly across every team — and many workflows were request-and-approval across roles, so role-based permissions had to be careful without making the workflow clunky.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
