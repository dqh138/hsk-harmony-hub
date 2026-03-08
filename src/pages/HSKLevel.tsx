import { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getGrammarByLevel, HSKLevel } from "@/data/grammar";
import { GrammarCategory, hskLevelTextColors } from "@/data/grammarTypes";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import GrammarCard from "@/components/GrammarCard";
import { cn } from "@/lib/utils";

const HSKLevelPage = () => {
  const { level } = useParams();
  const levelNum = Number(level) as HSKLevel;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GrammarCategory | null>(null);

  const isValid = [1, 2, 3, 4, 5, 6].includes(levelNum);
  const allPoints = isValid ? getGrammarByLevel(levelNum) : [];

  const availableCategories = useMemo(
    () => [...new Set(allPoints.map((g) => g.category))],
    [levelNum, isValid]
  );

  const filtered = useMemo(() => {
    let items = allPoints;
    if (query) {
      const q = query.toLowerCase().trim();
      items = items.filter(
        (g) =>
          g.pattern.toLowerCase().includes(q) ||
          g.name.toLowerCase().includes(q) ||
          g.explanation.toLowerCase().includes(q) ||
          g.structure.toLowerCase().includes(q) ||
          g.examples.some(
            (e) =>
              e.chinese.includes(q) ||
              e.pinyin.toLowerCase().includes(q) ||
              e.english.toLowerCase().includes(q)
          )
      );
    }
    if (category) {
      items = items.filter((g) => g.category === category);
    }
    return items;
  }, [query, category, levelNum]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return (

      <section className="border-b border-border/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className={cn("font-serif text-4xl font-black sm:text-5xl", hskLevelTextColors[levelNum])}>
            HSK {levelNum}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {allPoints.length} grammar points
          </p>
          <div className="mt-6 max-w-lg">
            <SearchBar value={query} onChange={setQuery} placeholder={`Search HSK ${levelNum} grammar...`} />
          </div>
          <div className="mt-4">
            <CategoryFilter
              selected={category}
              onChange={setCategory}
              availableCategories={availableCategories}
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((point) => (
            <GrammarCard key={point.id} point={point} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No matching grammar points found.
          </p>
        )}
      </section>
    </div>
  );
};

export default HSKLevelPage;
