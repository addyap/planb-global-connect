import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { Contact } from "@/components/sections/Contact";

const invoke = vi.fn().mockResolvedValue({ error: null });

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: true,
  supabase: { functions: { invoke: (...args: unknown[]) => invoke(...args) } },
}));

vi.mock("@/hooks/use-turnstile", () => ({
  useTurnstile: () => ({
    containerRef: { current: null },
    getToken: () => "test-turnstile-token",
    reset: vi.fn(),
    isConfigured: true,
  }),
}));

const getSubmitButton = () => screen.getByRole("button", { name: "Send message" });

const renderContact = async () => {
  const utils = render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
  // The Supabase client loads via a dynamic import on mount; wait for it
  // so the submit button is enabled before a test interacts with it.
  await waitFor(() => expect(getSubmitButton()).not.toBeDisabled());
  return utils;
};

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello, I'd like to discuss a project." } });
};

beforeEach(() => {
  invoke.mockClear();
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

describe("Contact form honeypot and timing trap", () => {
  it("silently succeeds without submitting when the honeypot field is filled", async () => {
    await renderContact();
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "I am a bot" } });

    fireEvent.submit(getSubmitButton().closest("form")!);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(invoke).not.toHaveBeenCalled();
  });

  it("silently succeeds without submitting when the form is filled too quickly", async () => {
    await renderContact();
    fillRequiredFields();

    fireEvent.submit(getSubmitButton().closest("form")!);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe("Contact form real submission", () => {
  it("submits to Supabase with the expected payload once past the timing trap", async () => {
    await renderContact();
    fillRequiredFields();

    // Simulate 3s having passed since mount, clearing the bot-timing trap,
    // without touching the real timers RTL's async utilities rely on.
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.submit(getSubmitButton().closest("form")!);
    dateSpy.mockRestore();

    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    const [fnName, options] = invoke.mock.calls[0];
    expect(fnName).toBe("submit-form");
    expect(options.body).toMatchObject({
      form_type: "contact",
      name: "Jane Doe",
      email: "jane@example.com",
      turnstileToken: "test-turnstile-token",
    });
    expect(toast.success).toHaveBeenCalled();
  });
});
