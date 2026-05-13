// Fetches full article content from supported Chinese news sources
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function f(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9", ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type FetchResult = { content: string; title?: string; supported: boolean };

async function fetchThePaper(id: string): Promise<FetchResult> {
  const r = await f(`https://www.thepaper.cn/newsDetail_forward_${id}`);
  const html = await r.text();
  // Extract article data from Next.js SSR payload
  const marker = 'id="__NEXT_DATA__" type="application/json">';
  const start = html.indexOf(marker);
  if (start < 0) return { content: "", supported: true };
  const end = html.indexOf("</script>", start + marker.length);
  const json = JSON.parse(html.slice(start + marker.length, end));
  const detail = json?.props?.pageProps?.detailData?.contentDetail;
  if (!detail) return { content: "", supported: true };
  return {
    content: stripHtml(detail.content ?? detail.summary ?? "").slice(0, 4000),
    title: detail.name ?? "",
    supported: true,
  };
}

async function fetchCLS(id: string): Promise<FetchResult> {
  const r = await f(
    `https://www.cls.cn/nodeapi/telegraphDetail?id=${id}&app=CailianpressWeb&os=web&sv=7.7.5`
  );
  const j = await r.json();
  const item = j?.data;
  const raw = item?.content ?? item?.brief ?? "";
  return {
    content: stripHtml(raw).slice(0, 4000),
    title: item?.title ?? "",
    supported: true,
  };
}

async function fetchJuejin(id: string): Promise<FetchResult> {
  const r = await f("https://api.juejin.cn/content_api/v1/article/detail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article_id: id }),
  });
  const j = await r.json();
  const info = j?.data?.article?.article_info;
  if (!info) return { content: "", supported: true };
  return {
    content: stripHtml(info.mark_content ?? "").slice(0, 4000),
    title: info.title ?? "",
    supported: true,
  };
}

async function fetchITHome(url: string): Promise<FetchResult> {
  const r = await f(url);
  const html = await r.text();
  const patterns = [
    /<div[^>]+class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]+class="[^"]*(?:post-tags|ad-|comment)[^"]*")/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
  ];
  let raw = "";
  for (const pat of patterns) {
    const m = html.match(pat);
    if (m) { raw = m[1]; break; }
  }
  if (!raw) return { content: "", supported: true };
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return {
    content: stripHtml(raw).slice(0, 4000),
    title: titleMatch ? stripHtml(titleMatch[1]) : undefined,
    supported: true,
  };
}

// Sources that are trending topics only — no article body
const TREND_SOURCES = new Set(["weibo", "baidu", "zhihu", "toutiao"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { source, id, url } = await req.json();

    if (TREND_SOURCES.has(source)) {
      return new Response(JSON.stringify({ content: "", supported: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: FetchResult;
    try {
      switch (source) {
        case "thepaper": result = await fetchThePaper(id ?? ""); break;
        case "cls":      result = await fetchCLS(id ?? ""); break;
        case "juejin":   result = await fetchJuejin(id ?? ""); break;
        case "ithome":   result = await fetchITHome(url ?? ""); break;
        default:         result = { content: "", supported: false };
      }
    } catch (e) {
      console.error(`[${source}] fetch error:`, e);
      result = { content: "", supported: true };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-article error:", e);
    return new Response(JSON.stringify({ content: "", supported: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
