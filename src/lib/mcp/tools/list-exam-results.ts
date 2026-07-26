import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_exam_results",
  title: "List my mock exam results",
  description: "List the signed-in user's HSK mock exam results from HSK Hub, newest first, with score per section.",
  inputSchema: {
    limit: z.number().int().optional().describe("Maximum number of results to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const { data, error } = await supabaseForUser(ctx)
      .from("exam_results")
      .select("exam_id, exam_title, section, total_questions, correct_answers, score_percent, elapsed_seconds, submitted_at")
      .order("submitted_at", { ascending: false })
      .limit(max);

    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    const rows = data ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            rows.length === 0
              ? "No mock exam results yet."
              : rows
                  .map(
                    (r) =>
                      `${new Date(r.submitted_at as string).toISOString().slice(0, 10)} · ${r.exam_title} · ${r.section}: ${r.correct_answers}/${r.total_questions} (${r.score_percent}%)`
                  )
                  .join("\n"),
        },
      ],
      structuredContent: { count: rows.length, results: rows },
    };
  },
});
