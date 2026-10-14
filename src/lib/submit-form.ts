export type SubmitFormBody = {
  form_type: "contact" | "questionnaire";
  /** Site language the visitor used; their confirmation email is sent in it. */
  lang?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  payload?: Record<string, unknown>;
  honeypot?: string;
  elapsedMs?: number;
  turnstileToken?: string;
};

/** Posts a form to the /api/submit Vercel Function, which emails it via Resend. Returns true on success. */
export async function submitForm(body: SubmitFormBody): Promise<boolean> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
