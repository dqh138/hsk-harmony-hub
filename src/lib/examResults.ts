import { supabase } from "@/integrations/supabase/client";

export type ExamResultSection = "listening" | "reading" | "writing";

export interface ExamResultPayload {
  userId: string;
  examId: string;
  examTitle: string;
  section: ExamResultSection;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  elapsedSeconds?: number | null;
}

export async function saveExamResult(payload: ExamResultPayload) {
  const client = supabase as any;

  const { error } = await client.from("exam_results").insert({
    user_id: payload.userId,
    exam_id: payload.examId,
    exam_title: payload.examTitle,
    section: payload.section,
    total_questions: payload.totalQuestions,
    correct_answers: payload.correctAnswers,
    score_percent: payload.scorePercent,
    elapsed_seconds: payload.elapsedSeconds ?? null,
    submitted_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export function formatElapsedTime(totalSeconds?: number | null) {
  if (totalSeconds == null) return null;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}