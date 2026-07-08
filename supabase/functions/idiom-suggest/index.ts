// Edge function: gợi ý thành ngữ 4 chữ (成语) từ mô tả tiếng Việt/Anh/Trung.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string") {
      return new Response(JSON.stringify({ error: "description required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const text = description.trim();
    if (text.length < 3 || text.length > 1000) {
      return new Response(JSON.stringify({ error: "description length 3-1000" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const system = `Bạn là chuyên gia Hán ngữ và thành ngữ Trung Quốc (成语 - chengyu, 4 chữ).
Người dùng đưa một mô tả bằng tiếng Việt (có thể lẫn tiếng Anh hoặc tiếng Trung).
Nhiệm vụ: gợi ý các thành ngữ 4 chữ CHÍNH XÁC phù hợp nhất với mô tả.

QUY TẮC SỐ LƯỢNG:
- Mô tả rất ngắn/chung chung (dưới ~15 từ, mơ hồ): trả 4-5 thành ngữ đa dạng.
- Mô tả trung bình, khá rõ ràng: trả 3-4 thành ngữ.
- Mô tả rất chi tiết, cụ thể, giới hạn ngữ cảnh: trả 1-3 thành ngữ tinh chọn.
- TỐI ĐA 5, tối thiểu 1. Chỉ chọn thành ngữ THỰC SỰ liên quan; không nhồi cho đủ số.

QUY TẮC NỘI DUNG:
- Ưu tiên thành ngữ đúng 4 chữ Hán (chengyu). Không dùng cụm tự chế.
- Sắp xếp theo mức độ phù hợp giảm dần.
- Giải thích tiếng Việt tự nhiên, ngắn gọn.

CHỈ trả về JSON hợp lệ theo schema:
{
  "idioms": [
    {
      "hanzi": "画蛇添足",
      "pinyin": "huà shé tiān zú",
      "literal": "vẽ rắn thêm chân",
      "meaning": "làm việc thừa, thêm thắt vô ích khiến hỏng chuyện",
      "example_cn": "他这么做完全是画蛇添足。",
      "example_vi": "Anh ta làm vậy quả là vẽ rắn thêm chân.",
      "relevance": "Vì sao thành ngữ này khớp với mô tả (1 câu ngắn)"
    }
  ]
}
Không thêm markdown, không thêm text ngoài JSON.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Gateway error", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Đã vượt giới hạn, thử lại sau." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "Hết credit AI, vui lòng nạp thêm." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { idioms: [] };
    }
    const idioms = (parsed as { idioms?: unknown[] }).idioms ?? [];
    const clean = idioms.slice(0, 5).map((it) => {
      const o = it as Record<string, unknown>;
      return {
        hanzi: String(o.hanzi ?? "").trim(),
        pinyin: String(o.pinyin ?? "").trim(),
        literal: String(o.literal ?? "").trim(),
        meaning: String(o.meaning ?? "").trim(),
        example_cn: String(o.example_cn ?? "").trim(),
        example_vi: String(o.example_vi ?? "").trim(),
        relevance: String(o.relevance ?? "").trim(),
      };
    }).filter((it) => it.hanzi.length > 0);

    return new Response(JSON.stringify({ idioms: clean }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("idiom-suggest error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
