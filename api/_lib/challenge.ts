// Self-hosted proof-of-work challenge for the forms (the scheme used by the open-source ALTCHA
// widget, implemented here so there is no dependency and no third-party account).
//
// GET /api/challenge hands the browser a salt and SHA-256(salt + n) for a secret random n, plus
// an HMAC signature over the whole challenge. The browser finds n by brute force (~50k hashes on
// average, well under a second, done while the visitor types) and sends it with the form.
// The server re-hashes once and checks the signature, so it needs no storage, and the
// timestamp inside the signed challenge gives a minimum fill time a script can't fake.

import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export const MAX_NUMBER = 100_000;
/** A challenge can't be used sooner than this after it was issued (bots post instantly). */
export const MIN_AGE_MS = 3_000;
/** …or later than this (a visitor who leaves the tab open gets a fresh one automatically). */
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type Challenge = { salt: string; challenge: string; issuedAt: number; maxNumber: number; signature: string };
export type Solution = Challenge & { number: number };
export type RejectReason = "missing" | "malformed" | "signature" | "too-early" | "expired" | "wrong-answer" | "reused";
// A flat shape rather than a union: the project compiles without strictNullChecks, which stops
// TypeScript narrowing `{ ok: true } | { ok: false; reason }` on `ok`.
export type VerifyResult = { ok: boolean; reason?: RejectReason };

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const sign = (secret: string, c: Omit<Challenge, "signature">) =>
  createHmac("sha256", secret).update(`${c.salt}.${c.challenge}.${c.issuedAt}.${c.maxNumber}`).digest("hex");

/**
 * The signing secret. FORM_SECRET if set; otherwise derived from RESEND_API_KEY, so the site
 * works with no extra configuration (the key is already a server-only secret).
 */
export function challengeSecret(env: Record<string, string | undefined> = process.env): string | null {
  if (env.FORM_SECRET) return env.FORM_SECRET;
  if (env.RESEND_API_KEY) return createHmac("sha256", env.RESEND_API_KEY).update("planb-form-challenge").digest("hex");
  return null;
}

export function createChallenge(secret: string, now = Date.now()): Challenge {
  const salt = randomBytes(12).toString("hex");
  const number = randomInt(0, MAX_NUMBER + 1);
  const unsigned = { salt, challenge: sha256(salt + number), issuedAt: now, maxNumber: MAX_NUMBER };
  return { ...unsigned, signature: sign(secret, unsigned) };
}

// Best-effort replay protection: remembers solved challenges in this function instance until
// they expire. Instances don't share memory, so this blunts bulk reuse rather than preventing it.
const used = new Map<string, number>();

export function verifySolution(secret: string, input: unknown, now = Date.now()): VerifyResult {
  if (!input || typeof input !== "object") return { ok: false, reason: "missing" };
  const s = input as Partial<Solution>;
  if (
    typeof s.salt !== "string" || typeof s.challenge !== "string" || typeof s.signature !== "string" ||
    typeof s.issuedAt !== "number" || typeof s.maxNumber !== "number" || typeof s.number !== "number" ||
    !Number.isInteger(s.number) || s.number < 0 || s.number > s.maxNumber || s.salt.length > 64
  ) {
    return { ok: false, reason: "malformed" };
  }

  const expected = Buffer.from(sign(secret, { salt: s.salt, challenge: s.challenge, issuedAt: s.issuedAt, maxNumber: s.maxNumber }), "hex");
  const given = Buffer.from(s.signature, "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: "signature" };

  const age = now - s.issuedAt;
  if (age < MIN_AGE_MS) return { ok: false, reason: "too-early" };
  if (age > MAX_AGE_MS) return { ok: false, reason: "expired" };
  if (sha256(s.salt + s.number) !== s.challenge) return { ok: false, reason: "wrong-answer" };

  for (const [k, exp] of used) if (exp < now) used.delete(k);
  if (used.has(s.challenge)) return { ok: false, reason: "reused" };
  used.set(s.challenge, s.issuedAt + MAX_AGE_MS);
  return { ok: true };
}
