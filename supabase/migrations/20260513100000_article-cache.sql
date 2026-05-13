CREATE TABLE IF NOT EXISTS public.article_cache (
  url       text        PRIMARY KEY,
  title     text,
  content   text        NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read article cache"
  ON public.article_cache FOR SELECT TO public USING (true);
