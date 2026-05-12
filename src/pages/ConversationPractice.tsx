import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronLeft, ChevronRight, Mic, MicOff, Volume2, RotateCcw } from "lucide-react";
import { LEVEL_META, type ConvLevel } from "@/data/conversationTypes";
import { getConversationById } from "@/data/conversations";
import { scorePronunciation, type ScoreResult } from "@/lib/pronunciationScore";
import { supabase } from "@/integrations/supabase/client";
import { SonioxClient } from "@soniox/speech-to-text-web";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusColor = (s: "match" | "wrong" | "missing") =>
  s === "match" ? "text-emerald-500" : s === "wrong" ? "text-red-500" : "text-red-500/70 line-through";

const ConversationPractice = () => {
  const { level, id } = useParams<{ level: string; id: string }>();
  const conv = id ? getConversationById(id) : undefined;

  const [showPinyin, setShowPinyin] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<number, ScoreResult>>({});
  const [recording, setRecording] = useState(false);
  const [recState, setRecState] = useState<"idle" | "starting" | "running" | "stopping">("idle");
  const recordTranscribeRef = useRef<InstanceType<typeof SonioxClient> | null>(null);
  const finalTextRef = useRef<string>("");
  const [liveText, setLiveText] = useState("");

  useEffect(() => {
    return () => {
      if (recordTranscribeRef.current) {
        try { recordTranscribeRef.current.stop(); } catch { /* noop */ }
      }
    };
  }, []);

  if (!conv || !level || !["beginner", "intermediate", "advanced"].includes(level)) {
    return <Navigate to="/conversations" replace />;
  }
  const lvl = level as ConvLevel;
  const meta = LEVEL_META[lvl];
  const currentLine = conv.lines[currentIdx];
  const currentScore = scores[currentIdx];

  const playTTS = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "zh-CN";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const startRecording = async () => {
    if (recState !== "idle") return;
    if (!SonioxClient.isSupported) {
      toast({
        title: "Trình duyệt không hỗ trợ ghi âm",
        description: "Hãy mở bằng Chrome/Edge mới nhất và cho phép quyền dùng micro.",
        variant: "destructive",
      });
      return;
    }
    setRecState("starting");
    finalTextRef.current = "";
    setLiveText("");
    try {
      const rt = new SonioxClient({
        apiKey: async () => {
          const { data, error } = await supabase.functions.invoke("soniox-token");
          if (error || !data?.api_key) {
            throw new Error(data?.error || error?.message || "Không lấy được token Soniox");
          }
          return data.api_key as string;
        },
      });
      recordTranscribeRef.current = rt;

      await rt.start({
        model: "stt-rt-preview-v2",
        languageHints: ["zh"],
        audioConstraints: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
        onStarted: () => {
          setRecState("running");
          setRecording(true);
        },
        onPartialResult: (result: { tokens: Array<{ text: string; is_final: boolean }> }) => {
          let nonFinal = "";
          for (const t of result.tokens) {
            if (t.is_final) finalTextRef.current += t.text;
            else nonFinal += t.text;
          }
          setLiveText(finalTextRef.current + nonFinal);
        },
        onFinished: () => {
          const transcript = finalTextRef.current.trim();
          if (transcript) {
            const s = scorePronunciation(currentLine.hanzi, transcript);
            setScores((prev) => ({ ...prev, [currentIdx]: s }));
          }
          setRecState("idle");
          setRecording(false);
          recordTranscribeRef.current = null;
        },
        onError: (status: string, message: string) => {
          console.error("Soniox error", status, message);
          const micMessage = status === "get_user_media_failed"
            ? "Không truy cập được micro. Hãy kiểm tra micro đã cắm/kết nối, cấp quyền micro cho trình duyệt rồi thử lại."
            : message;
          toast({ title: "Lỗi ghi âm", description: micMessage, variant: "destructive" });
          setRecState("idle");
          setRecording(false);
          recordTranscribeRef.current = null;
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const description = msg.includes("Failed to create stream")
        ? "Không tìm thấy micro khả dụng. Hãy kết nối/cấp quyền micro rồi bấm thử lại."
        : msg;
      toast({ title: "Không thể bắt đầu ghi âm", description, variant: "destructive" });
      setRecState("idle");
      setRecording(false);
      recordTranscribeRef.current = null;
    }
  };

  const stopRecording = () => {
    if (!recordTranscribeRef.current || recState !== "running") return;
    setRecState("stopping");
    try { recordTranscribeRef.current.stop(); } catch { /* noop */ }
  };

  const goPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIdx((i) => Math.min(conv.lines.length - 1, i + 1));

  const totalScore = useMemo(() => {
    const keys = Object.keys(scores);
    if (keys.length === 0) return null;
    const sum = keys.reduce((acc, k) => acc + scores[Number(k)].total, 0);
    return Math.round(sum / keys.length);
  }, [scores]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-6">
        <Link to={`/conversations/${lvl}`}>
          <Button variant="ghost" size="sm" className="mb-3 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={`text-sm ${meta.color}`}>{meta.labelZh} · {meta.label}</p>
            <h1 className="font-serif text-2xl font-bold gold-text md:text-3xl">{conv.title}</h1>
            <p className="text-sm text-muted-foreground">{conv.titleVi}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="pinyin-toggle" checked={showPinyin} onCheckedChange={setShowPinyin} />
            <Label htmlFor="pinyin-toggle" className="cursor-pointer text-sm">Hiện 拼音</Label>
          </div>
        </header>

        {/* Conversation list with karaoke highlight */}
        <Card className="mb-4">
          <CardContent className="space-y-3 p-4">
            {conv.lines.map((line, idx) => {
              const isActive = idx === currentIdx;
              const lineScore = scores[idx];
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    isActive ? "border-primary/60 bg-primary/5" : "border-transparent opacity-60"
                  )}
                  onClick={() => setCurrentIdx(idx)}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      line.speaker === "A" ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-500"
                    )}>
                      {line.speaker}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium leading-relaxed">{line.hanzi}</p>
                      {showPinyin && (
                        <p className="text-sm text-muted-foreground">{line.pinyin}</p>
                      )}
                      <p className="mt-1 text-xs italic text-muted-foreground">{line.vi}</p>
                      {lineScore && (
                        <div className="mt-2 text-xs">
                          <span className={cn(
                            "rounded px-1.5 py-0.5 font-bold",
                            lineScore.total >= 80 ? "bg-emerald-500/20 text-emerald-500"
                              : lineScore.total >= 50 ? "bg-amber-500/20 text-amber-500"
                              : "bg-red-500/20 text-red-500"
                          )}>
                            {lineScore.total}%
                          </span>
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => { e.stopPropagation(); playTTS(line.hanzi); }}
                        title="Nghe mẫu (TTS)"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={currentIdx === 0}>
              <ChevronLeft className="h-4 w-4" />
              Câu trước
            </Button>
            <Button variant="outline" size="sm" onClick={goNext} disabled={currentIdx === conv.lines.length - 1}>
              Câu tiếp
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => playTTS(currentLine.hanzi)}>
              <Volume2 className="h-4 w-4" />
              Nghe mẫu
            </Button>

            {!recording ? (
              <Button onClick={startRecording} disabled={recState !== "idle"} className="gap-2">
                <Mic className="h-4 w-4" />
                {recState === "starting" ? "Đang khởi động..." : "Bắt đầu nói"}
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive" className="gap-2">
                <MicOff className="h-4 w-4" />
                {recState === "stopping" ? "Đang dừng..." : "Dừng & chấm điểm"}
              </Button>
            )}

            {scores[currentIdx] && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScores((p) => { const n = { ...p }; delete n[currentIdx]; return n; })}
              >
                <RotateCcw className="h-4 w-4" />
                Thử lại
              </Button>
            )}

            {totalScore !== null && (
              <span className="ml-auto text-sm text-muted-foreground">
                Điểm trung bình: <strong className="text-foreground">{totalScore}%</strong>
              </span>
            )}
          </CardContent>
        </Card>

        {/* Recording / Result panel */}
        {(recording || liveText || currentScore) && (
          <Card>
            <CardContent className="space-y-3 p-4">
              {recording && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  </span>
                  Đang nghe... hãy đọc câu hiện tại
                </div>
              )}

              {liveText && !currentScore && (
                <div>
                  <p className="text-xs text-muted-foreground">Đang nhận:</p>
                  <p className="text-base">{liveText}</p>
                </div>
              )}

              {currentScore && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Bạn đã đọc:</p>
                    <p className="text-base">{currentScore.userTranscript}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">So sánh ký tự Hán:</p>
                    <p className="text-lg">
                      {currentScore.hanziDiff.map((d, i) => (
                        <span key={i} className={statusColor(d.status)}>{d.char}</span>
                      ))}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">So sánh Pinyin (bỏ qua thanh điệu):</p>
                    <p className="text-base">
                      {currentScore.pinyinDiff.map((d, i) => (
                        <span key={i} className={cn(statusColor(d.status), "mr-1")}>{d.syllable}</span>
                      ))}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span>Hán tự: <strong>{currentScore.hanziScore}%</strong></span>
                    <span>Pinyin: <strong>{currentScore.pinyinScore}%</strong></span>
                    <span className="ml-auto rounded-md bg-primary/10 px-3 py-1 text-base">
                      Tổng: <strong className="text-primary">{currentScore.total}%</strong>
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ConversationPractice;
