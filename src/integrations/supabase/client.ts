import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

if (!isSupabaseConfigured && typeof console !== 'undefined') {
  console.warn(
    '[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. ' +
    'Forms will be disabled but the rest of the site will continue to render.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Use safe placeholders if env is missing so createClient does not throw at module load.
// Calls made against this client will fail at request time, which the forms handle.
export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://missing.supabase.co',
  SUPABASE_PUBLISHABLE_KEY || 'missing-key',
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
