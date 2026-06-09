export type DictationLevel = "beginner" | "intermediate" | "advanced";
export type DictationCategory =
  | "news"
  | "vlog"
  | "cartoon"
  | "drama"
  | "education"
  | "history"
  | "discovery"
  | "other";

export interface DictationVideo {
  id: string;
  youtubeId: string;
  title: string;
  titleVi?: string;
  level: DictationLevel;
  category: DictationCategory;
  description?: string;
  durationLabel?: string;
  thumbnail?: string;
}

export const DICTATION_CATEGORIES: { id: DictationCategory; label: string }[] = [
  { id: "discovery", label: `Kh\u00e1m ph\u00e1` },
  { id: "history", label: `L\u1ecbch s\u1eed` },
  { id: "news", label: `Tin t\u1ee9c` },
  { id: "vlog", label: `Vlog` },
  { id: "cartoon", label: `Ho\u1ea1t h\u00ecnh` },
  { id: "drama", label: `Phim` },
  { id: "education", label: `H\u1ecdc t\u1eadp` },
  { id: "other", label: `Kh\u00e1c` },
];

export const DICTATION_LEVELS: { id: DictationLevel; label: string; short: string }[] = [
  { id: "beginner", label: `S\u01a1 c\u1ea5p`, short: `S\u01a1 c\u1ea5p` },
  { id: "intermediate", label: `Trung c\u1ea5p`, short: `Trung c\u1ea5p` },
  { id: "advanced", label: `Cao c\u1ea5p`, short: `Cao c\u1ea5p` },
];

export const LEVEL_COLORS: Record<DictationLevel, string> = {
  beginner: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  intermediate: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  advanced: "bg-red-500/15 text-red-500 border-red-500/30",
};

// Backward-compatible alias (was named HSK_LEVEL_COLORS)
export const HSK_LEVEL_COLORS = LEVEL_COLORS;

export const getThumbnail = (v: DictationVideo) =>
  v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;

export const DICTATION_VIDEOS: DictationVideo[] = [
  {
    id: "history-three-kingdoms-k-jjFZQNw",
    youtubeId: "k-jjFZQNw_Y",
    title: `\u4e2d\u56fd\u5386\u53f2 \u00b7 \u89c6\u9891\u8bb2\u89e3`,
    titleVi: "Video lịch sử Trung Quốc (có phụ đề tiếng Trung)",
    level: "intermediate",
    category: "history",
    description: "Video lịch sử Trung Quốc có phụ đề tiếng Trung rõ ràng, phù hợp luyện nghe chép chính tả.",
  },
];
