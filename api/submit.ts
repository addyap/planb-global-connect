// Vercel Function: POST /api/submit
// Receives the contact and questionnaire forms, runs the spam checks below, then sends two
// emails via Resend: the full submission to
// Anthony, and a confirmation to the visitor in the language they used on the site.
// No database: the email is the record. Templates live in api/_lib/emails.ts.
//
// Spam protection (no CAPTCHA and no third-party service, by choice), cheapest checks first:
//   1. JSON only, at most 32 KB, from the site's own origin.
//   2. Honeypot field empty (bots that fill it get a fake success).
//   3. A solved proof-of-work challenge from GET /api/challenge, signed by this server and at
//      least 3 s old — a script has to fetch, wait and burn CPU for every single message.
//   4. Per-IP rate limit.
//   5. Spam scoring: link-stuffed messages still reach Anthony, flagged "[Spam probable]",
//      but get no confirmation email, so the form can't be used to mail third parties.
//      Confirmations are also capped per recipient address.
// A determined attacker running a real browser can still get through slowly; if that ever
// happens, add a rate-limit rule for /api/submit in the Vercel Firewall (no code change).
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
import { challengeSecret, verifySolution } from "./_lib/challenge.js";

const NOTIFY_TO = process.env.NOTIFY_TO ?? CONTACT.email;
const NOTIFY_FROM = process.env.RESEND_FROM ?? "Plan B Concept <onboarding@resend.dev>";
const FORM_TYPES: FormType[] = ["contact", "questionnaire"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_FIELD_LENGTH = 5000;
const MAX_BODY_BYTES = 32 * 1024;

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

function hitLimit(store: Map<string, number[]>, key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  store.set(key, recent);
  if (store.size > 5000) store.clear();
  return recent.length > limit;
}

// At most 2 confirmation emails per recipient address per hour (same best-effort memory).
const confirmationsByAddress = new Map<string, number[]>();

const URL_RE = /\bhttps?:\/\/|\bwww\.|\[url=|<a\s/gi;

/** Reasons a submission looks like spam (empty = looks fine). Never blocks; it only flags. */
export function spamSignals(s: { name: string; message: string; answers: Record<string, unknown> }): string[] {
  const signals: string[] = [];
  const location = typeof s.answers.projectLocation === "string" ? s.answers.projectLocation : "";
  if ((s.name.match(URL_RE) ?? []).length > 0) signals.push("link in name");
  if ((location.match(URL_RE) ?? []).length > 0) signals.push("link in location");
  if ((s.message.match(URL_RE) ?? []).length > 2) signals.push("3+ links in message");
  return signals;
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
  pow?: unknown;
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
    if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
      return json(415, { ok: false, error: "json only" });
    }
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return json(413, { ok: false, error: "too large" });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "too large" });
    let body: SubmitPayload;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: "invalid json" });
    }
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

    // Honeypot: only bots fill the hidden field. Pretend success so they learn nothing.
    if (body.honeypot) {
      return json(200, { ok: true });
    }

    // Proof of work. A failure gets a real 400 (not a fake success) so a genuine visitor whose
    // challenge expired is retried with a fresh one by the page instead of silently losing the
    // message. The minimum fill time is checked here too, from the server's own timestamp.
    const secret = challengeSecret();
    if (!secret) {
      console.error("[submit] no FORM_SECRET or RESEND_API_KEY set — cannot verify challenges.");
      return json(500, { ok: false, error: "not configured" });
    }
    const pow = verifySolution(secret, body.pow);
    if (!pow.ok) {
      console.warn(`[submit] challenge rejected: ${pow.reason}`);
      return json(400, { ok: false, error: "challenge", reason: pow.reason });
    }

    if (body.email && !EMAIL_RE.test(body.email)) {
      return json(400, { ok: false, error: "invalid email" });
    }

    const ip =
      request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (hitLimit(recentByIp, ip, RATE_LIMIT, RATE_WINDOW_MS)) {
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

    const signals = spamSignals(submission);
    if (signals.length) console.warn(`[submit] flagged as probable spam: ${signals.join(", ")}`);

    // Anthony's notification must go out; if it fails the visitor sees an error and can retry.
    try {
      const ownerEmail = buildOwnerEmail(submission);
      if (signals.length) ownerEmail.subject = `[Spam probable] ${ownerEmail.subject}`;
      const id = await sendEmail(apiKey, NOTIFY_TO, submission.email || undefined, ownerEmail);
      console.log(`[submit] Sent ${formType} notification. Resend id=${id ?? "?"}`);
    } catch (err) {
      console.error("[submit] notification failed:", err);
      return json(502, { ok: false, error: "email send failed" });
    }

    // The visitor's confirmation is best-effort: the submission already reached Anthony.
    // Skipped for probable spam and capped per address, so nobody can use the form to mail others.
    const capped =
      !!submission.email &&
      hitLimit(confirmationsByAddress, submission.email.toLowerCase(), 2, 60 * 60 * 1000);
    if (submission.email && !signals.length && !capped) {
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
