import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// Minimal typing for YT IFrame API
interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: { onReady?: (e: { target: YTPlayer }) => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YouTubeSegmentPlayerHandle {
  playSegment: (startSec: number, durSec: number) => void;
  stop: () => void;
  setRate: (rate: number) => void;
}

interface Props {
  videoId: string;
}

let apiLoading: Promise<void> | null = null;
const loadYouTubeAPI = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;
  apiLoading = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiLoading;
};

const YouTubeSegmentPlayer = forwardRef<YouTubeSegmentPlayerHandle, Props>(({ videoId }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => setReady(true),
        },
      });
    });
    return () => {
      cancelled = true;
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      try {
        playerRef.current?.destroy();
      } catch { /* noop */ }
      playerRef.current = null;
    };
  }, [videoId]);

  useImperativeHandle(ref, () => ({
    playSegment: (startSec, durSec) => {
      const p = playerRef.current;
      if (!p || !ready) return;
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      p.seekTo(Math.max(0, startSec), true);
      p.playVideo();
      pauseTimerRef.current = window.setTimeout(() => {
        try { p.pauseVideo(); } catch { /* noop */ }
      }, Math.max(300, durSec * 1000));
    },
    stop: () => {
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      try { playerRef.current?.pauseVideo(); } catch { /* noop */ }
    },
    setRate: (rate) => {
      try { playerRef.current?.setPlaybackRate(rate); } catch { /* noop */ }
    },
  }), [ready]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-black">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
});

YouTubeSegmentPlayer.displayName = "YouTubeSegmentPlayer";
export default YouTubeSegmentPlayer;
