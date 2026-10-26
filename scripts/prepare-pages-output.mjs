// Post-build step for the GitHub Pages artifact.
//
// The Vite/Nitro build produces the client bundle in `.output/public`; this
// script turns that directory into a publishable GitHub Pages site:
//
//   1. verifies the build actually produced the app (not an empty folder);
//   2. installs the client-only shell as `404.html`, the only fallback
//      GitHub Pages offers for URLs that do not map to a file;
//   3. adds `.nojekyll` so Pages serves the files verbatim instead of
//      running them through Jekyll;
//   4. asserts that every local asset URL respects the `/artyfam/` base path;
//   5. fails the build if a server-side secret ended up in the public output.
//
// Any failed check exits with a non-zero status so the deploy job never
// publishes a broken site.
import { readdir, readFile, writeFile, copyFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const CLIENT_DIR = process.env.PAGES_OUTPUT_DIR ?? ".output/public";
const BASE_PATH = process.env.PAGES_BASE_PATH ?? "/artyfam";
const SHELL_FILE = "pages-shell.html";

const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`[pages] ✗ ${message}`);
}

function ok(message) {
  console.log(`[pages] ✓ ${message}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// Patterns for values that must never reach a public, static bundle.
const SECRET_PATTERNS = [
  { label: "Supabase secret key (sb_secret_…)", re: /sb_secret_[A-Za-z0-9_-]{8,}/ },
  { label: "service-role JWT", re: /eyJhbGciOi[A-Za-z0-9_-]{6,}\.eyJ[A-Za-z0-9_-]{6,}\./ },
  {
    label: "assigned service-role key",
    re: /SUPABASE_SERVICE_ROLE_KEY\s*[=:]\s*["'][^"']{8,}["']/,
  },
  { label: "assigned Lovable cron secret", re: /LOVABLE_CRON_SECRET\s*[=:]\s*["'][^"']{8,}["']/ },
];

async function main() {
  console.log(`[pages] preparing ${CLIENT_DIR} for GitHub Pages (base ${BASE_PATH})`);

  if (!(await exists(CLIENT_DIR))) {
    fail(`client output directory ${CLIENT_DIR} does not exist`);
    report();
    return;
  }

  const indexPath = join(CLIENT_DIR, "index.html");
  if (!(await exists(indexPath))) {
    fail("index.html is missing — the build did not produce a pre-rendered home page");
  } else {
    const html = await readFile(indexPath, "utf8");
    if (!/<script[^>]+src=/.test(html)) {
      fail(
        "index.html contains no client bundle reference — this does not look like the ARTYFAM app",
      );
    } else if (!html.includes(`${BASE_PATH}/assets/`)) {
      fail(
        `index.html does not reference assets under ${BASE_PATH}/assets/ — the base path is not applied`,
      );
    } else {
      ok("index.html is the pre-rendered app and references assets under the base path");
    }
  }

  // 404 fallback ------------------------------------------------------------
  const shellPath = join(CLIENT_DIR, SHELL_FILE);
  if (!(await exists(shellPath))) {
    fail(`${SHELL_FILE} is missing — no client-only shell to use as the 404 fallback`);
  } else {
    const shell = await readFile(shellPath, "utf8");
    if (!/<script[^>]+src=/.test(shell) || !shell.includes(`${BASE_PATH}/assets/`)) {
      fail(`${SHELL_FILE} does not look like a client-only shell for ${BASE_PATH}`);
    } else {
      await copyFile(shellPath, join(CLIENT_DIR, "404.html"));
      ok("404.html fallback installed from the client-only shell");
    }
  }

  // Jekyll -------------------------------------------------------------------
  await writeFile(join(CLIENT_DIR, ".nojekyll"), "", "utf8");
  ok(".nojekyll written (Pages serves the files verbatim)");

  // Base path ---------------------------------------------------------------
  const files = await walk(CLIENT_DIR);
  let checked = 0;
  for (const file of files) {
    if (!/\.(html|js|css|json|txt|xml)$/i.test(file)) continue;
    const content = await readFile(file, "utf8");
    const rel = relative(CLIENT_DIR, file);

    if (/\.(html|js|css)$/i.test(file)) {
      // Root-relative asset URLs must carry the base path.
      const bad = content.match(/(?:src|href)=["']\/(?!artyfam\/)(?!\/)[^"']*["']/g);
      if (bad) {
        const unique = [...new Set(bad)].slice(0, 3).join(", ");
        fail(`${rel} references root-relative URLs outside the base path: ${unique}`);
      }
    }

    for (const { label, re } of SECRET_PATTERNS) {
      if (re.test(content)) {
        fail(`${rel} contains a ${label} — server credentials must never be published`);
      }
    }
    checked += 1;
  }
  ok(`scanned ${checked} published files for base-path and secret leaks`);

  report();
}

function report() {
  if (failures.length) {
    console.error(`\n[pages] ✗ ${failures.length} check(s) failed — refusing to publish.`);
    process.exit(1);
  }
  console.log("\n[pages] ✓ GitHub Pages output is ready.");
}

await main();
