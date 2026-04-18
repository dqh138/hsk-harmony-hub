import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  durationMinutes: number;
  label: string;
  onTimeUp?: () => void;
}

const ExamTimer = ({ durationMinutes, label, onTimeUp }: ExamTimerProps) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            setRunning(false);
            if (!firedRef.current) {
              firedRef.current = true;
              onTimeUp?.();
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onTimeUp]);

  // Reset when duration/label changes (switching sections/exams)
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
    firedRef.current = false;
  }, [totalSeconds, label]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isLow = secondsLeft <= 60 && secondsLeft > 0;
  const isDone = secondsLeft === 0;

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      firedRef.current = false;
    }
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(totalSeconds);
    firedRef.current = false;
  };

  return (
    <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/50 px-3 py-1.5">
      <Timer className={cn("h-4 w-4", isLow && "text-destructive", !isLow && "text-hsk6")} />
      <span
        className={cn(
          "font-mono text-sm font-bold tabular-nums",
          isLow && "text-destructive animate-pulse",
          isDone && "text-destructive",
          !isLow && !isDone && "text-foreground"
        )}
      >
        {formatted}
      </span>
      <span className="hidden text-xs text-muted-foreground sm:inline">{label}</span>
      {!running && !isDone && secondsLeft === totalSeconds && (
        <Button onClick={handleStart} size="sm" variant="outline" className="h-7 border-hsk6/50 text-hsk6 hover:bg-hsk6/10">
          <Play className="mr-1 h-3 w-3" /> Start
        </Button>
      )}
      {!running && secondsLeft > 0 && secondsLeft < totalSeconds && (
        <Button onClick={handleStart} size="sm" variant="outline" className="h-7 border-hsk6/50 text-hsk6 hover:bg-hsk6/10">
          <Play className="mr-1 h-3 w-3" /> Resume
        </Button>
      )}
      {(running || isDone || (secondsLeft > 0 && secondsLeft < totalSeconds)) && (
        <Button onClick={handleReset} size="sm" variant="ghost" className="h-7 text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ExamTimer;
