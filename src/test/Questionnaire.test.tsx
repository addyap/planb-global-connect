import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { Questionnaire } from "@/components/sections/Questionnaire";

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

const getSubmitButton = () => screen.getByRole("button", { name: /send questionnaire/i });

const renderQuestionnaire = async () => {
  const utils = render(
    <MemoryRouter>
      <Questionnaire />
    </MemoryRouter>,
  );
  // The Supabase client loads via a dynamic import on mount; wait for it
  // so the submit button is enabled before a test interacts with it.
  await waitFor(() => expect(getSubmitButton()).not.toBeDisabled());
  return utils;
};

const fillRequiredFields = (container: HTMLElement) => {
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+33612345678" } });
  fireEvent.change(screen.getByLabelText("Project location"), { target: { value: "Cannes" } });
  fireEvent.change(container.querySelector("#projectType")!, { target: { value: "Renovation" } });
  fireEvent.change(container.querySelector("#propertyStatus")!, { target: { value: "Already owned" } });
  fireEvent.change(container.querySelector("#budget")!, { target: { value: "Under €50k" } });
  fireEvent.change(container.querySelector("#timeline")!, { target: { value: "Immediately" } });
  fireEvent.click(screen.getByRole("checkbox", { name: "Project management" }));
  fireEvent.click(screen.getByRole("radio", { name: "Yes" }));
  fireEvent.change(screen.getByLabelText("Project brief"), {
    target: { value: "A detailed project brief that is long enough to pass validation." },
  });
};

beforeEach(() => {
  invoke.mockClear();
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

describe("Questionnaire form validation", () => {
  it("shows validation errors and does not submit when required fields are empty", async () => {
    await renderQuestionnaire();
    fireEvent.click(getSubmitButton());

    expect(await screen.findByText("Please enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe("Questionnaire honeypot and timing trap", () => {
  it("silently succeeds without submitting when the honeypot field is filled", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "I am a bot" } });

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Thank you — your questionnaire has been received. Anthony will be in touch shortly."));
    expect(invoke).not.toHaveBeenCalled();
  });

  it("silently succeeds without submitting when the form is filled too quickly", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe("Questionnaire real submission", () => {
  it("submits to Supabase with the expected payload once past the timing trap", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);

    // Simulate 3s having passed since mount, clearing the bot-timing trap,
    // without touching the real timers RTL's async utilities rely on.
    // react-hook-form validates asynchronously before calling onSubmit, so
    // the spy has to stay active until that has actually happened.
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    dateSpy.mockRestore();
    const [fnName, options] = invoke.mock.calls[0];
    expect(fnName).toBe("submit-form");
    expect(options.body).toMatchObject({
      form_type: "questionnaire",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+33612345678",
      turnstileToken: "test-turnstile-token",
    });
    expect(toast.success).toHaveBeenCalled();
  });
});
