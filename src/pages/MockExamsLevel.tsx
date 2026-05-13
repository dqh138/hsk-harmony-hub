import { Link, useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { allMockExams } from "@/data/mockExam1";
import { Headphones, BookOpen, PenTool, ArrowLeft } from "lucide-react";
import { HSKLevel, hskLevelTextColors } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";

const VALID_LEVELS = ["1", "2", "3", "4", "5", "6"];

const MockExamsLevel = () => {
  const { level } = useParams<{ level: string }>();

  if (!level || !VALID_LEVELS.includes(level)) {
    return <Navigate to="/mock-exams" replace />;
  }

  const lvl = Number(level) as HSKLevel;
  const exams = allMockExams.filter((e) => e.level === lvl);

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/30 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4">
          <Link
            to="/mock-exams"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Tất cả cấp độ
          </Link>
          <h1 className={cn("mt-3 font-serif text-4xl font-black sm:text-5xl", hskLevelTextColors[lvl])}>
            HSK {lvl} · 模拟考试
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {exams.length > 0
              ? `${exams.length} đề thi thử HSK ${lvl}`
              : `Chưa có đề thi HSK ${lvl} — sắp ra mắt.`}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {exams.length === 0 ? (
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-border/60 bg-card/50 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Đề thi HSK {lvl} đang được biên soạn. Vui lòng quay lại sau.
            </p>
            <Link
              to="/mock-exams/6"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Thử đề HSK 6 ngay →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const hasListening = (exam.sections.listening?.length ?? 0) > 0;
              const hasReading = exam.sections.reading.length > 0;
              const hasWriting = !!exam.sections.writing;

              return (
                <div
                  key={exam.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-card p-6",
                    `border-hsk${lvl}/30`
                  )}
                >
                  <h2 className={cn("font-serif text-2xl font-black", hskLevelTextColors[lvl])}>
                    {exam.titleZh}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{exam.title}</p>

                  <div className="mt-4 flex flex-col gap-2">
                    {hasListening ? (
                      <Link
                        to={`/mock-exam/${exam.id}?section=listening`}
                        className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                      >
                        <Headphones className={cn("h-4 w-4", hskLevelTextColors[lvl])} />
                        <span>听力</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {exam.sections.listening!.reduce((s, p) => s + p.questions.length, 0)} 题
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/30 px-3 py-2 text-sm text-muted-foreground opacity-50">
                        <Headphones className="h-4 w-4" />
                        <span>听力</span>
                        <span className="ml-auto text-xs">Coming soon</span>
                      </div>
                    )}

                    {hasReading ? (
                      <Link
                        to={`/mock-exam/${exam.id}?section=reading`}
                        className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                      >
                        <BookOpen className={cn("h-4 w-4", hskLevelTextColors[lvl])} />
                        <span>阅读</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {exam.sections.reading.reduce(
                            (sum, part) =>
                              sum +
                              (part.questions?.length || 0) +
                              (part.passages?.reduce((s, p) => s + p.questions.length, 0) || 0) +
                              (part.blanksPassage?.reduce((s, b) => s + b.questions.length, 0) || 0),
                            0
                          )} 题
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/30 px-3 py-2 text-sm text-muted-foreground opacity-50">
                        <BookOpen className="h-4 w-4" />
                        <span>阅读</span>
                        <span className="ml-auto text-xs">Coming soon</span>
                      </div>
                    )}

                    {hasWriting ? (
                      <Link
                        to={`/mock-exam/${exam.id}?section=writing`}
                        className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                      >
                        <PenTool className={cn("h-4 w-4", hskLevelTextColors[lvl])} />
                        <span>书写</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/30 px-3 py-2 text-sm text-muted-foreground opacity-50">
                        <PenTool className="h-4 w-4" />
                        <span>书写</span>
                        <span className="ml-auto text-xs">Coming soon</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MockExamsLevel;
