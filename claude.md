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

- Design tokens live in app/tokens.css. The @theme block holds the light
  palette and generates the utilities; dark values are re-pointed for
  prefers-color-scheme and for an explicit [data-theme]. Components
  reference token-backed utilities (bg-sky, text-ink, ...) or var(--color-*)
  — never a raw hex or font family name. Blueprint-specific styles
  (chrome, hero, manifesto, terminal rule, blueprint strip) live in the
  @layer components block of app/globals.css.
- Fonts load via next/font in app/layout.tsx and expose --font-*-src
  variables that tokens.css maps to --font-display/body/mono.
- Theme: an inline script in <head> applies the stored choice before
  paint; ThemeToggle flips [data-theme] and persists to localStorage.
- All copy lives in typed data files under content/, never inline in JSX:
  content/site.ts, content/projects.ts, content/sideProjects.ts.
- Design direction: monospace-forward, near-monochrome with the signal
  accent used sparingly, name/metadata pinned to the viewport corners
  (a solid top bar under 40rem). Prose is Inter; labels and data are mono.
- Motion is limited and deliberate: a loading screen, the hero name
  settling from centre to corner on first scroll. All of it collapses
  under prefers-reduced-motion. No scroll-driven effects beyond that.
- Routes: / (homepage — a hero screen then one continuous scrolling
  document), /work/[slug] (case study rendered from content/projects.ts).
- Key components: HomeChrome / CaseChrome (corner furniture), Section +
  SectionLabel, TerminalRule, BlueprintStrip, WorkManifest, ProjectBrief,
  MetaTable, ShortHops, ContactLinks, SignalLink.

Principles:

- Accessible
- Responsive
- Semantic HTML
- Reusable components
- Avoid unnecessary dependencies
- Don't over-engineer
- Don't change established design decisions
- Keep components maintainable
