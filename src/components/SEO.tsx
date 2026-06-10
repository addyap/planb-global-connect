import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SITE = "https://www.planb-concept.com";
const DEFAULT_OG_IMAGE = `${SITE}/og-image.png`;


// English is the canonical indexed language. Other locales are signalled as alternates only.
const OG_LOCALE = "en_GB";
const OG_LOCALE_ALTERNATES = [
  "fr_FR",
  "nl_NL",
  "de_DE",
  "sv_SE",
  "da_DK",
  "nb_NO",
  "ru_RU",
];

type Props = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const upsertMeta = (
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string
) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (
  rel: string,
  href: string,
  attrs: Record<string, string> = {}
) => {
  const key = attrs.hreflang
    ? `link[rel="${rel}"][hreflang="${attrs.hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(key);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const JSONLD_ID = "seo-jsonld";

export const SEO = ({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
}: Props) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "en";
  const url = `${SITE}${path ?? location.pathname}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1"
    );

    // Open Graph
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Plan B Concept");
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", OG_LOCALES[lang] ?? "en_GB");

    // Twitter
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    // Canonical
    upsertLink("canonical", url);

    // hreflang intentionally omitted: site is English-only at a single URL.
    // Remove any previously-injected alternate tags (e.g. from earlier builds).
    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());

    // JSON-LD per route
    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSONLD_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, url, lang, type, image, noindex, jsonLd]);

  return null;
};
