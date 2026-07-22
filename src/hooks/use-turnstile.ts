import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile script failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders a Turnstile widget into containerRef and keeps the latest token in tokenRef.
 * Tokens are single-use — call reset() after every submit attempt (success or failure).
 */
export function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string>("");
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn("[turnstile] VITE_TURNSTILE_SITE_KEY is missing; forms will be disabled.");
      return;
    }
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "light",
          callback: (token: string) => {
            tokenRef.current = token;
          },
          "expired-callback": () => {
            tokenRef.current = "";
          },
          "error-callback": () => {
            tokenRef.current = "";
          },
        });
      })
      .catch((err) => console.error("[turnstile]", err));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const getToken = () => tokenRef.current;
  const reset = () => {
    tokenRef.current = "";
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return { containerRef, getToken, reset, isConfigured: Boolean(SITE_KEY) };
}
