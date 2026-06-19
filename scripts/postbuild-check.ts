/**
 * Postbuild sanity check.
 *
 * Verifies:
 *   1. dist/index.html exists (SPA entry point built correctly).
 *   2. vercel.json is present at the repo root (Vercel reads it from
 *      the repo root, NOT from dist/, so it must be version-controlled
 *      at the project root — never moved into dist/).
 *   3. Each prerendered route's <title> contains the expected substring,
 *      so a silent regex miss in prerender-routes.ts fails the build
 *      instead of shipping wrong meta to crawlers.
 *
 * Exits non-zero on failure so CI/the deploy aborts before shipping
 * a broken build.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const existenceChecks: { path: string; label: string }[] = [
  { path: resolve(root, "dist/index.html"), label: "dist/index.html" },
  { path: resolve(root, "vercel.json"), label: "vercel.json (repo root)" },
  { path: resolve(root, "dist/questionnaire/index.html"), label: "dist/questionnaire/index.html" },
  { path: resolve(root, "dist/mentions-legales/index.html"), label: "dist/mentions-legales/index.html" },
  { path: resolve(root, "dist/politique-de-confidentialite/index.html"), label: "dist/politique-de-confidentialite/index.html" },
  { path: resolve(root, "dist/cgu/index.html"), label: "dist/cgu/index.html" },
];

// Per-route expected <title> substring. Must match exactly what
// scripts/prerender-routes.ts writes — if these diverge, the build fails.
const titleChecks: { file: string; route: string; expected: string }[] = [
  { file: "dist/index.html", route: "/", expected: "Project Management Côte d'Azur | Plan B Concept" },
  { file: "dist/questionnaire/index.html", route: "/questionnaire", expected: "Project Brief Questionnaire" },
  { file: "dist/mentions-legales/index.html", route: "/mentions-legales", expected: "Mentions légales" },
  { file: "dist/politique-de-confidentialite/index.html", route: "/politique-de-confidentialite", expected: "Politique de confidentialité" },
  { file: "dist/cgu/index.html", route: "/cgu", expected: "Conditions Générales d'Utilisation" },
];

let failed = false;

for (const { path, label } of existenceChecks) {
  if (existsSync(path)) {
    console.log(`✓ exists: ${label}`);
  } else {
    console.error(`✗ MISSING: ${label}`);
    failed = true;
  }
}

// HTML entity decode for the few entities our escape function emits.
const decode = (s: string) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

for (const { file, route, expected } of titleChecks) {
  const full = resolve(root, file);
  if (!existsSync(full)) {
    // Already reported above.
    continue;
  }
  const html = readFileSync(full, "utf8");
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) {
    console.error(`✗ TITLE MISSING in ${file} (route ${route})`);
    failed = true;
    continue;
  }
  const actual = decode(m[1]).trim();
  if (!actual.includes(expected)) {
    console.error(`✗ TITLE MISMATCH in ${file} (route ${route})`);
    console.error(`    expected substring: ${expected}`);
    console.error(`    actual title:       ${actual}`);
    failed = true;
  } else {
    console.log(`✓ title ok: ${route} → "${actual}"`);
  }
}

if (failed) {
  console.error("\nPostbuild check failed. Aborting.");
  process.exit(1);
}
console.log("\nPostbuild check passed.");
