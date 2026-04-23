import { Award, BookCheck, Clock3, Save } from "lucide-react";
import { formatElapsedTime } from "@/lib/examResults";

interface ExamResultSummaryProps {
  examTitle: string;
  sectionLabel: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number | null;
  elapsedSeconds?: number | null;
  saveStatus: "idle" | "saved" | "guest" | "error";
}

const saveStatusLabel: Record<ExamResultSummaryProps["saveStatus"], string> = {
  idle: "Đã nộp bài",
  saved: "Đã lưu vào tài khoản của bạn",
  guest: "Đăng nhập để lưu lịch sử kết quả",
  error: "Chưa lưu được kết quả, vui lòng thử lại",
};

const ExamResultSummary = ({
  examTitle,
  sectionLabel,
  totalQuestions,
  correctAnswers,
  scorePercent,
  elapsedSeconds,
  saveStatus,
}: ExamResultSummaryProps) => {
  const duration = formatElapsedTime(elapsedSeconds);

  return (
    <div className="rounded-lg border border-hsk3/30 bg-hsk3/10 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-hsk3">Kết quả bài thi</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-foreground">{examTitle}</h3>
          <p className="text-sm text-muted-foreground">Phần {sectionLabel}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground">
          <Award className="h-4 w-4 text-hsk6" />
          {scorePercent === null ? "Chưa có chấm tự động" : `${scorePercent}%`}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border/50 bg-background/70 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookCheck className="h-4 w-4 text-hsk3" />
            Số câu đúng
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {correctAnswers}<span className="ml-1 text-sm font-medium text-muted-foreground">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="rounded-md border border-border/50 bg-background/70 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-hsk6" />
            Điểm
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{scorePercent === null ? "--" : scorePercent}</p>
        </div>

        <div className="rounded-md border border-border/50 bg-background/70 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Thời gian làm
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{duration ?? "--:--"}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Save className="h-4 w-4" />
        <span>{saveStatusLabel[saveStatus]}</span>
      </div>
    </div>
  );
};

export default ExamResultSummary;