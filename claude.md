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

- Design tokens live in app/tokens.css. The site is dark by default: the
  @theme block holds the dark palette and generates the utilities; light is
  an explicit opt-in via [data-theme="light"]. Components reference
  token-backed utilities (bg-sky, text-ink, ...) or var(--color-*) — never a
  raw hex or font family name. Blueprint-specific styles (chrome, hero,
  manifesto, terminal rule, blueprint strip) live in the @layer components
  block of app/globals.css.
- Fonts load via next/font in app/layout.tsx and expose --font-*-src
  variables that tokens.css maps to --font-display/body/mono.
- Theme: an inline script in <head> stamps [data-theme] before paint
  (stored choice, else "dark"); ThemeToggle flips it and persists to
  localStorage. System prefers-color-scheme is not consulted — dark is the
  deliberate default.
- All copy lives in typed data files under content/, never inline in JSX:
  content/site.ts, content/projects.ts, content/sideProjects.ts,
  content/about.ts.
- Design direction: monospace-forward, near-monochrome with the signal
  accent used sparingly, name/metadata pinned to the viewport corners
  (a solid top bar under 40rem). Prose is Inter; labels and data are mono.
- Motion is limited and deliberate: a loading screen, the hero name
  settling from centre to corner on first scroll. All of it collapses
  under prefers-reduced-motion. No scroll-driven effects beyond that.
- Routes: / (homepage — a hero screen then one continuous scrolling
  document), /work (case-study index), /work/[slug] (case study from
  content/projects.ts), /about (from content/about.ts), plus not-found.
- Corner furniture: HomeChrome on the homepage (hero + travel), PageChrome
  everywhere else (static; CaseChrome composes it). ThemeToggle lives in
  the bottom-right slot / mobile bar.
- Key components: HomeChrome / PageChrome / CaseChrome, Section +
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
