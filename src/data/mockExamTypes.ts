export type ExamSectionType = "listening" | "reading" | "writing";

export type ReadingPartType =
  | "error-identification"    // Part 1: Find the sentence with an error
  | "cloze-words"             // Part 2: Fill in blanks with correct words
  | "cloze-sentences"         // Part 3: Fill in blanks with correct sentences
  | "reading-comprehension";  // Part 4: Read passages and answer questions

export interface ExamQuestion {
  id: number;
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

export interface MockExam {
  id: string;
  title: string;
  titleZh: string;
  level: number;
  sections: {
    reading: ReadingPart[];
  };
}
