// Vercel Function: POST /api/submit
// Receives the contact and questionnaire forms, verifies the Cloudflare Turnstile token
// server-side (the secret key can never live in client code), re-checks the
// honeypot/timing spam trap, then sends two emails via Resend: the full submission to
// Anthony, and a confirmation to the visitor in the language they used on the site.
// No database: the email is the record. Templates live in api/_lib/emails.ts.
//
// Required environment variables (Vercel project settings):
//   RESEND_API_KEY        Resend API key
//   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret key
// Optional:
//   RESEND_FROM           Verified sender, e.g. "Plan B Concept <noreply@planb-concept.com>".
//                         Defaults to Resend's sandbox sender, which only delivers to the
//                         Resend account owner's own address.
//   NOTIFY_TO             Notification recipient; defaults to Anthony's address (CONTACT.email).

import { buildOwnerEmail, buildVisitorEmail, SUPPORTED_LANGS, type BuiltEmail, type FormType, type Submission } from "./_lib/emails.js";
import { CONTACT } from "../src/lib/contact.js";

const NOTIFY_TO = process.env.NOTIFY_TO ?? CONTACT.email;
const NOTIFY_FROM = process.env.RESEND_FROM ?? "Plan B Concept <onboarding@resend.dev>";
const FORM_TYPES: FormType[] = ["contact", "questionnaire"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_FIELD_LENGTH = 5000;

type SubmitPayload = {
  form_type?: string;
  lang?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  payload?: Record<string, unknown>;
  turnstileToken?: string;
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

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[submit] TURNSTILE_SECRET_KEY not set — rejecting submission.");
    return false;
  }
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await res.json().catch(() => ({ success: false }));
  return result.success === true;
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

    // Honeypot / minimum-fill-time spam trap, re-checked server-side.
    if (body.honeypot || (typeof body.elapsedMs === "number" && body.elapsedMs < 2000)) {
      // Pretend success so bots don't learn anything from the response.
      return json(200, { ok: true });
    }

    if (body.email && !EMAIL_RE.test(body.email)) {
      return json(400, { ok: false, error: "invalid email" });
    }

    if (!body.turnstileToken) {
      return json(400, { ok: false, error: "missing turnstile token" });
    }

    const remoteIp =
      request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (!(await verifyTurnstile(body.turnstileToken, remoteIp))) {
      return json(400, { ok: false, error: "turnstile verification failed" });
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
