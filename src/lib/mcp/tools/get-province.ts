import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROVINCES } from "../../../data/provinces";

export default defineTool({
  name: "get_province",
  title: "Explore a Chinese province",
  description:
    "Look up one of China's 34 provincial-level units in HSK Hub's 探索中国 dataset: capital, population, area, cuisine, landmarks, universities and the Chinese reading passage when available. Omit the name to list all units.",
  inputSchema: {
    name: z.string().optional().describe("Province name in Chinese, pinyin or Vietnamese. Omit to list every unit."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ name }) => {
    const q = (name ?? "").trim().toLowerCase();
    if (!q) {
      const list = PROVINCES.map((p) => `${p.nameCn} (${p.nameVn}) — ${p.kind}${p.capital ? ` · thủ phủ ${p.capital}` : ""}`);
      return {
        content: [{ type: "text" as const, text: list.join("\n") }],
        structuredContent: { count: PROVINCES.length, provinces: PROVINCES.map((p) => ({ id: p.id, nameCn: p.nameCn, nameVn: p.nameVn, kind: p.kind })) },
      };
    }

    const p =
      PROVINCES.find((x) => x.nameCn.includes(q) || x.geoName.includes(q)) ??
      PROVINCES.find(
        (x) => x.namePinyin.toLowerCase().includes(q) || x.nameVn.toLowerCase().includes(q) || x.id.toLowerCase() === q
      );
    if (!p) {
      return { content: [{ type: "text" as const, text: `No provincial-level unit matched "${name}".` }], isError: true };
    }

    const h = p.highlights ?? {};
    const lines = [
      `${p.nameCn} / ${p.geoName} (${p.nameVn}) — ${p.kind}`,
      p.capital ? `Thủ phủ: ${p.capital}${p.capitalVn ? ` (${p.capitalVn})` : ""}` : null,
      p.population ? `Dân số: ${p.population}` : null,
      p.area ? `Diện tích: ${p.area}` : null,
      p.majorCities?.length ? `Thành phố lớn: ${p.majorCities.map((c) => `${c.cn} (${c.vn})`).join(", ")}` : null,
      h.cuisine?.length ? `Ẩm thực: ${h.cuisine.join(", ")}` : null,
      h.landmarks?.length ? `Địa danh: ${h.landmarks.join(", ")}` : null,
      h.universities?.length ? `Đại học: ${h.universities.join(", ")}` : null,
      h.industries?.length ? `Kinh tế: ${h.industries.join(", ")}` : null,
      h.famousPeople?.length ? `Nhân vật: ${h.famousPeople.join(", ")}` : null,
      h.historical ? `Lịch sử: ${h.historical}` : null,
      p.reading ? `\nBài đọc:\n${p.reading.cn}\n\nDịch:\n${p.reading.vn}` : null,
    ].filter(Boolean) as string[];

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      structuredContent: { province: p },
    };
  },
});
