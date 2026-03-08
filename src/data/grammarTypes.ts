export type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type GrammarCategory =
  | "basic-sentence"
  | "particles"
  | "questions"
  | "negation"
  | "comparison"
  | "time"
  | "complement"
  | "conjunctions"
  | "prepositions"
  | "measure-words"
  | "adverbs"
  | "auxiliary-verbs"
  | "special-structures"
  | "passive"
  | "causative"
  | "emphasis"
  | "conditional"
  | "rhetoric"
  | "formal-expressions"
  | "complex-structures";

export interface Example {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface GrammarPoint {
  id: string;
  level: HSKLevel;
  pattern: string;
  name: string;
  explanation: string;
  structure: string;
  category: GrammarCategory;
  examples: Example[];
}

export const categoryLabels: Record<GrammarCategory, string> = {
  "basic-sentence": "Basic Sentences",
  particles: "Particles",
  questions: "Questions",
  negation: "Negation",
  comparison: "Comparison",
  time: "Time Expressions",
  complement: "Complements",
  conjunctions: "Conjunctions",
  prepositions: "Prepositions",
  "measure-words": "Measure Words",
  adverbs: "Adverbs",
  "auxiliary-verbs": "Auxiliary Verbs",
  "special-structures": "Special Structures",
  passive: "Passive Voice",
  causative: "Causative",
  emphasis: "Emphasis",
  conditional: "Conditional",
  rhetoric: "Rhetoric",
  "formal-expressions": "Formal Expressions",
  "complex-structures": "Complex Structures",
};

export const hskLevelColors: Record<HSKLevel, string> = {
  1: "bg-hsk1",
  2: "bg-hsk2",
  3: "bg-hsk3",
  4: "bg-hsk4",
  5: "bg-hsk5",
  6: "bg-hsk6",
};

export const hskLevelTextColors: Record<HSKLevel, string> = {
  1: "text-hsk1",
  2: "text-hsk2",
  3: "text-hsk3",
  4: "text-hsk4",
  5: "text-hsk5",
  6: "text-hsk6",
};

export const hskLevelBorderColors: Record<HSKLevel, string> = {
  1: "border-hsk1",
  2: "border-hsk2",
  3: "border-hsk3",
  4: "border-hsk4",
  5: "border-hsk5",
  6: "border-hsk6",
};
