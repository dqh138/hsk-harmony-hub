import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { allMockExams } from "@/data/mockExam1";
import { Headphones, BookOpen, PenTool } from "lucide-react";

const MockExams = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/30 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4">
          <h1 className="font-serif text-4xl font-black gold-text sm:text-5xl">
            模拟考试
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            HSK 6 Mock Exams — Practice with real exam questions from Hanban
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allMockExams.map((exam) => {
            const hasListening = (exam.sections.listening?.length ?? 0) > 0;
            const hasReading = exam.sections.reading.length > 0;
            const hasWriting = !!exam.sections.writing;

            return (
              <div
                key={exam.id}
                className="relative overflow-hidden rounded-xl border border-hsk6/30 bg-card p-6"
              >
                <h2 className="font-serif text-2xl font-black text-hsk6">
                  {exam.titleZh}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{exam.title}</p>

                <div className="mt-4 flex flex-col gap-2">
                  {/* 听力 */}
                  {hasListening ? (
                    <Link
                      to={`/mock-exam/${exam.id}?section=listening`}
                      className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-hsk6/50 hover:bg-hsk6/5"
                    >
                      <Headphones className="h-4 w-4 text-hsk6" />
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

                  {/* 阅读 */}
                  {hasReading ? (
                    <Link
                      to={`/mock-exam/${exam.id}?section=reading`}
                      className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-hsk6/50 hover:bg-hsk6/5"
                    >
                      <BookOpen className="h-4 w-4 text-hsk6" />
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

                  {/* 书写 */}
                  {hasWriting ? (
                    <Link
                      to={`/mock-exam/${exam.id}?section=writing`}
                      className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-colors hover:border-hsk6/50 hover:bg-hsk6/5"
                    >
                      <PenTool className="h-4 w-4 text-hsk6" />
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

          {/* Placeholder for future exams */}
          {([] as number[]).map((num) => (
            <div
              key={`placeholder-${num}`}
              className="relative overflow-hidden rounded-xl border border-dashed border-border/50 bg-card/50 p-6 opacity-50"
            >
              <h2 className="font-serif text-2xl font-black text-muted-foreground">
                HSK（六级）模拟试卷 {num}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                HSK 6 Mock Exam {num}
              </p>
              <div className="mt-4 space-y-2">
                {["听力", "阅读", "书写"].map((label) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg border border-dashed border-border/30 px-3 py-2 text-sm text-muted-foreground">
                    <span>{label}</span>
                    <span className="ml-auto text-xs">Coming soon</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MockExams;
