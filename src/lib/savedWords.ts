// Cloud-backed store for saved vocabulary words and per-location highlights.
// Uses Supabase when user is authenticated, falls back to localStorage as guest cache.
import { supabase } from "@/integrations/supabase/client";

const WORDS_KEY = "hskhub:saved-words";
const HIGHLIGHTS_KEY = "hskhub:highlights-v2";

export interface SavedWord {
  id: string;
  text: string;
  note?: string;
  createdAt: number;
}

export interface HighlightRecord {
  id: string;
  text: string;
  route: string;
  contextBefore: string;
  contextAfter: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let wordsCache: SavedWord[] = [];
let highlightsCache: HighlightRecord[] = [];
let currentUserId: string | null = null;
let initialized = false;

function emit() {
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent("hskhub:saved-words-changed"));
  window.dispatchEvent(new CustomEvent("hskhub:highlights-changed"));
}

function loadLocal(): { words: SavedWord[]; highlights: HighlightRecord[] } {
  try {
    const w = localStorage.getItem(WORDS_KEY);
    const h = localStorage.getItem(HIGHLIGHTS_KEY);
    return {
      words: w ? (JSON.parse(w) as SavedWord[]) : [],
      highlights: h ? (JSON.parse(h) as HighlightRecord[]) : [],
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
      .select("id, text, route, context_before, context_after")
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
    highlightsCache = highlightsRes.data.map((h: any) => ({
      id: h.id,
      text: h.text,
      route: h.route ?? "",
      contextBefore: h.context_before ?? "",
      contextAfter: h.context_after ?? "",
    }));
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
    await supabase.from("highlights").insert(
      local.highlights.map((h) => ({
        user_id: currentUserId!,
        text: h.text,
        route: h.route,
        context_before: h.contextBefore,
        context_after: h.contextAfter,
      }))
    );
  }
  localStorage.removeItem(WORDS_KEY);
  localStorage.removeItem(HIGHLIGHTS_KEY);
}

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

// ===== Highlights (per-location) =====
export function getHighlights(): HighlightRecord[] {
  if (!initialized) {
    const local = loadLocal();
    wordsCache = local.words;
    highlightsCache = local.highlights;
    initialized = true;
  }
  return highlightsCache;
}

export function getHighlightsForRoute(route: string): HighlightRecord[] {
  return getHighlights().filter((h) => h.route === route);
}

export async function addHighlightAt(
  text: string,
  route: string,
  contextBefore: string,
  contextAfter: string
): Promise<HighlightRecord | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Prevent exact duplicate
  const dup = highlightsCache.find(
    (h) =>
      h.text === trimmed &&
      h.route === route &&
      h.contextBefore === contextBefore &&
      h.contextAfter === contextAfter
  );
  if (dup) return dup;

  if (currentUserId) {
    const { data, error } = await supabase
      .from("highlights")
      .insert({
        user_id: currentUserId,
        text: trimmed,
        route,
        context_before: contextBefore,
        context_after: contextAfter,
      })
      .select("id, text, route, context_before, context_after")
      .single();
    if (error || !data) return null;
    const rec: HighlightRecord = {
      id: data.id,
      text: data.text,
      route: data.route ?? "",
      contextBefore: (data as any).context_before ?? "",
      contextAfter: (data as any).context_after ?? "",
    };
    highlightsCache = [rec, ...highlightsCache];
    emit();
    return rec;
  }

  const rec: HighlightRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    route,
    contextBefore,
    contextAfter,
  };
  highlightsCache = [rec, ...highlightsCache].slice(0, 1000);
  persistLocal();
  emit();
  return rec;
}

export async function removeHighlightById(id: string) {
  if (currentUserId) {
    await supabase.from("highlights").delete().eq("id", id);
  }
  highlightsCache = highlightsCache.filter((h) => h.id !== id);
  persistLocal();
  emit();
}
