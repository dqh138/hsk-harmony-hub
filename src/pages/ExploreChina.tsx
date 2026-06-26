import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

import ChinaMap from "@/components/explore/ChinaMap";
import ProvinceDrawer from "@/components/explore/ProvinceDrawer";
import { PROVINCES, type Province } from "@/data/provinces";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Compass, Search } from "lucide-react";

const KIND_COLOR: Record<Province["kind"], string> = {
  省: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  直辖市: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  自治区: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  特别行政区: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
};

const ExploreChina = () => {
  const [selected, setSelected] = useState<Province | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROVINCES;
    return PROVINCES.filter(
      (p) =>
        p.nameCn.includes(q) ||
        p.geoName.includes(q) ||
        p.namePinyin.toLowerCase().includes(q) ||
        p.nameVn.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (p: Province) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">探索中国 · Khám phá Trung Quốc</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Bản đồ tương tác 34 đơn vị hành chính cấp tỉnh. Hover để xem thông tin nhanh, click để mở phần
            giới thiệu chi tiết kèm bài đọc hiểu.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm 中文 / Pinyin / Tiếng Việt"
                className="pl-8"
              />
            </div>
            <div className="max-h-[70vh] space-y-1 overflow-y-auto rounded-lg border border-border bg-card/30 p-2">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                    selected?.id === p.id && "bg-muted"
                  )}
                >
                  <span className="text-base">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 truncate">
                      <span className="font-bold">{p.nameCn}</span>
                      <span className="text-xs text-muted-foreground">{p.namePinyin}</span>
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">{p.nameVn}</div>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0 text-[9px]", KIND_COLOR[p.kind])}>
                    {p.kind}
                  </Badge>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-2 py-6 text-center text-xs text-muted-foreground">Không tìm thấy.</div>
              )}
            </div>
          </aside>

          {/* Map */}
          <section className="rounded-lg border border-border bg-card/30 p-2">
            <div className="aspect-[9/7] w-full">
              <ChinaMap selectedId={selected?.id} onSelect={handleSelect} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2 pb-1 text-[11px] text-muted-foreground">
              <span>Cuộn chuột để zoom · kéo để di chuyển bản đồ.</span>
              <span>
                Bản đồ chỉ phục vụ học tập. Hoàng Sa &amp; Trường Sa thuộc Việt Nam — không thể hiện trên
                vùng lãnh thổ Trung Quốc.
              </span>
            </div>
          </section>
        </div>
      </main>

      <ProvinceDrawer province={selected} open={open} onOpenChange={setOpen} />

      <Footer />
    </div>
  );
};

export default ExploreChina;
