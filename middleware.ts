// Vercel Edge Middleware.
// The SPA rewrite in vercel.json serves index.html (HTTP 200) for every
// unmatched path so client-side routing can take over. React Router then
// renders NotFound.tsx with a noindex tag — but a raw-HTML reader (some
// bots, social-preview crawlers) never runs that JS, so it sees a fully
// indexable homepage clone at a broken URL. This middleware gives those
// readers an honest 404 status while still returning real HTML for the
// client to hydrate and route normally.

const KNOWN_ROUTES = new Set([
  "/",
  "/questionnaire",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/cgu",
]);

const HAS_FILE_EXTENSION = /\.[a-zA-Z0-9]+$/;

export const config = {
  matcher: "/:path*",
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  if (KNOWN_ROUTES.has(pathname) || HAS_FILE_EXTENSION.test(pathname)) {
    return;
  }

  const homepage = await fetch(new URL("/", request.url));
  return new Response(homepage.body, {
    status: 404,
    headers: homepage.headers,
  });
}
