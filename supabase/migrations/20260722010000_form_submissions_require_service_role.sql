-- Close the direct-REST-API bypass: form_submissions can no longer be written by the
-- public anon key at all. All inserts must now go through the submit-form edge function,
-- which verifies a Cloudflare Turnstile token and the honeypot/timing trap server-side
-- before writing with the service role key (which bypasses RLS entirely).

DROP POLICY IF EXISTS "Anyone can submit a form" ON public.form_submissions;

-- No INSERT/SELECT/UPDATE/DELETE policies remain for anon/authenticated — RLS denies
-- everything from the client by default. Only the service role (used exclusively by the
-- submit-form edge function) can write.
