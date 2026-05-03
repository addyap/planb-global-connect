CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact','questionnaire')),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  payload JSONB,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a form"
ON public.form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX idx_form_submissions_created_at ON public.form_submissions (created_at DESC);
CREATE INDEX idx_form_submissions_form_type ON public.form_submissions (form_type);