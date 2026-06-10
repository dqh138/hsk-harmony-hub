/**
 * Batch translate dictation segments (Chinese → Vietnamese) using Lovable AI.
 *
 * Usage:
 *   LOVABLE_API_KEY=... bun scripts/translate-dictation.ts <youtubeId>
 *
 * Đọc segments của video tương ứng trong src/data/dictationVideos.ts, chia
 * batch (mặc định 15 câu / lần), gọi Gemini qua Lovable AI Gateway, rồi ghi
 * ra scripts/out/<id>.translations.ts dưới dạng `export const TRANSLATIONS`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DICTATION_VIDEOS } from "../src/data/dictationVideos";

const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
if (!LOVABLE_API_KEY) {
  console.error("Missing LOVABLE_API_KEY in env");
  process.exit(1);
}

const youtubeId = process.argv[2];
if (!youtubeId) {
  console.error("Usage: bun scripts/translate-dictation.ts <youtubeId>");
  process.exit(1);
}

const video = DICTATION_VIDEOS.find((v) => v.youtubeId === youtubeId);
if (!video?.segments?.length) {
  console.error(`No segments found for ${youtubeId} in dictationVideos.ts`);
  process.exit(1);
}

const OUT_DIR = resolve("scripts/out");
mkdirSync(OUT_DIR, { recursive: true });

const BATCH_SIZE = 15;
const MODEL = "google/gemini-2.5-flash";

interface BatchOut {
  translations: { idx: number; vi: string }[];
}

async function translateBatch(
  items: { idx: number; hanzi: string }[],
): Promise<Record<number, string>> {
  const userPayload = items.map((s) => `${s.idx}. ${s.hanzi}`).join("\n");
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Bạn là dịch giả Trung-Việt. Dịch từng câu sang tiếng Việt tự nhiên, ngắn gọn, không thêm chú thích, không kèm pinyin. Trả về JSON đúng schema yêu cầu.",
        },
        {
          role: "user",
          content:
            `Dịch các câu sau (đánh số giữ nguyên) sang tiếng Việt. Trả về JSON:\n${userPayload}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "submit_translations",
            description: "Trả về bản dịch tiếng Việt cho từng câu",
            parameters: {
              type: "object",
              properties: {
                translations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      idx: { type: "number" },
                      vi: { type: "string" },
                    },
                    required: ["idx", "vi"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["translations"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "submit_translations" } },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gateway ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error(`No tool call in response: ${JSON.stringify(data).slice(0, 500)}`);
  const args = JSON.parse(call.function.arguments) as BatchOut;
  const map: Record<number, string> = {};
  for (const t of args.translations) map[t.idx] = t.vi.trim();
  return map;
}

function escapeStr(s: string) {
  return [...s]
    .map((c) => {
      const code = c.codePointAt(0)!;
      if (code === 0x60) return "\\`";
      if (code === 0x5c) return "\\\\";
      if (code === 0x24) return "\\$";
      if (code > 127) return `\\u${code.toString(16).padStart(4, "0")}`;
      return c;
    })
    .join("");
}

(async () => {
  const segs = video.segments!;
  console.log(`Translating ${segs.length} segments for ${youtubeId} (batch=${BATCH_SIZE})…`);
  const all: Record<number, string> = {};
  for (let i = 0; i < segs.length; i += BATCH_SIZE) {
    const batch = segs.slice(i, i + BATCH_SIZE).map((s) => ({ idx: s.idx, hanzi: s.hanzi }));
    process.stdout.write(`\r  batch ${i / BATCH_SIZE + 1}/${Math.ceil(segs.length / BATCH_SIZE)}    `);
    let attempt = 0;
    while (true) {
      try {
        const res = await translateBatch(batch);
        Object.assign(all, res);
        break;
      } catch (e) {
        attempt++;
        if (attempt >= 3) throw e;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  console.log();

  // Build ordered array matching segment idx
  const out = segs.map((s) => all[s.idx] ?? "");
  const missing = out.filter((x) => !x).length;
  if (missing) console.warn(`⚠ ${missing} câu chưa có bản dịch`);

  const lines = out.map((vi) => `  \`${escapeStr(vi)}\`,`);
  const file = resolve(OUT_DIR, `${youtubeId}.translations.ts`);
  writeFileSync(
    file,
    `// Auto-generated by scripts/translate-dictation.ts for ${youtubeId}\nexport const TRANSLATIONS = [\n${lines.join("\n")}\n];\n`,
  );
  console.log(`✅ Wrote ${out.length} translations → ${file}`);
})();
