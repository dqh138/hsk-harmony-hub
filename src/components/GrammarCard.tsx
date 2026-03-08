import { useState } from "react";
import { GrammarPoint, hskLevelColors, hskLevelTextColors, hskLevelBorderColors, categoryLabels } from "@/data/grammarTypes";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrammarCardProps {
  point: GrammarPoint;
}

const GrammarCard = ({ point }: GrammarCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group cursor-pointer rounded-lg border bg-card transition-all hover:shadow-lg hover:shadow-primary/5",
        hskLevelBorderColors[point.level],
        expanded && "border-opacity-100 shadow-lg shadow-primary/5"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("rounded px-2 py-0.5 text-xs font-bold text-background", hskLevelColors[point.level])}>
              HSK {point.level}
            </span>
            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {categoryLabels[point.category]}
            </span>
          </div>
          <h3 className={cn("font-serif text-xl font-bold", hskLevelTextColors[point.level])}>
            {point.pattern}
          </h3>
          <p className="mt-1 text-sm text-foreground">{point.name}</p>
        </div>
        <div className="ml-2 mt-1 text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/50 px-4 pb-4 pt-3">
          <p className="mb-3 text-sm text-muted-foreground">{point.explanation}</p>
          <div className="mb-4 rounded-md bg-muted/50 p-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Structure</span>
            <p className={cn("mt-1 font-serif text-base font-semibold", hskLevelTextColors[point.level])}>
              {point.structure}
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Examples</span>
            {point.examples.map((ex, i) => (
              <div key={i} className="rounded-md border border-border/30 bg-muted/30 p-3">
                <p className="font-serif text-lg text-foreground">{ex.chinese}</p>
                <p className="mt-1 text-sm italic text-secondary">{ex.pinyin}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{ex.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarCard;
