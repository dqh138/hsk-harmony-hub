import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Bookmark, FileText, ArrowRight, Sparkles, Layers, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { allGrammar } from "@/data/grammar";
import { allVocab } from "@/data/vocab";
import { HSKLevel, hskLevelColors, hskLevelTextColors } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

interface FeatureCard {
  title: string;
  chinese: string;
  description: string;
  icon: React.ElementType;
  href: string;
  cta: string;
  stat: string;
  accent: string;
  iconBg: string;
}

const Index = () => {
  const grammarCount = allGrammar.length;
  const vocabCount = allVocab.length;

  const features: FeatureCard[] = [
    {
      title: "Grammar Reference",
      chinese: "语法",
      description:
        "Tra cứu toàn bộ ngữ pháp HSK 1–6 với cấu trúc, giải thích và ví dụ song ngữ Hán–Anh chi tiết.",
      icon: BookOpen,
      href: "/hsk/1",
      cta: "Khám phá ngữ pháp",
      stat: `${grammarCount}+ điểm ngữ pháp`,
      accent: "from-hsk1/20 to-hsk2/10",
      iconBg: "bg-hsk1/15 text-hsk1",
    },
    {
      title: "Vocabulary",
      chinese: "生词",
      description:
        "Danh sách từ vựng chuẩn HSK theo từng cấp độ, kèm pinyin, từ loại, nghĩa và ví dụ thực tế.",
      icon: Layers,
      href: "/vocabulary/1",
      cta: "Học từ mới",
      stat: `${vocabCount}+ từ vựng`,
      accent: "from-hsk3/20 to-hsk4/10",
      iconBg: "bg-hsk3/15 text-hsk3",
    },
    {
      title: "Saved Words",
      chinese: "生词本",
      description:
        "Sổ tay từ vựng cá nhân — bôi đen từ bất kỳ trên trang để lưu, ôn lại bằng chế độ flashcard.",
      icon: Bookmark,
      href: "/saved-words",
      cta: "Mở sổ tay",
      stat: "Flashcard & ghi chú",
      accent: "from-hsk5/20 to-hsk6/10",
      iconBg: "bg-hsk5/15 text-hsk5",
    },
    {
      title: "Mock Exams",
      chinese: "模拟考试",
      description:
        "Luyện đề thi thử HSK với đầy đủ phần Nghe, Đọc, Viết — bấm giờ và xem đáp án mẫu chuẩn.",
      icon: FileText,
      href: "/mock-exams",
      cta: "Vào phòng thi",
      stat: "10+ đề HSK 6",
      accent: "from-hsk6/20 to-hsk1/10",
      iconBg: "bg-hsk6/15 text-hsk6",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container relative mx-auto px-4 py-20 text-center md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            学中文 · Học tiếng Trung từ HSK 1 đến HSK 6
          </div>
          <h1 className="mt-6 font-serif text-5xl font-black tracking-tight gold-text sm:text-6xl md:text-7xl">
            HSK Hub
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Một nơi duy nhất để <span className="font-semibold text-foreground">tra ngữ pháp</span>,{" "}
            <span className="font-semibold text-foreground">học từ vựng</span>,{" "}
            <span className="font-semibold text-foreground">luyện từ mới</span> và{" "}
            <span className="font-semibold text-foreground">ôn đề thi HSK</span>. Tất cả song ngữ Hán–Anh, miễn phí, không quảng cáo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/hsk/1">
                Bắt đầu với HSK 1 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/mock-exams">
                <FileText className="h-4 w-4" /> Thử đề HSK 6
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { value: `${grammarCount}+`, label: "Ngữ pháp" },
              { value: `${vocabCount}+`, label: "Từ vựng" },
              { value: "6", label: "Cấp HSK" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/50 bg-card/50 px-4 py-4 backdrop-blur">
                <div className="font-serif text-2xl font-black gold-text md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-black md:text-4xl">
            <span className="text-primary">Đồng hành</span> cùng bạn trên con đường{" "}
            <span className="gold-text">chinh phục HSK</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Từ ngữ pháp nền tảng đến phòng thi thử, mọi thứ bạn cần đều ở đây.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                to={f.href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 md:p-8"
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity group-hover:opacity-70", f.accent)} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", f.iconBg)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                      {f.stat}
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline gap-3">
                    <h3 className="font-serif text-2xl font-black">{f.title}</h3>
                    <span className="font-serif text-lg text-muted-foreground">{f.chinese}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                    {f.cta} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Level Access */}
      <section className="border-y border-border/30 bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-black md:text-3xl">
                Truy cập nhanh theo <span className="gold-text">cấp độ</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Chọn level — vào thẳng ngữ pháp của cấp đó.</p>
            </div>
            <Link to="/hsk/1" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {levels.map((level) => {
              const count = allGrammar.filter((g) => g.level === level).length;
              return (
                <Link
                  key={level}
                  to={`/hsk/${level}`}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className={cn("mx-auto mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold text-background", hskLevelColors[level])}>
                    LEVEL {level}
                  </div>
                  <div className={cn("font-serif text-3xl font-black", hskLevelTextColors[level])}>HSK {level}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{count} điểm NP</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-black md:text-4xl">
            Học theo <span className="gold-text">đúng thứ tự</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">Một vòng lặp đơn giản, hiệu quả từ HSK 1 đến HSK 6.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: "01", icon: BookOpen, title: "Học ngữ pháp", desc: "Nắm chắc cấu trúc và ví dụ từng level." , href: "/hsk/1"},
            { step: "02", icon: Layers, title: "Mở rộng từ vựng", desc: "Thêm từ mới theo level HSK chuẩn.", href: "/vocabulary/1" },
            { step: "03", icon: Bookmark, title: "Lưu & ôn lại", desc: "Bôi đen từ bất kỳ → lưu vào sổ tay.", href: "/saved-words" },
            { step: "04", icon: FileText, title: "Luyện đề thật", desc: "Bấm giờ, làm đề HSK đầy đủ 3 phần.", href: "/mock-exams" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.step}
                to={s.href}
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-black text-muted-foreground/30">{s.step}</span>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center md:p-12">
          <GraduationCap className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-serif text-3xl font-black md:text-4xl">
            Sẵn sàng <span className="gold-text">chinh phục HSK</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Bắt đầu từ ngữ pháp nền tảng hoặc lao thẳng vào phòng thi thử — bạn chọn.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/hsk/1"><BookOpen className="h-4 w-4" /> Học ngữ pháp HSK 1</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/vocabulary/1"><Search className="h-4 w-4" /> Duyệt từ vựng</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
        <p>中文语法 — HSK Grammar & Vocabulary Reference for Chinese Learners</p>
      </footer>
    </div>
  );
};

export default Index;
