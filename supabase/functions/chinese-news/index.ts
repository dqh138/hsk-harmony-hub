// Chinese News aggregator — ports key sources from github.com/ourongxing/newsnow
// Cache TTL: 12 hours (refreshed lazily on first request after expiry)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const TTL_MS = 12 * 60 * 60 * 1000;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

type NewsItem = { id: string; title: string; url: string; extra?: string };

async function f(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": UA,
      "Accept-Language": "zh-CN,zh;q=0.9",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res;
}

// ---------- Sources ----------
const sources: Record<string, () => Promise<NewsItem[]>> = {
  weibo: async () => {
    const r = await f("https://weibo.com/ajax/side/hotSearch");
    const j = await r.json();
    const list = (j?.data?.realtime ?? []) as Array<{ word: string; num?: number; word_scheme?: string }>;
    return list.slice(0, 30).map((k) => ({
      id: k.word,
      title: k.word,
      url: `https://s.weibo.com/weibo?q=${encodeURIComponent(k.word_scheme || `#${k.word}#`)}`,
      extra: k.num ? `${(k.num / 10000).toFixed(1)}万热度` : undefined,
    }));
  },

  baidu: async () => {
    const r = await f("https://top.baidu.com/board?tab=realtime");
    const html = await r.text();
    const m = html.match(/<!--s-data:(.*?)-->/s);
    if (!m) return [];
    const data = JSON.parse(m[1]);
    const cards = data?.data?.cards?.[0]?.content ?? [];
    return cards
      .filter((k: any) => !k.isTop)
      .slice(0, 30)
      .map((k: any) => ({
        id: k.rawUrl || k.word,
        title: k.word,
        url: k.rawUrl || `https://www.baidu.com/s?wd=${encodeURIComponent(k.word)}`,
        extra: k.desc,
      }));
  },

  zhihu: async () => {
    const r = await f(
      "https://www.zhihu.com/api/v3/feed/topstory/hot-list-web?limit=30&desktop=true"
    );
    const j = await r.json();
    return (j.data ?? []).map((k: any) => ({
      id: k.target?.link?.url ?? k.target?.title_area?.text,
      title: k.target?.title_area?.text ?? "",
      url: k.target?.link?.url ?? "",
      extra: k.target?.metrics_area?.text,
    }));
  },

  toutiao: async () => {
    const r = await f("https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc");
    const j = await r.json();
    return (j.data ?? []).slice(0, 30).map((k: any) => ({
      id: k.ClusterIdStr,
      title: k.Title,
      url: `https://www.toutiao.com/trending/${k.ClusterIdStr}/`,
      extra: k.HotValue ? `${(Number(k.HotValue) / 10000).toFixed(0)}万` : undefined,
    }));
  },

  thepaper: async () => {
    const r = await f("https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar");
    const j = await r.json();
    return (j?.data?.hotNews ?? []).slice(0, 30).map((k: any) => ({
      id: String(k.contId),
      title: k.name,
      url: `https://www.thepaper.cn/newsDetail_forward_${k.contId}`,
    }));
  },

  juejin: async () => {
    const r = await f(
      "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&spider=0"
    );
    const j = await r.json();
    return (j.data ?? []).slice(0, 30).map((k: any) => ({
      id: k.content?.content_id,
      title: k.content?.title ?? "",
      url: `https://juejin.cn/post/${k.content?.content_id}`,
      extra: k.content_counter?.hot_rank ? `热度 ${k.content_counter.hot_rank}` : undefined,
    }));
  },

  ithome: async () => {
    // Use the ranking JSON endpoint instead of HTML scraping
    const r = await f("https://m.ithome.com/rankm/");
    const html = await r.text();
    const items: NewsItem[] = [];
    // Look for article links in the markup
    const re = /<a[^>]+href="(https?:\/\/www\.ithome\.com\/0\/\d+\/\d+\.htm)"[^>]*>([^<]+)<\/a>/g;
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const url = m[1];
      const title = m[2].trim();
      if (!title || seen.has(url)) continue;
      seen.add(url);
      items.push({ id: url, title, url });
      if (items.length >= 30) break;
    }
    return items;
  },

  cls: async () => {
    // 财联社 telegraph (flash news) — public endpoint
    const r = await f(
      "https://www.cls.cn/nodeapi/updateTelegraphList?app=CailianpressWeb&category=&lastTime=&last_time=&os=web&refresh_type=1&rn=30&subscribedColumnIds=&sv=7.7.5"
    );
    const j = await r.json();
    return (j?.data?.roll_data ?? []).slice(0, 30).map((k: any) => ({
      id: String(k.id),
      title: k.title || k.brief?.replace(/\n/g, " ").slice(0, 60),
      url: k.shareurl || `https://www.cls.cn/detail/${k.id}`,
      extra: k.ctime ? new Date(k.ctime * 1000).toLocaleTimeString("zh-CN") : undefined,
    }));
  },
};

const ALLOWED = Object.keys(sources);

// ---------- Handler ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const source = url.searchParams.get("source") || "";
  const force = url.searchParams.get("force") === "1";

  if (!ALLOWED.includes(source)) {
    return new Response(
      JSON.stringify({ error: "Invalid source", allowed: ALLOWED }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Check cache
  if (!force) {
    const { data } = await supabase
      .from("news_cache")
      .select("payload, updated_at")
      .eq("source_id", source)
      .maybeSingle();

    if (data) {
      const age = Date.now() - new Date(data.updated_at).getTime();
      if (age < TTL_MS) {
        return new Response(
          JSON.stringify({ source, items: data.payload, updated_at: data.updated_at, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
  }

  try {
    const items = await sources[source]();
    await supabase
      .from("news_cache")
      .upsert({ source_id: source, payload: items, updated_at: new Date().toISOString() });
    return new Response(
      JSON.stringify({ source, items, updated_at: new Date().toISOString(), cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`[${source}] fetch failed:`, err);
    // Fall back to stale cache if available
    const { data } = await supabase
      .from("news_cache")
      .select("payload, updated_at")
      .eq("source_id", source)
      .maybeSingle();
    if (data) {
      return new Response(
        JSON.stringify({
          source,
          items: data.payload,
          updated_at: data.updated_at,
          cached: true,
          stale: true,
          error: String(err),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: String(err), source }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
