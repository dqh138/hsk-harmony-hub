// Edge function: lấy phụ đề tiếng Trung của 1 video YouTube và trả về dưới dạng segments.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string; // "asr" for auto-generated
  name?: { simpleText?: string };
}

interface Segment {
  idx: number;
  start: number;
  dur: number;
  hanzi: string;
}

function pickChineseTrack(tracks: CaptionTrack[]): CaptionTrack | null {
  if (!tracks?.length) return null;
  const priority = ["zh-Hans", "zh-CN", "zh", "zh-Hant", "zh-HK", "zh-TW"];
  for (const code of priority) {
    const t = tracks.find((x) => x.languageCode === code && x.kind !== "asr");
    if (t) return t;
  }
  for (const code of priority) {
    const t = tracks.find((x) => x.languageCode === code);
    if (t) return t;
  }
  const anyZh = tracks.find((x) => x.languageCode?.toLowerCase().startsWith("zh"));
  return anyZh ?? null;
}

interface Json3Event {
  tStartMs?: number;
  dDurationMs?: number;
  segs?: { utf8?: string }[];
}

function parseJson3(json: { events?: Json3Event[] }): Segment[] {
  const events = json.events ?? [];
  const raw: Segment[] = [];
  for (const ev of events) {
    if (!ev.segs || ev.tStartMs == null) continue;
    const text = ev.segs.map((s) => s.utf8 ?? "").join("").replace(/\n+/g, "").trim();
    if (!text) continue;
    raw.push({
      idx: 0,
      start: ev.tStartMs / 1000,
      dur: (ev.dDurationMs ?? 2000) / 1000,
      hanzi: text,
    });
  }
  // Ghép các segment quá ngắn với segment kế tiếp
  const merged: Segment[] = [];
  for (const s of raw) {
    const last = merged[merged.length - 1];
    if (last && (s.hanzi.length < 4 || last.hanzi.length < 4) && last.dur + s.dur < 8) {
      last.hanzi = (last.hanzi + s.hanzi).replace(/\s+/g, "");
      last.dur = s.start + s.dur - last.start;
    } else {
      merged.push({ ...s, hanzi: s.hanzi.replace(/\s+/g, "") });
    }
  }
  return merged.map((s, i) => ({ ...s, idx: i }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { videoId } = await req.json();
    if (!videoId || typeof videoId !== "string" || !/^[\w-]{6,15}$/.test(videoId)) {
      return new Response(JSON.stringify({ error: "videoId không hợp lệ" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) Lấy HTML watch page
    const watchResp = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=zh-CN`, {
      headers: {
        "User-Agent": UA,
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    if (!watchResp.ok) {
      return new Response(JSON.stringify({ error: `Không tải được trang YouTube (${watchResp.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const html = await watchResp.text();

    // 2) Trích ytInitialPlayerResponse
    const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;\s*(?:var|<\/script>)/s);
    if (!m) {
      return new Response(JSON.stringify({ error: "Không đọc được dữ liệu player từ YouTube" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let player: {
      videoDetails?: { title?: string; videoId?: string };
      captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] } };
      playabilityStatus?: { status?: string; reason?: string };
    };
    try {
      player = JSON.parse(m[1]);
    } catch {
      return new Response(JSON.stringify({ error: "Lỗi parse dữ liệu player" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (player.playabilityStatus?.status && player.playabilityStatus.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: `Video không phát được: ${player.playabilityStatus.reason ?? player.playabilityStatus.status}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tracks = player.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
    const track = pickChineseTrack(tracks);
    if (!track) {
      return new Response(
        JSON.stringify({
          error: "Video này không có phụ đề tiếng Trung. Hãy thử video khác có sub 中文.",
          availableLangs: tracks.map((t) => t.languageCode),
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3) Tải caption ở định dạng json3
    const captionUrl = track.baseUrl + (track.baseUrl.includes("fmt=") ? "" : "&fmt=json3");
    const capResp = await fetch(captionUrl, { headers: { "User-Agent": UA } });
    if (!capResp.ok) {
      return new Response(JSON.stringify({ error: `Không tải được phụ đề (${capResp.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const capJson = await capResp.json();
    const segments = parseJson3(capJson);

    if (segments.length === 0) {
      return new Response(JSON.stringify({ error: "Phụ đề rỗng" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        videoId,
        title: player.videoDetails?.title ?? "",
        languageCode: track.languageCode,
        isAutoGenerated: track.kind === "asr",
        segments,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("youtube-captions error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
