import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PINYIN_GROUPS, TONE_LABELS, displaySyllable, withTone } from "@/data/pinyinSyllables";
import { getExample } from "@/lib/pinyinExamples";

const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "zh-CN";
  utt.rate = 0.75;
  window.speechSynthesis.speak(utt);
};

const PinyinChart = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [playingTone, setPlayingTone] = useState<number | null>(null);

  const q = query.trim().toLowerCase().replace(/\u00fc/g, "v");

  const groups = useMemo(
    () =>
      PINYIN_GROUPS.map((g) => ({
        ...g,
        syllables: q ? g.syllables.filter((s) => s.includes(q)) : g.syllables,
      })).filter((g) => g.syllables.length > 0),
    [q]
  );

  const total = useMemo(() => PINYIN_GROUPS.reduce((n, g) => n + g.syllables.length, 0), []);
  const shown = groups.reduce((n, g) => n + g.syllables.length, 0);

  const playTone = (syllable: string, tone: number) => {
    const example = getExample(syllable, tone);
    setPlayingTone(tone);
    // Ưu tiên đọc chữ Hán mẫu (giọng zh-CN phát âm thanh điệu chuẩn hơn pinyin).
    speak(example?.hanzi ?? withTone(syllable, tone));
    window.setTimeout(() => setPlayingTone(null), 900);
  };

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-3 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Button>
        </Link>

        <header className="mb-6">
          <h1 className="font-serif text-3xl font-black gold-text md:text-4xl">
            拼音表 · Bảng Pinyin
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Toàn bộ {total} âm tiết Pinyin của tiếng Phổ thông, sắp xếp theo thanh mẫu. Nhấn vào một âm
            tiết để nghe lần lượt bốn thanh điệu kèm chữ Hán ví dụ.
          </p>
        </header>

        <div className="relative mb-6 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm âm tiết, ví dụ: zhang, ü, iao..."
            className="pl-9"
          />
          {q && (
            <p className="mt-2 text-xs text-muted-foreground">
              {shown} âm tiết khớp với “{query.trim()}”.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {groups.map((g) => (
            <Card key={g.initial || "zero"}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="font-serif text-xl font-black text-primary">
                    {g.initial || g.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{g.note}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {g.syllables.length} âm tiết
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.syllables.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelected(s)}
                      className={cn(
                        "rounded-md border border-border/60 bg-background/60 px-3 py-1.5 text-sm font-medium transition-all",
                        "hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {displaySyllable(s)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {groups.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Không tìm thấy âm tiết nào phù hợp.
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Âm thanh được tạo bằng giọng đọc tiếng Trung của trình duyệt. Bố cục tham khảo bảng Pinyin
          thông dụng.
        </p>
      </main>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl gold-text">
              {selected ? displaySyllable(selected) : ""}
            </DialogTitle>
            <DialogDescription>
              Chọn một thanh điệu để nghe cách phát âm.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {selected &&
              TONE_LABELS.map(({ tone, name, cn: toneCn, desc }) => {
                const example = getExample(selected, tone);
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => playTone(selected, tone)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border/60 p-3 text-left transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      playingTone === tone && "border-primary bg-primary/10"
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {tone}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-xl font-bold">
                        {withTone(selected, tone)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {name} · {toneCn} — {desc}
                      </span>
                    </span>
                    {example && (
                      <span className="max-w-[9rem] shrink-0 text-right">
                        <span className="block font-serif text-2xl">{example.hanzi}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          {example.meaning}
                        </span>
                      </span>
                    )}
                    <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PinyinChart;
