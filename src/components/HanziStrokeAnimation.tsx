import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface Props {
  text: string;
  size?: number;
  /** When this value changes, the animation restarts. */
  replayKey?: string | number;
}

/**
 * Renders Chinese characters as an animated stroke-by-stroke writing,
 * pausing on the completed character. Falls back to plain text on error.
 */
const resolvePrimaryColor = () => {
  if (typeof window === "undefined") return "#c8102e";
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  // raw is in form "0 84% 60%" — wrap into hsl()
  return raw ? `hsl(${raw})` : "#c8102e";
};

const HanziStrokeAnimation = ({ text, size = 140, replayKey }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HanziWriter[]>([]);
  const [failed, setFailed] = useState(false);

  const animate = () => {
    if (!containerRef.current) return;
    setFailed(false);
    containerRef.current.innerHTML = "";
    writersRef.current = [];

    const strokeColor = resolvePrimaryColor();
    const chars = Array.from(text);
    let cancelled = false;

    const writeSequentially = async () => {
      for (let i = 0; i < chars.length; i++) {
        if (cancelled) return;
        const ch = chars[i];
        if (!/\p{Script=Han}/u.test(ch)) {
          const span = document.createElement("span");
          span.textContent = ch;
          span.style.fontSize = `${size * 0.6}px`;
          span.style.alignSelf = "center";
          span.style.padding = `0 ${size * 0.05}px`;
          containerRef.current?.appendChild(span);
          continue;
        }

        const slot = document.createElement("div");
        slot.style.width = `${size}px`;
        slot.style.height = `${size}px`;
        containerRef.current?.appendChild(slot);

        try {
          const writer = HanziWriter.create(slot, ch, {
            width: size,
            height: size,
            padding: 4,
            strokeAnimationSpeed: 1.2,
            delayBetweenStrokes: 80,
            strokeColor,
            radicalColor: strokeColor,
          });
          writersRef.current.push(writer);
          await new Promise<void>((resolve) => {
            writer.animateCharacter({ onComplete: () => resolve() });
          });
        } catch {
          if (!cancelled) setFailed(true);
          return;
        }
      }
    };

    writeSequentially();
    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    const cleanup = animate();
    return () => {
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, replayKey, size]);

  if (failed) {
    return (
      <div className="font-serif text-6xl font-bold text-foreground">{text}</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="flex flex-wrap items-center justify-center gap-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          animate();
        }}
        className="text-xs"
      >
        <RotateCw className="mr-1 h-3 w-3" />
        Viết lại
      </Button>
    </div>
  );
};

export default HanziStrokeAnimation;
