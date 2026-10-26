# ARTYFAM

Boutique en ligne pour la Tunisie et l'Italie — React 19, Vite 8 and
[TanStack Start](https://tanstack.com/start) (file-based routing, SSR,
server functions), styled with Tailwind CSS 4.

The storefront currently runs on mock data (`src/data/catalog.ts`,
`src/data/config.ts`); the backend contract for the real data layer is
documented in [`docs/frontend-backend-contract.md`](docs/frontend-backend-contract.md).

## Development

```bash
bun install
bun run dev
```

Copy `.env.example` to `.env.local` and fill in the public Supabase values
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) if you want to exercise
the admin sign-in. The storefront itself does not need them.

> The service-role key is a **secret**: it is never committed, never exposed as
> a `VITE_` variable, and is only read by the server runtime.

## Checks

```bash
bun run lint     # eslint + prettier
bunx tsc --noEmit
bun run test     # vitest
```

## Builds

| Command | Output | Target |
| --- | --- | --- |
| `bun run build` | `.output/` (Nitro server + client) | Lovable Cloud / Cloudflare Workers — the server runtime |
| `bun run build:pages` | `.output/public/` | GitHub Pages — the static site |

Both builds compile the same application. They differ in what happens at
request time:

- **`build`** produces a Nitro server bundle. Server functions, the
  `checkAdminAccess` admin guard and the privileged Supabase client
  (`src/integrations/supabase/client.server.ts`, service role) run **on the
  server**. This is the deployment that owns `/admin`.
- **`build:pages`** produces a static site: the storefront is pre-rendered to
  plain HTML and served by GitHub Pages from
  `https://elyessbouhlel2021-byte.github.io/artyfam/`. It is configured by
  [`vite.pages.config.ts`](vite.pages.config.ts): base path `/artyfam/`, the
  matching router basepath, and the pre-rendered routes.

GitHub Pages cannot execute server functions. The static build therefore
publishes the public storefront and the three public admin entry points
(`/admin/login`, `/admin/forgot-password`, `/admin/reset-password`), which are
plain browser-side Supabase calls. `/admin` itself stays on the server
deployment: its authorization check is a server function, and the static build
fails closed (redirect to the login page) instead of exposing the dashboard.

### Static hosting details

- `scripts/prepare-pages-output.mjs` runs after the build: it verifies that the
  artifact really contains the app, installs the client-only shell as
  `404.html` (GitHub Pages has no rewrite rules and serves `404.html` for
  paths it cannot resolve), writes `.nojekyll`, and **fails the build** if a
  root-relative URL bypasses the base path or if a server credential ended up
  in the published output.
- The workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
  builds and deploys the artifact on every push to `main`.

### Required repository setting

The Pages source must be **GitHub Actions**
(*Settings → Pages → Build and deployment → Source*). While it points at the
`main` branch, GitHub publishes the repository root and renders `README.md`
as the website instead of the application.
