// Fetches full article content via Jina Reader with DB caching (TTL 7 days)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_CONTENT = 6000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return new Response(JSON.stringify({ error: "url required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const dbHeaders = {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    };

    // Check DB cache
    const cacheRes = await fetch(
      `${SUPABASE_URL}/rest/v1/article_cache?url=eq.${encodeURIComponent(url)}&select=title,content,updated_at`,
      { headers: dbHeaders }
    );
    if (cacheRes.ok) {
      const rows = await cacheRes.json();
      if (rows.length > 0) {
        const row = rows[0];
        const age = Date.now() - new Date(row.updated_at).getTime();
        if (age < TTL_MS) {
          return new Response(
            JSON.stringify({ content: row.content, title: row.title ?? "", cached: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Fetch via Jina Reader
    const JINA_API_KEY = Deno.env.get("JINA_API_KEY");
    const jinaHeaders: Record<string, string> = {
      "Accept": "text/plain",
      "X-Return-Format": "text",
    };
    if (JINA_API_KEY) jinaHeaders["Authorization"] = `Bearer ${JINA_API_KEY}`;

    const jinaRes = await fetch(`https://r.jina.ai/${url}`, { headers: jinaHeaders });
    if (!jinaRes.ok) throw new Error(`Jina HTTP ${jinaRes.status}`);

    const raw = await jinaRes.text();

    // Jina returns "Title: ...\nURL: ...\n\n<content>"
    let title = "";
    let content = raw;
    const titleMatch = raw.match(/^Title:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim();
    // Remove metadata header lines
    content = raw.replace(/^(Title|URL|Published Time|Description):.*$/gm, "").replace(/^\s*\n+/, "").trim();
    content = content.slice(0, MAX_CONTENT);

    // Upsert into cache
    await fetch(`${SUPABASE_URL}/rest/v1/article_cache`, {
      method: "POST",
      headers: { ...dbHeaders, "Prefer": "resolution=merge-duplicates" },
      body: JSON.stringify({ url, title, content, updated_at: new Date().toISOString() }),
    });

    return new Response(
      JSON.stringify({ content, title, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("article-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
