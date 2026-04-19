// Cloud-backed store for saved vocabulary words and highlights.
// Uses Supabase when user is authenticated, falls back to localStorage as guest cache.
import { supabase } from "@/integrations/supabase/client";

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

let wordsCache: SavedWord[] = [];
let highlightsCache: string[] = [];
let currentUserId: string | null = null;
let initialized = false;

function emit() {
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent("hskhub:saved-words-changed"));
  window.dispatchEvent(new CustomEvent("hskhub:highlights-changed"));
}

function loadLocal(): { words: SavedWord[]; highlights: string[] } {
  try {
    const w = localStorage.getItem(WORDS_KEY);
    const h = localStorage.getItem(HIGHLIGHTS_KEY);
    return {
      words: w ? (JSON.parse(w) as SavedWord[]) : [],
      highlights: h ? (JSON.parse(h) as string[]) : [],
    };
  } catch {
    return { words: [], highlights: [] };
  }
}

function persistLocal() {
  if (currentUserId) return; // Cloud is source of truth when signed in
  localStorage.setItem(WORDS_KEY, JSON.stringify(wordsCache));
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlightsCache));
}

async function fetchCloud() {
  if (!currentUserId) return;
  const [wordsRes, highlightsRes] = await Promise.all([
    supabase
      .from("saved_words")
      .select("id, text, note, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("highlights")
      .select("text")
      .order("created_at", { ascending: false }),
  ]);
  if (!wordsRes.error && wordsRes.data) {
    wordsCache = wordsRes.data.map((w) => ({
      id: w.id,
      text: w.text,
      note: w.note ?? undefined,
      createdAt: new Date(w.created_at).getTime(),
    }));
  }
  if (!highlightsRes.error && highlightsRes.data) {
    highlightsCache = highlightsRes.data.map((h) => h.text);
  }
  emit();
}

async function migrateLocalToCloud() {
  if (!currentUserId) return;
  const local = loadLocal();
  if (local.words.length === 0 && local.highlights.length === 0) return;

  if (local.words.length > 0) {
    await supabase.from("saved_words").upsert(
      local.words.map((w) => ({
        user_id: currentUserId!,
        text: w.text,
        note: w.note ?? null,
      })),
      { onConflict: "user_id,text", ignoreDuplicates: true }
    );
  }
  if (local.highlights.length > 0) {
    await supabase.from("highlights").upsert(
      local.highlights.map((t) => ({ user_id: currentUserId!, text: t })),
      { onConflict: "user_id,text", ignoreDuplicates: true }
    );
  }
  // Clear local after migration
  localStorage.removeItem(WORDS_KEY);
  localStorage.removeItem(HIGHLIGHTS_KEY);
}

/**
 * Initialize the store. Call once at app start with the current user id (or null).
 * When user changes, call again to switch source.
 */
export async function initSavedWords(userId: string | null) {
  currentUserId = userId;
  initialized = true;
  if (userId) {
    await migrateLocalToCloud();
    await fetchCloud();
  } else {
    const local = loadLocal();
    wordsCache = local.words;
    highlightsCache = local.highlights;
    emit();
  }
}

export function isCloudMode(): boolean {
  return !!currentUserId;
}

export function subscribeSavedWords(listener: Listener) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (!currentUserId && (e.key === WORDS_KEY || e.key === HIGHLIGHTS_KEY)) {
      const local = loadLocal();
      wordsCache = local.words;
      highlightsCache = local.highlights;
      listener();
    }
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
  if (!initialized) {
    const local = loadLocal();
    wordsCache = local.words;
    highlightsCache = local.highlights;
    initialized = true;
  }
  return wordsCache;
}

export async function saveWord(text: string, note?: string): Promise<SavedWord | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (currentUserId) {
    const { data, error } = await supabase
      .from("saved_words")
      .upsert(
        { user_id: currentUserId, text: trimmed, note: note ?? null },
        { onConflict: "user_id,text" }
      )
      .select("id, text, note, created_at")
      .single();
    if (error || !data) return null;
    const word: SavedWord = {
      id: data.id,
      text: data.text,
      note: data.note ?? undefined,
      createdAt: new Date(data.created_at).getTime(),
    };
    wordsCache = [word, ...wordsCache.filter((w) => w.text !== trimmed)];
    emit();
    return word;
  }

  // Local mode
  const existing = wordsCache.find((w) => w.text === trimmed);
  if (existing) {
    if (note && note !== existing.note) {
      existing.note = note;
      persistLocal();
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
  wordsCache = [word, ...wordsCache];
  persistLocal();
  emit();
  return word;
}

export async function removeWord(id: string) {
  if (currentUserId) {
    await supabase.from("saved_words").delete().eq("id", id);
  }
  wordsCache = wordsCache.filter((w) => w.id !== id);
  persistLocal();
  emit();
}

export async function updateWordNote(id: string, note: string) {
  if (currentUserId) {
    await supabase.from("saved_words").update({ note }).eq("id", id);
  }
  const w = wordsCache.find((x) => x.id === id);
  if (w) w.note = note;
  persistLocal();
  emit();
}

// ===== Highlights =====
export function getHighlights(): string[] {
  if (!initialized) {
    const local = loadLocal();
    wordsCache = local.words;
    highlightsCache = local.highlights;
    initialized = true;
  }
  return highlightsCache;
}

export async function addHighlight(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  if (highlightsCache.includes(trimmed)) return;

  if (currentUserId) {
    await supabase.from("highlights").upsert(
      { user_id: currentUserId, text: trimmed },
      { onConflict: "user_id,text", ignoreDuplicates: true }
    );
  }
  highlightsCache = [trimmed, ...highlightsCache].slice(0, 500);
  persistLocal();
  emit();
}

export async function removeHighlight(text: string) {
  const trimmed = text.trim();
  if (currentUserId) {
    await supabase.from("highlights").delete().eq("text", trimmed).eq("user_id", currentUserId);
  }
  highlightsCache = highlightsCache.filter((t) => t !== trimmed);
  persistLocal();
  emit();
}

export function isHighlighted(text: string) {
  return highlightsCache.includes(text.trim());
}
