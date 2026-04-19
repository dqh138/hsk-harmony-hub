
ALTER TABLE public.highlights 
  ADD COLUMN IF NOT EXISTS route TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS context_before TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS context_after TEXT NOT NULL DEFAULT '';

ALTER TABLE public.highlights DROP CONSTRAINT IF EXISTS highlights_user_id_text_key;

CREATE UNIQUE INDEX IF NOT EXISTS highlights_user_route_text_ctx_key
  ON public.highlights (user_id, route, text, context_before, context_after);

CREATE INDEX IF NOT EXISTS idx_highlights_user_route ON public.highlights (user_id, route);
