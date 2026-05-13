import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Headphones,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  RefreshCw,
  Volume2,
  Newspaper,
  Loader2,
  Rewind,
  FastForward,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type NewsItem = { id: string; title: string; url: string; extra?: string };
type NewsResponse = { items: NewsItem[]; updated_at: string; cached?: boolean };

type SourceDef = { id: string; cn: string; vi: string };

const ALL_SOURCES: SourceDef[] = [
  { id: "weibo", cn: "微博热搜", vi: "Weibo Hot" },
  { id: "baidu", cn: "百度热搜", vi: "Baidu Hot" },
  { id: "zhihu", cn: "知乎热榜", vi: "Zhihu Hot" },
  { id: "toutiao", cn: "今日头条", vi: "Toutiao" },
  { id: "ithome", cn: "IT之家", vi: "ITHome" },
  { id: "juejin", cn: "掘金热榜", vi: "Juejin" },
  { id: "thepaper", cn: "澎湃新闻", vi: "ThePaper" },
  { id: "cls", cn: "财联社电报", vi: "CLS Telegraph" },
];

type PlaylistItem = NewsItem & { sourceId: string; sourceCn: string };

const SPEEDS = [0.7, 0.85, 1.0, 1.15, 1.3, 1.5];
const STORAGE_KEY = "hskhub:passive-listening";

const formatTime = (sec: number) => {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PassiveListening = () => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(ALL_SOURCES.map((s) => s.id));
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.sources) && parsed.sources.length > 0) {
          return new Set(parsed.sources);
        }
      }
    } catch {
      // ignore
    }
    return new Set(ALL_SOURCES.map((s) => s.id));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stoppedManuallyRef = useRef(false);

  // Time tracking (estimated, since Web Speech API has no native seek)
  const CHARS_PER_SEC_AT_1X = 4.2; // empirical for Chinese hanzi
  const [elapsedSec, setElapsedSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const offsetAtStartRef = useRef(0); // seconds offset already played before current utterance
  const startTimeRef = useRef<number | null>(null); // ms timestamp when current utterance started
  const tickerRef = useRef<number | null>(null);
  const pausedOffsetRef = useRef(0); // where to resume when paused

  const stopTicker = () => {
    if (tickerRef.current !== null) {
      window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  };

  const startTicker = useCallback((totalDur: number) => {
    stopTicker();
    tickerRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) return;
      const playedNow = (performance.now() - startTimeRef.current) / 1000;
      const total = offsetAtStartRef.current + playedNow;
      setElapsedSec(Math.min(total, totalDur));
    }, 200) as unknown as number;
  }, []);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sources: Array.from(selectedSources),
          speed,
          loop,
          shuffle,
          voiceURI,
        })
      );
    } catch {
      // ignore
    }
  }, [selectedSources, speed, loop, shuffle, voiceURI]);

  // Load saved speed/loop/shuffle/voice
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (typeof p.speed === "number") setSpeed(p.speed);
      if (typeof p.loop === "boolean") setLoop(p.loop);
      if (typeof p.shuffle === "boolean") setShuffle(p.shuffle);
      if (typeof p.voiceURI === "string") setVoiceURI(p.voiceURI);
    } catch {
      // ignore
    }
  }, []);

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
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sources = Array.from(selectedSources);
      const results = await Promise.all(
        sources.map(async (sid) => {
          try {
            const { data, error: err } = await supabase.functions.invoke(
              "chinese-news",
              { body: { source: sid } }
            );
            if (err) throw err;
            const resp = data as NewsResponse;
            const src = ALL_SOURCES.find((s) => s.id === sid);
            return (resp.items ?? []).slice(0, 12).map<PlaylistItem>((it) => ({
              ...it,
              sourceId: sid,
              sourceCn: src?.cn ?? sid,
            }));
          } catch {
            return [] as PlaylistItem[];
          }
        })
      );
      let merged = results.flat();
      // De-dup by title
      const seen = new Set<string>();
      merged = merged.filter((it) => {
        const k = it.title.trim();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (shuffle) {
        merged = merged
          .map((v) => ({ v, r: Math.random() }))
          .sort((a, b) => a.r - b.r)
          .map((x) => x.v);
      }
      setPlaylist(merged);
      setCurrentIndex(0);
    } catch (e) {
      setError((e as Error).message ?? "Lỗi tải tin");
    } finally {
      setLoading(false);
    }
  }, [selectedSources, shuffle]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSpeak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stoppedManuallyRef.current = true;
    stopTicker();
    window.speechSynthesis.cancel();
  }, []);

  const buildText = (item: PlaylistItem) => `${item.sourceCn}。${item.title}`;

  const estimateDuration = useCallback(
    (text: string) => text.length / (CHARS_PER_SEC_AT_1X * speed),
    [speed]
  );

  const speakIndex = useCallback(
    (idx: number, offsetSec: number = 0) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setError("Trình duyệt không hỗ trợ đọc tiếng. Hãy thử Chrome hoặc Edge mới nhất.");
        return;
      }
      const item = playlist[idx];
      if (!item) {
        setIsPlaying(false);
        return;
      }
      stoppedManuallyRef.current = true;
      stopTicker();
      window.speechSynthesis.cancel();

      const fullText = buildText(item);
      const totalDur = estimateDuration(fullText);
      setDurationSec(totalDur);

      const safeOffset = Math.max(0, Math.min(offsetSec, Math.max(0, totalDur - 0.2)));
      const startCharIdx = Math.floor((safeOffset / Math.max(totalDur, 0.001)) * fullText.length);
      const text = fullText.slice(startCharIdx);

      offsetAtStartRef.current = safeOffset;
      pausedOffsetRef.current = safeOffset;
      setElapsedSec(safeOffset);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = speed;
      const v = voices.find((vv) => vv.voiceURI === voiceURI);
      if (v) u.voice = v;
      else {
        const zh = voices.find((vv) => vv.lang.toLowerCase().startsWith("zh"));
        if (zh) u.voice = zh;
      }
      u.onstart = () => {
        startTimeRef.current = performance.now();
        startTicker(totalDur);
      };
      u.onend = () => {
        stopTicker();
        if (stoppedManuallyRef.current) return;
        setElapsedSec(totalDur);
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= playlist.length) {
            if (loop && playlist.length > 0) {
              setTimeout(() => speakIndex(0, 0), 200);
              return 0;
            }
            setIsPlaying(false);
            return prev;
          }
          setTimeout(() => speakIndex(next, 0), 200);
          return next;
        });
      };
      u.onerror = () => {
        stopTicker();
        setIsPlaying(false);
      };
      stoppedManuallyRef.current = false;
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    },
    [playlist, speed, voices, voiceURI, loop, estimateDuration, startTicker]
  );

  const handlePlayPause = () => {
    if (playlist.length === 0) return;
    if (isPlaying) {
      // Save where we are so resume continues from same spot
      if (startTimeRef.current !== null) {
        const playedNow = (performance.now() - startTimeRef.current) / 1000;
        pausedOffsetRef.current = Math.min(
          offsetAtStartRef.current + playedNow,
          durationSec
        );
      }
      stopSpeak();
      setIsPlaying(false);
    } else {
      speakIndex(currentIndex, pausedOffsetRef.current);
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    const next = (currentIndex + 1) % playlist.length;
    setCurrentIndex(next);
    pausedOffsetRef.current = 0;
    if (isPlaying) speakIndex(next, 0);
    else {
      const item = playlist[next];
      if (item) {
        setDurationSec(estimateDuration(buildText(item)));
        setElapsedSec(0);
      }
    }
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prev);
    pausedOffsetRef.current = 0;
    if (isPlaying) speakIndex(prev, 0);
    else {
      const item = playlist[prev];
      if (item) {
        setDurationSec(estimateDuration(buildText(item)));
        setElapsedSec(0);
      }
    }
  };

  const handleSkip = (deltaSec: number) => {
    if (playlist.length === 0) return;
    // Compute current absolute elapsed
    let current = pausedOffsetRef.current;
    if (isPlaying && startTimeRef.current !== null) {
      const playedNow = (performance.now() - startTimeRef.current) / 1000;
      current = offsetAtStartRef.current + playedNow;
    }
    const target = current + deltaSec;
    if (target < 0) {
      // Go to previous track at end - |target|
      if (currentIndex > 0 || loop) {
        const prev = (currentIndex - 1 + playlist.length) % playlist.length;
        const prevItem = playlist[prev];
        if (!prevItem) return;
        const prevDur = estimateDuration(buildText(prevItem));
        const newOffset = Math.max(0, prevDur + target); // target is negative
        setCurrentIndex(prev);
        if (isPlaying) speakIndex(prev, newOffset);
        else {
          pausedOffsetRef.current = newOffset;
          setDurationSec(prevDur);
          setElapsedSec(newOffset);
        }
      } else {
        // Clamp at 0
        if (isPlaying) speakIndex(currentIndex, 0);
        else {
          pausedOffsetRef.current = 0;
          setElapsedSec(0);
        }
      }
      return;
    }
    if (target >= durationSec) {
      // advance to next
      handleNext();
      return;
    }
    if (isPlaying) speakIndex(currentIndex, target);
    else {
      pausedOffsetRef.current = target;
      setElapsedSec(target);
    }
  };

  const handleSeek = (sec: number) => {
    if (playlist.length === 0 || durationSec <= 0) return;
    const target = Math.max(0, Math.min(sec, durationSec));
    if (isPlaying) speakIndex(currentIndex, target);
    else {
      pausedOffsetRef.current = target;
      setElapsedSec(target);
    }
  };

  // Update duration when track changes (idle state)
  useEffect(() => {
    const item = playlist[currentIndex];
    if (!item) {
      setDurationSec(0);
      setElapsedSec(0);
      return;
    }
    if (!isPlaying) {
      setDurationSec(estimateDuration(buildText(item)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playlist, speed]);

  // Stop on unmount
  useEffect(() => {
    return () => {
      stopTicker();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Re-apply speed/voice mid-play (keep current position)
  useEffect(() => {
    if (isPlaying) {
      let current = pausedOffsetRef.current;
      if (startTimeRef.current !== null) {
        const playedNow = (performance.now() - startTimeRef.current) / 1000;
        current = offsetAtStartRef.current + playedNow;
      }
      speakIndex(currentIndex, current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, voiceURI]);

  const toggleSource = (id: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) next.add(id); // keep at least 1
      return next;
    });
  };

  const current = playlist[currentIndex];
  const upcoming = useMemo(() => playlist.slice(currentIndex + 1, currentIndex + 6), [playlist, currentIndex]);

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
            Tự động đọc to các tiêu đề nóng từ Weibo, Baidu, Zhihu, ITHome… bằng giọng tiếng Trung.
            Bật lên rồi làm việc khác — tai bạn vẫn quen với âm điệu chuẩn.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Player */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Đang phát · {currentIndex + 1}/{playlist.length || 0}
                </p>
                {current ? (
                  <>
                    <h2 className="mt-2 font-serif text-2xl font-black leading-tight md:text-3xl">
                      {current.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">{current.sourceCn}</span>
                      {current.extra ? ` · ${current.extra}` : ""}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {loading ? "Đang tải tin…" : error ?? "Chưa có tin để phát."}
                  </p>
                )}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={fetchAll}
                disabled={loading}
                title="Tải lại danh sách tin"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <input
                type="range"
                min={0}
                max={Math.max(durationSec, 0.1)}
                step={0.1}
                value={Math.min(elapsedSec, durationSec)}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                disabled={!playlist.length}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary disabled:opacity-50"
                aria-label="Tiến độ đọc"
              />
              <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
                <span>{formatTime(elapsedSec)}</span>
                <span className="italic">~ ước lượng theo tốc độ</span>
                <span>{formatTime(durationSec)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
              <Button size="icon" variant="ghost" onClick={handlePrev} disabled={!playlist.length} title="Tin trước">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleSkip(-5)}
                disabled={!playlist.length}
                title="Tua lùi 5 giây"
                className="relative"
              >
                <Rewind className="h-4 w-4" />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-background px-1 text-[9px] font-bold text-primary">5</span>
              </Button>
              <Button
                size="icon"
                onClick={handlePlayPause}
                disabled={!playlist.length}
                className="h-14 w-14 rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleSkip(5)}
                disabled={!playlist.length}
                title="Tua tới 5 giây"
                className="relative"
              >
                <FastForward className="h-4 w-4" />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-background px-1 text-[9px] font-bold text-primary">5</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={handleNext} disabled={!playlist.length} title="Tin sau">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Speed + loop + shuffle */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/50 p-1">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant={loop ? "default" : "outline"}
                onClick={() => setLoop((v) => !v)}
                className="gap-1.5"
              >
                <Repeat className="h-3.5 w-3.5" /> Loop
              </Button>
              <Button
                size="sm"
                variant={shuffle ? "default" : "outline"}
                onClick={() => {
                  setShuffle((v) => !v);
                  fetchAll();
                }}
                className="gap-1.5"
              >
                <Shuffle className="h-3.5 w-3.5" /> Shuffle
              </Button>
            </div>

            {/* Voice picker */}
            {voices.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Giọng:</span>
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

            {/* Up next */}
            <div className="mt-8 border-t border-border/40 pt-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tiếp theo
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Hết danh sách. Bật Loop để nghe lại.</p>
              ) : (
                <ul className="space-y-1.5">
                  {upcoming.map((it, i) => (
                    <li key={`${it.sourceId}-${it.id}-${i}`} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 w-5 text-right text-xs text-muted-foreground">
                        {currentIndex + i + 2}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{it.title}</p>
                        <p className="text-xs text-muted-foreground">{it.sourceCn}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Sidebar: source picker */}
          <aside className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="font-serif text-lg font-bold">Nguồn tin</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Chọn các nguồn muốn đưa vào danh sách phát.
            </p>
            <div className="mt-4 space-y-2">
              {ALL_SOURCES.map((s) => {
                const checked = selectedSources.has(s.id);
                return (
                  <label
                    key={s.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm transition-colors",
                      checked ? "bg-primary/5 border-primary/40" : "hover:bg-muted"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSource(s.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="font-medium">{s.cn}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{s.vi}</span>
                  </label>
                );
              })}
            </div>
            <Button onClick={fetchAll} className="mt-4 w-full gap-1.5" disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Áp dụng & tải lại
            </Button>

            <div className="mt-6 rounded-lg border border-border/40 bg-background/50 p-3 text-xs italic text-muted-foreground">
              Mẹo: bật Loop, chọn 0.85× và để trang này mở trong tab nền — bạn vẫn nghe được khi làm việc khác.
            </div>

            <Link
              to="/news"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <Newspaper className="h-4 w-4" /> Đọc nguyên văn ở 新闻 →
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default PassiveListening;
