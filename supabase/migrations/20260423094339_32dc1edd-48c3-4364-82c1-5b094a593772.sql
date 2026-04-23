CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  section TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  elapsed_seconds INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT exam_results_section_check CHECK (section IN ('listening', 'reading', 'writing')),
  CONSTRAINT exam_results_total_questions_check CHECK (total_questions >= 0),
  CONSTRAINT exam_results_correct_answers_check CHECK (correct_answers >= 0),
  CONSTRAINT exam_results_elapsed_seconds_check CHECK (elapsed_seconds IS NULL OR elapsed_seconds >= 0)
);

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exam results"
ON public.exam_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exam results"
ON public.exam_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam results"
ON public.exam_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exam results"
ON public.exam_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_exam_results_user_submitted_at
ON public.exam_results (user_id, submitted_at DESC);

CREATE INDEX idx_exam_results_exam_id
ON public.exam_results (exam_id);

CREATE TRIGGER update_exam_results_updated_at
BEFORE UPDATE ON public.exam_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();