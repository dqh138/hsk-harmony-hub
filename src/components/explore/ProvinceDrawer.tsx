import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Province } from "@/data/provinces";
import { Utensils, GraduationCap, Factory, Users, Landmark, Scroll, MapPin, BookOpen } from "lucide-react";

type Props = {
  province: Province | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

const KIND_LABEL: Record<Province["kind"], string> = {
  省: "Tỉnh",
  直辖市: "TP trực thuộc TW",
  自治区: "Khu tự trị",
  特别行政区: "Đặc khu hành chính",
};

const Section = ({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Utensils;
  title: string;
  items?: string[];
}) => {
  if (!items?.length) return null;
  return (
    <Card className="p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((it) => (
          <li key={it} className="leading-snug">
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
};

const ProvinceDrawer = ({ province, open, onOpenChange }: Props) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVn, setShowVn] = useState(false);

  if (!province) return null;
  const r = province.reading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto sm:max-w-xl">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{province.emoji}</span>
            <div className="flex-1">
              <SheetTitle className="flex items-baseline gap-2 text-2xl">
                <span>{province.nameCn}</span>
                <span className="text-base font-normal text-muted-foreground">{province.namePinyin}</span>
              </SheetTitle>
              <SheetDescription className="mt-0.5 flex items-center gap-2">
                <span>{province.nameVn}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {KIND_LABEL[province.kind]}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/30 p-3 text-center text-xs">
          <div>
            <div className="text-muted-foreground">首府</div>
            <div className="font-bold">{province.capital ?? "—"}</div>
            {province.capitalVn && <div className="text-[10px] text-muted-foreground">{province.capitalVn}</div>}
          </div>
          <div>
            <div className="text-muted-foreground">人口</div>
            <div className="font-bold">{province.population ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">面积</div>
            <div className="font-bold">{province.area ?? "—"}</div>
          </div>
        </div>

        {!province.highlights && !province.reading && (
          <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <BookOpen className="mx-auto mb-2 h-6 w-6" />
            Nội dung chi tiết đang được cập nhật.
          </div>
        )}

        {/* Highlights */}
        {province.highlights && (
          <div className="mt-4 space-y-3">
            {province.highlights.historical && (
              <Card className="border-primary/30 bg-primary/5 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <Scroll className="h-3.5 w-3.5" /> Đặc trưng lịch sử
                </div>
                <div className="text-sm">{province.highlights.historical}</div>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {province.majorCities?.length ? (
                <Card className="p-3 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> 主要城市 Thành phố chính
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {province.majorCities.map((c) => (
                      <Badge key={c.cn} variant="outline" className="text-xs">
                        {c.cn} <span className="ml-1 font-normal text-muted-foreground">{c.vn}</span>
                      </Badge>
                    ))}
                  </div>
                </Card>
              ) : null}

              <Section icon={Utensils} title="美食 Ẩm thực" items={province.highlights.cuisine} />
              <Section icon={GraduationCap} title="高校 Trường đại học" items={province.highlights.universities} />
              <Section icon={Factory} title="产业 Ngành nghề" items={province.highlights.industries} />
              <Section icon={Users} title="名人 Người nổi tiếng" items={province.highlights.famousPeople} />
              <Section icon={Landmark} title="地标 Địa danh" items={province.highlights.landmarks} />
            </div>
          </div>
        )}

        {/* Reading passage */}
        {r && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <BookOpen className="h-4 w-4" />
                阅读理解 — Bài đọc hiểu
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={showPinyin ? "default" : "outline"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setShowPinyin((v) => !v)}
                >
                  拼音
                </Button>
                <Button
                  size="sm"
                  variant={showVn ? "default" : "outline"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setShowVn((v) => !v)}
                >
                  VN
                </Button>
              </div>
            </div>
            <Card className="space-y-2 p-4 leading-relaxed">
              <p className="text-base">{r.cn}</p>
              {showPinyin && <p className="text-sm italic text-muted-foreground">{r.pinyin}</p>}
              {showVn && <p className="border-t border-border pt-2 text-sm">{r.vn}</p>}
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProvinceDrawer;
