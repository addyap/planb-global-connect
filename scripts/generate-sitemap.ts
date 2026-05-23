// Generates public/sitemap.xml. Runs via predev / prebuild hooks.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.planb-concept.com";
// Single-page app with client-side i18n: only distinct URLs are listed; no hreflang.
const ROUTES = ["/", "/questionnaire"];
const today = new Date().toISOString().split("T")[0];

const urls = ROUTES.map((path) => {
  const loc = `${BASE_URL}${path}`;
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>${path === "/" ? "1.0" : "0.8"}</priority>`,
    `  </url>`,
  ].join("\n");
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${ROUTES.length} routes)`);
