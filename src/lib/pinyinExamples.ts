import { allVocab } from "@/data/vocab";

const TONE_MAP: Record<string, { base: string; tone: number }> = {};
const build = (base: string, marks: string[]) => {
  marks.forEach((m, i) => {
    TONE_MAP[m] = { base, tone: i + 1 };
  });
};
build("a", ["\u0101", "\u00e1", "\u01ce", "\u00e0"]);
build("o", ["\u014d", "\u00f3", "\u01d2", "\u00f2"]);
build("e", ["\u0113", "\u00e9", "\u011b", "\u00e8"]);
build("i", ["\u012b", "\u00ed", "\u01d0", "\u00ec"]);
build("u", ["\u016b", "\u00fa", "\u01d4", "\u00f9"]);
build("v", ["\u01d6", "\u01d8", "\u01da", "\u01dc"]);

/** Tách một âm tiết pinyin có dấu thành { base, tone }. "mā" -> { base: "ma", tone: 1 } */
export const parseTonedSyllable = (raw: string): { base: string; tone: number } => {
  let tone = 0;
  let base = "";
  for (const ch of raw.toLowerCase()) {
    const hit = TONE_MAP[ch];
    if (hit) {
      base += hit.base;
      tone = hit.tone;
    } else if (ch === "\u00fc") {
      base += "v";
    } else if (/[a-z]/.test(ch)) {
      base += ch;
    }
  }
  return { base, tone };
};

export interface PinyinExample {
  hanzi: string;
  meaning: string;
}

let cache: Map<string, PinyinExample> | null = null;

/** Chỉ mục "âm tiết + thanh" -> một chữ Hán ví dụ, dựng từ kho từ vựng HSK. */
export const getExampleIndex = (): Map<string, PinyinExample> => {
  if (cache) return cache;
  const map = new Map<string, PinyinExample>();
  for (const word of allVocab) {
    const syllables = word.pinyin.trim().split(/[\s'·]+/).filter(Boolean);
    const chars = Array.from(word.hanzi);
    if (syllables.length !== chars.length) continue;
    syllables.forEach((syl, i) => {
      const { base, tone } = parseTonedSyllable(syl);
      if (!base || tone === 0) return;
      const key = `${base}${tone}`;
      if (map.has(key)) return;
      map.set(key, {
        hanzi: chars[i],
        meaning: chars.length === 1 ? word.meaning : `trong ${word.hanzi} — ${word.meaning}`,
      });
    });
  }
  cache = map;
  return map;
};

export const getExample = (base: string, tone: number): PinyinExample | undefined =>
  getExampleIndex().get(`${base}${tone}`);
