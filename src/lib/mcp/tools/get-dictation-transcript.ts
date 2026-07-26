import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DICTATION_VIDEOS } from "@/data/dictationVideos";

export default defineTool({
  name: "get_dictation_transcript",
  title: "Get dictation transcript",
  description:
    "Return the sentence-by-sentence Chinese transcript (with Vietnamese translation when available) of one dictation video from HSK Hub. Use list_dictation_videos first to get the video id.",
  inputSchema: {
    videoId: z.string().describe("The dictation entry id returned by list_dictation_videos."),
    from: z.number().int().optional().describe("First sentence index to return (0-based, default 0)."),
    count: z.number().int().optional().describe("How many sentences to return (default 40, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ videoId, from, count }) => {
    const video = DICTATION_VIDEOS.find((v) => v.id === videoId || v.youtubeId === videoId);
    if (!video) {
      return { content: [{ type: "text" as const, text: `No dictation video with id "${videoId}".` }], isError: true };
    }
    const segments = video.segments ?? [];
    const start = Math.max(from ?? 0, 0);
    const take = Math.min(Math.max(count ?? 40, 1), 200);
    const slice = segments.slice(start, start + take).map((s, i) => ({
      index: start + i,
      start: s.start,
      duration: s.dur,
      hanzi: s.hanzi,
      vi: video.translations?.[start + i] ?? null,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            slice.length === 0
              ? `"${video.title}" has no prepared transcript in this range.`
              : `${video.title} (${slice.length}/${segments.length} sentences)\n` +
                slice.map((s) => `${s.index + 1}. [${s.start.toFixed(1)}s] ${s.hanzi}${s.vi ? `\n   ${s.vi}` : ""}`).join("\n"),
        },
      ],
      structuredContent: {
        videoId: video.id,
        title: video.title,
        totalSentences: segments.length,
        sentences: slice,
      },
    };
  },
});
