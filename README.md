# Personal Portfolio

Next.js App Router project using React 19, TypeScript, and Tailwind CSS 4. The current homepage is the create-next-app starter; portfolio content and visual styling are still to be built.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No `.env` file or environment variables are required by the current app. Keep future secrets in an ignored `.env.local` and document variable names without values.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run lint` | Run ESLint. |
| `npm run format:check` | Check Prettier formatting. |
| `npm run test:e2e` | Run Playwright homepage checks in desktop Chromium and mobile emulation. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve a previously built app. |

## Where to make changes

- `app/page.tsx` — homepage route and page composition.
- `app/layout.tsx` — shared document metadata, fonts, and stylesheet setup.
- `app/globals.css` — global design tokens and base styles.
- `public/` — static assets served from the site root.
- `e2e/` — browser-level checks.

GSAP is installed but not used yet. shadcn/ui is initialized with a base-nova setup and local Button/Separator components. The Aceternity registry is configured for optional component installs; no Aceternity components have been added. HeroUI is not installed. See `../Website Docs/Architecture/Portfolio-Codebase-Guide.md` for file responsibilities, current gaps, and how the pieces fit together. Before changing Next.js app code, follow the instructions in `AGENTS.md` and consult the installed Next.js 16 docs.
