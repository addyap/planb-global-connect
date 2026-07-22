// Edge function: submit-form
// The only path allowed to write to public.form_submissions. Verifies a Cloudflare
// Turnstile token server-side (the secret key can never live in client code), re-checks
// the honeypot/timing spam trap, then inserts using the service role key — bypassing RLS,
// since the anon INSERT policy has been removed (see the accompanying migration).

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeadersFor } from "../_shared/cors.ts";

const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn("[submit-form] TURNSTILE_SECRET_KEY not set — rejecting submission.");
    return false;
  }
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json().catch(() => ({ success: false }));
  return json.success === true;
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonResponse = (status: number, data: unknown) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body: SubmitPayload = await req.json().catch(() => ({}));

    if (!body.form_type || !["contact", "questionnaire"].includes(body.form_type)) {
      return jsonResponse(400, { ok: false, error: "invalid form_type" });
    }

    // Honeypot / minimum-fill-time spam trap, re-checked server-side.
    if (body.honeypot || (typeof body.elapsedMs === "number" && body.elapsedMs < 2000)) {
      // Pretend success so bots don't learn anything from the response.
      return jsonResponse(200, { ok: true });
    }

    if (!body.turnstileToken) {
      return jsonResponse(400, { ok: false, error: "missing turnstile token" });
    }

    const remoteIp = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for");
    const verified = await verifyTurnstile(body.turnstileToken, remoteIp);
    if (!verified) {
      return jsonResponse(400, { ok: false, error: "turnstile verification failed" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from("form_submissions").insert([{
      form_type: body.form_type,
      name: body.name ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      message: body.message ?? null,
      payload: body.payload ?? null,
      user_agent: req.headers.get("user-agent"),
    }]);

    if (error) {
      console.error("[submit-form] insert failed:", error.message);
      return jsonResponse(500, { ok: false, error: "insert failed" });
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("[submit-form] unexpected error:", err);
    return jsonResponse(500, { ok: false, error: "unexpected error" });
  }
});
