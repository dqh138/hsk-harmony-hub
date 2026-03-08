import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { searchGrammar, allGrammar } from "@/data/grammar";
import { HSKLevel, hskLevelColors, hskLevelTextColors, GrammarCategory } from "@/data/grammarTypes";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import GrammarCard from "@/components/GrammarCard";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

const levelDescriptions: Record<HSKLevel, string> = {
  1: "Basic greetings, numbers, simple sentences",
  2: "Daily life, comparisons, time expressions",
  3: "把/被 structures, complements, conjunctions",
  4: "Complex conjunctions, potential complements, emphasis",
  5: "Formal expressions, advanced conjunctions, rhetoric",
  6: "Literary Chinese, academic structures, idiomatic expressions",
};

const Index = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GrammarCategory | null>(null);

  const results = useMemo(() => {
    let items = query ? searchGrammar(query) : [];
    if (category) {
      items = (query ? items : allGrammar).filter((g) => g.category === category);
    }
    return items;
  }, [query, category]);

  const showResults = query || category;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-black tracking-tight gold-text sm:text-6xl md:text-7xl">
            中文语法
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Your complete HSK 1–6 Chinese grammar reference. Search, browse, and master every essential pattern.
          </p>
          <div className="mx-auto mt-8 max-w-lg">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="mx-auto mt-4 max-w-3xl">
            <CategoryFilter selected={category} onChange={setCategory} />
          </div>
        </div>
      </section>

      {/* Results or Level Cards */}
      <section className="container mx-auto px-4 py-12">
        {showResults ? (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {results.length} grammar point{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((point) => (
                <GrammarCard key={point.id} point={point} />
              ))}
            </div>
            {results.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                No grammar points found. Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((level) => {
              const count = allGrammar.filter((g) => g.level === level).length;
              return (
                <Link
                  key={level}
                  to={`/hsk/${level}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
                    hskLevelBorderColor(level)
                  )}
                >
                  <div className={cn("absolute right-4 top-4 rounded px-2 py-0.5 text-xs font-bold text-background", hskLevelColors[level])}>
                    {count} points
                  </div>
                  <h2 className={cn("font-serif text-3xl font-black", hskLevelTextColors[level])}>
                    HSK {level}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {levelDescriptions[level]}
                  </p>
                  <div className="mt-4 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Browse grammar →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
        <p>中文语法 — HSK Grammar Reference for Chinese Learners</p>
      </footer>
    </div>
  );
};

function hskLevelBorderColor(level: HSKLevel): string {
  const map: Record<HSKLevel, string> = {
    1: "border-hsk1/30 hover:border-hsk1/60",
    2: "border-hsk2/30 hover:border-hsk2/60",
    3: "border-hsk3/30 hover:border-hsk3/60",
    4: "border-hsk4/30 hover:border-hsk4/60",
    5: "border-hsk5/30 hover:border-hsk5/60",
    6: "border-hsk6/30 hover:border-hsk6/60",
  };
  return map[level];
}

export default Index;
