import { HSKLevel } from "./grammarTypes";

export interface VocabWord {
  id: string;
  level: HSKLevel;
  hanzi: string;
  pinyin: string;
  pos: string;
  meaning: string;
  example: {
    chinese: string;
    english: string;
  };
}
