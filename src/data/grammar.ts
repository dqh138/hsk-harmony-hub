import { hsk1Grammar } from "./hsk1";
import { hsk2Grammar } from "./hsk2";
import { hsk3Grammar } from "./hsk3";
import { hsk4Grammar } from "./hsk4";
import { hsk5Grammar } from "./hsk5";
import { hsk6Grammar } from "./hsk6";
import { GrammarPoint, HSKLevel } from "./grammarTypes";

export const allGrammar: GrammarPoint[] = [
  ...hsk1Grammar,
  ...hsk2Grammar,
  ...hsk3Grammar,
  ...hsk4Grammar,
  ...hsk5Grammar,
  ...hsk6Grammar,
];

export const getGrammarByLevel = (level: HSKLevel): GrammarPoint[] =>
  allGrammar.filter((g) => g.level === level);

export const searchGrammar = (query: string): GrammarPoint[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allGrammar.filter(
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
};

export { type GrammarPoint, type HSKLevel } from "./grammarTypes";
