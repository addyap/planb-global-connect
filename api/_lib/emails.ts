// Builds the two emails sent for every form submission:
//   - buildOwnerEmail:   the notification to Anthony, always in French, listing every field
//                        (empty ones marked "Non renseigné") with answers translated to French.
//   - buildVisitorEmail: the confirmation to the visitor, in the language they used on the site.
// Field labels and option lists come from the site's locale files so the emails always match
// the form. Imports use .js extensions because Vercel runs these files as native ES modules.

import { CONTACT } from "../../src/lib/contact.js";
import en from "../../src/i18n/locales/en.js";
import fr from "../../src/i18n/locales/fr.js";
import nl from "../../src/i18n/locales/nl.js";
import de from "../../src/i18n/locales/de.js";
import sv from "../../src/i18n/locales/sv.js";
import da from "../../src/i18n/locales/da.js";
import no from "../../src/i18n/locales/no.js";
import ru from "../../src/i18n/locales/ru.js";
import { CONFIRMATION_COPY, LANGUAGE_NAMES_FR } from "./email-copy.js";

type Locale = typeof en;

const LOCALES: Record<string, Locale> = { en, fr, nl, de, sv, da, no, ru } as Record<string, Locale>;

export const SUPPORTED_LANGS = Object.keys(LOCALES);

const SITE_URL = "https://www.planb-concept.com";
const LOGO_URL = `${SITE_URL}/apple-touch-icon.png`;
const PRIVACY_URL = `${SITE_URL}/politique-de-confidentialite`;

const C = {
  ink: "#1d0c0c",
  burgundy: "#280b0b",
  gold: "#e7be40",
  terracotta: "#96362c",
  muted: "#f5f2f0",
  border: "#e5e0dc",
  label: "#7a6a66",
  faint: "#a39893",
  headerSub: "#cdbdb0",
  ok: "#1f7a4d",
  okBg: "#e8f4ec",
  warn: "#8a5a00",
  warnBg: "#fcf1d6",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export type FormType = "contact" | "questionnaire";

export type Submission = {
  formType: FormType;
  lang: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  answers: Record<string, unknown>;
  userAgent: string | null;
  receivedAt: Date;
};

export type BuiltEmail = { subject: string; html: string; text: string };

// ---------- field model ----------

type QuestionnaireKey = keyof Locale["questionnaire"]["fields"];

const OPTION_LISTS: Partial<Record<QuestionnaireKey, keyof Locale["questionnaire"]>> = {
  projectType: "projectTypeOptions",
  propertyStatus: "propertyStatusOptions",
  budget: "budgetOptions",
  timeline: "timelineOptions",
  siteVisit: "siteVisitOptions",
  services: "serviceOptions",
};

const QUESTIONNAIRE_SECTIONS: { fr: string; keys: QuestionnaireKey[] }[] = [
  { fr: "Coordonnées", keys: ["fullName", "email", "phone"] },
  {
    fr: "Le projet",
    keys: ["projectLocation", "projectType", "propertyStatus", "budget", "timeline", "siteVisit"],
  },
  { fr: "Accompagnement recherché", keys: ["services"] },
  { fr: "Description du projet", keys: ["brief"] },
];

type ContactKey = "name" | "email" | "phone" | "message";
const CONTACT_SECTIONS: { fr: string; keys: ContactKey[] }[] = [
  { fr: "Coordonnées", keys: ["name", "email", "phone"] },
  { fr: "Message", keys: ["message"] },
];

const LONG_FIELDS = new Set<string>(["brief", "message"]);

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown) =>
  (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []).map(str).filter(Boolean);

const isFilled = (v: unknown) => (Array.isArray(v) ? list(v).length > 0 : str(v) !== "");

function questionnaireValue(s: Submission, key: QuestionnaireKey): unknown {
  // Core identity fields are sent top-level by the form; prefer them, fall back to the answers.
  if (key === "fullName") return s.name || s.answers.fullName;
  if (key === "email") return s.email || s.answers.email;
  if (key === "phone") return s.phone || s.answers.phone;
  if (key === "brief") return s.message || s.answers.brief;
  return s.answers[key];
}

// The visitor confirmation goes to whatever address was typed into the form, so anything it
// echoes back could be used to send spam from our domain (a scripted POST with a victim's
// address and a link in the name or message). It therefore never repeats free text, only
// answers that match one of the form's own options, and a name that doesn't look like a link.
const FREE_TEXT_FIELDS = new Set<string>(["brief", "message", "projectLocation"]);
const LINK_LIKE = /:\/\/|www\.|\S\.[a-z]{2,}/i;

function safeVisitorName(name: string): string {
  const n = name.trim();
  return n && n.length <= 60 && !LINK_LIKE.test(n) ? n : "";
}

function isKnownOption(lang: string, key: QuestionnaireKey, value: string): boolean {
  const listKey = OPTION_LISTS[key];
  if (!listKey) return false;
  const options = LOCALES[lang]?.questionnaire[listKey] as unknown as string[] | undefined;
  return !!options?.includes(value);
}

function contactValue(s: Submission, key: ContactKey): string {
  return { name: s.name, email: s.email, phone: s.phone, message: s.message }[key];
}

/** Maps an option chosen in the visitor's language to the same option in the target language. */
function translateOption(fromLang: string, toLang: string, key: QuestionnaireKey, value: string): string {
  const listKey = OPTION_LISTS[key];
  if (!listKey) return value;
  const from = LOCALES[fromLang]?.questionnaire[listKey] as unknown as string[] | undefined;
  const to = LOCALES[toLang]?.questionnaire[listKey] as unknown as string[] | undefined;
  const i = from?.indexOf(value) ?? -1;
  return i >= 0 && to?.[i] ? to[i] : value;
}

// ---------- html helpers ----------

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const multiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

const empty = (label: string) =>
  `<span style="color:${C.faint};font-style:italic;">${esc(label)}</span>`;

const link = (href: string, text: string) =>
  `<a href="${esc(href)}" style="color:${C.terracotta};text-decoration:underline;">${esc(text)}</a>`;

const goldLink = (href: string, text: string) =>
  `<a href="${esc(href)}" style="color:${C.gold};text-decoration:underline;">${esc(text)}</a>`;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** wa.me needs an international number; accept +XX / 00XX, and assume France for 0X XX XX XX XX. */
function whatsappDigits(phone: string): string | null {
  const compact = phone.replace(/[^\d+]/g, "");
  if (compact.startsWith("+")) return compact.slice(1) || null;
  if (compact.startsWith("00")) return compact.slice(2) || null;
  if (/^0[1-9]\d{8}$/.test(compact)) return `33${compact.slice(1)}`;
  return null;
}

function button(href: string, label: string, primary = true) {
  const style = primary
    ? `background:${C.burgundy};color:${C.gold};border:1px solid ${C.burgundy};`
    : `background:#ffffff;color:${C.burgundy};border:1px solid ${C.border};`;
  return (
    `<a href="${esc(href)}" style="display:inline-block;${style}padding:11px 18px;border-radius:8px;` +
    `font-family:${FONT};font-size:14px;font-weight:600;line-height:1;text-decoration:none;margin:0 8px 8px 0;">${esc(label)}</a>`
  );
}

function sectionTitle(title: string) {
  return (
    `<h2 style="margin:32px 0 4px;padding:0 0 8px;border-bottom:1px solid ${C.border};font-family:${FONT};` +
    `font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.terracotta};">${esc(title)}</h2>`
  );
}

function rowsTable(rows: { label: string; html: string }[]) {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">` +
    rows
      .map(
        (r, i) =>
          `<tr><td valign="top" style="width:38%;padding:10px 12px 10px 0;${i ? `border-top:1px solid ${C.muted};` : ""}` +
          `font-family:${FONT};font-size:13px;line-height:20px;color:${C.label};">${esc(r.label)}</td>` +
          `<td valign="top" style="padding:10px 0;${i ? `border-top:1px solid ${C.muted};` : ""}` +
          `font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${r.html}</td></tr>`,
      )
      .join("") +
    `</table>`
  );
}

function longBlock(html: string) {
  return (
    `<div style="margin-top:12px;padding:16px 18px;background:${C.muted};border-left:3px solid ${C.gold};` +
    `border-radius:0 8px 8px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.ink};">${html}</div>`
  );
}

function layout(opts: { lang: string; title: string; preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="${esc(opts.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.muted};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.muted}" style="background:${C.muted};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${C.border};border-radius:14px;overflow:hidden;">
<tr><td bgcolor="${C.burgundy}" style="background:${C.burgundy};padding:24px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="padding-right:16px;"><img src="${LOGO_URL}" width="56" height="56" alt="Plan B" style="display:block;border:0;border-radius:8px;"></td>
<td valign="middle">
<div style="font-family:${FONT};font-size:18px;font-weight:800;letter-spacing:4px;color:${C.gold};">PLAN B CONCEPT</div>
<div style="margin-top:4px;font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.headerSub};">Maîtrise d'œuvre · Côte d'Azur</div>
</td></tr></table>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:${C.gold};">&nbsp;</td></tr>
<tr><td style="padding:36px 32px 36px;">${opts.body}</td></tr>
<tr><td bgcolor="${C.burgundy}" style="background:${C.burgundy};padding:24px 32px;font-family:${FONT};font-size:12px;line-height:19px;color:${C.headerSub};">${opts.footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function heading(eyebrow: string, title: string) {
  return (
    `<div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.terracotta};">${esc(eyebrow)}</div>` +
    `<h1 style="margin:8px 0 0;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;color:${C.ink};">${esc(title)}</h1>`
  );
}

// ---------- notification to Anthony (French) ----------

export function buildOwnerEmail(s: Submission): BuiltEmail {
  const NR = "Non renseigné";
  const frLocale = LOCALES.fr;
  const isQ = s.formType === "questionnaire";
  const name = s.name || "Visiteur sans nom";
  const receivedAt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(s.receivedAt);
  const langName = LANGUAGE_NAMES_FR[s.lang] ?? s.lang;

  let filled = 0;
  let total = 0;
  const htmlSections: string[] = [];
  const textSections: string[] = [];

  const sections = isQ ? QUESTIONNAIRE_SECTIONS : CONTACT_SECTIONS;
  for (const section of sections) {
    const rows: { label: string; html: string }[] = [];
    const textRows: string[] = [];
    let extra = "";

    for (const key of section.keys) {
      total++;
      const label = isQ
        ? frLocale.questionnaire.fields[key as QuestionnaireKey]
        : frLocale.contact[key as ContactKey];
      const raw = isQ ? questionnaireValue(s, key as QuestionnaireKey) : contactValue(s, key as ContactKey);
      if (isFilled(raw)) filled++;

      if (key === "services") {
        // Show every service with a tick or a dash, so it is clear what was and wasn't chosen.
        const chosen = new Set(list(raw).map((v) => translateOption(s.lang, "fr", "services", v)));
        const options = frLocale.questionnaire.serviceOptions as unknown as string[];
        const others = [...chosen].filter((v) => !options.includes(v));
        extra =
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">` +
          [...options, ...others]
            .map((opt) => {
              const on = chosen.has(opt);
              return (
                `<tr><td valign="top" style="width:28px;padding:6px 0;font-family:${FONT};font-size:15px;font-weight:700;color:${on ? C.ok : C.border};">${on ? "✓" : "—"}</td>` +
                `<td style="padding:6px 0;font-family:${FONT};font-size:15px;line-height:22px;${on ? `color:${C.ink};font-weight:600;` : `color:${C.faint};`}">${esc(opt)}</td></tr>`
              );
            })
            .join("") +
          `</table>` +
          (chosen.size ? "" : `<p style="margin:8px 0 0;font-family:${FONT};font-size:14px;">${empty(NR)}</p>`);
        textRows.push(
          ...options.map((opt) => `  [${chosen.has(opt) ? "x" : " "}] ${opt}`),
          ...others.map((opt) => `  [x] ${opt}`),
          ...(chosen.size ? [] : [`  (${NR})`]),
        );
        continue;
      }

      const value = str(raw);
      if (LONG_FIELDS.has(key)) {
        extra = longBlock(value ? multiline(value) : empty(NR));
        textRows.push(value || NR);
        continue;
      }

      const shown = value ? translateOption(s.lang, "fr", key as QuestionnaireKey, value) : "";
      let html = shown ? esc(shown) : empty(NR);
      if (shown && key === "email") html = link(`mailto:${shown}`, shown);
      if (shown && key === "phone") html = link(telHref(shown), shown);
      rows.push({ label, html });
      textRows.push(`${label} : ${shown || NR}`);
    }

    htmlSections.push(sectionTitle(section.fr) + (rows.length ? rowsTable(rows) : "") + extra);
    textSections.push(`${section.fr.toUpperCase()}\n${textRows.join("\n")}`);
  }

  const complete = filled === total;
  const badge =
    `<span style="display:inline-block;padding:5px 12px;border-radius:999px;font-family:${FONT};font-size:12px;font-weight:700;` +
    `background:${complete ? C.okBg : C.warnBg};color:${complete ? C.ok : C.warn};">` +
    `${filled}/${total} champs renseignés${complete ? "" : ` · ${total - filled} non renseigné${total - filled > 1 ? "s" : ""}`}</span>`;

  const actions: string[] = [];
  if (s.email) {
    const subj = isQ ? "Votre projet — Plan B Concept" : "Votre message — Plan B Concept";
    actions.push(button(`mailto:${s.email}?subject=${encodeURIComponent(subj)}`, `Répondre à ${s.name || "ce visiteur"}`));
  }
  if (s.phone) {
    actions.push(button(telHref(s.phone), "Appeler", false));
    const wa = whatsappDigits(s.phone);
    if (wa) actions.push(button(`https://wa.me/${wa}`, "WhatsApp", false));
  }

  const location = isQ ? str(s.answers.projectLocation) : "";
  const subject = `[Plan B Concept] ${isQ ? "Nouveau questionnaire" : "Nouveau message"} — ${name}${location ? ` · ${location}` : ""}`;
  const preheader = isQ
    ? [location, translateOption(s.lang, "fr", "projectType", str(s.answers.projectType)), translateOption(s.lang, "fr", "budget", str(s.answers.budget))]
        .filter(Boolean)
        .join(" · ") || "Nouveau questionnaire projet"
    : str(s.message).slice(0, 120) || "Nouveau message";

  const body =
    heading(isQ ? "Nouveau questionnaire projet" : "Nouveau message de contact", name) +
    `<p style="margin:10px 0 16px;font-family:${FONT};font-size:14px;line-height:21px;color:${C.label};">Reçu le ${esc(receivedAt)} · Formulaire rempli en ${esc(langName)}</p>` +
    badge +
    (actions.length ? `<div style="margin-top:22px;">${actions.join("")}</div>` : "") +
    htmlSections.join("");

  const footer =
    (s.email
      ? `Répondez directement à cet e-mail pour écrire à ${esc(name)} (${esc(s.email)}).<br>`
      : "") +
    `Envoyé automatiquement depuis le formulaire de ${goldLink(SITE_URL, "planb-concept.com")}.` +
    (s.userAgent
      ? `<div style="margin-top:12px;font-size:11px;line-height:16px;color:#8f7d75;">Navigateur : ${esc(s.userAgent)}</div>`
      : "");

  const text =
    `${isQ ? "NOUVEAU QUESTIONNAIRE PROJET" : "NOUVEAU MESSAGE DE CONTACT"} — ${name}\n` +
    `Reçu le ${receivedAt} · Formulaire rempli en ${langName}\n` +
    `${filled}/${total} champs renseignés\n\n` +
    textSections.join("\n\n") +
    (s.email ? `\n\nRépondez directement à cet e-mail pour écrire à ${name} (${s.email}).` : "") +
    (s.userAgent ? `\nNavigateur : ${s.userAgent}` : "");

  return {
    subject,
    html: layout({ lang: "fr", title: subject, preheader, body, footer }),
    text,
  };
}

// ---------- confirmation to the visitor (their language) ----------

export function buildVisitorEmail(s: Submission): BuiltEmail {
  const lang = LOCALES[s.lang] ? s.lang : "en";
  const locale = LOCALES[lang];
  const copy = CONFIRMATION_COPY[lang] ?? CONFIRMATION_COPY.en;
  const isQ = s.formType === "questionnaire";
  const NR = copy.notProvided;

  const rows: { label: string; html: string }[] = [];
  const textRows: string[] = [];

  if (isQ) {
    for (const section of QUESTIONNAIRE_SECTIONS) {
      for (const key of section.keys) {
        if (FREE_TEXT_FIELDS.has(key)) continue;
        const label = locale.questionnaire.fields[key];
        const raw = questionnaireValue(s, key);
        if (key === "fullName") {
          const v = safeVisitorName(str(raw));
          rows.push({ label, html: v ? esc(v) : empty(NR) });
          textRows.push(`${label}: ${v || NR}`);
          continue;
        }
        const all = key === "services" ? list(raw) : [str(raw)].filter(Boolean);
        // email / phone are the visitor's own details; everything else must be a known option.
        const values = OPTION_LISTS[key] ? all.filter((v) => isKnownOption(lang, key, v)) : all.map((v) => v.slice(0, 50));
        rows.push({ label, html: values.length ? values.map(esc).join("<br>") : empty(NR) });
        textRows.push(`${label}: ${values.length ? values.join(", ") : NR}`);
      }
    }
  } else {
    for (const key of ["name", "email", "phone"] as const) {
      const raw = contactValue(s, key);
      const v = key === "name" ? safeVisitorName(raw) : raw.slice(0, 50);
      rows.push({ label: locale.contact[key], html: v ? esc(v) : empty(NR) });
      textRows.push(`${locale.contact[key]}: ${v || NR}`);
    }
  }

  const steps = copy.steps
    .map(
      (step, i) =>
        `<tr><td valign="top" style="width:40px;padding:0 0 14px;">` +
        `<div style="width:28px;height:28px;line-height:28px;border-radius:14px;background:${C.burgundy};color:${C.gold};text-align:center;font-family:${FONT};font-size:13px;font-weight:700;">${i + 1}</div></td>` +
        `<td valign="top" style="padding:4px 0 14px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${esc(step)}</td></tr>`,
    )
    .join("");

  const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(locale.contact.whatsappPrefill)}`;
  const directCard =
    `<div style="margin-top:32px;padding:22px 24px;background:${C.muted};border-radius:12px;">` +
    `<div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.terracotta};">${esc(copy.directTitle)}</div>` +
    `<div style="margin-top:10px;font-family:${FONT};font-size:17px;font-weight:700;color:${C.ink};">${esc(CONTACT.name)}</div>` +
    `<div style="margin-top:2px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.label};">${esc(locale.footer.tagline)}</div>` +
    `<div style="margin-top:12px;font-family:${FONT};font-size:15px;line-height:24px;">` +
    `${link(`tel:${CONTACT.phoneIntl}`, CONTACT.phoneDisplay)}<br>${link(`mailto:${CONTACT.email}`, CONTACT.email)}</div>` +
    `<div style="margin-top:16px;">${button(`tel:${CONTACT.phoneIntl}`, copy.call)}${button(waHref, "WhatsApp", false)}</div>` +
    `</div>`;

  const subject = isQ ? copy.subjectQuestionnaire : copy.subjectContact;
  const intro = isQ ? copy.introQuestionnaire : copy.introContact;
  // Both forms require a name; the fallback only guards against a hand-crafted request.
  const visitorName = safeVisitorName(s.name);
  const title = visitorName ? copy.thanks(visitorName) : copy.thanks("").replace(/,\s*\.$/, ".");

  const body =
    heading(isQ ? copy.eyebrowQuestionnaire : copy.eyebrowContact, title) +
    `<p style="margin:14px 0 0;font-family:${FONT};font-size:16px;line-height:25px;color:${C.ink};">${esc(intro)}</p>` +
    sectionTitle(copy.nextTitle) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${steps}</table>` +
    sectionTitle(isQ ? copy.recapQuestionnaire : copy.recapContact) +
    rowsTable(rows) +
    directCard;

  const footer =
    `<div style="font-weight:700;color:${C.gold};letter-spacing:1px;">Plan B Concept</div>` +
    `<div>${esc(locale.footer.tagline)}</div>` +
    `<div style="margin-top:12px;">${esc(copy.footerReason)}</div>` +
    `<div style="margin-top:12px;">${goldLink(SITE_URL, "planb-concept.com")} · ${goldLink(PRIVACY_URL, copy.privacy)}</div>`;

  const text =
    `${title}\n\n${intro}\n\n` +
    `${copy.nextTitle.toUpperCase()}\n${copy.steps.map((st, i) => `${i + 1}. ${st}`).join("\n")}\n\n` +
    `${(isQ ? copy.recapQuestionnaire : copy.recapContact).toUpperCase()}\n${textRows.join("\n")}\n\n` +
    `${copy.directTitle}\n${CONTACT.name} — ${CONTACT.phoneDisplay} — ${CONTACT.email}\nWhatsApp: ${waHref}\n\n` +
    `—\nPlan B Concept · ${locale.footer.tagline}\n${copy.footerReason}\n${SITE_URL}`;

  return {
    subject,
    html: layout({ lang, title: subject, preheader: intro, body, footer }),
    text,
  };
}
