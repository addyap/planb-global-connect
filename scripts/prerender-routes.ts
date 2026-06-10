/**
 * Static per-route head prerendering (postbuild).
 *
 * What this does:
 *   Generates a dedicated HTML file for each app route so that non-JS crawlers
 *   (LinkedIn, Slack, Facebook, Twitter) see the correct per-route <title>,
 *   meta description, canonical, og:*, twitter:*, JSON-LD and <html lang>
 *   on first byte — without needing to execute JavaScript.
 *
 * What this does NOT do:
 *   It does NOT prerender body markup (no React SSR). Each generated file
 *   still ships `<div id="root"></div>` and React hydrates on the client.
 *   Google (which executes JS) sees the same correct head whether served
 *   the pre-baked file directly or after SPA navigation; the static file
 *   just gives social-preview crawlers a working response.
 *
 * Why this approach:
 *   Full body SSR with this stack (React Router v6 BrowserRouter + i18next
 *   + framer-motion + React.lazy route splitting) requires significant
 *   refactoring (data router, react-helmet-async, SSR entry, hydration
 *   safety) — high risk for a marginal gain on the stated goal of "head
 *   tags readable by non-JS crawlers". Head-only static generation hits
 *   the goal with zero React code changes and zero hydration risk.
 *
 * On the deployed site:
 *   Vercel serves dist/<route>/index.html when it exists, otherwise falls
 *   through to the `(.*) -> /index.html` rewrite in vercel.json. So:
 *     /questionnaire             -> dist/questionnaire/index.html         (this script)
 *     /cgu                       -> dist/cgu/index.html                   (this script)
 *     /mentions-legales          -> dist/mentions-legales/index.html      (this script)
 *     /politique-de-confidentialite -> dist/politique-de-confidentialite/index.html
 *     /                          -> dist/index.html                       (Vite + head patched here)
 *     /anything-else             -> dist/index.html (SPA fallback, React renders <NotFound>)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SITE = "https://www.planb-concept.com";
const DIST = resolve(process.cwd(), "dist");

type RouteMeta = {
  path: string; // route path, e.g. "/questionnaire"
  outDir: string; // dir under dist/ where index.html is written ("" for root)
  lang: "en" | "fr"; // <html lang>
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** If true, add robots noindex (e.g. 404, though 404 is the SPA fallback so not needed here). */
  noindex?: boolean;
};

// English is the canonical indexed language for all routes. Legal pages are
// French-content only — their <html lang> reflects the page language, but the
// rest of the head meta stays in French as authored in the components.
const ROUTES: RouteMeta[] = [
  {
    path: "/",
    outDir: "",
    lang: "en",
    title: "Project Management Côte d'Azur | Plan B Concept",
    description:
      "30+ years of on-the-ground experience. Fully bilingual English & French. Trusted guidance from first sketch to final handover.",
    // Homepage JSON-LD graph already lives in index.html — don't duplicate it here.
  },
  {
    path: "/questionnaire",
    outDir: "questionnaire",
    lang: "en",
    title: "Project Brief Questionnaire | Plan B Concept — Côte d'Azur",
    description:
      "Share the details of your renovation, construction or property project on the French Riviera. Anthony Gratton will review your brief and reply in English or French.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Project questionnaire",
          item: `${SITE}/questionnaire`,
        },
      ],
    },
  },
  {
    path: "/mentions-legales",
    outDir: "mentions-legales",
    lang: "fr",
    title: "Mentions légales — Plan B Concept",
    description:
      "Mentions légales du site planb-concept.com, édité par Plan B Concept.",
  },
  {
    path: "/politique-de-confidentialite",
    outDir: "politique-de-confidentialite",
    lang: "fr",
    title: "Politique de confidentialité — Plan B Concept",
    description:
      "Politique de confidentialité et traitement des données personnelles sur planb-concept.com.",
  },
  {
    path: "/cgu",
    outDir: "cgu",
    lang: "fr",
    title: "Conditions Générales d'Utilisation — Plan B Concept",
    description: "Conditions Générales d'Utilisation du site planb-concept.com.",
  },
];

const OG_IMAGE = `${SITE}/og-image.png`;

// Markers so we can locate-and-replace existing tags rather than blindly
// appending duplicates. We rewrite by regex on the static index.html template.
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const templatePath = resolve(DIST, "index.html");
const template = readFileSync(templatePath, "utf8");

function patchHead(html: string, route: RouteMeta): string {
  const url = `${SITE}${route.path}`;
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  const ogImage = escapeHtml(OG_IMAGE);
  const robots = route.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  let out = html;

  // <html lang="..."> — preserve any other attributes.
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${route.lang}"`);

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // <meta name="description">
  out = out.replace(
    /<meta\s+name="description"[^>]*\/?>/i,
    `<meta name="description" content="${desc}" />`
  );

  // <meta name="robots">
  out = out.replace(
    /<meta\s+name="robots"[^>]*\/?>/i,
    `<meta name="robots" content="${robots}" />`
  );

  // Open Graph — replace title/description/url. Leave og:locale + alternates
  // and og:image as already set in index.html (en_GB is canonical site-wide).
  out = out.replace(
    /<meta\s+property="og:title"[^>]*\/?>/i,
    `<meta property="og:title" content="${title}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"[^>]*\/?>/i,
    `<meta property="og:description" content="${desc}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"[^>]*\/?>/i,
    `<meta property="og:url" content="${url}" />`
  );

  // Twitter
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*\/?>/i,
    `<meta name="twitter:description" content="${desc}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:image"[^>]*\/?>/i,
    `<meta name="twitter:image" content="${ogImage}" />`
  );

  // Canonical — index.html intentionally ships without one (SEO.tsx injects
  // client-side). Inject the route-specific canonical before </head>.
  const canonical = `<link rel="canonical" href="${url}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(out)) {
    out = out.replace(/<link\s+rel="canonical"[^>]*>/i, canonical);
  } else {
    out = out.replace(/<\/head>/i, `    ${canonical}\n  </head>`);
  }

  // Per-route JSON-LD — append a second <script type="application/ld+json">
  // so the existing Organization graph in index.html stays intact.
  if (route.jsonLd) {
    const json = JSON.stringify(route.jsonLd);
    const scriptTag = `<script type="application/ld+json" data-route-jsonld>${json}</script>`;
    out = out.replace(/<\/head>/i, `    ${scriptTag}\n  </head>`);
  }

  return out;
}

let wrote = 0;
for (const route of ROUTES) {
  const html = patchHead(template, route);
  const outFile =
    route.outDir === ""
      ? resolve(DIST, "index.html")
      : resolve(DIST, route.outDir, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html, "utf8");
  console.log(`✓ prerendered ${route.path} -> ${outFile.replace(DIST + "/", "dist/")}`);
  wrote++;
}

console.log(`\nPrerender complete: ${wrote} routes baked.`);
