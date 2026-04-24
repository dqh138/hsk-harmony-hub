import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Layers, LogIn, Cloud, RotateCw, BookmarkPlus, ChevronRight, Sparkles, CheckCircle2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { vocabByLevel, type VocabWord } from "@/data/vocab";
import { HSKLevel, hskLevelTextColors } from "@/data/grammarTypes";
import { nextSrs, QUALITY_LABELS, type SrsState } from "@/lib/srs";
import { saveWord } from "@/lib/savedWords";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import HanziStrokeAnimation from "@/components/HanziStrokeAnimation";

type ProgressRow = {
  word_id: string;
  level: number;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  due_at: string;
  total_reviews: number;
  lapses: number;
};

type Card = { word: VocabWord; progress?: ProgressRow };

const LEVELS: HSKLevel[] = [1, 2, 3, 4];
const NEW_PER_SESSION = 10;
const MAX_QUEUE = 30;

const Flashcards = () => {
  const { user, loading } = useAuth();
  const [level, setLevel] = useState<HSKLevel>(1);
  const [progressMap, setProgressMap] = useState<Map<string, ProgressRow>>(new Map());
  const [loadingData, setLoadingData] = useState(true);
  const [queue, setQueue] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, again: 0 });
  const [submitting, setSubmitting] = useState(false);

  // Load progress for level
  const loadProgress = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    const { data, error } = await supabase
      .from("flashcard_progress")
      .select("word_id, level, ease_factor, interval_days, repetitions, due_at, total_reviews, lapses")
      .eq("user_id", user.id)
      .eq("level", level);
    if (error) {
      toast({ title: "Lỗi tải tiến độ", description: error.message, variant: "destructive" });
    } else {
      const m = new Map<string, ProgressRow>();
      (data ?? []).forEach((r) => m.set(r.word_id, r as ProgressRow));
      setProgressMap(m);
    }
    setLoadingData(false);
  }, [user, level]);

  useEffect(() => {
    if (loading || !user) return;
    loadProgress();
  }, [loading, user, loadProgress]);

  // Build queue: due cards first, then new cards
  const buildQueue = useCallback(() => {
    const all = vocabByLevel[level] ?? [];
    const now = Date.now();
    const due: Card[] = [];
    const fresh: Card[] = [];
    for (const w of all) {
      const p = progressMap.get(w.id);
      if (!p) fresh.push({ word: w });
      else if (new Date(p.due_at).getTime() <= now) due.push({ word: w, progress: p });
    }
    due.sort((a, b) => new Date(a.progress!.due_at).getTime() - new Date(b.progress!.due_at).getTime());
    const q = [...due, ...fresh.slice(0, NEW_PER_SESSION)].slice(0, MAX_QUEUE);
    setQueue(q);
    setIdx(0);
    setFlipped(false);
    setSessionStats({ reviewed: 0, again: 0 });
  }, [level, progressMap]);

  const stats = useMemo(() => {
    const all = vocabByLevel[level] ?? [];
    const now = Date.now();
    let learned = 0, due = 0;
    for (const w of all) {
      const p = progressMap.get(w.id);
      if (p) {
        learned += 1;
        if (new Date(p.due_at).getTime() <= now) due += 1;
      }
    }
    return { total: all.length, learned, due, fresh: all.length - learned };
  }, [level, progressMap]);

  const current = queue[idx];

  const handleAnswer = async (quality: number) => {
    if (!current || !user || submitting) return;
    setSubmitting(true);
    const prev: SrsState = current.progress
      ? {
          ease_factor: Number(current.progress.ease_factor),
          interval_days: current.progress.interval_days,
          repetitions: current.progress.repetitions,
        }
      : { ease_factor: 2.5, interval_days: 0, repetitions: 0 };
    const result = nextSrs(prev, quality);

    const row = {
      user_id: user.id,
      word_id: current.word.id,
      level: current.word.level,
      hanzi: current.word.hanzi,
      ease_factor: result.ease_factor,
      interval_days: result.interval_days,
      repetitions: result.repetitions,
      due_at: result.due_at,
      last_reviewed_at: new Date().toISOString(),
      last_quality: quality,
      total_reviews: (current.progress?.total_reviews ?? 0) + 1,
      lapses: (current.progress?.lapses ?? 0) + (result.lapsed ? 1 : 0),
    };

    const { error } = await supabase
      .from("flashcard_progress")
      .upsert(row, { onConflict: "user_id,word_id" });
    if (error) {
      toast({ title: "Không lưu được tiến độ", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    // Log review
    await supabase.from("flashcard_reviews").insert({
      user_id: user.id,
      word_id: current.word.id,
      level: current.word.level,
      quality,
      interval_days: result.interval_days,
      ease_factor: result.ease_factor,
    });

    // Update local map
    setProgressMap((m) => {
      const next = new Map(m);
      next.set(current.word.id, {
        word_id: current.word.id,
        level: current.word.level,
        ease_factor: result.ease_factor,
        interval_days: result.interval_days,
        repetitions: result.repetitions,
        due_at: result.due_at,
        total_reviews: row.total_reviews,
        lapses: row.lapses,
      });
      return next;
    });

    setSessionStats((s) => ({ reviewed: s.reviewed + 1, again: s.again + (quality < 3 ? 1 : 0) }));

    // Re-queue if forgot, advance otherwise
    if (quality < 3) {
      setQueue((q) => {
        const copy = [...q];
        const [c] = copy.splice(idx, 1);
        const insertAt = Math.min(copy.length, idx + 3);
        copy.splice(insertAt, 0, c);
        return copy;
      });
      setFlipped(false);
    } else {
      setFlipped(false);
      setIdx((i) => i + 1);
    }
    setSubmitting(false);
  };

  const handleSaveToVocab = async () => {
    if (!current) return;
    const w = current.word;
    await saveWord(w.hanzi, `${w.pinyin} · ${w.meaning}`);
    toast({ title: "Đã lưu vào 生词本", description: w.hanzi });
  };

  // ---- Auth gate ----
  if (loading) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="mx-auto max-w-md p-8 text-center">
            <Layers className="mx-auto mb-3 h-10 w-10 text-primary" />
            <h1 className="mb-2 font-serif text-2xl font-bold gold-text">抽认卡 · Flashcards</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Đăng nhập để học từ vựng theo phương pháp lặp lại ngắt quãng (SRS).
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập / Đăng ký
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // ---- Main UI ----
  const inSession = queue.length > 0 && idx < queue.length;
  const sessionDone = queue.length > 0 && idx >= queue.length;

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold gold-text">抽认卡 · Flashcards</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Cloud className="h-3.5 w-3.5" />
            Lặp lại ngắt quãng (SM-2) · tiến độ đồng bộ trên mọi thiết bị
          </p>
        </div>

        {/* Level picker */}
        <div className="mb-6 flex flex-wrap gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              onClick={() => {
                setLevel(lv);
                setQueue([]);
              }}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-bold transition-colors",
                level === lv ? "border-primary bg-primary/10" : "border-border hover:bg-muted",
                hskLevelTextColors[lv]
              )}
            >
              HSK {lv}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Tổng từ</div>
            <div className="mt-1 text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="h-3 w-3" />Đã học</div>
            <div className="mt-1 text-2xl font-bold text-primary">{stats.learned}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />Tới hạn ôn</div>
            <div className="mt-1 text-2xl font-bold text-destructive">{stats.due}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Sparkles className="h-3 w-3" />Từ mới</div>
            <div className="mt-1 text-2xl font-bold text-muted-foreground">{stats.fresh}</div>
          </Card>
        </div>

        {!inSession && !sessionDone && (
          <Card className="p-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {loadingData ? "Đang tải tiến độ..." : "Sẵn sàng để bắt đầu phiên học mới."}
            </p>
            <Button size="lg" onClick={buildQueue} disabled={loadingData || stats.total === 0}>
              <Layers className="mr-2 h-4 w-4" />
              Bắt đầu phiên ({Math.min(stats.due + Math.min(NEW_PER_SESSION, stats.fresh), MAX_QUEUE)} thẻ)
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Mỗi phiên: tối đa {MAX_QUEUE} thẻ, gồm thẻ tới hạn ôn + tối đa {NEW_PER_SESSION} từ mới.
            </p>
          </Card>
        )}

        {sessionDone && (
          <Card className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h2 className="mb-2 font-serif text-2xl font-bold">Hoàn thành phiên! 🎉</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Đã ôn {sessionStats.reviewed} thẻ · {sessionStats.again} thẻ cần học lại
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={buildQueue}>
                <RotateCw className="mr-2 h-4 w-4" />
                Phiên mới
              </Button>
              <Button variant="outline" onClick={() => setQueue([])}>Đổi cấp độ</Button>
            </div>
          </Card>
        )}

        {inSession && current && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{idx + 1} / {queue.length}</span>
              <Badge variant={current.progress ? "secondary" : "outline"}>
                {current.progress
                  ? `Ôn lại · lần ${current.progress.repetitions + 1}`
                  : "Từ mới"}
              </Badge>
            </div>
            <Progress value={(idx / queue.length) * 100} className="mb-4" />

            <button
              onClick={() => setFlipped((f) => !f)}
              className={cn(
                "flex min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-md transition-all hover:border-primary/50",
                flipped && "bg-muted/30"
              )}
            >
              {!flipped ? (
                <>
                  <div className="font-serif text-6xl font-bold text-foreground">{current.word.hanzi}</div>
                  <div className="mt-6 text-sm text-muted-foreground">Nhấn để xem nghĩa</div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="font-serif text-5xl font-bold text-foreground">{current.word.hanzi}</div>
                  <div className="text-xl text-primary">{current.word.pinyin}</div>
                  <div className="text-sm text-muted-foreground">{current.word.pos}</div>
                  <div className="text-lg font-medium">{current.word.meaning}</div>
                  {current.word.example && (
                    <div className="mt-4 rounded-md bg-muted/50 p-3 text-left">
                      <div className="font-serif text-base">{current.word.example.chinese}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{current.word.example.english}</div>
                    </div>
                  )}
                </div>
              )}
            </button>

            {flipped ? (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUALITY_LABELS.map((q) => (
                  <Button
                    key={q.value}
                    variant={q.value < 3 ? "destructive" : q.value === 5 ? "default" : "outline"}
                    onClick={() => handleAnswer(q.value)}
                    disabled={submitting}
                    className="flex h-auto flex-col gap-0.5 py-3"
                  >
                    <span className="font-bold">{q.label}</span>
                    <span className="text-[10px] opacity-80">{q.hint}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex justify-center">
                <Button onClick={() => setFlipped(true)} size="lg">
                  Lật thẻ
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Phiên: {sessionStats.reviewed} đã ôn · {sessionStats.again} quên</span>
              <Button variant="ghost" size="sm" onClick={handleSaveToVocab}>
                <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
                Lưu vào 生词本
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
