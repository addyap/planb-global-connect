// @vitest-environment node
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { challengeSecret, createChallenge, MAX_NUMBER } from "../../api/_lib/challenge";
import { solveChallenge } from "@/lib/submit-form";

// Runs the real /api/submit handler with the real challenge code; only Resend is faked.
process.env.RESEND_API_KEY = "test-key";
let POST: (req: Request) => Promise<Response>;
const sent: { to: string[]; subject: string }[] = [];
let ipCounter = 0;

beforeAll(async () => {
  ({ POST } = await import("../../api/submit"));
});

beforeEach(() => {
  sent.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      sent.push({ to: body.to, subject: body.subject });
      return new Response(JSON.stringify({ id: "x" }), { status: 200 });
    }),
  );
});

const secret = () => challengeSecret()!;
/** A challenge issued `ageMs` ago, solved the same way the browser does. */
const solved = async (ageMs = 5_000) => (await solveChallenge(createChallenge(secret(), Date.now() - ageMs)))!;

const submit = (body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://www.planb-concept.com/api/submit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://www.planb-concept.com",
        "x-real-ip": `10.0.0.${++ipCounter}`,
        ...headers,
      },
      body: JSON.stringify(body),
    }),
  );

const form = (extra: Record<string, unknown> = {}) => ({
  form_type: "contact",
  lang: "en",
  name: "Jane Doe",
  email: `jane${ipCounter}@example.com`,
  message: "I'd like to renovate a villa in Cannes.",
  ...extra,
});

describe("proof-of-work challenge", () => {
  it("the browser solver finds the answer to a server challenge", async () => {
    const c = createChallenge(secret());
    const s = await solveChallenge(c);
    expect(s?.number).toBeGreaterThanOrEqual(0);
    expect(s?.number).toBeLessThanOrEqual(MAX_NUMBER);
  });

  it("accepts a solved challenge and sends both emails", async () => {
    const res = await submit(form({ pow: await solved() }));
    expect(res.status).toBe(200);
    expect(sent.map((e) => e.to[0])).toEqual(["anthony.gratton13@gmail.com", expect.stringMatching(/@example\.com$/)]);
  });

  it("rejects a message with no challenge, and sends nothing", async () => {
    const res = await submit(form());
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "challenge", reason: "missing" });
    expect(sent).toHaveLength(0);
  });

  it("rejects a challenge used less than 3 seconds after it was issued", async () => {
    const res = await submit(form({ pow: await solved(500) }));
    expect(await res.json()).toMatchObject({ reason: "too-early" });
  });

  it("rejects an expired challenge", async () => {
    const res = await submit(form({ pow: await solved(3 * 60 * 60 * 1000) }));
    expect(await res.json()).toMatchObject({ reason: "expired" });
  });

  it("rejects a forged or tampered challenge", async () => {
    const pow = await solved();
    const res = await submit(form({ pow: { ...pow, issuedAt: pow.issuedAt - 1 } }));
    expect(await res.json()).toMatchObject({ reason: "signature" });
  });

  it("rejects a wrong answer", async () => {
    const pow = await solved();
    const res = await submit(form({ pow: { ...pow, number: (pow.number + 1) % MAX_NUMBER } }));
    expect(await res.json()).toMatchObject({ reason: "wrong-answer" });
  });

  it("rejects reusing the same solved challenge", async () => {
    const pow = await solved();
    expect((await submit(form({ pow }))).status).toBe(200);
    const again = await submit(form({ pow }));
    expect(await again.json()).toMatchObject({ reason: "reused" });
  });
});

describe("request checks", () => {
  it("rejects other origins, non-JSON and oversized bodies", async () => {
    expect((await submit(form({ pow: await solved() }), { origin: "https://evil.example" })).status).toBe(403);
    expect((await submit(form(), { "content-type": "text/plain" })).status).toBe(415);
    expect((await submit(form({ message: "x".repeat(40_000) }))).status).toBe(413);
  });

  it("gives honeypot bots a fake success and sends nothing", async () => {
    const res = await submit(form({ honeypot: "I am a bot", pow: await solved() }));
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(0);
  });
});

describe("spam handling", () => {
  it("flags link-stuffed messages for Anthony and sends no confirmation", async () => {
    const message = "Cheap: http://a.example http://b.example http://c.example";
    const res = await submit(form({ message, pow: await solved() }));
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toMatch(/^\[Spam probable\]/);
  });

  it("sends at most 2 confirmations an hour to the same address", async () => {
    const email = "repeat@example.com";
    for (let i = 0; i < 3; i++) await submit(form({ email, pow: await solved() }));
    expect(sent.filter((e) => e.to[0] === email)).toHaveLength(2);
    expect(sent.filter((e) => e.to[0] === "anthony.gratton13@gmail.com")).toHaveLength(3);
  });
});
