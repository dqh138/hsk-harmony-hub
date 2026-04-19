import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getVocabByLevel } from "@/data/vocab";
import { HSKLevel, hskLevelTextColors } from "@/data/grammarTypes";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VocabularyLevel = () => {
  const { level } = useParams();
  const levelNum = Number(level) as HSKLevel;
  const isValid = [1, 2, 3, 4, 5, 6].includes(levelNum);
  const [query, setQuery] = useState("");

  const all = isValid ? getVocabByLevel(levelNum) : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (w) =>
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.example.chinese.includes(q) ||
        w.example.english.toLowerCase().includes(q)
    );
  }, [query, all]);

  if (!isValid) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <section className="border-b border-border/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className={cn("font-serif text-4xl font-black sm:text-5xl", hskLevelTextColors[levelNum])}>
            生词 · HSK {levelNum}
          </h1>
          <p className="mt-2 text-muted-foreground">{all.length} từ vựng</p>
          <div className="mt-6 max-w-lg">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={`Tìm từ vựng HSK ${levelNum}...`}
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {all.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Chưa có dữ liệu từ vựng cho HSK {levelNum}. Hãy thêm vào{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              src/data/hsk{levelNum}Vocab.ts
            </code>
            .
          </p>
        ) : (
          <div className="rounded-lg border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-24">汉字</TableHead>
                  <TableHead className="w-32">Pinyin</TableHead>
                  <TableHead className="w-20">POS</TableHead>
                  <TableHead>Nghĩa</TableHead>
                  <TableHead>Ví dụ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w, i) => (
                  <TableRow key={w.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className={cn("font-serif text-xl font-bold", hskLevelTextColors[levelNum])}>
                      {w.hanzi}
                    </TableCell>
                    <TableCell className="italic text-muted-foreground">{w.pinyin}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{w.pos}</TableCell>
                    <TableCell>{w.meaning}</TableCell>
                    <TableCell>
                      <div className="text-sm">{w.example.chinese}</div>
                      <div className="text-xs text-muted-foreground">{w.example.english}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">Không tìm thấy từ phù hợp.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default VocabularyLevel;
