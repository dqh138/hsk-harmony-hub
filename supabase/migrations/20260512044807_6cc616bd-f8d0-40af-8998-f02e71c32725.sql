CREATE TABLE IF NOT EXISTS public.news_cache (
  source_id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news cache"
ON public.news_cache FOR SELECT
USING (true);