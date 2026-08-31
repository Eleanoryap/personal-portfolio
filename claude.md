This is Eleanor's personal portfolio.

Goal:
Position Eleanor as a Frontend Engineer
with a strong UI/UX mindset.

Tech:
Next.js (App Router)
React
TypeScript
Tailwind CSS (v4, CSS-first theme)
ESLint + Prettier

Architecture:

- Design tokens live in app/tokens.css and feed Tailwind's @theme.
  Components reference token-backed utilities (bg-sky, text-ink, ...)
  or var(--color-*) — never a raw hex or font family name.
- Fonts load via next/font in app/layout.tsx and expose
  --font-*-src variables that tokens.css maps to --font-display/body/mono.
- All copy lives in typed data files under content/, never inline in JSX:
  content/site.ts, content/projects.ts, content/sideProjects.ts.
- Routes: / (homepage, one continuous scrolling document),
  /work/[slug] (case study rendered from content/projects.ts).

Principles:

- Accessible
- Responsive
- Semantic HTML
- Reusable components
- Avoid unnecessary dependencies
- Don't over-engineer
- Don't change established design decisions
- Keep components maintainable
