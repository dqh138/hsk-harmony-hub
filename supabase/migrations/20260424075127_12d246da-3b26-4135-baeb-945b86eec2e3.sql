-- Bảng lưu tiến độ ôn tập flashcard theo thuật toán SM-2
CREATE TABLE public.flashcard_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  word_id TEXT NOT NULL,
  level INTEGER NOT NULL,
  hanzi TEXT NOT NULL,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  due_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  last_quality SMALLINT,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, word_id)
);

CREATE INDEX idx_flashcard_progress_user_due ON public.flashcard_progress (user_id, due_at);
CREATE INDEX idx_flashcard_progress_user_level ON public.flashcard_progress (user_id, level);

ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own flashcard progress"
ON public.flashcard_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own flashcard progress"
ON public.flashcard_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own flashcard progress"
ON public.flashcard_progress FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete their own flashcard progress"
ON public.flashcard_progress FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_flashcard_progress_updated_at
BEFORE UPDATE ON public.flashcard_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bảng log lịch sử mỗi lượt ôn (để phân tích/biểu đồ)
CREATE TABLE public.flashcard_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  word_id TEXT NOT NULL,
  level INTEGER NOT NULL,
  quality SMALLINT NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_flashcard_reviews_user_time ON public.flashcard_reviews (user_id, reviewed_at DESC);

ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own flashcard reviews"
ON public.flashcard_reviews FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own flashcard reviews"
ON public.flashcard_reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);