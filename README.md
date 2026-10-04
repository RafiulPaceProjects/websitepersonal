# Personal Portfolio

Next.js App Router project using React 19, TypeScript, and Tailwind CSS 4. Live at https://rafiulpaceprojects.github.io/websitepersonal/.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No `.env` file or environment variables are required by the current app. Keep future secrets in an ignored `.env.local` and document variable names without values.

## Useful commands

| Command                | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run lint`         | Run ESLint.                                                              |
| `npm run format:check` | Check Prettier formatting.                                               |
| `npm run test:e2e`     | Run Playwright homepage checks in desktop Chromium and mobile emulation. |
| `npm run build`        | Create a production build.                                               |
| `npm run start`        | Serve a previously built app.                                            |

## Where to make changes

- `app/page.tsx` — homepage route and page composition.
- `app/layout.tsx` — shared document metadata, fonts, and stylesheet setup.
- `app/globals.css` — global design tokens and base styles.
- `public/` — static assets served from the site root.
- `e2e/` — browser-level checks.

GSAP drives the film arrival, loader and profile-card feedback. A small CSS float composes with its transforms and pauses while the card is hovered or pressed. Reduced motion disables both effects. shadcn/ui uses the existing base-nova setup; no new UI library is needed for these interactions. Before changing Next.js app code, follow `AGENTS.md` and consult the installed Next.js docs.

## Browser checks

`npm run test:e2e` covers the current homepage, loader symmetry, responsive photo loading, video failure, reduced motion and contact destinations. The mobile interaction suite also tests native touch press/release, swipe scrolling, cancellation, social-link taps, idle float and desktop hover. Phone, Fold, iPad and Surface viewport checks verify readable text and reachable links. These are Chromium emulation tests; physical Safari testing remains a separate check.

Run `npx playwright install chromium` once if the test browser is missing. Playwright starts the dev server automatically when needed. On failure, inspect `playwright-report/` and `test-results/`; use `npx playwright show-report` to open the report.

CI uses Next's supported `--webpack` development option: the clean Linux runner hits a Turbopack Google-font query error before the page can compile. The production build and local development keep their existing bundler settings.

## Deploying

Every push to `main` runs `.github/workflows/pages.yml`. Lint, TypeScript and the full Playwright suite must pass before the static export is built and published. Failed browser tests are uploaded as a GitHub Actions artifact for seven days.

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
