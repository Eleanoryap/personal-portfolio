# personal-portfolio

Personal portfolio site. Static foundation — no animation, scroll effects, or
page transitions yet.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first theme via `app/tokens.css`)
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
