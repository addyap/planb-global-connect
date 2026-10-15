// Vercel Function: GET /api/challenge
// Issues a signed proof-of-work challenge for the contact and questionnaire forms.
// See api/_lib/challenge.ts for how it works.

import { challengeSecret, createChallenge } from "./_lib/challenge.js";

export function GET(): Response {
  const secret = challengeSecret();
  if (!secret) {
    console.error("[challenge] no FORM_SECRET or RESEND_API_KEY set — cannot sign challenges.");
    return new Response(JSON.stringify({ error: "not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  return new Response(JSON.stringify(createChallenge(secret)), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
