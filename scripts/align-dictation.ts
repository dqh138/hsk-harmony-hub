/**
 * Forced-alignment script for dictation subtitles using Soniox.
 *
 * Usage:
 *   bun scripts/align-dictation.ts <youtubeId>
 *
 * What it does:
 *   1. Downloads audio of the YouTube video (via yt-dlp).
 *   2. Sends it to Soniox async STT (Chinese) → per-token timestamps.
 *   3. Loads the existing `segments` for that videoId from
 *      `src/data/dictationVideos.ts` and re-aligns each segment's
 *      `start` / `dur` by matching Han characters one-by-one.
 *   4. Writes the realigned segments to
 *      `scripts/out/<youtubeId>.segments.ts` (paste into dictationVideos.ts).
 *
 * Requirements:
 *   - env SONIOX_API_KEY  (already in this project's secrets)
 *   - nix (yt-dlp is fetched on demand)
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
if (!video || !video.segments?.length) {
  console.error(`No segments found for youtubeId=${youtubeId} in dictationVideos.ts`);
  process.exit(1);
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
  if (!r.ok) {
    throw new Error(`Soniox ${path} → ${r.status}: ${await r.text()}`);
  }
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
      model: "stt-async-preview",
      language_hints: ["zh"],
    }),
  });
  const id = job.id as string;
  // poll
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

function align(tokens: SonioxToken[]) {
  // Flatten Soniox tokens into per-Han-char stream
  const chars: { ch: string; start: number; end: number }[] = [];
  for (const tok of tokens) {
    const text = tok.text || "";
    const hans = [...text].filter(isHan);
    if (!hans.length) continue;
    const dur = (tok.end_ms - tok.start_ms) / 1000;
    const per = dur / hans.length;
    hans.forEach((ch, i) => {
      chars.push({
        ch,
        start: tok.start_ms / 1000 + per * i,
        end: tok.start_ms / 1000 + per * (i + 1),
      });
    });
  }
  console.log(`  Soniox produced ${chars.length} Han chars`);

  const segs = video!.segments!;
  let cursor = 0;
  const out = segs.map((seg) => {
    const refChars = [...seg.hanzi].filter(isHan);
    // Greedy: find first cursor position where the next refChars.length chars
    // best match (exact match preferred, allow up to 2 mismatches).
    let bestStart = -1;
    let bestScore = -1;
    const window = Math.min(chars.length, cursor + 200);
    for (let i = cursor; i <= window - refChars.length; i++) {
      let score = 0;
      for (let j = 0; j < refChars.length; j++) {
        if (chars[i + j].ch === refChars[j]) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestStart = i;
        if (score === refChars.length) break;
      }
    }
    if (bestStart < 0) {
      console.warn(`  ! could not align seg ${seg.idx}: "${seg.hanzi}"`);
      return seg;
    }
    const startSec = chars[bestStart].start;
    const endSec = chars[bestStart + refChars.length - 1].end;
    cursor = bestStart + refChars.length;
    return {
      ...seg,
      start: +startSec.toFixed(2),
      dur: +Math.max(0.4, endSec - startSec).toFixed(2),
    };
  });
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
  console.log(`\n✅ Wrote ${outFile}`);
  console.log(`   Paste its array into src/data/dictationVideos.ts (replace SILK_ROAD_SEGMENTS).`);
})();
