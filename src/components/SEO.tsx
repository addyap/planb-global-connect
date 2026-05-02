import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SITE = "https://www.planb-concept.com";

type Props = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
};

const upsertMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string, attrs: Record<string, string> = {}) => {
  const key = attrs.hreflang ? `link[rel="${rel}"][hreflang="${attrs.hreflang}"]` : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(key);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const SEO = ({ title, description, path, type = "website" }: Props) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "en";
  const url = `${SITE}${path ?? location.pathname}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");

    // Open Graph
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);

    // Twitter
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");

    // Canonical
    upsertLink("canonical", url);

    // hreflang alternates
    const langs = ["en", "fr", "nl", "de", "sv", "ru"];
    langs.forEach((l) => upsertLink("alternate", url, { hreflang: l }));
    upsertLink("alternate", url, { hreflang: "x-default" });
  }, [title, description, url, lang, type]);

  return null;
};
