import { track as vercelTrack } from "@vercel/analytics";

export type ConversionEvent = "whatsapp_click" | "phone_click" | "email_click" | "form_submit" | "form_error";

/**
 * Conversion events for Vercel Web Analytics. Custom events only show up on a paid Vercel
 * plan; on Hobby the call is a harmless no-op, so it is safe to leave in place either way.
 */
export const track = (event: ConversionEvent, props?: Record<string, string>) => {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
};
