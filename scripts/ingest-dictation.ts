/**
 * One-shot dictation ingestion wrapper.
 *
 * Usage:
 *   SONIOX_API_KEY=... LOVABLE_API_KEY=... \
 *     bun scripts/ingest-dictation.ts <youtubeId> [--bootstrap]
 *
 * Steps:
 *   1. Run align-dictation.ts (BOOTSTRAP=1 when --bootstrap flag passed,
 *      or auto-set when video has no existing segments).
 *   2. Inject the generated `SEGMENTS` array into src/data/dictationVideos.ts
 *      as a typed `const <SLUG>_SEGMENTS` and wire it into the matching
 *      entry's `segments:` field.
 *   3. Run translate-dictation.ts to produce Vietnamese translations.
 *   4. Inject the generated `TRANSLATIONS` array into the data file and wire
 *      it into the entry's `translations:` field.
 *
 * Safe to re-run: if segments/translations consts already exist for the
 * video, this script regenerates them in place.
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const youtubeId = process.argv[2];
const forceBootstrap = process.argv.includes("--bootstrap");
if (!youtubeId) {
  console.error("Usage: bun scripts/ingest-dictation.ts <youtubeId> [--bootstrap]");
  process.exit(1);
}
if (!process.env.SONIOX_API_KEY) {
  console.error("Missing SONIOX_API_KEY");
  process.exit(1);
}
if (!process.env.LOVABLE_API_KEY) {
  console.error("Missing LOVABLE_API_KEY");
  process.exit(1);
}

const DATA_FILE = resolve("src/data/dictationVideos.ts");
const SEG_FILE = resolve(`scripts/out/${youtubeId}.segments.ts`);
const TRANS_FILE = resolve(`scripts/out/${youtubeId}.translations.ts`);

function run(cmd: string, args: string[], env: Record<string, string> = {}): Promise<void> {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error(`${cmd} ${args.join(" ")} → exit ${code}`))));
  });
}

function loadData(): string {
  return readFileSync(DATA_FILE, "utf-8");
}
function saveData(s: string) {
  writeFileSync(DATA_FILE, s);
}

function findEntry(src: string): { entryStart: number; entryEnd: number; slug: string; topLevelAnchor: number } {
  // Locate the object literal containing `youtubeId: "<id>"`.
  const needle = `youtubeId: "${youtubeId}"`;
  const idx = src.indexOf(needle);
  if (idx < 0) {
    throw new Error(`No entry with youtubeId "${youtubeId}" in dictationVideos.ts`);
  }
  // Walk backward to opening `{` of this object.
  let start = idx;
  let depth = 0;
  for (let i = idx; i >= 0; i--) {
    const c = src[i];
    if (c === "}") depth++;
    else if (c === "{") {
      if (depth === 0) { start = i; break; }
      depth--;
    }
  }
  // Walk forward to matching `}`.
  let end = idx;
  depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  // Derive slug from `id: "..."` inside the entry.
  const idMatch = src.slice(start, end).match(/id:\s*"([^"]+)"/);
  const slug = (idMatch?.[1] || youtubeId)
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
  // Top-level anchor: position of `export const DICTATION_VIDEOS` declaration.
  // New consts must be inserted at module scope, not inside the array literal.
  const anchorMatch = src.match(/export const DICTATION_VIDEOS\b/);
  if (!anchorMatch) throw new Error("Could not find `export const DICTATION_VIDEOS` anchor");
  const topLevelAnchor = anchorMatch.index!;
  return { entryStart: start, entryEnd: end, slug, topLevelAnchor };
}

function extractExportArray(file: string, exportName: string): string {
  const src = readFileSync(file, "utf-8");
  const re = new RegExp(`export const ${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not find export ${exportName} in ${file}`);
  return m[1]; // includes leading [ and trailing ]
}

function upsertConst(
  src: string,
  constName: string,
  typeAnnotation: string,
  arrayLiteral: string,
  anchorBefore: number,
): string {
  // If the const already exists, replace its body.
  const existingRe = new RegExp(`const ${constName}${escapeRegExp(typeAnnotation)}\\s*=\\s*\\[[\\s\\S]*?\\n\\];`);
  const block = `const ${constName}${typeAnnotation} = ${arrayLiteral};`;
  if (existingRe.test(src)) {
    return src.replace(existingRe, block);
  }
  // Otherwise insert just before the entry's `{`.
  return src.slice(0, anchorBefore) + block + "\n\n" + src.slice(anchorBefore);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setEntryField(entrySrc: string, field: string, value: string): string {
  // Replace existing `field: ...,` line; otherwise insert before closing `}`.
  const re = new RegExp(`(\\n[ \\t]*)${field}:\\s*[^,\\n]+,`);
  if (re.test(entrySrc)) {
    return entrySrc.replace(re, `$1${field}: ${value},`);
  }
  // Insert before final `}` of the entry, keeping indentation.
  const lastBrace = entrySrc.lastIndexOf("}");
  const prefix = entrySrc.slice(0, lastBrace);
  // Make sure we end with comma + newline + indent.
  const indentMatch = entrySrc.match(/\n([ \t]+)\w+:/);
  const indent = indentMatch?.[1] ?? "    ";
  const trimmed = prefix.replace(/,?\s*$/, "");
  return `${trimmed},\n${indent}${field}: ${value},\n  ${entrySrc.slice(lastBrace)}`;
}

async function main() {
  // === Step 1: align ===
  console.log(`\n=== [1/4] Aligning subtitles for ${youtubeId} ===`);
  const data0 = loadData();
  const entry0 = findEntry(data0);
  // Decide bootstrap mode: forced, or entry has no segments yet.
  const entryText0 = data0.slice(entry0.entryStart, entry0.entryEnd + 1);
  const hasSegments = /segments:\s*[A-Z_][A-Z0-9_]*_SEGMENTS/.test(entryText0);
  const bootstrap = forceBootstrap || !hasSegments;
  if (bootstrap) console.log("  mode: BOOTSTRAP (no curated reference)");
  await run("bun", ["scripts/align-dictation.ts", youtubeId], bootstrap ? { BOOTSTRAP: "1" } : {});

  if (!existsSync(SEG_FILE)) throw new Error(`Expected ${SEG_FILE} after align`);

  // === Step 2: inject segments ===
  console.log(`\n=== [2/4] Injecting segments into dictationVideos.ts ===`);
  let data = loadData();
  let entry = findEntry(data);
  const segsArr = extractExportArray(SEG_FILE, "SEGMENTS");
  const segConst = `${entry.slug}_SEGMENTS`;
  data = upsertConst(data, segConst, ": DictationSegment[]", segsArr, entry.entryStart);
  entry = findEntry(data); // re-find after insertion
  let entryText = data.slice(entry.entryStart, entry.entryEnd + 1);
  entryText = setEntryField(entryText, "segments", segConst);
  data = data.slice(0, entry.entryStart) + entryText + data.slice(entry.entryEnd + 1);
  saveData(data);
  console.log(`  wired ${segConst} → entry`);

  // === Step 3: translate ===
  console.log(`\n=== [3/4] Translating segments to Vietnamese ===`);
  await run("bun", ["scripts/translate-dictation.ts", youtubeId]);
  if (!existsSync(TRANS_FILE)) throw new Error(`Expected ${TRANS_FILE} after translate`);

  // === Step 4: inject translations ===
  console.log(`\n=== [4/4] Injecting translations into dictationVideos.ts ===`);
  data = loadData();
  entry = findEntry(data);
  const transArr = extractExportArray(TRANS_FILE, "TRANSLATIONS");
  const transConst = `${entry.slug}_TRANSLATIONS`;
  data = upsertConst(data, transConst, "", transArr, entry.entryStart);
  entry = findEntry(data);
  entryText = data.slice(entry.entryStart, entry.entryEnd + 1);
  entryText = setEntryField(entryText, "translations", transConst);
  data = data.slice(0, entry.entryStart) + entryText + data.slice(entry.entryEnd + 1);
  saveData(data);
  console.log(`  wired ${transConst} → entry`);

  console.log(`\n✅ Done. Video ${youtubeId} fully ingested.`);
}

main().catch((e) => {
  console.error("\n❌ Ingestion failed:", e.message);
  process.exit(1);
});
