import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/** Supabase client acting as the signed-in MCP user (RLS applies as that user). */
export function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const notAuthenticated = {
  content: [{ type: "text" as const, text: "Not authenticated. Sign in to HSK Hub through the OAuth flow first." }],
  isError: true,
};
