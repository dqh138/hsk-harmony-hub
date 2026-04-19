import { useEffect, useRef, useState } from "react";
import { BookmarkPlus, Highlighter, ExternalLink, Clock, X } from "lucide-react";
import { addHighlight, isHighlighted, removeHighlight, saveWord } from "@/lib/savedWords";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PopoverState {
  text: string;
  x: number;
  y: number;
}

const MAX_LEN = 80;

const SelectionPopover = () => {
  const [state, setState] = useState<PopoverState | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      // Defer to ensure selection is finalized.
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setState(null);
          return;
        }
        const text = sel.toString().trim();
        if (!text || text.length > MAX_LEN) {
          setState(null);
          return;
        }

        // Don't show inside the popover itself or input/textarea.
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

    const handleScroll = () => setState(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
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
  const highlighted = isHighlighted(text);

  const close = () => {
    setState(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleSave = () => {
    saveWord(text);
    toast({ title: "已保存", description: `"${text}" 已加入生词本` });
    close();
  };

  const handleSaveLater = () => {
    saveWord(text, "稍后查询");
    toast({ title: "已加入待查列表", description: `"${text}"` });
    close();
  };

  const handlePleco = () => {
    window.open(`https://www.pleco.com/?s=${encodeURIComponent(text)}`, "_blank", "noopener");
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

  const handleHighlight = () => {
    if (highlighted) {
      removeHighlight(text);
      toast({ title: "已取消高亮", description: `"${text}"` });
    } else {
      addHighlight(text);
      toast({ title: "已高亮", description: `"${text}"` });
    }
    close();
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
      className="z-[100] flex items-center gap-1 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
    >
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
        onClick={handlePleco}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        title="Pleco 词典"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        <span>Pleco</span>
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
        onClick={handleHighlight}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted",
          highlighted && "text-primary"
        )}
        title={highlighted ? "取消高亮" : "高亮"}
      >
        <Highlighter className="h-3.5 w-3.5" />
        <span>{highlighted ? "取消" : "高亮"}</span>
      </button>
      <button
        onClick={close}
        className="rounded-md p-1.5 transition-colors hover:bg-muted"
        title="关闭"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default SelectionPopover;
