import { describe, it, expect } from "vitest";
import { buildOwnerEmail, buildVisitorEmail, type Submission } from "../../api/_lib/emails";

// The visitor confirmation is sent to whatever address is typed into the form, so it must not
// echo free text back — otherwise a scripted POST could use our domain to deliver spam.
const base: Omit<Submission, "formType" | "name" | "message" | "answers"> = {
  lang: "en",
  email: "victim@example.com",
  phone: "+33 6 00 00 00 00",
  userAgent: null,
  receivedAt: new Date("2026-10-14T12:00:00Z"),
};
const body = (e: { html: string; text: string }) => e.html + e.text;

describe("visitor confirmation email", () => {
  it("does not repeat a link-like name or the free-text message", () => {
    const email = buildVisitorEmail({
      ...base,
      formType: "contact",
      name: "Cheap pills at https://spam.example",
      message: "Click http://evil.example now",
      answers: {},
    });
    expect(body(email)).not.toMatch(/spam\.example|evil\.example|Click/);
  });

  it("only repeats questionnaire answers that match the form's own options", () => {
    const email = buildVisitorEmail({
      ...base,
      formType: "questionnaire",
      name: "Jane Doe",
      message: "brief http://evil.example",
      answers: {
        budget: "€50k–€150k",
        projectType: "WIN BIG http://evil.example",
        projectLocation: "http://evil.example",
        services: ["Project management", "http://evil.example"],
      },
    });
    expect(body(email)).not.toMatch(/evil\.example|WIN BIG/);
    expect(email.text).toContain("€50k–€150k");
    expect(email.text).toContain("Project management");
    expect(email.text).toContain("Jane Doe");
  });

  it("still gives Anthony the full message", () => {
    const email = buildOwnerEmail({ ...base, formType: "contact", name: "Jane", message: "My villa in Cannes", answers: {} });
    expect(email.text).toContain("My villa in Cannes");
  });
});
