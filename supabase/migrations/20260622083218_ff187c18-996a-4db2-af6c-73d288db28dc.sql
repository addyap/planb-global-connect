
-- Enable pg_net for async HTTP calls from Postgres
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: POST the inserted row to the notify-submission edge function.
-- Wrapped in a safe block so a webhook failure can never block the INSERT.
CREATE OR REPLACE FUNCTION public.notify_form_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fn_url text := 'https://zavyvuoedgauwtuacdxy.supabase.co/functions/v1/notify-submission';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inphdnl2dW9lZGdhdXd0dWFjZHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTM2NDYsImV4cCI6MjA5MzM4OTY0Nn0.itWekwn1l-VR7EAZF7yQ99sAdSOyfjvZn6A6BcBSDyM';
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
