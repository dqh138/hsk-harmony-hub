// Bảng âm tiết Pinyin tiêu chuẩn của tiếng Phổ thông, nhóm theo thanh mẫu (声母).
// Mỗi âm tiết đều có thể đọc với 4 thanh điệu (một số kết hợp hiếm gặp trong
// thực tế nhưng vẫn giữ để bảng đầy đủ như bảng tra Pinyin thông dụng).

export interface PinyinGroup {
  /** Thanh mẫu, chuỗi rỗng nghĩa là âm tiết không có thanh mẫu (零声母). */
  initial: string;
  label: string;
  note: string;
  syllables: string[];
}

export const PINYIN_GROUPS: PinyinGroup[] = [
  {
    initial: "",
    label: "\u96f6\u58f0\u6bcd",
    note: "Không có thanh mẫu",
    syllables: [
      "a", "o", "e", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "er",
      "yi", "ya", "ye", "yao", "you", "yan", "yin", "yang", "ying",
      "wu", "wa", "wo", "wai", "wei", "wan", "wen", "wang", "weng",
      "yu", "yue", "yuan", "yun", "yong",
    ],
  },
  {
    initial: "b",
    label: "b",
    note: "Âm môi",
    syllables: ["ba", "bo", "bai", "bei", "bao", "ban", "ben", "bang", "beng", "bi", "bie", "biao", "bian", "bin", "bing", "bu"],
  },
  {
    initial: "p",
    label: "p",
    note: "Âm môi",
    syllables: ["pa", "po", "pai", "pei", "pao", "pou", "pan", "pen", "pang", "peng", "pi", "pie", "piao", "pian", "pin", "ping", "pu"],
  },
  {
    initial: "m",
    label: "m",
    note: "Âm môi",
    syllables: ["ma", "mo", "me", "mai", "mei", "mao", "mou", "man", "men", "mang", "meng", "mi", "mie", "miao", "miu", "mian", "min", "ming", "mu"],
  },
  {
    initial: "f",
    label: "f",
    note: "Âm môi răng",
    syllables: ["fa", "fo", "fei", "fou", "fan", "fen", "fang", "feng", "fu"],
  },
  {
    initial: "d",
    label: "d",
    note: "Âm đầu lưỡi",
    syllables: ["da", "de", "dai", "dei", "dao", "dou", "dan", "den", "dang", "deng", "dong", "di", "die", "diao", "diu", "dian", "ding", "du", "duo", "dui", "duan", "dun"],
  },
  {
    initial: "t",
    label: "t",
    note: "Âm đầu lưỡi",
    syllables: ["ta", "te", "tai", "tei", "tao", "tou", "tan", "tang", "teng", "tong", "ti", "tie", "tiao", "tian", "ting", "tu", "tuo", "tui", "tuan", "tun"],
  },
  {
    initial: "n",
    label: "n",
    note: "Âm mũi đầu lưỡi",
    syllables: ["na", "ne", "nai", "nei", "nao", "nou", "nan", "nen", "nang", "neng", "nong", "ni", "nie", "niao", "niu", "nian", "nin", "niang", "ning", "nu", "nuo", "nuan", "nun", "nv", "nve"],
  },
  {
    initial: "l",
    label: "l",
    note: "Âm bên đầu lưỡi",
    syllables: ["la", "le", "lai", "lei", "lao", "lou", "lan", "lang", "leng", "long", "li", "lia", "lie", "liao", "liu", "lian", "lin", "liang", "ling", "lu", "luo", "luan", "lun", "lv", "lve"],
  },
  {
    initial: "g",
    label: "g",
    note: "Âm gốc lưỡi",
    syllables: ["ga", "ge", "gai", "gei", "gao", "gou", "gan", "gen", "gang", "geng", "gong", "gu", "gua", "guo", "guai", "gui", "guan", "gun", "guang"],
  },
  {
    initial: "k",
    label: "k",
    note: "Âm gốc lưỡi",
    syllables: ["ka", "ke", "kai", "kei", "kao", "kou", "kan", "ken", "kang", "keng", "kong", "ku", "kua", "kuo", "kuai", "kui", "kuan", "kun", "kuang"],
  },
  {
    initial: "h",
    label: "h",
    note: "Âm gốc lưỡi",
    syllables: ["ha", "he", "hai", "hei", "hao", "hou", "han", "hen", "hang", "heng", "hong", "hu", "hua", "huo", "huai", "hui", "huan", "hun", "huang"],
  },
  {
    initial: "j",
    label: "j",
    note: "Âm mặt lưỡi",
    syllables: ["ji", "jia", "jie", "jiao", "jiu", "jian", "jin", "jiang", "jing", "jiong", "ju", "jue", "juan", "jun"],
  },
  {
    initial: "q",
    label: "q",
    note: "Âm mặt lưỡi",
    syllables: ["qi", "qia", "qie", "qiao", "qiu", "qian", "qin", "qiang", "qing", "qiong", "qu", "que", "quan", "qun"],
  },
  {
    initial: "x",
    label: "x",
    note: "Âm mặt lưỡi",
    syllables: ["xi", "xia", "xie", "xiao", "xiu", "xian", "xin", "xiang", "xing", "xiong", "xu", "xue", "xuan", "xun"],
  },
  {
    initial: "zh",
    label: "zh",
    note: "Âm quặt lưỡi",
    syllables: ["zha", "zhe", "zhi", "zhai", "zhei", "zhao", "zhou", "zhan", "zhen", "zhang", "zheng", "zhong", "zhu", "zhua", "zhuo", "zhuai", "zhui", "zhuan", "zhun", "zhuang"],
  },
  {
    initial: "ch",
    label: "ch",
    note: "Âm quặt lưỡi",
    syllables: ["cha", "che", "chi", "chai", "chao", "chou", "chan", "chen", "chang", "cheng", "chong", "chu", "chua", "chuo", "chuai", "chui", "chuan", "chun", "chuang"],
  },
  {
    initial: "sh",
    label: "sh",
    note: "Âm quặt lưỡi",
    syllables: ["sha", "she", "shi", "shai", "shei", "shao", "shou", "shan", "shen", "shang", "sheng", "shu", "shua", "shuo", "shuai", "shui", "shuan", "shun", "shuang"],
  },
  {
    initial: "r",
    label: "r",
    note: "Âm quặt lưỡi",
    syllables: ["re", "ri", "rao", "rou", "ran", "ren", "rang", "reng", "rong", "ru", "rua", "ruo", "rui", "ruan", "run"],
  },
  {
    initial: "z",
    label: "z",
    note: "Âm đầu lưỡi trước",
    syllables: ["za", "ze", "zi", "zai", "zei", "zao", "zou", "zan", "zen", "zang", "zeng", "zong", "zu", "zuo", "zui", "zuan", "zun"],
  },
  {
    initial: "c",
    label: "c",
    note: "Âm đầu lưỡi trước",
    syllables: ["ca", "ce", "ci", "cai", "cao", "cou", "can", "cen", "cang", "ceng", "cong", "cu", "cuo", "cui", "cuan", "cun"],
  },
  {
    initial: "s",
    label: "s",
    note: "Âm đầu lưỡi trước",
    syllables: ["sa", "se", "si", "sai", "sao", "sou", "san", "sen", "sang", "seng", "song", "su", "suo", "sui", "suan", "sun"],
  },
];

export const ALL_SYLLABLES = PINYIN_GROUPS.flatMap((g) => g.syllables);

export const TONE_LABELS = [
  { tone: 1, name: "Thanh 1", cn: "\u9634\u5e73", desc: "Cao và đều" },
  { tone: 2, name: "Thanh 2", cn: "\u9633\u5e73", desc: "Đi lên" },
  { tone: 3, name: "Thanh 3", cn: "\u4e0a\u58f0", desc: "Xuống rồi lên" },
  { tone: 4, name: "Thanh 4", cn: "\u53bb\u58f0", desc: "Đi xuống nhanh" },
] as const;

const TONE_VOWELS: Record<string, string[]> = {
  a: ["\u0101", "\u00e1", "\u01ce", "\u00e0"],
  o: ["\u014d", "\u00f3", "\u01d2", "\u00f2"],
  e: ["\u0113", "\u00e9", "\u011b", "\u00e8"],
  i: ["\u012b", "\u00ed", "\u01d0", "\u00ec"],
  u: ["\u016b", "\u00fa", "\u01d4", "\u00f9"],
  // ü
  v: ["\u01d6", "\u01d8", "\u01da", "\u01dc"],
};

/** Hiển thị "nv" -> "nü", "lve" -> "lüe". */
export const displaySyllable = (syllable: string) => syllable.replace(/v/g, "\u00fc");

/**
 * Thêm dấu thanh vào âm tiết pinyin (tone 1-4, 0 = thanh nhẹ).
 * Quy tắc: ưu tiên a/e; "ou" đánh vào o; nếu không, đánh vào nguyên âm cuối.
 */
export const withTone = (syllable: string, tone: number): string => {
  const base = syllable.toLowerCase();
  if (tone < 1 || tone > 4) return displaySyllable(base);

  let target = -1;
  const aIdx = base.indexOf("a");
  const eIdx = base.indexOf("e");
  const ouIdx = base.indexOf("ou");
  if (aIdx >= 0) target = aIdx;
  else if (eIdx >= 0) target = eIdx;
  else if (ouIdx >= 0) target = ouIdx;
  else {
    for (let i = base.length - 1; i >= 0; i--) {
      if ("iouv".includes(base[i])) {
        target = i;
        break;
      }
    }
  }
  if (target < 0) return displaySyllable(base);

  const marked = TONE_VOWELS[base[target]]?.[tone - 1] ?? base[target];
  const out = base.slice(0, target) + marked + base.slice(target + 1);
  return displaySyllable(out);
};
