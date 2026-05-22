// Generates public/sitemap.xml. Runs via predev / prebuild hooks.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.planb-concept.com";
const LANGS = ["en", "fr", "nl", "de", "sv", "da", "no", "ru"] as const;
// Single-page app: /about, /services, /area, /contact all render the same Index
// component (anchor sections) and canonicalize to "/", so only distinct URLs are listed.
const ROUTES = ["/", "/questionnaire"];
const today = new Date().toISOString().split("T")[0];

const urls = ROUTES.map((path) => {
  const loc = `${BASE_URL}${path}`;
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc}" />`
  ).join("\n");
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>${path === "/" ? "1.0" : "0.8"}</priority>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
    `  </url>`,
  ].join("\n");
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${ROUTES.length} routes × ${LANGS.length} languages)`);
