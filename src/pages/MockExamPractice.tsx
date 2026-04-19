import { useState, useMemo, useRef, useCallback } from "react";
import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import { allMockExams } from "@/data/mockExam1";
import { ReadingPart, ListeningPart, ExamQuestion } from "@/data/mockExamTypes";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import ExamTimer from "@/components/ExamTimer";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, Headphones, BookOpen, PenTool, FileText } from "lucide-react";

type SectionType = "listening" | "reading" | "writing";

const MockExamPractice = () => {
  const { examId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const [showScripts, setShowScripts] = useState(false);
  const scriptsRef = useRef<HTMLDivElement>(null);

  const toggleScripts = useCallback(() => {
    const next = !showScripts;
    setShowScripts(next);
    if (next) {
      setTimeout(() => {
        scriptsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [showScripts]);

  const activeSection = (searchParams.get("section") as SectionType) || "reading";

  const exam = allMockExams.find((e) => e.id === examId);

  const hasListening = (exam?.sections.listening?.length ?? 0) > 0;
  const hasReading = (exam?.sections.reading.length ?? 0) > 0;
  const hasWriting = !!exam?.sections.writing;

  const readingParts = exam?.sections.reading ?? [];
  const listeningParts = exam?.sections.listening ?? [];
  const activeParts = activeSection === "listening" ? listeningParts : activeSection === "reading" ? readingParts : [];
  const part = activeParts[currentPart];

  const allQuestions = useMemo(() => {
    const qs: ExamQuestion[] = [];
    if (activeSection === "reading") {
      readingParts.forEach((p) => {
        if (p.questions) qs.push(...p.questions);
        if (p.passages) p.passages.forEach((pa) => qs.push(...pa.questions));
        if (p.blanksPassage) p.blanksPassage.forEach((b) => qs.push(...b.questions));
      });
    } else if (activeSection === "listening") {
      listeningParts.forEach((p) => qs.push(...p.questions));
    }
    return qs;
  }, [activeSection, readingParts, listeningParts]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;

  const score = useMemo(() => {
    if (!revealed) return 0;
    return allQuestions.filter(
      (q) => q.correctAnswer && answers[q.id] === q.correctAnswer
    ).length;
  }, [revealed, answers, allQuestions]);

  if (!exam) return <Navigate to="/mock-exams" replace />;

  const switchSection = (s: SectionType) => {
    setSearchParams({ section: s });
    setCurrentPart(0);
    setAnswers({});
    setRevealed(false);
    setShowScripts(false);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const renderQuestion = (q: ExamQuestion) => {
    const selected = answers[q.id];
    const correct = q.correctAnswer;
    const isCorrect = selected === correct;

    return (
      <div key={q.id} className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-muted-foreground">
            {q.id}.
          </span>
          {q.questionText && (
            <span className="text-sm">{q.questionText}</span>
          )}
          {revealed && selected && (
            isCorrect ? (
              <CheckCircle className="h-4 w-4 text-hsk3" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )
          )}
        </div>
        <div className="grid gap-2">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === letter;
            const isCorrectOption = revealed && correct === letter;
            const isWrong = revealed && isSelected && !isCorrect;

            return (
              <div
                key={i}
                role="button"
                tabIndex={revealed ? -1 : 0}
                onClick={(e) => {
                  // Don't trigger answer selection if user is selecting text
                  const sel = window.getSelection();
                  if (sel && sel.toString().length > 0) return;
                  handleAnswer(q.id, letter);
                }}
                onKeyDown={(e) => {
                  if (revealed) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAnswer(q.id, letter);
                  }
                }}
                aria-disabled={revealed}
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-all select-text cursor-pointer",
                  !revealed && isSelected && "border-primary bg-primary/10 text-foreground",
                  !revealed && !isSelected && "border-border/50 hover:border-primary/50 hover:bg-primary/5",
                  isCorrectOption && "border-hsk3 bg-hsk3/10 text-hsk3",
                  isWrong && "border-destructive bg-destructive/10 text-destructive",
                  revealed && "cursor-default",
                  revealed && !isCorrectOption && !isWrong && "opacity-50"
                )}
              >
                <span className="mt-0.5 font-mono text-xs font-bold opacity-70 select-none">
                  {letter}
                </span>
                <span className="flex-1">{opt}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReadingPart = (p: ReadingPart) => (
    <div>
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-serif text-lg font-bold text-primary">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.instructions}</p>
      </div>

      {p.type === "error-identification" && p.questions && (
        <div className="grid gap-4">{p.questions.map((q) => renderQuestion(q))}</div>
      )}

      {(p.type === "cloze-words" || p.type === "cloze-sentences") && p.blanksPassage && (
        <div className="space-y-8">
          {p.blanksPassage.map((bp, bpi) => (
            <div key={bpi} className="space-y-4">
              <div className="rounded-lg border border-border/30 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-line">
                {bp.text}
              </div>
              <div className="grid gap-4">{bp.questions.map((q) => renderQuestion(q))}</div>
            </div>
          ))}
        </div>
      )}

      {p.type === "reading-comprehension" && p.passages && (
        <div className="space-y-10">
          {p.passages.map((passage, pi) => (
            <div key={pi} className="space-y-4">
              <div className="mb-2 text-xs font-bold text-muted-foreground">
                {passage.questions[0].id}—{passage.questions[passage.questions.length - 1].id}
              </div>
              <div className="rounded-lg border border-border/30 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                {passage.text}
              </div>
              <div className="grid gap-4">{passage.questions.map((q) => renderQuestion(q))}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderListeningPart = (p: ListeningPart) => (
    <div>
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-serif text-lg font-bold text-primary">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{p.instructions}</p>
      </div>

      <div className="grid gap-4">
        {p.questions.map((q) => renderQuestion(q))}
      </div>

      {/* Scripts shown when showScripts is toggled */}
      {showScripts && p.scripts && p.scripts.length > 0 && (
        <div ref={scriptsRef} className="mt-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-primary">
            <FileText className="h-4 w-4" /> 听力文本
          </h4>
          {p.scripts.map((s, i) => (
            <div key={i} className="rounded-lg border border-border/30 bg-muted/30 p-4">
              <div className="mb-2 text-xs font-bold text-muted-foreground">
                第 {s.questionRange} 题
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {s.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWritingSection = () => {
    const w = exam.sections.writing!;
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-primary">{w.title}</h3>
              {w.instructions.map((inst, i) => (
                <p key={i} className="mt-1 text-sm text-muted-foreground">{inst}</p>
              ))}
            </div>
            <ExamTimer
              durationMinutes={45}
              label="书写 45 分钟"
              onTimeUp={() => toast({ title: "时间到", description: "书写部分时间已结束。" })}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">提示：考试规定阅读后有 10 分钟阅题时间，然后开始 45 分钟书写。</p>
        </div>

        <div className="rounded-lg border border-border/30 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto">
          {w.prompt}
        </div>

        {!revealed ? (
          <Button
            onClick={() => setRevealed(true)}
            variant="outline"
            className="border-hsk6/50 text-hsk6 hover:bg-hsk6/10"
          >
            <Eye className="mr-1 h-4 w-4" /> 查看范文
          </Button>
        ) : w.sampleAnswer ? (
          <div className="rounded-lg border border-hsk3/30 bg-hsk3/5 p-4">
            <h4 className="mb-2 font-serif text-sm font-bold text-hsk3">范文参考</h4>
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {w.sampleAnswer}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">暂无范文。</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <section className="border-b border-border/30 py-8">
        <div className="container mx-auto px-4">
          <Link to="/mock-exams" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to exams
          </Link>
          <h1 className="font-serif text-3xl font-black text-hsk6 sm:text-4xl">{exam.titleZh}</h1>
          <p className="mt-1 text-muted-foreground">{exam.title}</p>

          {/* Section tabs */}
          <div className="mt-4 flex gap-2">
            <Button
              variant={activeSection === "listening" ? "default" : "outline"}
              size="sm"
              onClick={() => switchSection("listening")}
              disabled={!hasListening}
              className={cn(activeSection === "listening" && "bg-hsk6 text-background hover:bg-hsk6/90")}
            >
              <Headphones className="mr-1 h-4 w-4" /> 听力
            </Button>
            <Button
              variant={activeSection === "reading" ? "default" : "outline"}
              size="sm"
              onClick={() => switchSection("reading")}
              disabled={!hasReading}
              className={cn(activeSection === "reading" && "bg-hsk6 text-background hover:bg-hsk6/90")}
            >
              <BookOpen className="mr-1 h-4 w-4" /> 阅读
            </Button>
            <Button
              variant={activeSection === "writing" ? "default" : "outline"}
              size="sm"
              onClick={() => switchSection("writing")}
              disabled={!hasWriting}
              className={cn(activeSection === "writing" && "bg-hsk6 text-background hover:bg-hsk6/90")}
            >
              <PenTool className="mr-1 h-4 w-4" /> 书写
            </Button>
          </div>

          {/* Progress bar for listening/reading */}
          {activeSection !== "writing" && totalQuestions > 0 && (
            <>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-hsk6 transition-all" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground">{answeredCount}/{totalQuestions}</span>
              </div>
              {revealed && (
                <div className="mt-4 rounded-lg border border-hsk3/30 bg-hsk3/10 p-4">
                  <p className="text-lg font-bold text-hsk3">Score: {score}/{totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Part tabs for listening/reading */}
      {activeSection !== "writing" && activeParts.length > 0 && (
        <div className="sticky top-16 z-40 border-b border-border/30 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2">
            {activeParts.map((p, i) => (
              <button key={i} onClick={() => setCurrentPart(i)} className={cn("whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors", currentPart === i ? "bg-hsk6/20 text-hsk6" : "text-muted-foreground hover:text-foreground")}>
                {p.title}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              {activeSection === "reading" && (
                <ExamTimer
                  durationMinutes={50}
                  label="阅读 50 分钟"
                  onTimeUp={() => {
                    setRevealed(true);
                    toast({ title: "时间到", description: "阅读部分时间已结束，已显示答案。" });
                  }}
                />
              )}
              {activeSection === "listening" && (
                <Button
                  onClick={toggleScripts}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-primary/50 text-primary hover:bg-primary/10",
                    showScripts && "bg-primary/10"
                  )}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  {showScripts ? " 隐藏文本" : " 查看文本"}
                </Button>
              )}
              {!revealed && (
                <Button onClick={() => setRevealed(true)} variant="outline" size="sm" className="border-hsk6/50 text-hsk6 hover:bg-hsk6/10" disabled={answeredCount === 0}>
                  <Eye className="mr-1 h-4 w-4" /> 查看答案
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky audio player for listening section */}
      {activeSection === "listening" && exam.audioSrc && (
        <div className="sticky top-[6.5rem] z-30 border-b border-border/30 bg-background/95 backdrop-blur">
          <div className="container mx-auto max-w-3xl px-4 py-3">
            <AudioPlayer src={exam.audioSrc} title="听力音频" />
          </div>
        </div>
      )}

      <section className="container mx-auto max-w-3xl px-4 py-8">

        {activeSection === "writing" && hasWriting && renderWritingSection()}

        {activeSection === "reading" && part && renderReadingPart(part as ReadingPart)}

        {activeSection === "listening" && part && renderListeningPart(part as ListeningPart)}

        {activeSection !== "writing" && activeParts.length > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentPart((p) => Math.max(0, p - 1))} disabled={currentPart === 0}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button variant="ghost" onClick={() => setCurrentPart((p) => Math.min(activeParts.length - 1, p + 1))} disabled={currentPart === activeParts.length - 1}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MockExamPractice;
