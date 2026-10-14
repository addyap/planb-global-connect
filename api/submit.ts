// Vercel Function: POST /api/submit
// Receives the contact and questionnaire forms, verifies the Cloudflare Turnstile token
// server-side (the secret key can never live in client code), re-checks the
// honeypot/timing spam trap, then emails the submission to Anthony via Resend.
// No database: the email is the record.
//
// Required environment variables (Vercel project settings):
//   RESEND_API_KEY        Resend API key
//   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret key
// Optional:
//   RESEND_FROM           Verified sender, e.g. "Plan B Concept <noreply@planb-concept.com>".
//                         Defaults to Resend's sandbox sender, which only delivers to the
//                         Resend account owner's own address.
//   NOTIFY_TO             Recipient; defaults to Anthony's address.

const NOTIFY_TO = process.env.NOTIFY_TO ?? "anthony.gratton13@gmail.com";
const NOTIFY_FROM = process.env.RESEND_FROM ?? "Plan B Concept <onboarding@resend.dev>";
const FORM_TYPES = ["contact", "questionnaire"] as const;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_FIELD_LENGTH = 5000;

type FormType = (typeof FORM_TYPES)[number];

type SubmitPayload = {
  form_type?: string;
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

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clip = (v: unknown) => String(v ?? "").slice(0, MAX_FIELD_LENGTH);

const formatValue = (v: unknown) => clip(Array.isArray(v) ? v.join(", ") : v);

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

function buildEmail(formType: FormType, body: SubmitPayload, userAgent: string | null) {
  const rows: [string, string][] = [
    ["Form type", formType],
    ["Name", clip(body.name)],
    ["Email", clip(body.email)],
    ["Phone", clip(body.phone)],
    ["Message", clip(body.message)],
  ];
  const details =
    formType === "questionnaire" && body.payload && typeof body.payload === "object"
      ? Object.entries(body.payload).map(([k, v]): [string, string] => [k, formatValue(v)])
      : [];
  const submittedAt = new Date().toISOString();

  const htmlTable = (entries: [string, string][]) =>
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">` +
    entries
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666;"><strong>${escapeHtml(k)}</strong></td>` +
          `<td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (details.length
      ? "\n\n— Questionnaire details —\n" + details.map(([k, v]) => `${k}: ${v}`).join("\n")
      : "") +
    (userAgent ? `\n\nUser agent: ${userAgent}` : "") +
    `\nSubmitted at: ${submittedAt}`;

  const html =
    `<div style="font-family:sans-serif;font-size:14px;color:#111;">` +
    `<h2 style="margin:0 0 16px;">New ${escapeHtml(formType)} submission</h2>` +
    htmlTable(rows) +
    (details.length
      ? `<h3 style="margin-top:24px;font-family:sans-serif;">Questionnaire details</h3>` + htmlTable(details)
      : "") +
    (userAgent
      ? `<p style="margin-top:24px;color:#888;font-size:12px;">User agent: ${escapeHtml(userAgent)}</p>`
      : "") +
    `<p style="margin:4px 0 0;color:#888;font-size:12px;">Submitted at: ${submittedAt}</p>` +
    `</div>`;

  return { html, text };
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

    const { html, text } = buildEmail(formType, body, request.headers.get("user-agent"));
    const subject = `[Plan B Concept] New ${formType} submission${body.name ? ` — ${clip(body.name).slice(0, 100)}` : ""}`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        subject,
        html,
        text,
        reply_to: body.email || undefined,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      console.error(`[submit] Resend returned ${resendRes.status}: ${errText}`);
      return json(502, { ok: false, error: "email send failed" });
    }

    const sent = await resendRes.json().catch(() => ({}));
    console.log(`[submit] Sent ${formType}. Resend id=${sent?.id ?? "?"}`);
    return json(200, { ok: true });
  } catch (err) {
    console.error("[submit] unexpected error:", err);
    return json(500, { ok: false, error: "unexpected error" });
  }
}
