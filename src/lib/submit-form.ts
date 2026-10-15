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
};

type Challenge = { salt: string; challenge: string; issuedAt: number; maxNumber: number; signature: string };
type Solution = Challenge & { number: number };

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

/** Finds n with SHA-256(salt + n) === challenge. ~50k hashes on average (~0.2 s desktop, ~1–2 s low-end phone); Web Crypto keeps the page responsive. */
export async function solveChallenge(c: Challenge): Promise<Solution | null> {
  const enc = new TextEncoder();
  for (let n = 0; n <= c.maxNumber; n++) {
    if (hex(await crypto.subtle.digest("SHA-256", enc.encode(c.salt + n))) === c.challenge) return { ...c, number: n };
  }
  return null;
}

async function fetchAndSolve(): Promise<Solution | null> {
  const res = await fetch("/api/challenge", { cache: "no-store" });
  if (!res.ok) return null;
  return solveChallenge((await res.json()) as Challenge);
}

// One solution is worked out in the background as soon as the visitor starts on a form, so
// it is normally ready long before they press send. Each solution is single-use.
let pending: Promise<Solution | null> | null = null;

/** Start solving a challenge now (call when the visitor first focuses a form). Safe to call repeatedly. */
export function primeChallenge(): void {
  if (!pending) pending = fetchAndSolve().catch(() => null);
}

async function takeSolution(): Promise<Solution | null> {
  primeChallenge();
  const solution = await pending;
  pending = null;
  return solution;
}

const post = (body: SubmitFormBody, pow: Solution | null) =>
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, pow }),
  });

/** Posts a form to the /api/submit Vercel Function, which emails it via Resend. Returns true on success. */
export async function submitForm(body: SubmitFormBody): Promise<boolean> {
  try {
    const solution = await takeSolution();
    let res = await post(body, solution);
    if (res.status === 400) {
      const { error, reason } = await res.clone().json().catch(() => ({}));
      if (error === "challenge" && reason === "too-early") {
        // Sent within 3 s of the challenge (e.g. autofill): wait it out and resend the same one.
        await new Promise((r) => setTimeout(r, 3000));
        res = await post(body, solution);
      } else if (error === "challenge") {
        // Expired or already used (tab left open for hours, a second message): solve a fresh one.
        res = await post(body, await takeSolution());
      }
    }
    primeChallenge(); // ready for "send another message"
    return res.ok;
  } catch {
    return false;
  }
}
