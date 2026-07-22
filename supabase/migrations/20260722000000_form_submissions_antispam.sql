-- Server-side anti-spam hardening for public.form_submissions.
-- Client-side honeypot/timing checks (Contact.tsx, Questionnaire.tsx) only stop bots
-- that run the React app's JS. Anyone can call the Supabase REST API directly with the
-- public anon key and bypass them entirely, since the existing RLS policy is
-- `WITH CHECK (true)`. This adds checks that run inside Postgres itself, so they apply
-- no matter how the insert is made.

-- Basic email format check (only enforced when an email is provided; DB has no email column NOT NULL).
ALTER TABLE public.form_submissions
  ADD CONSTRAINT form_submissions_email_format_chk
    CHECK (email IS NULL OR email = '' OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- Rate limiting: reject inserts once thresholds are hit, before the row (and its
-- notify-submission email) is ever created.
CREATE OR REPLACE FUNCTION public.form_submissions_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_by_email integer;
  recent_global integer;
BEGIN
  -- Same email address: max 3 submissions per 15 minutes.
  IF NEW.email IS NOT NULL AND NEW.email <> '' THEN
    SELECT count(*) INTO recent_by_email
    FROM public.form_submissions
    WHERE email = NEW.email
      AND created_at > now() - interval '15 minutes';

    IF recent_by_email >= 3 THEN
      RAISE EXCEPTION 'rate limit exceeded' USING ERRCODE = '23514';
    END IF;
  END IF;

  -- Site-wide burst guard: max 10 submissions per minute across all visitors.
  SELECT count(*) INTO recent_global
  FROM public.form_submissions
  WHERE created_at > now() - interval '1 minute';

  IF recent_global >= 10 THEN
    RAISE EXCEPTION 'rate limit exceeded' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS form_submissions_rate_limit ON public.form_submissions;
CREATE TRIGGER form_submissions_rate_limit
BEFORE INSERT ON public.form_submissions
FOR EACH ROW EXECUTE FUNCTION public.form_submissions_rate_limit();

REVOKE EXECUTE ON FUNCTION public.form_submissions_rate_limit() FROM PUBLIC, anon, authenticated;
