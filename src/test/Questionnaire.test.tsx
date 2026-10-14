import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { Questionnaire } from "@/components/sections/Questionnaire";

const submitForm = vi.fn().mockResolvedValue(true);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/submit-form", () => ({
  submitForm: (...args: unknown[]) => submitForm(...args),
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
  expect(getSubmitButton()).not.toBeDisabled();
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
  submitForm.mockClear();
  submitForm.mockResolvedValue(true);
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

describe("Questionnaire form validation", () => {
  it("shows validation errors and does not submit when required fields are empty", async () => {
    await renderQuestionnaire();
    fireEvent.click(getSubmitButton());

    expect(await screen.findByText("Please enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });
});

describe("Questionnaire honeypot and timing trap", () => {
  it("silently succeeds without submitting when the honeypot field is filled", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "I am a bot" } });

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Thank you — your questionnaire has been received. Anthony will be in touch shortly."));
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("silently succeeds without submitting when the form is filled too quickly", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(submitForm).not.toHaveBeenCalled();
  });
});

describe("Questionnaire real submission", () => {
  it("submits to /api/submit with the expected payload once past the timing trap", async () => {
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);

    // Simulate 3s having passed since mount, clearing the bot-timing trap,
    // without touching the real timers RTL's async utilities rely on.
    // react-hook-form validates asynchronously before calling onSubmit, so
    // the spy has to stay active until that has actually happened.
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
    dateSpy.mockRestore();
    expect(submitForm.mock.calls[0][0]).toMatchObject({
      form_type: "questionnaire",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+33612345678",
      turnstileToken: "test-turnstile-token",
    });
    expect(toast.success).toHaveBeenCalled();
  });
});

describe("Questionnaire failed submission", () => {
  it("shows an error toast and does not redirect to a mail client when sending fails", async () => {
    submitForm.mockResolvedValue(false);
    const hrefBefore = window.location.href;
    const { container } = await renderQuestionnaire();
    fillRequiredFields(container);

    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    dateSpy.mockRestore();
    expect(toast.success).not.toHaveBeenCalled();
    expect(window.location.href).toBe(hrefBefore);
  });
});
