import { hsk1Vocab } from "./hsk1Vocab";
import { hsk2Vocab } from "./hsk2Vocab";
import { hsk3Vocab } from "./hsk3Vocab";
import { hsk4Vocab } from "./hsk4Vocab";
import { hsk5Vocab } from "./hsk5Vocab";
import { hsk6Vocab } from "./hsk6Vocab";
import { VocabWord } from "./vocabTypes";
import { HSKLevel } from "./grammarTypes";

export const vocabByLevel: Record<HSKLevel, VocabWord[]> = {
  1: hsk1Vocab,
  2: hsk2Vocab,
  3: hsk3Vocab,
  4: hsk4Vocab,
  5: hsk5Vocab,
  6: hsk6Vocab,
};

export const allVocab: VocabWord[] = [
  ...hsk1Vocab,
  ...hsk2Vocab,
  ...hsk3Vocab,
  ...hsk4Vocab,
  ...hsk5Vocab,
  ...hsk6Vocab,
];

export const getVocabByLevel = (level: HSKLevel): VocabWord[] => vocabByLevel[level] ?? [];

export type { VocabWord } from "./vocabTypes";
