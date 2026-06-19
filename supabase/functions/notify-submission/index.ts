// Edge function: notify-submission
// Triggered by a Database Webhook on INSERT to public.form_submissions.
// Sends a notification email via Resend. Designed to FAIL GRACEFULLY —
// missing config or provider errors must never block form submissions,
// so we always log and return HTTP 200.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const NOTIFY_TO = "anthony.gratton13@gmail.com";
// Until a verified Resend sender/domain is configured, the Resend sandbox
// sender works for sending TO the verified account owner only.
const NOTIFY_FROM = Deno.env.get("RESEND_FROM") ?? "Plan B Concept <onboarding@resend.dev>";

type SubmissionRow = {
  id?: string;
  form_type?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  payload?: Record<string, unknown> | null;
  user_agent?: string | null;
  created_at?: string | null;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildBody(row: SubmissionRow): { html: string; text: string } {
  const formType = row.form_type ?? "unknown";
  const rows: [string, string][] = [
    ["Form type", formType],
    ["Name", row.name ?? ""],
    ["Email", row.email ?? ""],
    ["Phone", row.phone ?? ""],
    ["Message", row.message ?? ""],
  ];

  let payloadText = "";
  let payloadHtml = "";
  if (formType === "questionnaire" && row.payload && typeof row.payload === "object") {
    const entries = Object.entries(row.payload as Record<string, unknown>);
    payloadText =
      "\n\n— Questionnaire details —\n" +
      entries
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v ?? "")}`)
        .join("\n");
    payloadHtml =
      `<h3 style="margin-top:24px;font-family:sans-serif;">Questionnaire details</h3>` +
      `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">` +
      entries
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666;"><strong>${escapeHtml(k)}</strong></td>` +
            `<td style="padding:4px 0;">${escapeHtml(Array.isArray(v) ? v.join(", ") : String(v ?? ""))}</td></tr>`,
        )
        .join("") +
      `</table>`;
  }

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    payloadText +
    (row.user_agent ? `\n\nUser agent: ${row.user_agent}` : "") +
    (row.created_at ? `\nSubmitted at: ${row.created_at}` : "");

  const html =
    `<div style="font-family:sans-serif;font-size:14px;color:#111;">` +
    `<h2 style="margin:0 0 16px;">New ${escapeHtml(formType)} submission</h2>` +
    `<table style="border-collapse:collapse;">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666;"><strong>${escapeHtml(k)}</strong></td>` +
          `<td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    payloadHtml +
    (row.user_agent
      ? `<p style="margin-top:24px;color:#888;font-size:12px;">User agent: ${escapeHtml(row.user_agent)}</p>`
      : "") +
    (row.created_at
      ? `<p style="margin:4px 0 0;color:#888;font-size:12px;">Submitted at: ${escapeHtml(row.created_at)}</p>`
      : "") +
    `</div>`;

  return { html, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.warn("[notify-submission] RESEND_API_KEY not set — skipping email.");
      return new Response(
        JSON.stringify({ ok: true, skipped: "RESEND_API_KEY missing" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      console.warn("[notify-submission] Non-JSON body, ignoring.");
      return new Response(JSON.stringify({ ok: true, skipped: "invalid body" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Supabase database webhook payload shape: { type, table, record, old_record, schema }
    const row: SubmissionRow = body?.record ?? body ?? {};
    if (!row || typeof row !== "object") {
      console.warn("[notify-submission] No record on payload, skipping.");
      return new Response(JSON.stringify({ ok: true, skipped: "no record" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = `[Plan B Concept] New ${row.form_type ?? "form"} submission${
      row.name ? ` — ${row.name}` : ""
    }`;
    const { html, text } = buildBody(row);

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
        reply_to: row.email ?? undefined,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      console.error(
        `[notify-submission] Resend returned ${resendRes.status}: ${errText}`,
      );
      // Still 200 so the webhook doesn't retry-loop or block the insert.
      return new Response(
        JSON.stringify({ ok: true, skipped: `resend ${resendRes.status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendJson = await resendRes.json().catch(() => ({}));
    console.log(`[notify-submission] Sent. Resend id=${resendJson?.id ?? "?"}`);
    return new Response(
      JSON.stringify({ ok: true, id: resendJson?.id ?? null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[notify-submission] Unexpected error:", err);
    // Always return 200 so form inserts never break.
    return new Response(JSON.stringify({ ok: true, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
