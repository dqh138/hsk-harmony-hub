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

// ===== Chuẩn hoá chữ số tiếng Trung → số Ả Rập =====
// Cho phép người học gõ "六千" thay cho "6000", "百分之五十" thay cho "50%",
// "五百块" thay cho "500块"… Đáp án tiêu chuẩn vẫn luôn giữ dạng số.
const CN_NUM: Record<string, number> = {
  "零": 0, "〇": 0, "○": 0,
  "一": 1, "壹": 1, "二": 2, "贰": 2, "两": 2, "兩": 2,
  "三": 3, "叁": 3, "四": 4, "肆": 4, "五": 5, "伍": 5,
  "六": 6, "陆": 6, "七": 7, "柒": 7, "八": 8, "捌": 8, "九": 9, "玖": 9,
};
const CN_UNIT: Record<string, number> = { "十": 10, "拾": 10, "百": 100, "佰": 100, "千": 1000, "仟": 1000 };
const CN_BIG: Record<string, number> = { "万": 10000, "萬": 10000, "亿": 100000000, "億": 100000000 };
const CN_ALL = new Set<string>([
  ...Object.keys(CN_NUM), ...Object.keys(CN_UNIT), ...Object.keys(CN_BIG),
]);

function parseCnNumber(s: string): number | null {
  if (!s) return null;
  let total = 0;
  let section = 0;
  let current = 0;
  let touched = false;
  for (const ch of s) {
    if (ch in CN_NUM) {
      current = CN_NUM[ch];
      touched = true;
    } else if (ch in CN_UNIT) {
      const u = CN_UNIT[ch];
      if (current === 0) current = 1;
      section += current * u;
      current = 0;
      touched = true;
    } else if (ch in CN_BIG) {
      section += current;
      if (section === 0) section = 1;
      total += section * CN_BIG[ch];
      section = 0;
      current = 0;
      touched = true;
    } else {
      return null;
    }
  }
  if (!touched) return null;
  return total + section + current;
}

export function normalizeNumbers(s: string): string {
  if (!s) return s;
  // 1) "百分之X" → "X%" (X có thể là chữ Hán hoặc chữ số)
  s = s.replace(
    /百分之([零〇○一壹二贰两兩三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万萬亿億]+|\d+(?:\.\d+)?)/g,
    (_, n: string) => {
      if (/^[\d.]+$/.test(n)) return `${n}%`;
      const p = parseCnNumber(n);
      return p !== null ? `${p}%` : `${n}%`;
    }
  );
  // 2) Chuyển các đoạn chữ số Hán liên tiếp thành số Ả Rập.
  //    - Có đơn vị (千/百/十/万/亿) → parse theo nghĩa (六千 → 6000).
  //    - Không có đơn vị → đọc rời từng chữ số (一八三九 → 1839, dùng cho năm,
  //      số điện thoại, mã số…). Đáp án chuẩn vẫn luôn giữ dạng số Ả Rập.
  let out = "";
  let buf = "";
  const flush = () => {
    if (!buf) return;
    const hasUnit = [...buf].some((c) => c in CN_UNIT || c in CN_BIG);
    if (hasUnit) {
      const n = parseCnNumber(buf);
      out += n !== null ? String(n) : buf;
    } else {
      // Tất cả là chữ số đơn (0-9) → ghép thành digits.
      const digits = [...buf].map((c) => (c in CN_NUM ? String(CN_NUM[c]) : c)).join("");
      out += digits;
    }
    buf = "";
  };
  for (const ch of s) {
    if (CN_ALL.has(ch)) buf += ch;
    else { flush(); out += ch; }
  }
  flush();
  return out;
}

export function normalizeHanzi(s: string): string {
  // Giữ lại chữ số (6000, 500, 1839…) vì là một phần của đáp án.
  // Chuẩn hoá chữ số Hán → số Ả Rập trước, sau đó loại punctuation + chữ Latin.
  return normalizeNumbers(s).replace(PUNCT_RE, "").replace(/[a-zA-Z]/g, "");
}

export function hanziToPinyinSyllables(hanzi: string): string[] {
  // pinyin-pro không sinh pinyin cho chữ số → bỏ chữ số khỏi đầu vào pinyin
  // (việc khớp chữ số đã được lo ở phần so sánh Hán tự).
  const cleaned = normalizeHanzi(hanzi).replace(/[0-9]/g, "");
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
