import { pinyin } from "pinyin-pro";

// Strip tone marks: ā á ǎ à → a, etc.
const TONE_MAP: Record<string, string> = {
  "ā": "a", "á": "a", "ǎ": "a", "à": "a",
  "ē": "e", "é": "e", "ě": "e", "è": "e",
  "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
  "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
  "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
  "ǖ": "v", "ǘ": "v", "ǚ": "v", "ǜ": "v", "ü": "v",
};

export function stripTone(s: string): string {
  return s.toLowerCase().split("").map((c) => TONE_MAP[c] ?? c).join("");
}

const PUNCT_RE = /[\s\u3000\u3001\u3002\uff0c\uff01\uff1f\uff1b\uff1a\u201c\u201d\u2018\u2019\u300a\u300b\(\)\[\]\{\}.,!?;:'"`~]/g;

export function normalizeHanzi(s: string): string {
  return s.replace(PUNCT_RE, "").replace(/[a-zA-Z0-9]/g, "");
}

export function hanziToPinyinSyllables(hanzi: string): string[] {
  const cleaned = normalizeHanzi(hanzi);
  if (!cleaned) return [];
  const result = pinyin(cleaned, { toneType: "none", type: "array", v: true });
  return result.map((s) => s.toLowerCase());
}

export interface CharDiff {
  char: string;
  status: "match" | "wrong" | "missing";
}

export interface ScoreResult {
  hanziDiff: CharDiff[];
  pinyinDiff: { syllable: string; status: "match" | "wrong" | "missing" }[];
  hanziScore: number; // 0-100
  pinyinScore: number; // 0-100
  total: number; // weighted 0-100
  userTranscript: string;
}

// Simple positional comparison (alignment via LCS would be better but keep simple)
function compareSequences<T>(target: T[], guess: T[], eq: (a: T, b: T) => boolean): { status: "match" | "wrong" | "missing"; value: T }[] {
  const result: { status: "match" | "wrong" | "missing"; value: T }[] = [];
  // Use simple LCS-based alignment
  const n = target.length;
  const m = guess.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (eq(target[i - 1], guess[j - 1])) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Backtrack
  let i = n, j = m;
  const ops: { status: "match" | "wrong" | "missing"; value: T }[] = [];
  while (i > 0 && j > 0) {
    if (eq(target[i - 1], guess[j - 1])) {
      ops.push({ status: "match", value: target[i - 1] });
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      ops.push({ status: "missing", value: target[i - 1] });
      i--;
    } else {
      // skip extra char from guess
      j--;
    }
  }
  while (i > 0) {
    ops.push({ status: "missing", value: target[i - 1] });
    i--;
  }
  // Mark mismatches: if a character is missing but guess had something at that position, it's "wrong"
  // Simplified: keep as missing
  return ops.reverse();
}

export function scorePronunciation(targetHanzi: string, userText: string): ScoreResult {
  const targetChars = normalizeHanzi(targetHanzi).split("");
  const userChars = normalizeHanzi(userText).split("");

  const hanziOps = compareSequences(targetChars, userChars, (a, b) => a === b);
  const hanziDiff: CharDiff[] = hanziOps.map((o) => ({ char: o.value, status: o.status }));
  const matched = hanziDiff.filter((d) => d.status === "match").length;
  const hanziScore = targetChars.length > 0 ? Math.round((matched / targetChars.length) * 100) : 0;

  const targetPy = hanziToPinyinSyllables(targetHanzi).map(stripTone);
  const userPy = hanziToPinyinSyllables(userText).map(stripTone);
  const pyOps = compareSequences(targetPy, userPy, (a, b) => a === b);
  const pinyinDiff = pyOps.map((o) => ({ syllable: o.value, status: o.status }));
  const pyMatched = pinyinDiff.filter((d) => d.status === "match").length;
  const pinyinScore = targetPy.length > 0 ? Math.round((pyMatched / targetPy.length) * 100) : 0;

  const total = Math.round(hanziScore * 0.6 + pinyinScore * 0.4);

  return { hanziDiff, pinyinDiff, hanziScore, pinyinScore, total, userTranscript: userText };
}
