// localStorage-backed store for saved vocabulary words and highlights.
const WORDS_KEY = "hskhub:saved-words";
const HIGHLIGHTS_KEY = "hskhub:highlights";

export interface SavedWord {
  id: string;
  text: string;
  note?: string;
  createdAt: number;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
  // Cross-tab sync via storage event is automatic; also dispatch custom for same-tab.
  window.dispatchEvent(new CustomEvent("hskhub:saved-words-changed"));
  window.dispatchEvent(new CustomEvent("hskhub:highlights-changed"));
}

export function subscribeSavedWords(listener: Listener) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === WORDS_KEY || e.key === HIGHLIGHTS_KEY) listener();
  };
  const onCustom = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener("hskhub:saved-words-changed", onCustom);
  window.addEventListener("hskhub:highlights-changed", onCustom);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("hskhub:saved-words-changed", onCustom);
    window.removeEventListener("hskhub:highlights-changed", onCustom);
  };
}

export function getSavedWords(): SavedWord[] {
  try {
    const raw = localStorage.getItem(WORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWord(text: string, note?: string): SavedWord | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const words = getSavedWords();
  const existing = words.find((w) => w.text === trimmed);
  if (existing) {
    if (note && note !== existing.note) {
      existing.note = note;
      localStorage.setItem(WORDS_KEY, JSON.stringify(words));
      emit();
    }
    return existing;
  }
  const word: SavedWord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    note,
    createdAt: Date.now(),
  };
  words.unshift(word);
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  emit();
  return word;
}

export function removeWord(id: string) {
  const words = getSavedWords().filter((w) => w.id !== id);
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  emit();
}

export function updateWordNote(id: string, note: string) {
  const words = getSavedWords();
  const w = words.find((x) => x.id === id);
  if (!w) return;
  w.note = note;
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  emit();
}

// ===== Highlights =====
export function getHighlights(): string[] {
  try {
    const raw = localStorage.getItem(HIGHLIGHTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHighlight(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const list = getHighlights();
  if (list.includes(trimmed)) return;
  list.unshift(trimmed);
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(list.slice(0, 500)));
  emit();
}

export function removeHighlight(text: string) {
  const list = getHighlights().filter((t) => t !== text);
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(list));
  emit();
}

export function isHighlighted(text: string) {
  return getHighlights().includes(text.trim());
}
