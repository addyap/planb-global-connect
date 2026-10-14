// Vercel Function: POST /api/submit
// Receives the contact and questionnaire forms, runs the spam checks below, then sends two
// emails via Resend: the full submission to
// Anthony, and a confirmation to the visitor in the language they used on the site.
// No database: the email is the record. Templates live in api/_lib/emails.ts.
//
// Spam protection (no CAPTCHA, by choice): requests must come from the site's own origin,
// carry the form's honeypot/fill-time fields, and stay under a per-IP rate limit. This
// stops drive-by bots but not a determined attacker; if abuse appears, add a rate-limit
// rule in the Vercel Firewall (no code change needed).
//
// Required environment variables (Vercel project settings):
//   RESEND_API_KEY        Resend API key
// Optional:
//   RESEND_FROM           Verified sender, e.g. "Plan B Concept <noreply@planb-concept.com>".
//                         Defaults to Resend's sandbox sender, which only delivers to the
//                         Resend account owner's own address.
//   ALLOWED_ORIGINS       Extra comma-separated origins allowed to post (e.g. a preview URL).
//   NOTIFY_TO             Notification recipient; defaults to Anthony's address (CONTACT.email).

import { buildOwnerEmail, buildVisitorEmail, SUPPORTED_LANGS, type BuiltEmail, type FormType, type Submission } from "./_lib/emails.js";
import { CONTACT } from "../src/lib/contact.js";

const NOTIFY_TO = process.env.NOTIFY_TO ?? CONTACT.email;
const NOTIFY_FROM = process.env.RESEND_FROM ?? "Plan B Concept <onboarding@resend.dev>";
const FORM_TYPES: FormType[] = ["contact", "questionnaire"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_FIELD_LENGTH = 5000;
const MIN_FILL_MS = 2000;

const ALLOWED_ORIGINS = new Set([
  "https://www.planb-concept.com",
  "https://planb-concept.com",
  "http://localhost:8080",
  "http://localhost:3000",
  ...(process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean),
]);

// Best-effort per-IP rate limit. It lives in the function instance's memory, so it resets on
// cold starts and isn't shared between instances — enough to blunt a burst from one source.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  recentByIp.set(ip, recent);
  if (recentByIp.size > 5000) recentByIp.clear();
  return recent.length > RATE_LIMIT;
}

type SubmitPayload = {
  form_type?: string;
  lang?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  payload?: Record<string, unknown>;
  honeypot?: string;
  elapsedMs?: number;
};

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const clip = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_FIELD_LENGTH) : "");

/** Keeps only string / string[] answers, clipped, so nothing unexpected reaches the templates. */
function cleanAnswers(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload).slice(0, 50)) {
    if (typeof v === "string") out[k] = clip(v);
    else if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string").slice(0, 20).map(clip);
  }
  return out;
}

async function sendEmail(apiKey: string, to: string, replyTo: string | undefined, email: BuiltEmail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: replyTo,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Resend returned ${res.status}: ${errText}`);
  }
  const sent = await res.json().catch(() => ({}));
  return sent?.id as string | undefined;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: SubmitPayload = await request.json().catch(() => ({}));
    const formType = body.form_type as FormType;

    if (!FORM_TYPES.includes(formType)) {
      return json(400, { ok: false, error: "invalid form_type" });
    }

    // Only the site itself may post. Browsers always send Origin on a cross-origin-capable POST.
    const origin = request.headers.get("origin") ?? "";
    if (!ALLOWED_ORIGINS.has(origin)) {
      console.warn(`[submit] rejected origin "${origin}"`);
      return json(403, { ok: false, error: "forbidden" });
    }

    // Honeypot / minimum-fill-time spam trap. The real form always sends elapsedMs, so a
    // request without it didn't come from the form. Pretend success so bots learn nothing.
    if (body.honeypot || typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) {
      return json(200, { ok: true });
    }

    if (body.email && !EMAIL_RE.test(body.email)) {
      return json(400, { ok: false, error: "invalid email" });
    }

    const ip =
      request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      console.warn(`[submit] rate limited ${ip}`);
      return json(429, { ok: false, error: "too many submissions" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[submit] RESEND_API_KEY not set — cannot send.");
      return json(500, { ok: false, error: "email not configured" });
    }

    const submission: Submission = {
      formType,
      lang: SUPPORTED_LANGS.includes(body.lang ?? "") ? body.lang! : "en",
      name: clip(body.name).slice(0, 200),
      email: clip(body.email),
      phone: clip(body.phone).slice(0, 50),
      message: clip(body.message),
      answers: cleanAnswers(body.payload),
      userAgent: request.headers.get("user-agent"),
      receivedAt: new Date(),
    };

    // Anthony's notification must go out; if it fails the visitor sees an error and can retry.
    try {
      const id = await sendEmail(apiKey, NOTIFY_TO, submission.email || undefined, buildOwnerEmail(submission));
      console.log(`[submit] Sent ${formType} notification. Resend id=${id ?? "?"}`);
    } catch (err) {
      console.error("[submit] notification failed:", err);
      return json(502, { ok: false, error: "email send failed" });
    }

    // The visitor's confirmation is best-effort: the submission already reached Anthony.
    if (submission.email) {
      try {
        const id = await sendEmail(apiKey, submission.email, CONTACT.email, buildVisitorEmail(submission));
        console.log(`[submit] Sent ${formType} confirmation (${submission.lang}). Resend id=${id ?? "?"}`);
      } catch (err) {
        console.error("[submit] confirmation failed:", err);
      }
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("[submit] unexpected error:", err);
    return json(500, { ok: false, error: "unexpected error" });
  }
}
