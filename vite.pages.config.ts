// Static build for GitHub Pages.
//
// `vite.config.ts` (the default build) keeps producing the Nitro/Cloudflare
// server bundle used by Lovable Cloud. This config builds the *same* app as a
// static site for the GitHub Pages project site, which is served from
// https://elyessbouhlel2021-byte.github.io/artyfam/ and therefore needs:
//
//   - a public base of `/artyfam/`, so every asset URL (JS, CSS, fonts, images)
//     resolves under the sub-path, plus the matching router basepath so the
//     client router keeps matching `/artyfam/...` URLs;
//   - the storefront pre-rendered to plain HTML. The whole catalog is mock
//     data, so no server runtime is needed at request time;
//   - a client-only shell, used as the `404.html` fallback. GitHub Pages has
//     no rewrite rules: it can only serve files that exist, and serves the
//     site's `404.html` for anything it cannot resolve. The shell boots the
//     router client-side, which is what makes deep links such as
//     `/artyfam/admin/login` work on refresh.
//
// Everything privileged stays on the server runtime: `checkAdminAccess` and
// the Supabase service-role client are never part of the published output.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/** Public sub-path of the GitHub Pages project site. */
const BASE_PATH = "/artyfam";

/** Strip the base path and the query/hash from a prerender page path. */
function routePathOf(path: string): string {
  const [pathname = ""] = path.split(/[?#]/);
  const clean = pathname.replace(/\/+$/, "");
  const withoutBase =
    clean === BASE_PATH
      ? ""
      : clean.startsWith(`${BASE_PATH}/`)
        ? clean.slice(BASE_PATH.length)
        : clean;
  return withoutBase || "/";
}

export default defineConfig({
  vite: {
    base: `${BASE_PATH}/`,
  },
  tanstackStart: {
    router: { basepath: BASE_PATH },
    prerender: {
      enabled: true,
      // Follow the links found in the pre-rendered HTML so that every
      // product and category page is part of the static output too.
      crawlLinks: true,
      autoSubfolderIndex: true,
      // A broken route must fail the build instead of silently shipping a
      // half-static site.
      failOnError: true,
      retryCount: 2,
      filter: (page: { path: string }) => {
        // Query-string variants (e.g. `/shop?promo=true`) would be written to
        // the very same document as their canonical route and would silently
        // replace it. Only the shell marker is allowed to carry a query.
        const [, search] = page.path.split(/[?#]/);
        if (search && !search.includes("__shell=1")) return false;
        // `/admin` is session-dependent and gated by a server function, so it
        // is not published as a static document. Opening it falls back to
        // 404.html, the client router takes over and redirects to the login
        // page — exactly like it does without a session.
        if (routePathOf(page.path) === "/admin") return false;
        return true;
      },
    },
    pages: [
      { path: "/" },
      { path: "/shop" },
      { path: "/search" },
      { path: "/cart" },
      { path: "/checkout" },
      { path: "/contact" },
      { path: "/faq" },
      { path: "/shipping" },
      { path: "/returns" },
      { path: "/privacy" },
      { path: "/terms" },
      // The admin entry points are pure browser-side Supabase calls, so they
      // work on a static host. `/admin` itself is deliberately absent: it is
      // gated by a server function and stays on the server deployment.
      { path: "/admin/login" },
      { path: "/admin/forgot-password" },
      { path: "/admin/reset-password" },
    ],
    spa: {
      enabled: true,
      // Path requested from the preview server to obtain the client-only
      // shell. It has to resolve to a real route (otherwise the server
      // answers 404 and the prerender fails), so the home route is reused
      // with a marker query string; the shell itself only renders the root
      // route, without any page content.
      // `scripts/prepare-pages-output.mjs` copies the result to `404.html`.
      maskPath: "/?__shell=1",
      prerender: { outputPath: "/pages-shell" },
    },
  },
});
