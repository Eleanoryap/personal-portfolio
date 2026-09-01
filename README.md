# personal-portfolio

Eleanor Yap's personal portfolio. Monospace-forward, near-monochrome,
dark by default with a light toggle, and viewport-corner furniture.
Content is static and server-rendered; the only motion is the loading
screen and the hero name settling into the corner on first scroll (both
disabled under `prefers-reduced-motion`).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first theme via `app/tokens.css`, light + dark)
- ESLint + Prettier

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script                 | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server             |
| `npm run build`        | Production build                 |
| `npm run start`        | Serve the production build       |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Format with Prettier             |
| `npm run format:check` | Check formatting without writing |

## Layout

- `app/` — routes, root layout, global styles, design tokens
- `components/` — reusable presentational components
- `content/` — typed content layer (all copy lives here, never inline in JSX)
