import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allGrammar, getGrammarByLevel } from "@/data/grammar";

export default defineTool({
  name: "search_grammar",
  title: "Search HSK grammar points",
  description:
    "Search HSK Hub's HSK 1-6 grammar reference by pattern, name or explanation, with structure formula and examples.",
  inputSchema: {
    query: z.string().describe("Pattern, keyword or English explanation to search for. Leave empty to browse by level."),
    level: z.number().int().optional().describe("HSK level filter, 1 to 6."),
    limit: z.number().int().optional().describe("Maximum number of grammar points to return (default 10, max 40)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, level, limit }) => {
    const max = Math.min(Math.max(limit ?? 10, 1), 40);
    const pool =
      level && level >= 1 && level <= 6 ? getGrammarByLevel(level as 1 | 2 | 3 | 4 | 5 | 6) : allGrammar;
    const q = (query ?? "").trim().toLowerCase();
    const matches = (q
      ? pool.filter((g) =>
          g.pattern.toLowerCase().includes(q) ||
          g.name.toLowerCase().includes(q) ||
          g.explanation.toLowerCase().includes(q) ||
          g.structure.toLowerCase().includes(q)
        )
      : pool
    ).slice(0, max);

    const rows = matches.map((g) => ({
      level: g.level,
      pattern: g.pattern,
      name: g.name,
      category: g.category,
      structure: g.structure,
      explanation: g.explanation,
      examples: g.examples.slice(0, 3),
    }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            rows.length === 0
              ? "No matching grammar point found."
              : rows
                  .map(
                    (r) =>
                      `HSK${r.level} ${r.pattern} — ${r.name}\n  Structure: ${r.structure}\n  ${r.explanation}\n` +
                      r.examples.map((e) => `  例: ${e.chinese} (${e.pinyin}) — ${e.english}`).join("\n")
                  )
                  .join("\n\n"),
        },
      ],
      structuredContent: { count: rows.length, grammar: rows },
    };
  },
});
