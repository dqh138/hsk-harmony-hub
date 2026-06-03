export type DictationLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type DictationCategory =
  | "news"
  | "vlog"
  | "cartoon"
  | "drama"
  | "education"
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
  { id: "news", label: `Tin t\u1ee9c` },
  { id: "vlog", label: `Vlog` },
  { id: "cartoon", label: `Ho\u1ea1t h\u00ecnh` },
  { id: "drama", label: `Phim` },
  { id: "education", label: `H\u1ecdc t\u1eadp` },
  { id: "other", label: `Kh\u00e1c` },
];

export const HSK_LEVEL_COLORS: Record<DictationLevel, string> = {
  1: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  2: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  3: "bg-purple-500/15 text-purple-500 border-purple-500/30",
  4: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  5: "bg-red-500/15 text-red-500 border-red-500/30",
  6: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
};

export const getThumbnail = (v: DictationVideo) =>
  v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;

// Paste video tại đây. Ví dụ:
// {
//   id: "cctv-news-001",
//   youtubeId: "xxxxxxxxxxx",
//   title: `\u65b0\u95fb\u8054\u64ad`,
//   titleVi: "Bản tin CCTV",
//   level: 5,
//   category: "news",
//   description: "Bản tin thời sự CCTV.",
// },
export const DICTATION_VIDEOS: DictationVideo[] = [];
