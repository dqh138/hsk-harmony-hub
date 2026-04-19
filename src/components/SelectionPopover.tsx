import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookmarkPlus, Highlighter, ExternalLink, Clock, X, Languages, Loader2 } from "lucide-react";
import { addHighlightAt, saveWord } from "@/lib/savedWords";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CONTEXT_LEN = 20;

interface PopoverState {
  text: string;
  x: number;
  y: number;
}

interface LookupResult {
  pinyin: string;
  meaning: string;
  partOfSpeech?: string;
  hskLevel?: string;
}

const MAX_LEN = 80;
// Chỉ tra cứu nếu chuỗi chứa ký tự Hán.
const HAN_REGEX = /[\u4e00-\u9fff]/;

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "MARK", "NOSCRIPT", "CODE", "PRE"]);

/**
 * Walk text nodes immediately before/after a Range to capture surrounding
 * context (used to disambiguate highlight position when re-applying later).
 */
function computeContext(range: Range, len: number): { contextBefore: string; contextAfter: string } {
  const root = document.getElementById("root") ?? document.body;

  const acceptText = (n: Node) => {
    const parent = n.parentElement;
    if (!parent) return NodeFilter.FILTER_REJECT;
    if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
    if (parent.closest("[data-selection-popover]")) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  };

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: acceptText });

  // Collect all text nodes in document order, with their concatenated string and per-node start offsets
  const segs: { node: Text; start: number }[] = [];
  let full = "";
  let cur = walker.nextNode() as Text | null;
  while (cur) {
    const v = cur.nodeValue ?? "";
    if (v.length > 0) {
      segs.push({ node: cur, start: full.length });
      full += v;
    }
    cur = walker.nextNode() as Text | null;
  }

  const startNode = range.startContainer;
  const endNode = range.endContainer;
  const startSeg = segs.find((s) => s.node === startNode);
  const endSeg = segs.find((s) => s.node === endNode);
  if (!startSeg || !endSeg) return { contextBefore: "", contextAfter: "" };

  const startOffset = startSeg.start + range.startOffset;
  const endOffset = endSeg.start + range.endOffset;

  return {
    contextBefore: full.slice(Math.max(0, startOffset - len), startOffset),
    contextAfter: full.slice(endOffset, endOffset + len),
  };
}

const SelectionPopover = () => {
  const [state, setState] = useState<PopoverState | null>(null);
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef<Range | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (action: string): boolean => {
    if (user) return true;
    toast({
      title: "Cần đăng nhập",
      description: `Đăng nhập để ${action} và đồng bộ trên mọi thiết bị.`,
    });
    setState(null);
    setLookup(null);
    window.getSelection()?.removeAllRanges();
    navigate("/auth");
    return false;
  };

  useEffect(() => {
    const handleSelection = (e: Event) => {
      // Skip if mouseup/touchend happened inside our popover — clicking a
      // popover button must not dismiss the popover before its onClick fires.
      const evTarget = e.target as Node | null;
      if (evTarget && popoverRef.current?.contains(evTarget)) return;

      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setState(null);
          setLookup(null);
          return;
        }
        const text = sel.toString().trim();
        if (!text || text.length > MAX_LEN) {
          setState(null);
          setLookup(null);
          return;
        }

        const anchor = sel.anchorNode;
        const el =
          anchor && anchor.nodeType === Node.ELEMENT_NODE
            ? (anchor as Element)
            : anchor?.parentElement ?? null;
        if (el?.closest("[data-selection-popover]")) return;
        if (el?.closest("input, textarea, [contenteditable='true']")) return;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        rangeRef.current = range.cloneRange();
        setLookup(null);
        setState({
          text,
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + window.scrollY,
        });
      }, 10);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
    };

    const handleScroll = () => {
      setState(null);
      setLookup(null);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setState(null);
        setLookup(null);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!state) return null;

  const { text, x, y } = state;
  const hasHan = HAN_REGEX.test(text);

  const close = () => {
    setState(null);
    setLookup(null);
    rangeRef.current = null;
    window.getSelection()?.removeAllRanges();
  };

  const handleSave = async () => {
    if (!requireAuth("lưu từ")) return;
    await saveWord(text, lookup ? `${lookup.pinyin} – ${lookup.meaning}` : undefined);
    toast({ title: "已保存", description: `"${text}" 已加入生词本` });
    close();
  };

  const handleSaveLater = async () => {
    if (!requireAuth("lưu từ")) return;
    await saveWord(text, "稍后查询");
    toast({ title: "已加入待查列表", description: `"${text}"` });
    close();
  };

  const handleGoogle = () => {
    window.open(
      `https://translate.google.com/?sl=zh-CN&tl=vi&text=${encodeURIComponent(text)}&op=translate`,
      "_blank",
      "noopener"
    );
    close();
  };

  const handleHighlight = async () => {
    const range = rangeRef.current;
    console.log("[highlight] click handleHighlight", { hasRange: !!range, text });
    if (!range) {
      close();
      return;
    }

    const { contextBefore, contextAfter } = computeContext(range, CONTEXT_LEN);
    console.log("[highlight] context", { contextBefore, contextAfter, route: location.pathname });

    const rec = await addHighlightAt(text, location.pathname, contextBefore, contextAfter);
    console.log("[highlight] saved record", rec);

    if (rec) {
      try {
        const mark = document.createElement("mark");
        mark.className = "hskhub-highlight";
        mark.dataset.highlightId = rec.id;
        range.surroundContents(mark);
        console.log("[highlight] wrapped DOM");
      } catch (err) {
        console.warn("[highlight] surroundContents failed", err);
      }
    }
    close();
  };

  const handlePinyin = async () => {
    if (loading || lookup) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pinyin-translate", {
        body: { text },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setLookup(data as LookupResult);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi tra cứu";
      toast({ title: "Tra cứu thất bại", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={popoverRef}
      data-selection-popover
      style={{
        position: "absolute",
        left: x,
        top: y - 8,
        transform: "translate(-50%, -100%)",
      }}
      className="z-[100] flex max-w-[min(90vw,520px)] flex-col gap-1 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
    >
      {lookup && (
        <div className="flex flex-col gap-0.5 border-b border-border/60 px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-semibold text-primary">
              {lookup.pinyin}
            </span>
            {lookup.hskLevel && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {lookup.hskLevel}
              </span>
            )}
            {lookup.partOfSpeech && (
              <span className="text-[11px] italic text-muted-foreground">
                {lookup.partOfSpeech}
              </span>
            )}
          </div>
          <div className="text-xs text-foreground/90">{lookup.meaning}</div>
        </div>
      )}
      <div
        className="flex flex-wrap items-center gap-1"
        onMouseDown={(e) => e.preventDefault()}
      >
        <button
          onClick={handleHighlight}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          title="高亮"
        >
          <Highlighter className="h-3.5 w-3.5" />
          <span>高亮</span>
        </button>
        {hasHan && (
          <button
            onClick={handlePinyin}
            disabled={loading || !!lookup}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
            title="Hiển thị phiên âm và nghĩa"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Languages className="h-3.5 w-3.5" />
            )}
            <span>拼音</span>
          </button>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          title="加入生词本"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          <span>保存</span>
        </button>
        <button
          onClick={handleSaveLater}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          title="稍后查询"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>稍后查</span>
        </button>
        <button
          onClick={handleGoogle}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          title="Google 翻译"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Google</span>
        </button>
        <button
          onClick={close}
          className="rounded-md p-1.5 transition-colors hover:bg-muted"
          title="关闭"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SelectionPopover;
