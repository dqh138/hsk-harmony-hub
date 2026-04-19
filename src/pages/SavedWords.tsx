import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, RotateCw, ChevronLeft, ChevronRight, BookOpen, Layers, LogIn, Cloud } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getSavedWords,
  removeWord,
  subscribeSavedWords,
  type SavedWord,
} from "@/lib/savedWords";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type Mode = "list" | "flashcard";

const SavedWords = () => {
  const { user, loading } = useAuth();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setWords(getSavedWords());
    return subscribeSavedWords(() => setWords(getSavedWords()));
  }, [user]);

  const current = words[index];

  const reset = () => {
    setIndex(0);
    setFlipped(false);
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(words.length, 1));
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + words.length) % Math.max(words.length, 1));
  };

  const shuffle = () => {
    setWords((arr) => [...arr].sort(() => Math.random() - 0.5));
    reset();
  };

  const formattedDate = useMemo(
    () => (ts: number) => new Date(ts).toLocaleDateString("zh-CN"),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="mx-auto max-w-md p-8 text-center">
            <Cloud className="mx-auto mb-3 h-10 w-10 text-primary" />
            <h1 className="mb-2 font-serif text-2xl font-bold gold-text">生词本</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Đăng nhập để lưu từ vựng và đồng bộ trên mọi thiết bị.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập / Đăng ký
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold gold-text">生词本</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Cloud className="h-3.5 w-3.5" />
              共 {words.length} 个已保存的词语 · đồng bộ cloud
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("list")}
            >
              <BookOpen className="mr-1.5 h-4 w-4" />
              列表
            </Button>
            <Button
              variant={mode === "flashcard" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("flashcard");
                reset();
              }}
              disabled={words.length === 0}
            >
              <Layers className="mr-1.5 h-4 w-4" />
              抽认卡
            </Button>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            <p className="mb-2 text-base">还没有保存的词语。</p>
            <p className="text-sm">
              在网页上选中任意中文文本，点击"保存"即可加入生词本。
            </p>
          </Card>
        ) : mode === "list" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((w) => (
              <Card key={w.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-serif text-2xl font-semibold text-foreground">
                    {w.text}
                  </div>
                  <button
                    onClick={() => removeWord(w.id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {w.note && (
                  <div className="text-sm text-muted-foreground">{w.note}</div>
                )}
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formattedDate(w.createdAt)}</span>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.pleco.com/?s=${encodeURIComponent(w.text)}`}
                      target="_blank"
                      rel="noopener"
                      className="text-primary hover:underline"
                    >
                      Pleco
                    </a>
                    <a
                      href={`https://translate.google.com/?sl=zh-CN&tl=vi&text=${encodeURIComponent(w.text)}&op=translate`}
                      target="_blank"
                      rel="noopener"
                      className="text-primary hover:underline"
                    >
                      译
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {index + 1} / {words.length}
              </span>
              <Button variant="ghost" size="sm" onClick={shuffle}>
                <RotateCw className="mr-1.5 h-4 w-4" />
                乱序
              </Button>
            </div>
            <button
              onClick={() => setFlipped((f) => !f)}
              className={cn(
                "flex min-h-[280px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-md transition-all hover:border-primary/50",
                flipped && "bg-muted/30"
              )}
            >
              {!flipped ? (
                <div className="font-serif text-5xl font-bold text-foreground">
                  {current?.text}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">点击查询</div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={`https://www.pleco.com/?s=${encodeURIComponent(current?.text ?? "")}`}
                      target="_blank"
                      rel="noopener"
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      Pleco 词典
                    </a>
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={`https://translate.google.com/?sl=zh-CN&tl=vi&text=${encodeURIComponent(current?.text ?? "")}&op=translate`}
                      target="_blank"
                      rel="noopener"
                      className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Google 翻译
                    </a>
                  </div>
                  {current?.note && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      备注：{current.note}
                    </div>
                  )}
                </div>
              )}
            </button>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={prev}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                上一个
              </Button>
              <Button
                variant="ghost"
                onClick={() => current && removeWord(current.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                删除
              </Button>
              <Button onClick={next}>
                下一个
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedWords;
