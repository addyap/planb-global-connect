ALTER TABLE public.form_submissions
  ADD CONSTRAINT form_submissions_name_length_chk
    CHECK (name IS NULL OR char_length(name) <= 200),
  ADD CONSTRAINT form_submissions_email_length_chk
    CHECK (email IS NULL OR char_length(email) <= 320),
  ADD CONSTRAINT form_submissions_phone_length_chk
    CHECK (phone IS NULL OR char_length(phone) <= 50),
  ADD CONSTRAINT form_submissions_message_length_chk
    CHECK (message IS NULL OR char_length(message) <= 5000),
  ADD CONSTRAINT form_submissions_payload_length_chk
    CHECK (payload IS NULL OR char_length(payload::text) <= 20000);