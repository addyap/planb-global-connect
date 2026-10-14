# Plan B Concept — planb-concept.com

Bilingual EN/FR project management & construction advisory on the French Riviera.

This is a Vite + React + React Router + i18next single-page app, deployed on Vercel.

---

## ⚠️ Maintenance note: meta tags live in TWO places

Per-route head metadata (`<title>`, meta description, canonical URL, Open Graph, Twitter, JSON-LD) is defined in **two** files that must be kept in sync:

1. **`src/components/SEO.tsx`** — runtime injection. Receives `title`/`description`/`path`/`jsonLd` props from each route component (`src/pages/*.tsx`) and updates `document.head` after hydration. This is what JS-executing crawlers (Google) and the browser tab see on SPA navigations.
2. **`scripts/prerender-routes.ts`** — build-time static HTML. Writes a pre-baked `<head>` into `dist/<route>/index.html` for each of the 5 routes. This is what non-JS social-preview crawlers (LinkedIn, Slack, Facebook, Twitter) see on first byte.

**Any change to a route's title, description, canonical, og:* or JSON-LD must be made in BOTH places**, otherwise crawlers and the live page will show different text.

Routes currently prerendered:

| Route                            | Lang | Defined in (runtime)                        | Defined in (build-time)            |
| -------------------------------- | ---- | ------------------------------------------- | ---------------------------------- |
| `/`                              | en   | `src/pages/Index.tsx`                       | `scripts/prerender-routes.ts`      |
| `/questionnaire`                 | en   | `src/pages/QuestionnairePage.tsx`           | `scripts/prerender-routes.ts`      |
| `/mentions-legales`              | fr   | `src/pages/MentionsLegales.tsx`             | `scripts/prerender-routes.ts`      |
| `/politique-de-confidentialite`  | fr   | `src/pages/PolitiqueConfidentialite.tsx`    | `scripts/prerender-routes.ts`      |
| `/cgu`                           | fr   | `src/pages/CGU.tsx`                         | `scripts/prerender-routes.ts`      |

The base static `<head>` (sitewide Organization / WebSite / ProfessionalService JSON-LD, favicons, fonts preconnect, hero image preload) lives in `index.html` and is inherited by all 5 prerendered files.

---

## Build & deploy

- `bun run dev` — local dev (Vite).
- `bun run build` — production build. Runs `prebuild` (sitemap), `vite build`, then `postbuild` (per-route prerender + sanity check).
- `dist/` is what Vercel deploys. `vercel.json` at the repo root supplies the SPA fallback rewrite (`(.*) → /index.html`, excluding `/api/`) for unknown paths.

## Notable conventions

- All 8 UI languages auto-detect from the visitor's browser; English is the canonical indexed language for meta tags.
- All locales except EN are lazy-loaded via `i18next-resources-to-backend` (see `src/i18n/index.ts`).
- Route-level code splitting via `React.lazy()` in `src/App.tsx`; the homepage import stays synchronous.
- Form submissions (contact + questionnaire) `POST` to the `api/submit.ts` Vercel Function — there is no database. It checks the request comes from the site's own origin, the honeypot/fill-time trap, email format and a per-IP rate limit (no CAPTCHA, by choice), then sends two emails via Resend: the full submission to Anthony (always in French, every field listed, blanks marked « Non renseigné », answers translated to French) and a confirmation to the visitor in the language they used. The email is the only record. Templates are in `api/_lib/emails.ts`; field labels and options come from `src/i18n/locales`, so the emails follow any form change automatically. `middleware.ts` and the `vercel.json` rewrite both skip `/api/`.
- Vercel environment variables: `RESEND_API_KEY` (server only — never in client code). Optional: `RESEND_FROM` (a sender on a Resend-verified domain; without it Resend's sandbox sender only delivers to the Resend account owner's address) `NOTIFY_TO`, and `ALLOWED_ORIGINS` (extra origins allowed to post, e.g. a preview URL).
- `/api/*` isn't served by `bun run dev` (plain Vite); use `vercel dev` to test the forms locally.
