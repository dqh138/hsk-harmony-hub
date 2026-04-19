import { useEffect, useState } from "react";
import { getHighlights, subscribeSavedWords } from "@/lib/savedWords";

/**
 * Walks the DOM and wraps occurrences of highlighted phrases in <mark> tags.
 * Skips inputs, scripts, and already-marked nodes. Re-runs on route changes
 * via MutationObserver so dynamically rendered content also gets highlighted.
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

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTextNode(node: Text, regex: RegExp) {
  const text = node.nodeValue ?? "";
  if (!text || !regex.test(text)) return;
  regex.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const mark = document.createElement("mark");
    mark.className = "hskhub-highlight";
    mark.textContent = match[0];
    frag.appendChild(mark);
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) regex.lastIndex++;
  }
  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  node.parentNode?.replaceChild(frag, node);
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

function applyHighlights(root: HTMLElement, terms: string[]) {
  if (terms.length === 0) return;
  const pattern = terms.map(escapeRegex).join("|");
  const regex = new RegExp(pattern, "g");

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-selection-popover]")) return NodeFilter.FILTER_REJECT;
      if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  let cur = walker.nextNode();
  while (cur) {
    nodes.push(cur as Text);
    cur = walker.nextNode();
  }
  nodes.forEach((n) => highlightTextNode(n, regex));
}

const HighlightStyles = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    return subscribeSavedWords(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const terms = getHighlights();

    let scheduled = false;
    const run = () => {
      scheduled = false;
      clearHighlights(root);
      applyHighlights(root, terms);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(run);
    };

    schedule();

    const observer = new MutationObserver((mutations) => {
      // Ignore mutations we caused (mark nodes).
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
  }, [tick]);

  return null;
};

export default HighlightStyles;
