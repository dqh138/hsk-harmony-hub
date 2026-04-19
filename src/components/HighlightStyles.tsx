import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getHighlightsForRoute,
  subscribeSavedWords,
  type HighlightRecord,
} from "@/lib/savedWords";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Re-applies per-location highlights (saved with route + context-before/after)
 * onto the current page. Only highlights the exact instances that the user
 * originally selected — not every occurrence of the same text.
 */
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "INPUT",
  "TEXTAREA",
  "MARK",
  "NOSCRIPT",
  "CODE",
  "PRE",
]);

const CONTEXT_LEN = 20;

interface TextSegment {
  node: Text;
  start: number; // inclusive offset in concatenated string
  end: number; // exclusive
}

function collectTextSegments(root: HTMLElement): { full: string; segments: TextSegment[] } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-selection-popover]")) return NodeFilter.FILTER_REJECT;
      if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const segments: TextSegment[] = [];
  let full = "";
  let cur = walker.nextNode() as Text | null;
  while (cur) {
    const value = cur.nodeValue ?? "";
    if (value.length > 0) {
      segments.push({ node: cur, start: full.length, end: full.length + value.length });
      full += value;
    }
    cur = walker.nextNode() as Text | null;
  }
  return { full, segments };
}

function findOffset(
  full: string,
  contextBefore: string,
  text: string,
  contextAfter: string
): number {
  // Try exact context match first
  const target = contextBefore + text + contextAfter;
  let idx = full.indexOf(target);
  if (idx !== -1) return idx + contextBefore.length;

  // Fallback: trim context if missing on edges (start/end of page)
  if (contextBefore && !contextAfter) {
    idx = full.indexOf(contextBefore + text);
    if (idx !== -1) return idx + contextBefore.length;
  }
  if (!contextBefore && contextAfter) {
    idx = full.indexOf(text + contextAfter);
    if (idx !== -1) return idx;
  }
  // Last resort: first occurrence of text alone (only if there is exactly one)
  const first = full.indexOf(text);
  if (first !== -1 && full.indexOf(text, first + 1) === -1) return first;
  return -1;
}

function wrapRange(segments: TextSegment[], startOffset: number, endOffset: number) {
  // Find segment containing startOffset and endOffset
  const startSeg = segments.find((s) => startOffset >= s.start && startOffset < s.end);
  const endSeg = segments.find((s) => endOffset > s.start && endOffset <= s.end);
  if (!startSeg || !endSeg) return;

  const range = document.createRange();
  try {
    range.setStart(startSeg.node, startOffset - startSeg.start);
    range.setEnd(endSeg.node, endOffset - endSeg.start);
  } catch {
    return;
  }

  // Only wrap if range stays within a single parent (safest, avoids breaking layout)
  if (startSeg.node.parentNode !== endSeg.node.parentNode && startSeg !== endSeg) {
    // Multi-parent ranges: skip to avoid DOM corruption
    return;
  }

  try {
    const mark = document.createElement("mark");
    mark.className = "hskhub-highlight";
    range.surroundContents(mark);
  } catch {
    // surroundContents can throw if range crosses element boundaries
  }
}

function clearHighlights(root: HTMLElement) {
  const marks = root.querySelectorAll("mark.hskhub-highlight");
  marks.forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  });
}

function applyHighlights(root: HTMLElement, records: HighlightRecord[]) {
  if (records.length === 0) return;
  // Apply one-by-one so each subsequent search sees fresh DOM
  for (const rec of records) {
    const { full, segments } = collectTextSegments(root);
    const offset = findOffset(full, rec.contextBefore, rec.text, rec.contextAfter);
    if (offset === -1) continue;
    wrapRange(segments, offset, offset + rec.text.length);
  }
}

const HighlightStyles = () => {
  const [tick, setTick] = useState(0);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => subscribeSavedWords(() => setTick((t) => t + 1)), []);

  useEffect(() => {
    setTick((t) => t + 1);
  }, [user?.id, location.pathname]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const records = getHighlightsForRoute(location.pathname);

    let scheduled = false;
    const run = () => {
      scheduled = false;
      clearHighlights(root);
      applyHighlights(root, records);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(run);
    };

    schedule();

    const observer = new MutationObserver((mutations) => {
      const meaningful = mutations.some((m) =>
        Array.from(m.addedNodes).some(
          (n) => !(n instanceof HTMLElement && n.tagName === "MARK")
        )
      );
      if (meaningful) schedule();
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      clearHighlights(root);
    };
  }, [tick, location.pathname]);

  return null;
};

export { CONTEXT_LEN };
export default HighlightStyles;
