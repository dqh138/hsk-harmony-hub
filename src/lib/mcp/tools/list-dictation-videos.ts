import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DICTATION_VIDEOS } from "@/data/dictationVideos";

export default defineTool({
  name: "list_dictation_videos",
  title: "List dictation videos",
  description:
    "Browse HSK Hub's Chinese dictation (听写) library: title, level, topic category, duration and number of practice sentences.",
  inputSchema: {
    query: z.string().optional().describe("Filter by title text (Chinese or Vietnamese)."),
    level: z.string().optional().describe("Level filter: beginner, intermediate or advanced."),
    category: z.string().optional().describe("Category filter: news, vlog, cartoon, drama, education, history, discovery, other."),
    limit: z.number().int().optional().describe("Maximum number of videos to return (default 25, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, level, category, limit }) => {
    const max = Math.min(Math.max(limit ?? 25, 1), 100);
    const q = (query ?? "").trim().toLowerCase();
    const rows = DICTATION_VIDEOS.filter((v) => {
      if (level && v.level !== level) return false;
      if (category && v.category !== category) return false;
      if (q && !(v.title.toLowerCase().includes(q) || (v.titleVi ?? "").toLowerCase().includes(q))) return false;
      return true;
    })
      .slice(0, max)
      .map((v) => ({
        id: v.id,
        title: v.title,
        titleVi: v.titleVi ?? null,
        level: v.level,
        category: v.category,
        durationLabel: v.durationLabel ?? null,
        sentenceCount: v.segments?.length ?? 0,
        youtubeUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
      }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            rows.length === 0
              ? "No dictation video matched the filters."
              : rows
                  .map(
                    (r) =>
                      `${r.title}${r.titleVi ? ` (${r.titleVi})` : ""} — ${r.level}/${r.category} · ${r.sentenceCount} sentences${r.durationLabel ? ` · ${r.durationLabel}` : ""} · id=${r.id}`
                  )
                  .join("\n"),
        },
      ],
      structuredContent: { count: rows.length, videos: rows },
    };
  },
});
