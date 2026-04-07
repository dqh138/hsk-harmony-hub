import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const AudioPlayer = ({ src, title }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    setPlaying(true);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  };

  const changeSpeed = (s: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = s;
    setSpeed(s);
  };

  const seek = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val[0];
    setCurrentTime(val[0]);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      {title && (
        <div className="mb-3 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{title}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={toggle}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={restart} title="Restart">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" className="h-8 shrink-0 gap-1 px-2 text-xs" onClick={() => skip(-10)} title="-10s">
          <SkipBack className="h-3.5 w-3.5" />
          <span className="font-mono">10</span>
        </Button>
        <Button variant="ghost" className="h-8 shrink-0 gap-1 px-2 text-xs" onClick={() => skip(10)} title="+10s">
          <span className="font-mono">10</span>
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={seek}
          className="flex-1"
        />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {fmt(currentTime)} / {fmt(duration)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 shrink-0 px-2 text-xs font-mono">
              {speed === 1 ? "1x" : `${speed}x`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0">
            {SPEED_OPTIONS.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => changeSpeed(s)}
                className={speed === s ? "bg-accent font-bold" : ""}
              >
                {s === 1 ? "Normal" : `${s}x`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AudioPlayer;
