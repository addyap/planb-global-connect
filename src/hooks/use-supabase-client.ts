import { useEffect, useState } from "react";

type SupabaseModule = typeof import("@/integrations/supabase/client");

/**
 * Loads the Supabase client lazily so it ships in its own chunk instead of
 * the homepage's critical bundle — most visitors never touch a form.
 */
export function useSupabaseClient() {
  const [mod, setMod] = useState<SupabaseModule | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/integrations/supabase/client").then((m) => {
      if (!cancelled) setMod(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return mod;
}
