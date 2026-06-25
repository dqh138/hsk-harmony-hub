/**
 * Split a fully-ingested long video into per-chapter dictation entries.
 *
 * Reads:
 *   scripts/out/<youtubeId>.segments.ts      (export const SEGMENTS = [...])
 *   scripts/out/<youtubeId>.translations.ts  (export const TRANSLATIONS = [...])
 *
 * Writes 1 file per chapter under scripts/out/chapters/<youtubeId>/, then
 * rewrites src/data/dictationVideos.ts:
 *   - Removes the temp full-video entry (by youtubeId).
 *   - Inserts N const blocks (<SLUG>_SEGMENTS / _TRANSLATIONS) before
 *     `export const DICTATION_VIDEOS`.
 *   - Appends N entries at the end of DICTATION_VIDEOS array.
 *
 * Long chapters can be partitioned into "part 1/N, 2/N…" via the CHAPTER_SPEC.
 * Splits happen at the segment whose start is closest to the ideal even
 * division, preferring a segment whose hanzi ends with strong punctuation
 * (。！？).
 *
 * Usage:
 *   bun scripts/split-dictation-chapters.ts <youtubeId>
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const youtubeId = process.argv[2];
if (!youtubeId) {
  console.error("Usage: bun scripts/split-dictation-chapters.ts <youtubeId>");
  process.exit(1);
}

// ===== Chapter spec for C9Qie0RFSLQ (中國歷史) =====
// title = display chapter name (Chinese, traditional as-in-video).
// parts = how many sub-entries to split this chapter into (default 1).
// 4–6 min target; user-listed long chapters get split.
interface ChapterSpec {
  start: number; // sec
  end: number;
  title: string; // Chinese chapter name
  titleVi: string;
  parts: number;
}

const SPECS: Record<string, ChapterSpec[]> = {
  C9Qie0RFSLQ: [
    { start: 0,    end: 413,  title: "夏商周",                              titleVi: "Hạ - Thương - Chu",                                          parts: 1 },
    { start: 413,  end: 851,  title: "春秋戰國",                            titleVi: "Xuân Thu - Chiến Quốc",                                       parts: 1 },
    { start: 851,  end: 1227, title: "秦朝",                                titleVi: "Nhà Tần",                                                     parts: 1 },
    { start: 1227, end: 1837, title: "楚漢爭霸",                            titleVi: "Sở - Hán tranh hùng",                                         parts: 2 },
    { start: 1837, end: 3232, title: "漢朝（西漢、新朝、東漢）",             titleVi: "Nhà Hán (Tây Hán, Tân triều, Đông Hán)",                       parts: 5 },
    { start: 3232, end: 3756, title: "三國",                                titleVi: "Tam Quốc",                                                    parts: 1 },
    { start: 3756, end: 4228, title: "晉朝（西晉、東晉、南北朝、五胡十六國、隋朝）", titleVi: "Nhà Tấn (Tây Tấn, Đông Tấn, Nam Bắc triều, Ngũ Hồ thập lục quốc, nhà Tùy)", parts: 2 },
    { start: 4228, end: 4742, title: "唐朝（五代十國）",                     titleVi: "Nhà Đường (Ngũ Đại Thập Quốc)",                                parts: 2 },
    { start: 4742, end: 5081, title: "宋朝（北宋、南宋）",                   titleVi: "Nhà Tống (Bắc Tống, Nam Tống)",                                parts: 1 },
    { start: 5081, end: 5346, title: "元朝",                                titleVi: "Nhà Nguyên",                                                  parts: 1 },
    { start: 5346, end: 6506, title: "明朝",                                titleVi: "Nhà Minh",                                                    parts: 4 },
    { start: 6506, end: 6971, title: "清朝",                                titleVi: "Nhà Thanh",                                                   parts: 2 },
  ],
};

const specs = SPECS[youtubeId];
if (!specs) {
  console.error(`No CHAPTER_SPEC for ${youtubeId}. Add it to scripts/split-dictation-chapters.ts.`);
  process.exit(1);
}

const SEG_FILE = resolve(`scripts/out/${youtubeId}.segments.ts`);
const TRANS_FILE = resolve(`scripts/out/${youtubeId}.translations.ts`);
const DATA_FILE = resolve("src/data/dictationVideos.ts");

interface Seg { idx: number; start: number; dur: number; hanzi: string }

// Cheap eval: pull the array literal text and JSON-ish parse via Function.
function loadExport<T>(file: string, name: string): T {
  const src = readFileSync(file, "utf-8");
  const re = new RegExp(`export const ${name}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const m = src.match(re);
  if (!m) throw new Error(`No export ${name} in ${file}`);
  // Use Function to evaluate the literal (it may contain template strings with \uXXXX escapes).
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(`return ${m[1]};`);
  return fn() as T;
}

const segments = loadExport<Seg[]>(SEG_FILE, "SEGMENTS");
const translations = loadExport<string[]>(TRANS_FILE, "TRANSLATIONS");
if (segments.length !== translations.length) {
  console.warn(`⚠ segments(${segments.length}) ≠ translations(${translations.length}); will pad/trim per slice.`);
}

const STRONG_END = /[\u3002\uff1f\uff01]\s*$/;

function sliceByTimeRange(rangeStart: number, rangeEnd: number): { start: number; end: number } {
  // Returns segment-index range [from, to) whose seg.start is within [rangeStart, rangeEnd).
  let from = segments.findIndex((s) => s.start >= rangeStart);
  if (from < 0) from = segments.length;
  let to = segments.findIndex((s) => s.start >= rangeEnd);
  if (to < 0) to = segments.length;
  return { start: from, end: to };
}

function splitIntoParts(from: number, to: number, parts: number): Array<[number, number]> {
  if (parts <= 1 || to - from <= parts) return [[from, to]];
  const tStart = segments[from].start;
  const tEnd = to < segments.length ? segments[to].start : segments[to - 1].start + segments[to - 1].dur;
  const span = tEnd - tStart;
  const out: Array<[number, number]> = [];
  let cur = from;
  for (let p = 1; p < parts; p++) {
    const targetT = tStart + (span * p) / parts;
    // Find segment closest to targetT, with preference for strong punctuation
    // within ±15% window of remaining segments.
    let best = cur + 1;
    let bestScore = Infinity;
    const winFrom = Math.max(cur + 1, Math.floor(from + (to - from) * (p / parts) - (to - from) * 0.1));
    const winTo = Math.min(to - (parts - p), Math.ceil(from + (to - from) * (p / parts) + (to - from) * 0.1));
    for (let i = winFrom; i <= winTo; i++) {
      const dt = Math.abs(segments[i].start - targetT);
      const punctBonus = STRONG_END.test(segments[i - 1]?.hanzi ?? "") ? -8 : 0; // prefer cuts after 。！？
      const score = dt + punctBonus;
      if (score < bestScore) { bestScore = score; best = i; }
    }
    out.push([cur, best]);
    cur = best;
  }
  out.push([cur, to]);
  return out;
}

function escapeHanzi(s: string) {
  return [...s]
    .map((c) => {
      const code = c.codePointAt(0)!;
      if (code > 127) return `\\u${code.toString(16).padStart(4, "0")}`;
      return c;
    })
    .join("");
}

function slugify(s: string) {
  return s.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase();
}

// Build entries
interface Entry {
  id: string;
  constBase: string;
  title: string;          // 中国历史: <chapter> [part N/M]
  titleVi: string;
  segs: Seg[];
  trans: string[];
  startSec: number;
}

const entries: Entry[] = [];
specs.forEach((sp, chapterIdx) => {
  const { start: from, end: to } = sliceByTimeRange(sp.start, sp.end);
  if (from >= to) {
    console.warn(`⚠ Chapter "${sp.title}" produced no segments`);
    return;
  }
  const ranges = splitIntoParts(from, to, sp.parts);
  const total = ranges.length;
  const chNum = String(chapterIdx + 1).padStart(2, "0");
  const titleSlug = slugify(sp.titleVi) || `CH${chNum}`;
  ranges.forEach(([a, b], i) => {
    const partLabel = total > 1 ? ` Phần ${i + 1}/${total}` : "";
    const partCnLabel = total > 1 ? ` 第${i + 1}部分` : "";
    const segsRaw = segments.slice(a, b);
    const transRaw = translations.slice(a, b);
    const segs = segsRaw.map((s, k) => ({ ...s, idx: k }));
    const trans = transRaw.length === segs.length
      ? transRaw
      : segs.map((_, k) => transRaw[k] ?? "");
    entries.push({
      id: `china-history-ch${chNum}-p${i + 1}-${youtubeId}`,
      constBase: `CHINA_HISTORY_CH${chNum}_${titleSlug}_P${i + 1}_${slugify(youtubeId)}`,
      title: `\u4e2d\u56fd\u5386\u53f2: ${sp.title}${partCnLabel}`,
      titleVi: `Lịch sử Trung Quốc: ${sp.titleVi}${partLabel}`,
      segs,
      trans,
      startSec: segs[0].start,
    });
  });
});

console.log(`Prepared ${entries.length} chapter entries`);
for (const e of entries) {
  const dur = (e.segs.at(-1)!.start + e.segs.at(-1)!.dur - e.segs[0].start) / 60;
  console.log(`  ${e.title.padEnd(40)} ${e.segs.length.toString().padStart(3)} segs, ${dur.toFixed(1)}min`);
}

// ===== Patch data file =====
function segsToTs(segs: Seg[]): string {
  return `[\n${segs
    .map((s) => `  { idx: ${s.idx}, start: ${s.start}, dur: ${s.dur}, hanzi: \`${escapeHanzi(s.hanzi)}\` },`)
    .join("\n")}\n]`;
}
function transToTs(t: string[]): string {
  return `[\n${t.map((s) => `  \`${escapeHanzi(s)}\`,`).join("\n")}\n]`;
}

let data = readFileSync(DATA_FILE, "utf-8");

// 1) Remove the temp full-video entry (by youtubeId).
{
  const needle = `youtubeId: "${youtubeId}"`;
  const idx = data.indexOf(needle);
  if (idx >= 0) {
    // walk to enclosing `{`
    let start = idx;
    for (let i = idx, depth = 0; i >= 0; i--) {
      if (data[i] === "}") depth++;
      else if (data[i] === "{") {
        if (depth === 0) { start = i; break; }
        depth--;
      }
    }
    let end = idx;
    for (let i = start, depth = 0; i < data.length; i++) {
      if (data[i] === "{") depth++;
      else if (data[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
    }
    // include trailing comma + newline
    let trailEnd = end + 1;
    while (data[trailEnd] === ",") trailEnd++;
    while (data[trailEnd] === " " || data[trailEnd] === "\n" || data[trailEnd] === "\r") trailEnd++;
    // include leading whitespace
    let trailStart = start;
    while (trailStart > 0 && (data[trailStart - 1] === " " || data[trailStart - 1] === "\t")) trailStart--;
    data = data.slice(0, trailStart) + data.slice(end + 1 + (data[end + 1] === "," ? 1 : 0));
    console.log("Removed temp full-video entry.");
  }
}

// 2) Insert const blocks before `export const DICTATION_VIDEOS`.
const anchorRe = /export const DICTATION_VIDEOS\b/;
const anchorMatch = data.match(anchorRe);
if (!anchorMatch) throw new Error("Cannot find DICTATION_VIDEOS anchor");
const anchorIdx = anchorMatch.index!;
const constBlocks: string[] = [];
for (const e of entries) {
  constBlocks.push(`const ${e.constBase}_SEGMENTS: DictationSegment[] = ${segsToTs(e.segs)};`);
  constBlocks.push(`const ${e.constBase}_TRANSLATIONS = ${transToTs(e.trans)};`);
}
const insertedConsts = constBlocks.join("\n\n") + "\n\n";
data = data.slice(0, anchorIdx) + insertedConsts + data.slice(anchorIdx);

// 3) Append entries at end of DICTATION_VIDEOS array.
const closingIdx = data.lastIndexOf("];");
if (closingIdx < 0) throw new Error("Cannot find DICTATION_VIDEOS closing `];`");
const newEntries = entries
  .map(
    (e) => `  {
    id: "${e.id}",
    youtubeId: "${youtubeId}",
    title: \`${escapeHanzi(e.title)}\`,
    titleVi: ${JSON.stringify(e.titleVi)},
    level: "advanced",
    category: "history",
    languageCode: "zh-Hant",
    isAutoGenerated: false,
    segments: ${e.constBase}_SEGMENTS,
    translations: ${e.constBase}_TRANSLATIONS,
  },`,
  )
  .join("\n");
data = data.slice(0, closingIdx) + newEntries + "\n" + data.slice(closingIdx);

writeFileSync(DATA_FILE, data);
console.log(`✅ Patched ${DATA_FILE} with ${entries.length} entries.`);
