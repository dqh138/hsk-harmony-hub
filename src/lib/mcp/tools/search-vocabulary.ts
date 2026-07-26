import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allVocab, getVocabByLevel } from "@/data/vocab";

export default defineTool({
  name: "search_vocabulary",
  title: "Search HSK vocabulary",
  description:
    "Search the HSK 1-6 vocabulary bank of HSK Hub by hanzi, pinyin or English meaning. Optionally filter by HSK level.",
  inputSchema: {
    query: z.string().describe("Hanzi, pinyin or English meaning to search for. Leave empty to browse by level."),
    level: z.number().int().optional().describe("HSK level filter, 1 to 6."),
    limit: z.number().int().optional().describe("Maximum number of words to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, level, limit }) => {
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const pool =
      level && level >= 1 && level <= 6 ? getVocabByLevel(level as 1 | 2 | 3 | 4 | 5 | 6) : allVocab;
    const q = (query ?? "").trim().toLowerCase();
    const matches = (q ? pool.filter((w) =>
      w.hanzi.includes(q) ||
      w.pinyin.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q)
    ) : pool).slice(0, max);

    const rows = matches.map((w) => ({
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      pos: w.pos,
      meaning: w.meaning,
      level: w.level,
      example: w.example,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            rows.length === 0
              ? "No matching vocabulary found."
              : rows
                  .map((r) => `HSK${r.level} ${r.hanzi} (${r.pinyin}) [${r.pos}] — ${r.meaning}\n  例: ${r.example.chinese} — ${r.example.english}`)
                  .join("\n"),
        },
      ],
      structuredContent: { count: rows.length, words: rows },
    };
  },
});
