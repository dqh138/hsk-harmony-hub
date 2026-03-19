import { useState, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { allMockExams } from "@/data/mockExam1";
import { ReadingPart, ExamQuestion } from "@/data/mockExamTypes";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const MockExamPractice = () => {
  const { examId } = useParams();
  const exam = allMockExams.find((e) => e.id === examId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);

  if (!exam) return <Navigate to="/mock-exams" replace />;

  const parts = exam.sections.reading;
  const part = parts[currentPart];

  const allQuestions = useMemo(() => {
    const qs: ExamQuestion[] = [];
    parts.forEach((p) => {
      if (p.questions) qs.push(...p.questions);
      if (p.passages) p.passages.forEach((pa) => qs.push(...pa.questions));
      if (p.blanksPassage) p.blanksPassage.forEach((b) => qs.push(...b.questions));
    });
    return qs;
  }, [parts]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;

  const score = useMemo(() => {
    if (!revealed) return 0;
    return allQuestions.filter(
      (q) => q.correctAnswer && answers[q.id] === q.correctAnswer
    ).length;
  }, [revealed, answers, allQuestions]);

  const handleAnswer = (questionId: number, answer: string) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const letterIndex = (letter: string) =>
    letter.charCodeAt(0) - "A".charCodeAt(0);

  const renderQuestion = (q: ExamQuestion, showFullOptions = true) => {
    const selected = answers[q.id];
    const correct = q.correctAnswer;
    const isCorrect = selected === correct;

    return (
      <div key={q.id} className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-muted-foreground">
            {q.id}.
          </span>
          {revealed && selected && (
            isCorrect ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
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
              <button
                key={i}
                onClick={() => handleAnswer(q.id, letter)}
                disabled={revealed}
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-all",
                  !revealed && isSelected && "border-primary bg-primary/10 text-foreground",
                  !revealed && !isSelected && "border-border/50 hover:border-primary/50 hover:bg-primary/5",
                  isCorrectOption && "border-green-500 bg-green-500/10 text-green-300",
                  isWrong && "border-red-500 bg-red-500/10 text-red-300",
                  revealed && !isCorrectOption && !isWrong && "opacity-50"
                )}
              >
                <span className="mt-0.5 font-mono text-xs font-bold opacity-70">
                  {letter}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPart = (part: ReadingPart) => {
    return (
      <div>
        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h3 className="font-serif text-lg font-bold text-primary">
            {part.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {part.instructions}
          </p>
        </div>

        {/* Part 1: Error identification */}
        {part.type === "error-identification" && part.questions && (
          <div className="grid gap-4">
            {part.questions.map((q) => renderQuestion(q))}
          </div>
        )}

        {/* Part 2 & 3: Cloze (words / sentences) */}
        {(part.type === "cloze-words" || part.type === "cloze-sentences") &&
          part.blanksPassage && (
            <div className="space-y-8">
              {part.blanksPassage.map((bp, bpi) => (
                <div key={bpi} className="space-y-4">
                  <div className="rounded-lg border border-border/30 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-line">
                    {bp.text}
                  </div>
                  <div className="grid gap-4">
                    {bp.questions.map((q) => renderQuestion(q))}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Part 4: Reading comprehension */}
        {part.type === "reading-comprehension" && part.passages && (
          <div className="space-y-10">
            {part.passages.map((passage, pi) => (
              <div key={pi} className="space-y-4">
                <div className="mb-2 text-xs font-bold text-muted-foreground">
                  {passage.questions[0].id}—{passage.questions[passage.questions.length - 1].id}
                </div>
                <div className="rounded-lg border border-border/30 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                  {passage.text}
                </div>
                <div className="grid gap-4">
                  {passage.questions.map((q) => renderQuestion(q))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border/30 py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/mock-exams"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to exams
          </Link>
          <h1 className="font-serif text-3xl font-black text-hsk6 sm:text-4xl">
            {exam.titleZh}
          </h1>
          <p className="mt-1 text-muted-foreground">{exam.title} — Reading Section</p>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-4">
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-hsk6 transition-all"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {answeredCount}/{totalQuestions}
            </span>
          </div>

          {/* Score (if revealed) */}
          {revealed && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-lg font-bold text-green-400">
                Score: {score}/{totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Part tabs */}
      <div className="sticky top-16 z-40 border-b border-border/30 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2">
          {parts.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrentPart(i)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                currentPart === i
                  ? "bg-hsk6/20 text-hsk6"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.title}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {!revealed && (
              <Button
                onClick={() => setRevealed(true)}
                variant="outline"
                size="sm"
                className="border-hsk6/50 text-hsk6 hover:bg-hsk6/10"
                disabled={answeredCount === 0}
              >
                <Eye className="mr-1 h-4 w-4" />
                Reveal Answers
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto max-w-3xl px-4 py-8">
        {renderPart(part)}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentPart((p) => Math.max(0, p - 1))}
            disabled={currentPart === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous Part
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setCurrentPart((p) => Math.min(parts.length - 1, p + 1))
            }
            disabled={currentPart === parts.length - 1}
          >
            Next Part <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MockExamPractice;
