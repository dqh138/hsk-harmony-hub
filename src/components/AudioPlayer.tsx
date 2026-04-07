import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const AudioPlayer = ({ src, title }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={toggle}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={restart}
        >
          <RotateCcw className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default AudioPlayer;
