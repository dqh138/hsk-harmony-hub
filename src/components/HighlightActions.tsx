import { useEffect, useRef, useState } from "react";
import { X, Highlighter } from "lucide-react";
import { removeHighlightById } from "@/lib/savedWords";

interface PopoverState {
  id: string;
  x: number;
  y: number;
}

/**
 * Listens for clicks on existing highlight <mark> elements and shows a small
 * popover with a "remove highlight" action.
 */
const HighlightActions = () => {
  const [state, setState] = useState<PopoverState | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Click inside our own popover → ignore
      if (popoverRef.current?.contains(target)) return;

      const mark = target.closest<HTMLElement>("mark.hskhub-highlight");
      if (!mark || !mark.dataset.highlightId) {
        setState(null);
        return;
      }

      // Don't show when user is selecting text
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) return;

      const rect = mark.getBoundingClientRect();
      setState({
        id: mark.dataset.highlightId,
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY,
      });
    };

    const handleScroll = () => setState(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!state) return null;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = state.id;
    setState(null);
    await removeHighlightById(id);
  };

  return (
    <div
      ref={popoverRef}
      data-selection-popover
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: state.x,
        top: state.y - 8,
        transform: "translate(-50%, -100%)",
      }}
      className="z-[100] flex items-center gap-1 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleRemove}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
        title="取消高亮"
      >
        <Highlighter className="h-3.5 w-3.5" />
        <span>取消高亮</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          setState(null);
        }}
        className="rounded-md p-1.5 transition-colors hover:bg-muted"
        title="关闭"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default HighlightActions;
