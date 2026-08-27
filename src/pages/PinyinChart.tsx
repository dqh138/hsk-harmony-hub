import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
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

/**
 * Chuyển cách viết chính tả (yi/wu/yu/ju...) về vận mẫu gốc để xếp vào đúng cột.
 * Ví dụ: "yi" -> "i", "ju" -> "ü", "wan" -> "uan".
 */
const ZERO_INITIAL_FINALS: Record<string, string> = {
  yi: "i", ya: "ia", ye: "ie", yao: "iao", you: "iu", yan: "ian", yin: "in", yang: "iang", ying: "ing",
  wu: "u", wa: "ua", wo: "uo", wai: "uai", wei: "ui", wan: "uan", wen: "un", wang: "uang", weng: "ueng",
  yu: "\u00fc", yue: "\u00fce", yuan: "\u00fcan", yun: "\u00fcn", yong: "iong",
};

const getFinal = (initial: string, syllable: string): string => {
  if (!initial) return ZERO_INITIAL_FINALS[syllable] ?? syllable;
  let f = syllable.slice(initial.length);
  // j/q/x + u thực chất là ü
  if ("jqx".includes(initial) && f.startsWith("u")) {
    f = "\u00fc" + f.slice(1);
  }
  return f;
};

/** Thứ tự cột vận mẫu theo bảng Pinyin truyền thống. */
const FINAL_ORDER = [
  "a", "o", "e", "er",
  "ai", "ei", "ao", "ou",
  "an", "en", "ang", "eng", "ong",
  "i", "ia", "ie", "iao", "iu", "ian", "in", "iang", "ing", "iong",
  "u", "ua", "uo", "uai", "ui", "uan", "un", "uang", "ueng",
  "\u00fc", "\u00fce", "\u00fcan", "\u00fcn",
];

interface Cell {
  syllable: string;
}

interface Row {
  initial: string;
  label: string;
  note: string;
  cells: Map<string, Cell>; // final -> cell
}

const buildMatrix = (): Row[] =>
  PINYIN_GROUPS.map((g) => {
    const cells = new Map<string, Cell>();
    for (const s of g.syllables) {
      cells.set(getFinal(g.initial, s), { syllable: s });
    }
    return { initial: g.initial, label: g.label, note: g.note, cells };
  });

const PinyinChart = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [playingTone, setPlayingTone] = useState<number | null>(null);

  const q = query.trim().toLowerCase().replace(/\u00fc/g, "v");

  const rows = useMemo(() => {
    const matrix = buildMatrix();
    if (!q) return matrix;
    return matrix
      .map((r) => {
        const cells = new Map<string, Cell>();
        r.cells.forEach((cell, final) => {
          if (cell.syllable.includes(q) || displaySyllable(cell.syllable).includes(query.trim().toLowerCase())) {
            cells.set(final, cell);
          }
        });
        return { ...r, cells };
      })
      .filter((r) => r.cells.size > 0);
  }, [q, query]);

  // Chỉ giữ các cột vận mẫu thực sự xuất hiện (sau lọc).
  const columns = useMemo(() => {
    const present = new Set<string>();
    rows.forEach((r) => r.cells.forEach((_, f) => present.add(f)));
    return FINAL_ORDER.filter((f) => present.has(f));
  }, [rows]);

  const total = useMemo(() => PINYIN_GROUPS.reduce((n, g) => n + g.syllables.length, 0), []);
  const shown = rows.reduce((n, r) => n + r.cells.size, 0);

  const playTone = (syllable: string, tone: number) => {
    const example = getExample(syllable, tone);
    setPlayingTone(tone);
    speak(example?.hanzi ?? withTone(syllable, tone));
    window.setTimeout(() => setPlayingTone(null), 900);
  };

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1800px] px-3 py-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-3 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Button>
        </Link>

        <header className="mb-4">
          <h1 className="font-serif text-3xl font-black gold-text md:text-4xl">
            拼音表 · Bảng Pinyin
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Bảng kết hợp {total} âm tiết Pinyin: hàng là thanh mẫu (声母), cột là vận mẫu (韵母). Nhấn vào
            một âm tiết để nghe lần lượt bốn thanh điệu kèm chữ Hán ví dụ.
          </p>
        </header>

        <div className="relative mb-4 max-w-sm">
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

        {rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Không tìm thấy âm tiết nào phù hợp.
          </p>
        ) : (
          <div className="w-full rounded-lg border border-border/60">
            <table className="w-full table-fixed border-collapse text-[11px] leading-none">
              <thead>
                <tr className="bg-muted/40">
                  <th className="w-[3.4rem] border-b border-r border-border/60 bg-muted/60 px-1 py-1 text-left font-serif text-[10px]">
                    声母
                    <span className="mx-1 text-muted-foreground">/</span>
                    韵母
                  </th>
                  {columns.map((f) => (
                    <th
                      key={f}
                      className="whitespace-nowrap border-b border-border/40 px-0.5 py-1 text-center text-[10px] font-semibold text-primary"
                    >
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.initial || "zero"} className="even:bg-muted/20">
                    <th
                      className="whitespace-nowrap border-r border-border/60 bg-background px-1 py-0.5 text-left font-serif text-xs font-black text-primary"
                      title={r.note}
                    >
                      {r.initial || "零"}
                      <span className="ml-1 hidden text-[9px] font-normal text-muted-foreground xl:inline">{r.note}</span>
                    </th>
                    {columns.map((f) => {
                      const cell = r.cells.get(f);
                      return (
                        <td
                          key={f}
                          className={cn(
                            "border-b border-border/30 p-0 text-center",
                            !cell && "bg-muted/10"
                          )}
                        >
                          {cell && (
                            <button
                              type="button"
                              onClick={() => setSelected(cell.syllable)}
                              className={cn(
                                "w-full truncate rounded px-0.5 py-1 text-[11px] font-medium transition-all",
                                "hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
                              )}
                            >
                              {displaySyllable(cell.syllable)}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Âm thanh được tạo bằng giọng đọc tiếng Trung của trình duyệt. j/q/x + u đọc như ü (ju = jü).
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
