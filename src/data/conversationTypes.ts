export type ConvLevel = "beginner" | "intermediate" | "advanced";

export interface ConvLine {
  speaker: string;
  hanzi: string;
  pinyin: string;
  vi: string;
}

export interface Conversation {
  id: string;
  level: ConvLevel;
  title: string;
  titleVi: string;
  description?: string;
  lines: ConvLine[];
}

export const LEVEL_META: Record<ConvLevel, { label: string; labelZh: string; description: string; color: string }> = {
  beginner: {
    label: "Sơ cấp",
    labelZh: "初级",
    description: "Hội thoại cơ bản hằng ngày, từ vựng HSK 1-2.",
    color: "text-emerald-500",
  },
  intermediate: {
    label: "Trung cấp",
    labelZh: "中级",
    description: "Hội thoại đa dạng tình huống, từ vựng HSK 3-4.",
    color: "text-amber-500",
  },
  advanced: {
    label: "Cao cấp",
    labelZh: "高级",
    description: "Hội thoại học thuật, công việc, từ vựng HSK 5-6.",
    color: "text-red-500",
  },
};
