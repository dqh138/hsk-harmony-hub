/**
 * Forced-alignment script for dictation subtitles using Soniox.
 *
 * Usage:
 *   bun scripts/align-dictation.ts <youtubeId>
 *
 * Strategy:
 *   1. Download YouTube audio (yt-dlp).
 *   2. Soniox async STT → per-token timestamps.
 *   3. Align reference text (existing curated hanzi) 1:1 to Soniox char stream.
 *   4. Detect natural segment boundaries from Soniox silence gaps + strong
 *      punctuation in the reference text.
 *   5. Emit new segments where audio chunks dictate boundaries, but text comes
 *      from the curated reference (preserves spelling + punctuation).
 */

import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { DICTATION_VIDEOS } from "../src/data/dictationVideos";

const SONIOX_API_KEY = process.env.SONIOX_API_KEY;
if (!SONIOX_API_KEY) {
  console.error("Missing SONIOX_API_KEY in env");
  process.exit(1);
}

const youtubeId = process.argv[2];
if (!youtubeId) {
  console.error("Usage: bun scripts/align-dictation.ts <youtubeId>");
  process.exit(1);
}

const video = DICTATION_VIDEOS.find((v) => v.youtubeId === youtubeId);
if (!video) {
  console.error(`Video not found for youtubeId=${youtubeId} in dictationVideos.ts`);
  process.exit(1);
}
const HAS_REFERENCE = !!video.segments?.length && !process.env.BOOTSTRAP;
if (!HAS_REFERENCE) {
  console.log("⚠ No reference segments — bootstrapping from Soniox transcript only.");
}

const OUT_DIR = resolve("scripts/out");
mkdirSync(OUT_DIR, { recursive: true });
const AUDIO_PATH = resolve(OUT_DIR, `${youtubeId}.m4a`);

function sh(cmd: string, args: string[]): Promise<void> {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error(`${cmd} exit ${code}`))));
  });
}

async function downloadAudio() {
  if (existsSync(AUDIO_PATH) && statSync(AUDIO_PATH).size > 10_000) {
    console.log(`[1/4] Audio cached: ${AUDIO_PATH}`);
    return;
  }
  console.log(`[1/4] Downloading audio for ${youtubeId}…`);
  await sh("nix", [
    "run",
    "nixpkgs#yt-dlp",
    "--",
    "-f",
    "bestaudio[ext=m4a]/bestaudio",
    "-o",
    AUDIO_PATH,
    `https://www.youtube.com/watch?v=${youtubeId}`,
  ]);
}

const SONIOX = "https://api.soniox.com";

async function sonioxFetch(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SONIOX}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SONIOX_API_KEY}`,
      ...(init.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Soniox ${path} → ${r.status}: ${await r.text()}`);
  return r.json();
}

async function uploadFile(): Promise<string> {
  console.log("[2/4] Uploading to Soniox…");
  const buf = readFileSync(AUDIO_PATH);
  const fd = new FormData();
  fd.append("file", new Blob([buf]), `${youtubeId}.m4a`);
  const r = await fetch(`${SONIOX}/v1/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SONIOX_API_KEY}` },
    body: fd,
  });
  if (!r.ok) throw new Error(`upload ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.id as string;
}

interface SonioxToken {
  text: string;
  start_ms: number;
  end_ms: number;
}

async function transcribe(fileId: string): Promise<SonioxToken[]> {
  console.log("[3/4] Transcribing…");
  const job = await sonioxFetch("/v1/transcriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_id: fileId,
      model: "stt-async-v4",
      language_hints: ["zh"],
      language_hints_strict: true,
    }),
  });
  const id = job.id as string;
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const s = await sonioxFetch(`/v1/transcriptions/${id}`);
    process.stdout.write(`\r  status: ${s.status}    `);
    if (s.status === "completed") break;
    if (s.status === "error") throw new Error(`transcription error: ${JSON.stringify(s)}`);
  }
  console.log();
  const t = await sonioxFetch(`/v1/transcriptions/${id}/transcript`);
  return (t.tokens || []) as SonioxToken[];
}

const isHan = (ch: string) => /[\u3400-\u9FFF]/.test(ch);
const isDigit = (ch: string) => /[0-9]/.test(ch);
// "Matchable" = chữ Hán hoặc chữ số Ả Rập. Số được giữ nguyên trong segment
// và được dùng làm anchor khi căn chỉnh với Soniox (sau khi Soniox đã được
// chuẩn hoá chữ số Hán → số Ả Rập, xem normalizeSonioxText bên dưới).
const isMatchable = (ch: string) => isHan(ch) || isDigit(ch);
const STRONG_PUNCT = new Set(["\u3002", "\uff1f", "\uff01", "\uff1b"]); // 。？！；
const SOFT_PUNCT = new Set(["\uff0c", "\u3001", "\uff1a"]); // ，、：

// ===== CN numerals → Arabic =====
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
  let total = 0, section = 0, current = 0, touched = false;
  for (const ch of s) {
    if (ch in CN_NUM) { current = CN_NUM[ch]; touched = true; }
    else if (ch in CN_UNIT) {
      const u = CN_UNIT[ch];
      if (current === 0) current = 1;
      section += current * u; current = 0; touched = true;
    } else if (ch in CN_BIG) {
      section += current;
      if (section === 0) section = 1;
      total += section * CN_BIG[ch];
      section = 0; current = 0; touched = true;
    } else return null;
  }
  return touched ? total + section + current : null;
}
function normalizeSonioxText(s: string): string {
  // Soniox hay đọc số thành chữ Hán (六千, 一万二…). Reference của ta giữ dạng
  // số Ả Rập, nên cần convert để alignment khớp được.
  // Thay 百分之X → X%, sau đó convert các đoạn chữ số Hán liên tiếp → digits.
  s = s.replace(
    /百分之([零〇○一壹二贰两兩三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万萬亿億]+|\d+(?:\.\d+)?)/g,
    (_, n: string) => {
      if (/^[\d.]+$/.test(n)) return `${n}%`;
      const p = parseCnNumber(n);
      return p !== null ? `${p}%` : `${n}%`;
    }
  );
  let out = "", buf = "";
  const flush = () => {
    if (!buf) return;
    const hasUnit = [...buf].some((c) => c in CN_UNIT || c in CN_BIG);
    if (hasUnit) {
      const n = parseCnNumber(buf);
      out += n !== null ? String(n) : buf;
    } else {
      out += [...buf].map((c) => (c in CN_NUM ? String(CN_NUM[c]) : c)).join("");
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

function align(tokens: SonioxToken[]) {
  // 1) Flatten Soniox into per-char stream (Han + digits).
  //    Normalize CN numerals → Arabic so they align with digits in reference.
  const chars: { ch: string; start: number; end: number }[] = [];
  for (const tok of tokens) {
    const normText = normalizeSonioxText(tok.text || "");
    const matchable = [...normText].filter(isMatchable);
    if (!matchable.length) continue;
    const dur = (tok.end_ms - tok.start_ms) / 1000;
    const per = dur / matchable.length;
    matchable.forEach((ch, i) => {
      chars.push({
        ch,
        start: tok.start_ms / 1000 + per * i,
        end: tok.start_ms / 1000 + per * (i + 1),
      });
    });
  }
  if (!chars.length) throw new Error("Soniox returned no matchable chars");
  console.log(`  Soniox produced ${chars.length} matchable chars (Han + digits)`);

  // 2) Full reference string (keep punctuation).
  //    If we have curated segments, use them; otherwise bootstrap from
  //    concatenated Soniox token text (includes any punctuation Soniox emitted).
  const refFull = HAS_REFERENCE
    ? video!.segments!.map((s) => s.hanzi).join("")
    : tokens.map((t) => t.text || "").join("");
  const refArr = [...refFull];
  const LOOKAHEAD = 5;
  const refTime: number[] = new Array(refArr.length).fill(-1);
  let refPos = 0;
  for (let s = 0; s < chars.length; s++) {
    const sCh = chars[s].ch;
    // attach any leading non-matchable ref chars (punctuation) to current time
    while (refPos < refArr.length && !isMatchable(refArr[refPos])) {
      refTime[refPos] = chars[s].start;
      refPos++;
    }
    if (refPos >= refArr.length) break;
    let found = -1;
    for (let k = 0; k <= LOOKAHEAD && refPos + k < refArr.length; k++) {
      if (!isMatchable(refArr[refPos + k])) continue;
      if (refArr[refPos + k] === sCh) {
        found = refPos + k;
        break;
      }
    }
    if (found < 0) continue; // STT mismatch, skip this Soniox char
    for (let i = refPos; i < found; i++) refTime[i] = chars[s].start;
    refTime[found] = chars[s].start;
    refPos = found + 1;
  }
  // Fill remaining unmapped ref chars (forward then backward)
  let last = chars[chars.length - 1].end;
  for (let i = refArr.length - 1; i >= 0; i--) {
    if (refTime[i] < 0) refTime[i] = last;
    else last = refTime[i];
  }

  // Map each ref position back to a Soniox char index (for gap detection)
  const refToSonioxIdx: number[] = new Array(refArr.length).fill(-1);
  {
    let si = 0;
    for (let i = 0; i < refArr.length; i++) {
      while (si < chars.length - 1 && chars[si].start < refTime[i]) si++;
      refToSonioxIdx[i] = si;
    }
  }

  // 4) Boundaries from silence gaps in Soniox stream
  const GAP_THRESHOLD = 0.35;
  const gapAfterSoniox = new Set<number>();
  for (let i = 1; i < chars.length; i++) {
    if (chars[i].start - chars[i - 1].end >= GAP_THRESHOLD) {
      gapAfterSoniox.add(i - 1);
    }
  }
  console.log(`  Detected ${gapAfterSoniox.size} silence boundaries`);

  // 5) Walk ref, decide cut points.
  //    Priority: strong punctuation → soft punctuation (especially near gaps) →
  //    soft punctuation as max-length safety net. Bare gaps without nearby
  //    punctuation are ignored to avoid mid-clause cuts.
  const MIN_HAN = 5;
  const SOFT_HAN_TARGET = 12; // prefer cutting at soft punct after this many han
  const MAX_HAN = 25;

  // Pre-compute boolean "this index is a good cut point"
  const cutAfter: boolean[] = new Array(refArr.length).fill(false);
  let hanRunning = 0;
  for (let i = 0; i < refArr.length; i++) {
    const ch = refArr[i];
    if (isMatchable(ch)) hanRunning++;
    const isStrong = STRONG_PUNCT.has(ch);
    const isSoft = SOFT_PUNCT.has(ch);
    if (isStrong && hanRunning >= MIN_HAN) {
      cutAfter[i] = true;
      hanRunning = 0;
      continue;
    }
    // Look at nearby Soniox gap (±2 ref positions) for soft punctuation
    let nearGap = false;
    for (let k = -2; k <= 2; k++) {
      const j = i + k;
      if (j < 0 || j >= refArr.length) continue;
      const sIdx = refToSonioxIdx[j];
      if (sIdx >= 0 && gapAfterSoniox.has(sIdx)) { nearGap = true; break; }
    }
    if (isSoft && nearGap && hanRunning >= MIN_HAN) {
      cutAfter[i] = true;
      hanRunning = 0;
      continue;
    }
    if (isSoft && hanRunning >= SOFT_HAN_TARGET) {
      cutAfter[i] = true;
      hanRunning = 0;
      continue;
    }
    if (hanRunning >= MAX_HAN && (isSoft || isStrong)) {
      cutAfter[i] = true;
      hanRunning = 0;
    }
  }

  const out: { idx: number; start: number; dur: number; hanzi: string }[] = [];
  let bufStart = 0;
  const flush = (endIdx: number) => {
    // trim leading punctuation/whitespace from segment (giữ chữ số đầu câu)
    let s = bufStart;
    while (s <= endIdx && !isMatchable(refArr[s])) s++;
    if (s > endIdx) { bufStart = endIdx + 1; return; }
    const hanzi = refArr.slice(s, endIdx + 1).join("").trim();
    if (!hanzi) { bufStart = endIdx + 1; return; }
    let e = endIdx;
    while (e >= s && refTime[e] < 0) e--;
    const startSec = refTime[s] ?? 0;
    const endSec = (refTime[e] ?? startSec) + 0.08;
    out.push({
      idx: out.length,
      start: +startSec.toFixed(2),
      dur: +Math.max(0.4, endSec - startSec).toFixed(2),
      hanzi,
    });
    bufStart = endIdx + 1;
  };
  for (let i = 0; i < refArr.length; i++) {
    if (cutAfter[i]) flush(i);
  }
  if (bufStart < refArr.length) flush(refArr.length - 1);

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

function toTs(segments: { idx: number; start: number; dur: number; hanzi: string }[]) {
  const lines = segments.map(
    (s) =>
      `  { idx: ${s.idx}, start: ${s.start}, dur: ${s.dur}, hanzi: \`${escapeHanzi(s.hanzi)}\` },`,
  );
  return `// Auto-generated by scripts/align-dictation.ts for ${youtubeId}\nexport const SEGMENTS = [\n${lines.join("\n")}\n];\n`;
}

(async () => {
  await downloadAudio();
  const fileId = await uploadFile();
  const tokens = await transcribe(fileId);
  console.log("[4/4] Aligning…");
  const aligned = align(tokens);
  const outFile = resolve(OUT_DIR, `${youtubeId}.segments.ts`);
  writeFileSync(outFile, toTs(aligned));
  console.log(`\n✅ Wrote ${aligned.length} segments → ${outFile}`);
})();
