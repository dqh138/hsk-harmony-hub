import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_saved_words",
  title: "List my saved words",
  description: "List the signed-in user's saved vocabulary notebook (生词本) entries from HSK Hub.",
  inputSchema: {
    limit: z.number().int().optional().describe("Maximum number of entries to return (default 50, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const max = Math.min(Math.max(limit ?? 50, 1), 200);
    const { data, error } = await supabaseForUser(ctx)
      .from("saved_words")
      .select("id, text, note, created_at")
      .order("created_at", { ascending: false })
      .limit(max);

    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    const rows = data ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text: rows.length === 0 ? "生词本 is empty." : rows.map((r) => `${r.text}${r.note ? ` — ${r.note}` : ""}`).join("\n"),
        },
      ],
      structuredContent: { count: rows.length, words: rows },
    };
  },
});
