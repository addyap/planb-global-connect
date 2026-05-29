/**
 * Postbuild sanity check.
 *
 * Verifies:
 *   1. dist/index.html exists (SPA entry point built correctly).
 *   2. vercel.json is present at the repo root (Vercel reads it from
 *      the repo root, NOT from dist/, so it must be version-controlled
 *      at the project root — never moved into dist/).
 *
 * Exits non-zero on failure so CI/the deploy aborts before shipping
 * a broken build.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const checks: { path: string; label: string }[] = [
  { path: resolve(root, "dist/index.html"), label: "dist/index.html" },
  { path: resolve(root, "vercel.json"), label: "vercel.json (repo root)" },
];

let failed = false;
for (const { path, label } of checks) {
  if (existsSync(path)) {
    console.log(`✓ ${label}`);
  } else {
    console.error(`✗ MISSING: ${label}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nPostbuild check failed. Aborting.");
  process.exit(1);
}
console.log("\nPostbuild check passed.");
