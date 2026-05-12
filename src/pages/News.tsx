import { useEffect, useState, useCallback } from "react";
import { ExternalLink, RefreshCw, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type NewsItem = { id: string; title: string; url: string; extra?: string };
type NewsResponse = { items: NewsItem[]; updated_at: string; cached?: boolean; stale?: boolean };

type SourceDef = { id: string; cn: string; vi: string };

const groups: { key: string; label: string; sources: SourceDef[] }[] = [
  {
    key: "hot",
    label: "热搜 · Hot Trending",
    sources: [
      { id: "weibo", cn: "微博热搜", vi: "Weibo Hot" },
      { id: "baidu", cn: "百度热搜", vi: "Baidu Hot" },
      { id: "zhihu", cn: "知乎热榜", vi: "Zhihu Hot" },
      { id: "toutiao", cn: "今日头条", vi: "Toutiao" },
    ],
  },
  {
    key: "tech",
    label: "科技 · Công nghệ",
    sources: [
      { id: "ithome", cn: "IT之家", vi: "ITHome" },
      { id: "juejin", cn: "掘金热榜", vi: "Juejin" },
    ],
  },
  {
    key: "news",
    label: "新闻 · Tin chính thống",
    sources: [
      { id: "thepaper", cn: "澎湃新闻", vi: "ThePaper" },
      { id: "cls", cn: "财联社电报", vi: "CLS Telegraph" },
    ],
  },
];

const SourceCard = ({ source }: { source: SourceDef }) => {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data: json, error: err } = await supabase.functions.invoke<NewsResponse>(
        "chinese-news",
        { body: { source: source.id, force } }
      );
      if (err) throw err;
      if (!json) throw new Error("Empty response");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải tin");
    } finally {
      setLoading(false);
    }
  }, [source.id]);

  useEffect(() => { load(false); }, [load]);

  return (
    <Card className="flex flex-col overflow-hidden border-border/60 bg-card/60 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <div>
          <h3 className="font-serif text-base font-bold gold-text">{source.cn}</h3>
          <p className="text-xs text-muted-foreground">{source.vi}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => load(true)}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      <div className="max-h-[480px] flex-1 overflow-y-auto">
        {loading && !data ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-destructive">Lỗi: {error}</div>
        ) : (
          <ol className="divide-y divide-border/40">
            {data?.items.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span
                    className={cn(
                      "shrink-0 font-mono text-xs font-bold tabular-nums",
                      idx < 3 ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 leading-snug text-foreground/90 group-hover:text-primary">
                    {item.title}
                    {item.extra && (
                      <span className="ml-1.5 text-xs text-muted-foreground">· {item.extra}</span>
                    )}
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>

      {data?.updated_at && (
        <div className="border-t border-border/60 bg-muted/20 px-3 py-1.5 text-[10px] text-muted-foreground">
          {data.stale ? "⚠ Tin cũ · " : ""}Cập nhật:{" "}
          {new Date(data.updated_at).toLocaleString("vi-VN")}
          {data.cached ? " (cache)" : " (mới)"}
        </div>
      )}
    </Card>
  );
};

const News = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Newspaper className="h-7 w-7 text-primary" />
            <h1 className="font-serif text-3xl font-bold gold-text">中国新闻 · Tin Trung Quốc</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tin nóng tổng hợp từ các nguồn lớn của Trung Quốc · Cache 12 giờ · Click vào tin để xem nguồn gốc.
          </p>
        </div>

        <Tabs defaultValue={groups[0].key}>
          <TabsList className="mb-6">
            {groups.map((g) => (
              <TabsTrigger key={g.key} value={g.key}>{g.label}</TabsTrigger>
            ))}
          </TabsList>
          {groups.map((g) => (
            <TabsContent key={g.key} value={g.key}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {g.sources.map((s) => (
                  <SourceCard key={s.id} source={s} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default News;
