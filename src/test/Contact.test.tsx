import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { Contact } from "@/components/sections/Contact";

const submitForm = vi.fn().mockResolvedValue(true);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/submit-form", () => ({
  submitForm: (...args: unknown[]) => submitForm(...args),
}));

const getSubmitButton = () => screen.getByRole("button", { name: "Send message" });

const renderContact = async () => {
  const utils = render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
  expect(getSubmitButton()).not.toBeDisabled();
  return utils;
};

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello, I'd like to discuss a project." } });
};

beforeEach(() => {
  submitForm.mockClear();
  submitForm.mockResolvedValue(true);
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
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("silently succeeds without submitting when the form is filled too quickly", async () => {
    await renderContact();
    fillRequiredFields();

    fireEvent.submit(getSubmitButton().closest("form")!);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(submitForm).not.toHaveBeenCalled();
  });
});

describe("Contact form real submission", () => {
  it("submits to /api/submit with the expected payload once past the timing trap", async () => {
    await renderContact();
    fillRequiredFields();

    // Simulate 3s having passed since mount, clearing the bot-timing trap,
    // without touching the real timers RTL's async utilities rely on.
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.submit(getSubmitButton().closest("form")!);
    dateSpy.mockRestore();

    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1));
    expect(submitForm.mock.calls[0][0]).toMatchObject({
      form_type: "contact",
      lang: "en",
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(toast.success).toHaveBeenCalled();
  });
});

describe("Contact form failed submission", () => {
  it("shows an error toast and does not redirect to a mail client when sending fails", async () => {
    submitForm.mockResolvedValue(false);
    const hrefBefore = window.location.href;
    await renderContact();
    fillRequiredFields();

    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3000);
    fireEvent.submit(getSubmitButton().closest("form")!);
    dateSpy.mockRestore();

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(toast.success).not.toHaveBeenCalled();
    expect(window.location.href).toBe(hrefBefore);
  });
});
