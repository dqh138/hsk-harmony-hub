import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ChineseDecorInline } from "@/components/ChineseDecor";
import { HSKLevel, hskLevelColors, hskLevelTextColors } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];
const displayCounts: Record<HSKLevel, number> = { 1: 15, 2: 30, 3: 50, 4: 75, 5: 100, 6: 130 };

const levelDescriptions: Record<HSKLevel, string> = {
  1: "Cấu trúc câu cơ bản, đại từ, câu hỏi đơn giản.",
  2: "Trợ từ thường gặp, thì quá khứ, so sánh đơn giản.",
  3: "Bổ ngữ, liên từ, cấu trúc câu phức cơ bản.",
  4: "Câu bị động, câu nhấn mạnh, trạng từ nâng cao.",
  5: "Cấu trúc trang trọng, câu điều kiện, biểu đạt phức tạp.",
  6: "Văn phong học thuật, tu từ, cấu trúc nâng cao.",
};

const Grammar = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        
        <div className="container relative mx-auto px-4 py-16 text-center md:py-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            语法 · Grammar Reference
          </div>
          <h1 className="mt-6 font-serif text-4xl font-black tracking-tight gold-text sm:text-5xl md:text-6xl">
            Ngữ pháp HSK 1–6
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Chọn cấp độ để xem toàn bộ điểm ngữ pháp với cấu trúc, giải thích và ví dụ song ngữ Hán–Anh.
          </p>
        </div>
      </section>

      {/* Levels grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <Link
              key={level}
              to={`/hsk/${level}`}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="flex items-start justify-between">
                <div className={cn("inline-block rounded px-2 py-0.5 text-[10px] font-bold text-background", hskLevelColors[level])}>
                  LEVEL {level}
                </div>
                <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {displayCounts[level]} điểm
                </span>
              </div>
              <div className={cn("mt-4 font-serif text-4xl font-black", hskLevelTextColors[level])}>
                HSK {level}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {levelDescriptions[level]}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                Xem ngữ pháp <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Grammar;
