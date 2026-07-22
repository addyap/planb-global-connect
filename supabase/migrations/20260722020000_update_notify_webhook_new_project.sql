-- Repoints the form-submission email-notify webhook at the new Supabase project.
-- The original project (zavyvuoedgauwtuacdxy) turned out to still be Lovable-owned;
-- this repo now runs against a fresh project (izhwthfmsyjxbusypihe) created directly
-- under the site owner's own account. Same trigger/function, updated constants.

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_form_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fn_url text := 'https://izhwthfmsyjxbusypihe.supabase.co/functions/v1/notify-submission';
  anon_key text := 'sb_publishable_TrpqOBjCQcMrpnnw5fW4mw_EJNqR_l5';
BEGIN
  BEGIN
    PERFORM net.http_post(
      url := fn_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', to_jsonb(NEW),
        'old_record', NULL
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_form_submission webhook failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS form_submissions_notify ON public.form_submissions;
CREATE TRIGGER form_submissions_notify
AFTER INSERT ON public.form_submissions
FOR EACH ROW EXECUTE FUNCTION public.notify_form_submission();

REVOKE EXECUTE ON FUNCTION public.notify_form_submission() FROM PUBLIC, anon, authenticated;
