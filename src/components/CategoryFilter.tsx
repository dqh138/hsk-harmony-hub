import { GrammarCategory, categoryLabels } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";

const categories: GrammarCategory[] = [
  "basic-sentence", "particles", "questions", "negation", "comparison",
  "time", "complement", "conjunctions", "prepositions", "measure-words",
  "adverbs", "auxiliary-verbs", "special-structures", "passive", "causative",
  "emphasis", "conditional", "rhetoric", "formal-expressions", "complex-structures",
];

interface CategoryFilterProps {
  selected: GrammarCategory | null;
  onChange: (cat: GrammarCategory | null) => void;
  availableCategories?: GrammarCategory[];
}

const CategoryFilter = ({ selected, onChange, availableCategories }: CategoryFilterProps) => {
  const cats = availableCategories
    ? categories.filter((c) => availableCategories.includes(c))
    : categories;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border border-border/50 px-3 py-1 text-xs font-medium transition-colors",
          !selected
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        All
      </button>
      {cats.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(selected === cat ? null : cat)}
          className={cn(
            "rounded-full border border-border/50 px-3 py-1 text-xs font-medium transition-colors",
            selected === cat
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
