// Edge function: lấy phụ đề tiếng Trung của 1 video YouTube và trả về dưới dạng segments.
// Dùng InnerTube API (client ANDROID) để tránh bị YouTube chặn (429) khi scrape HTML.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string;
  name?: { simpleText?: string; runs?: { text: string }[] };
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
  return tracks.find((x) => x.languageCode?.toLowerCase().startsWith("zh")) ?? null;
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
    raw.push({ idx: 0, start: ev.tStartMs / 1000, dur: (ev.dDurationMs ?? 2000) / 1000, hanzi: text });
  }
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

// InnerTube clients ta sẽ thử lần lượt. TVHTML5_SIMPLY_EMBEDDED_PLAYER & MWEB
// thường bypass được kiểm tra "đăng nhập để xác minh bạn không phải bot".
const CLIENTS = [
  {
    name: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
    clientNameId: "85",
    body: {
      context: {
        client: {
          clientName: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
          clientVersion: "2.0",
          hl: "zh-CN",
          gl: "US",
        },
        thirdParty: { embedUrl: "https://www.youtube.com" },
      },
    },
    ua: "Mozilla/5.0 (PlayStation; PlayStation 4/12.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
  },
  {
    name: "IOS",
    clientNameId: "5",
    body: {
      context: {
        client: {
          clientName: "IOS",
          clientVersion: "20.10.4",
          deviceMake: "Apple",
          deviceModel: "iPhone16,2",
          osName: "iPhone",
          osVersion: "18.3.2.22D82",
          hl: "zh-CN",
          gl: "US",
        },
      },
    },
    ua: "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X)",
  },
  {
    name: "MWEB",
    clientNameId: "2",
    body: {
      context: {
        client: { clientName: "MWEB", clientVersion: "2.20240726.01.00", hl: "zh-CN", gl: "US" },
      },
    },
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
];

// Public InnerTube API key (đã công khai từ lâu, không phải bí mật)
const INNERTUBE_KEY = "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w";

async function fetchPlayer(videoId: string) {
  let lastErr = "";
  for (const c of CLIENTS) {
    try {
      const resp = await fetch(
        `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}&prettyPrint=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": c.ua,
            "Accept-Language": "zh-CN,zh;q=0.9",
            "X-YouTube-Client-Name": c.name === "ANDROID" ? "3" : c.name === "IOS" ? "5" : "1",
            "X-YouTube-Client-Version": c.body.context.client.clientVersion,
          },
          body: JSON.stringify({ ...c.body, videoId }),
        }
      );
      if (!resp.ok) {
        lastErr = `${c.name} HTTP ${resp.status}`;
        continue;
      }
      const data = await resp.json();
      const tracks =
        data?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
      if (tracks.length > 0 || data?.playabilityStatus?.status === "OK") {
        return { data, clientUa: c.ua };
      }
      lastErr = `${c.name}: no captions / ${data?.playabilityStatus?.status}`;
    } catch (e) {
      lastErr = `${c.name}: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  throw new Error(`Không lấy được dữ liệu player từ YouTube (${lastErr})`);
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

    const { data: player, clientUa } = await fetchPlayer(videoId);

    if (player.playabilityStatus?.status && player.playabilityStatus.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: `Video không phát được: ${player.playabilityStatus.reason ?? player.playabilityStatus.status}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tracks: CaptionTrack[] =
      player.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
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

    const captionUrl = track.baseUrl + (track.baseUrl.includes("fmt=") ? "" : "&fmt=json3");
    const capResp = await fetch(captionUrl, { headers: { "User-Agent": clientUa } });
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
