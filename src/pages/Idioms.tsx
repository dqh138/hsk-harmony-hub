import { useState } from "react";
import { Sparkles, Loader2, BookmarkPlus, Volume2, ScrollText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addSavedWord } from "@/lib/savedWords";
import idiomsBg from "@/assets/idioms-bg.jpg";

interface Idiom {
  hanzi: string;
  pinyin: string;
  literal: string;
  meaning: string;
  example_cn: string;
  example_vi: string;
  relevance: string;
}

const CACHE_KEY = "hskhub:idiom-cache";
const readCache = (): Record<string, Idiom[]> => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
};
const writeCache = (key: string, val: Idiom[]) => {
  const c = readCache();
  c[key] = val;
  const entries = Object.entries(c).slice(-30);
  localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
};

const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

const Idioms = () => {
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Idiom[]>([]);
  const [lastQuery, setLastQuery] = useState("");

  const suggest = async () => {
    const text = desc.trim();
    if (text.length < 3) {
      toast({ title: "Mô tả quá ngắn", description: "Nhập ít nhất 3 ký tự.", variant: "destructive" });
      return;
    }
    const cache = readCache();
    if (cache[text]) {
      setResults(cache[text]);
      setLastQuery(text);
      toast({ title: "Kết quả từ bộ nhớ đệm" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("idiom-suggest", {
        body: { description: text },
      });
      if (error) throw error;
      const idioms: Idiom[] = data?.idioms ?? [];
      setResults(idioms);
      setLastQuery(text);
      writeCache(text, idioms);
      if (idioms.length === 0) {
        toast({ title: "Không tìm thấy thành ngữ phù hợp", description: "Thử mô tả rõ hơn." });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Lỗi gợi ý", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const save = async (it: Idiom) => {
    try {
      await addSavedWord({
        hanzi: it.hanzi,
        pinyin: it.pinyin,
        meaning: it.meaning,
        source: "idioms",
      });
      toast({ title: "Đã lưu vào sổ từ vựng", description: it.hanzi });
    } catch (e) {
      toast({ title: "Không lưu được", description: String(e), variant: "destructive" });
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background: 状元 / 科举 vibe */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.08] dark:opacity-[0.06]"
        style={{ backgroundImage: `url(${idiomsBg})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/50 to-background"
      />

      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ScrollText className="h-3.5 w-3.5" />
            成语 · Tra thành ngữ 4 chữ
          </div>
          <h1 className="mb-2 font-serif text-4xl font-bold gold-text">状元阁 · Thành ngữ theo mô tả</h1>
          <p className="text-sm text-muted-foreground">
            Mô tả bằng tiếng Việt (có thể xen tiếng Anh/Trung). AI sẽ chọn thành ngữ 4 chữ phù hợp nhất — mô tả càng chi tiết, gợi ý càng chính xác.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-3xl border-border/60 bg-card/80 p-4 backdrop-blur">
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") suggest();
            }}
            placeholder="Ví dụ: khi ai đó làm việc thừa thãi, cố sức thêm chi tiết không cần thiết khiến kết quả tệ hơn..."
            className="min-h-[120px] resize-none bg-background/70 text-base"
            maxLength={1000}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {desc.length}/1000 · ⌘/Ctrl + Enter để gợi ý
            </span>
            <Button onClick={suggest} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Đang tra..." : "Gợi ý thành ngữ"}
            </Button>
          </div>
        </Card>

        {results.length > 0 && (
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Mô tả: <span className="italic">"{lastQuery}"</span>
              </p>
              <Badge variant="outline" className="text-xs">{results.length} kết quả</Badge>
            </div>
            <div className="space-y-4">
              {results.map((it, i) => (
                <Card key={i} className="border-border/60 bg-card/90 p-5 backdrop-blur transition-shadow hover:shadow-lg">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-3xl font-bold text-foreground">{it.hanzi}</h3>
                        <button
                          onClick={() => speak(it.hanzi)}
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm italic text-secondary">{it.pinyin}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => save(it)} className="gap-1.5">
                      <BookmarkPlus className="h-3.5 w-3.5" />
                      Lưu
                    </Button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {it.literal && (
                      <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Nghĩa đen</p>
                        <p className="text-sm">{it.literal}</p>
                      </div>
                    )}
                    <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Nghĩa bóng</p>
                      <p className="text-sm">{it.meaning}</p>
                    </div>
                  </div>

                  {(it.example_cn || it.example_vi) && (
                    <div className="mt-3 rounded-md border-l-2 border-primary/60 bg-primary/5 p-3">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">Ví dụ</p>
                      {it.example_cn && <p className="text-sm text-foreground">{it.example_cn}</p>}
                      {it.example_vi && <p className="mt-1 text-sm italic text-muted-foreground">{it.example_vi}</p>}
                    </div>
                  )}

                  {it.relevance && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-secondary">Vì sao khớp: </span>
                      {it.relevance}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Idioms;
