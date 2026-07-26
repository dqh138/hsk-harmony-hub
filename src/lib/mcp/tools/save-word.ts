import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "save_word",
  title: "Save a word to my notebook",
  description: "Add a Chinese word, phrase or sentence (with an optional note) to the signed-in user's HSK Hub 生词本.",
  inputSchema: {
    text: z.string().trim().describe("The Chinese word, phrase or sentence to save."),
    note: z.string().optional().describe("Optional note, meaning or translation."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ text, note }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const value = text.trim();
    if (!value) return { content: [{ type: "text" as const, text: "text must not be empty." }], isError: true };

    const { data, error } = await supabaseForUser(ctx)
      .from("saved_words")
      .upsert(
        { user_id: ctx.getUserId(), text: value, note: note?.trim() || null },
        { onConflict: "user_id,text" }
      )
      .select("id, text, note, created_at")
      .maybeSingle();

    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: `Saved "${value}" to 生词本.` }],
      structuredContent: { word: data },
    };
  },
});
