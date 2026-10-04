# Personal Portfolio

Next.js App Router project using React 19, TypeScript, and Tailwind CSS 4. Live at https://rafiulpaceprojects.github.io/websitepersonal/.

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

## Deploying

Every push to `main` runs `.github/workflows/pages.yml`, which builds a static export and publishes it to GitHub Pages in about two minutes.

The Pages build sets `GITHUB_PAGES=true`, which turns on `output: "export"`, serves the site under `/websitepersonal`, and ships images unoptimized (see `next.config.ts`). Local dev is unchanged.

- Reference files from `public/` through `asset()` in `lib/env.ts`, or they break under the base path.
- Static export has no server: no Server Actions, API routes or request-time image optimization.
- Keys never go in the repo. `.env.example` lists names with empty values; real values live in an ignored `.env.local`.

To try the Pages build locally (stop `npm run dev` first):

```bash
GITHUB_PAGES=true npm run build
mkdir -p /tmp/site && rm -rf /tmp/site/websitepersonal && cp -R out /tmp/site/websitepersonal
cd /tmp/site && python3 -m http.server 4173   # open http://localhost:4173/websitepersonal/
```
