import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { HSKLevel, hskLevelColors, hskLevelTextColors } from "@/data/grammarTypes";
import { allMockExams } from "@/data/mockExam1";
import { cn } from "@/lib/utils";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

const levelDescriptions: Record<HSKLevel, string> = {
  1: "Đề thi HSK 1 — sắp ra mắt.",
  2: "Đề thi HSK 2 — sắp ra mắt.",
  3: "Đề thi HSK 3 — sắp ra mắt.",
  4: "Đề thi HSK 4 — sắp ra mắt.",
  5: "Đề thi HSK 5 — sắp ra mắt.",
  6: "Đề thi HSK 6 chính thức — Nghe, Đọc, Viết đầy đủ.",
};

const MockExams = () => {
  const countsByLevel: Record<HSKLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const exam of allMockExams) {
    const lvl = exam.level as HSKLevel;
    if (countsByLevel[lvl] !== undefined) countsByLevel[lvl] += 1;
  }

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4 py-16 text-center md:py-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <FileText className="h-3.5 w-3.5" />
            模拟考试 · Mock Exams
          </div>
          <h1 className="mt-6 font-serif text-4xl font-black tracking-tight gold-text sm:text-5xl md:text-6xl">
            Đề thi thử HSK 1–6
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Chọn cấp độ để vào phòng thi thử với phần Nghe, Đọc, Viết và bấm giờ chuẩn HSK.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => {
            const count = countsByLevel[level];
            const available = count > 0;
            return (
              <Link
                key={level}
                to={`/mock-exams/${level}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
                  !available && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn("inline-block rounded px-2 py-0.5 text-[10px] font-bold text-background", hskLevelColors[level])}>
                    LEVEL {level}
                  </div>
                  <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {available ? `${count} đề` : "Coming soon"}
                  </span>
                </div>
                <div className={cn("mt-4 font-serif text-4xl font-black", hskLevelTextColors[level])}>
                  HSK {level}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {levelDescriptions[level]}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                  {available ? "Vào phòng thi" : "Xem chi tiết"} <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MockExams;
