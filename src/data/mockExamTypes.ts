export type ExamSectionType = "listening" | "reading" | "writing";

export type ReadingPartType =
  | "error-identification"    // Part 1: Find the sentence with an error
  | "cloze-words"             // Part 2: Fill in blanks with correct words
  | "cloze-sentences"         // Part 3: Fill in blanks with correct sentences
  | "reading-comprehension";  // Part 4: Read passages and answer questions

export type ListeningPartType =
  | "short-conversations"     // Part 1: Q1-15
  | "interviews"              // Part 2: Q16-30
  | "passages";               // Part 3: Q31-50

export interface ExamQuestion {
  id: number;
  questionText?: string;      // For listening Part 2/3 questions shown on screen
  options: string[];          // A, B, C, D (or A-E for cloze-sentences)
  correctAnswer?: string;     // "A" | "B" | "C" | "D" | "E"
}

export interface ReadingPart {
  type: ReadingPartType;
  title: string;
  instructions: string;
  passage?: string;           // For parts with shared passage
  passages?: {                // For Part 4: multiple passages
    text: string;
    questions: ExamQuestion[];
  }[];
  questions?: ExamQuestion[]; // For Part 1 (standalone questions)
  blanksPassage?: {           // For Part 2 & 3: passage with blanks
    text: string;
    options: string[][];      // Per-blank options for Part 2
    questions: ExamQuestion[];
  }[];
}

export interface ListeningScript {
  questionRange: string;      // e.g., "1" or "16-20"
  text: string;
}

export interface ListeningPart {
  type: ListeningPartType;
  title: string;
  instructions: string;
  questions: ExamQuestion[];
  scripts?: ListeningScript[];
}

export interface WritingSection {
  title: string;
  instructions: string[];
  prompt: string;
  sampleAnswer?: string;
}

export interface MockExam {
  id: string;
  title: string;
  titleZh: string;
  level: number;
  sections: {
    listening?: ListeningPart[];
    reading: ReadingPart[];
    writing?: WritingSection;
  };
}
