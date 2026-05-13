import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RefreshCw,
  Volume2,
  Loader2,
  ExternalLink,
  BookOpen,
  Headphones,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type NewsItem = { id: string; title: string; url: string; extra?: string };
type NewsResponse = { items: NewsItem[]; updated_at: string; cached?: boolean };

const ARTICLE_SOURCES = [
  { id: "thepaper", cn: "澎湃新闻" },
  { id: "ithome",   cn: "IT之家" },
  { id: "juejin",   cn: "掘金热榜" },
  { id: "cls",      cn: "财联社电报" },
];
const ARTICLE_SOURCE_IDS = new Set(ARTICLE_SOURCES.map((s) => s.id));

type PlaylistItem = NewsItem & { sourceId: string; sourceCn: string };

const SPEEDS = [0.7, 0.85, 1.0, 1.15, 1.3];

function splitChunks(text: string, maxLen = 170): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[。！？；\n])/);
  let cur = "";
  for (const s of sentences) {
    if (!s.trim()) continue;
    if ((cur + s).length > maxLen && cur.length > 0) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

const PassiveListening = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => {
      const all = window.speechSynthesis.getVoices();
      const zh = all.filter((v) => v.lang.toLowerCase().startsWith("zh"));
      setVoices(zh.length > 0 ? zh : all);
    };
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        ARTICLE_SOURCES.map(async ({ id: sid, cn: sourceCn }) => {
          try {
            const { data, error: err } = await supabase.functions.invoke("chinese-news", {
              body: { source: sid },
            });
            if (err) throw err;
            return ((data as NewsResponse).items ?? []).slice(0, 15).map<PlaylistItem>((it) => ({
              ...it,
              sourceId: sid,
              sourceCn,
            }));
          } catch {
            return [] as PlaylistItem[];
          }
        })
      );
      const merged = results.flat();
      const seen = new Set<string>();
      setPlaylist(
        merged.filter((it) => {
          if (!it.title.trim() || seen.has(it.title)) return false;
          seen.add(it.title);
          return true;
        })
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4 py-12 text-center md:py-16">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Headphones className="h-3.5 w-3.5" />
            被动听力 · Nghe thụ động
          </div>
          <h1 className="mt-5 font-serif text-4xl font-black tracking-tight gold-text sm:text-5xl md:text-6xl">
            Nghe tin Trung Quốc
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Chọn bài từ ThePaper, ITHome, Juejin, CLS — đọc to toàn bài bằng giọng tiếng Trung chuẩn.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <ArticleReader
          playlist={playlist}
          voices={voices}
          speed={speed}
          setSpeed={setSpeed}
          voiceURI={voiceURI}
          setVoiceURI={setVoiceURI}
          loading={loading}
          fetchAll={fetchAll}
        />
      </section>
    </div>
  );
};

// ---------- Article Reader ----------

type ArticleReaderProps = {
  playlist: PlaylistItem[];
  voices: SpeechSynthesisVoice[];
  speed: number;
  setSpeed: (s: number) => void;
  voiceURI: string | null;
  setVoiceURI: (v: string | null) => void;
  loading: boolean;
  fetchAll: () => void;
};

const ArticleReader = ({
  playlist,
  voices,
  speed,
  setSpeed,
  voiceURI,
  setVoiceURI,
  loading,
  fetchAll,
}: ArticleReaderProps) => {
  const [selected, setSelected] = useState<PlaylistItem | null>(null);
  const [content, setContent] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChunk, setActiveChunk] = useState(-1);
  const contentCache = useRef(new Map<string, string>());
  const chunkIdxRef = useRef(0);
  const stoppedRef = useRef(false);
  const chunkRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const chunks = useMemo(
    () =>
      content
        ? splitChunks(
            [selected?.sourceCn, selected?.title, content].filter(Boolean).join("。")
          )
        : [],
    [content, selected]
  );

  const pickVoice = useCallback(
    () =>
      voices.find((v) => v.voiceURI === voiceURI) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ??
      null,
    [voices, voiceURI]
  );

  const speakChunk = useCallback(
    (idx: number, chunkList: string[]) => {
      if (idx >= chunkList.length) {
        setIsPlaying(false);
        setActiveChunk(-1);
        return;
      }
      const u = new SpeechSynthesisUtterance(chunkList[idx]);
      u.lang = "zh-CN";
      u.rate = speed;
      const v = pickVoice();
      if (v) u.voice = v;
      u.onstart = () => {
        setActiveChunk(idx);
        chunkRefs.current[idx]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
      u.onend = () => {
        if (stoppedRef.current) return;
        chunkIdxRef.current = idx + 1;
        speakChunk(idx + 1, chunkList);
      };
      u.onerror = () => {
        if (stoppedRef.current) return;
        chunkIdxRef.current = idx + 1;
        speakChunk(idx + 1, chunkList);
      };
      window.speechSynthesis.speak(u);
    },
    [speed, pickVoice]
  );

  const play = useCallback(
    (fromChunk = 0) => {
      if (chunks.length === 0) return;
      stoppedRef.current = false;
      chunkIdxRef.current = fromChunk;
      window.speechSynthesis.cancel();
      setIsPlaying(true);
      speakChunk(fromChunk, chunks);
    },
    [chunks, speakChunk]
  );

  const stop = useCallback(() => {
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveChunk(-1);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const cur = chunkIdxRef.current;
      stop();
      setTimeout(() => play(cur), 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, voiceURI]);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  const selectItem = async (item: PlaylistItem) => {
    stop();
    setSelected(item);
    setActiveChunk(-1);
    const cacheKey = item.url;
    if (contentCache.current.has(cacheKey)) {
      setContent(contentCache.current.get(cacheKey)!);
      setFetchError(false);
      return;
    }
    setContent("");
    setFetchError(false);
    setFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("article-content", {
        body: { url: item.url },
      });
      if (error || !data?.content) {
        setFetchError(true);
      } else {
        contentCache.current.set(cacheKey, data.content);
        setContent(data.content);
      }
    } catch {
      setFetchError(true);
    } finally {
      setFetching(false);
    }
  };

  // Group articles by source for the sidebar
  const bySource = useMemo(() => {
    const map = new Map<string, PlaylistItem[]>();
    for (const item of playlist) {
      const arr = map.get(item.sourceId) ?? [];
      arr.push(item);
      map.set(item.sourceId, arr);
    }
    return map;
  }, [playlist]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Player panel */}
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Chọn một bài từ danh sách →</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {selected.sourceCn}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-black leading-tight">
                  {selected.title}
                </h2>
                {selected.extra && (
                  <p className="mt-1 text-xs text-muted-foreground">{selected.extra}</p>
                )}
              </div>
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Bài gốc <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Content */}
            <div className="mt-5 max-h-[420px] overflow-y-auto rounded-xl bg-muted/30 p-4">
              {fetching ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải nội dung…
                </div>
              ) : fetchError ? (
                <p className="py-10 text-center text-sm italic text-muted-foreground">
                  Không tải được nội dung bài này.
                </p>
              ) : chunks.length > 0 ? (
                <div className="space-y-1.5 text-sm leading-relaxed">
                  {chunks.map((chunk, i) => (
                    <p
                      key={i}
                      ref={(el) => { chunkRefs.current[i] = el; }}
                      onClick={() => { stop(); play(i); }}
                      className={cn(
                        "cursor-pointer rounded px-1.5 py-0.5 transition-colors",
                        activeChunk === i
                          ? "bg-primary/20 text-foreground font-medium"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      {chunk}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-sm italic text-muted-foreground">
                  Đang chờ nội dung…
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                onClick={isPlaying ? stop : () => play(0)}
                disabled={fetching || chunks.length === 0}
                className="gap-2 min-w-[130px]"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4" /> Dừng</>
                ) : (
                  <><Play className="h-4 w-4" /> Phát giọng</>
                )}
              </Button>

              <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/50 p-1">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                      speed === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              {voices.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Volume2 className="h-3.5 w-3.5" />
                  <select
                    value={voiceURI ?? ""}
                    onChange={(e) => setVoiceURI(e.target.value || null)}
                    className="rounded-md border border-border/50 bg-background px-2 py-1 text-xs"
                  >
                    <option value="">Mặc định (zh-CN)</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {isPlaying && chunks.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Đoạn {activeChunk + 1}/{chunks.length} · Bấm vào đoạn bất kỳ để phát từ đó
              </p>
            )}
          </>
        )}
      </div>

      {/* Article list sidebar */}
      <aside className="rounded-2xl border border-border/50 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold">Chọn bài</h3>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={fetchAll}
            disabled={loading}
            title="Tải lại"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {loading && playlist.length === 0 ? (
          <p className="text-sm text-muted-foreground">Đang tải tin…</p>
        ) : playlist.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có tin. Bấm tải lại.</p>
        ) : (
          <div className="max-h-[640px] space-y-4 overflow-y-auto pr-1">
            {ARTICLE_SOURCES.map(({ id: sid, cn }) => {
              const items = bySource.get(sid);
              if (!items || items.length === 0) return null;
              return (
                <div key={sid}>
                  <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {cn}
                  </p>
                  <div className="space-y-1">
                    {items.map((item, i) => {
                      const isActive =
                        selected?.id === item.id && selected?.sourceId === item.sourceId;
                      return (
                        <button
                          key={`${sid}-${item.id}-${i}`}
                          onClick={() => selectItem(item)}
                          className={cn(
                            "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "border-primary/60 bg-primary/5"
                              : "border-border/40 hover:bg-muted"
                          )}
                        >
                          <p className="line-clamp-2 font-medium leading-snug">{item.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
};

export default PassiveListening;
