import { GrammarPoint } from "./grammarTypes";

export const hsk3Grammar: GrammarPoint[] = [
  {
    id: "h3-01", level: 3, category: "special-structures",
    pattern: "把", name: "把 structure",
    explanation: "把 moves the object before the verb to emphasize what happens to it.",
    structure: "Subject + 把 + Object + Verb + Complement",
    examples: [
      { chinese: "请把门关上。", pinyin: "Qǐng bǎ mén guānshang.", english: "Please close the door." },
      { chinese: "他把作业做完了。", pinyin: "Tā bǎ zuòyè zuòwán le.", english: "He finished the homework." },
    ],
  },
  {
    id: "h3-02", level: 3, category: "passive",
    pattern: "被", name: "Passive with 被",
    explanation: "被 indicates the passive voice — the subject receives the action.",
    structure: "Subject + 被 + (Agent) + Verb + Complement",
    examples: [
      { chinese: "我的手机被偷了。", pinyin: "Wǒ de shǒujī bèi tōu le.", english: "My phone was stolen." },
      { chinese: "蛋糕被他吃了。", pinyin: "Dàngāo bèi tā chī le.", english: "The cake was eaten by him." },
    ],
  },
  {
    id: "h3-03", level: 3, category: "complement",
    pattern: "结果补语", name: "Result complements",
    explanation: "A result complement after the verb indicates the outcome of the action.",
    structure: "Verb + Result Complement",
    examples: [
      { chinese: "我听懂了。", pinyin: "Wǒ tīngdǒng le.", english: "I understood (by listening)." },
      { chinese: "你看见了吗？", pinyin: "Nǐ kànjiàn le ma?", english: "Did you see it?" },
      { chinese: "我记住了他的名字。", pinyin: "Wǒ jìzhù le tā de míngzi.", english: "I memorized his name." },
    ],
  },
  {
    id: "h3-04", level: 3, category: "complement",
    pattern: "方向补语", name: "Directional complements",
    explanation: "Direction words like 上/下/进/出/回/过/起 after verbs indicate direction.",
    structure: "Verb + Direction",
    examples: [
      { chinese: "走进来。", pinyin: "Zǒu jìnlái.", english: "Walk in (towards the speaker)." },
      { chinese: "他跑出去了。", pinyin: "Tā pǎo chūqù le.", english: "He ran out." },
    ],
  },
  {
    id: "h3-05", level: 3, category: "comparison",
    pattern: "跟...一样", name: "Same as... with 跟...一样",
    explanation: "Used to express that two things are the same in some way.",
    structure: "A + 跟 + B + 一样 + (Adjective)",
    examples: [
      { chinese: "他跟我一样高。", pinyin: "Tā gēn wǒ yīyàng gāo.", english: "He is as tall as me." },
      { chinese: "这个跟那个一样。", pinyin: "Zhège gēn nàge yīyàng.", english: "This one is the same as that one." },
    ],
  },
  {
    id: "h3-06", level: 3, category: "comparison",
    pattern: "越来越...", name: "More and more",
    explanation: "越来越 + adjective means 'more and more...'",
    structure: "越来越 + Adjective/Verb",
    examples: [
      { chinese: "天气越来越冷了。", pinyin: "Tiānqì yuèláiyuè lěng le.", english: "The weather is getting colder and colder." },
      { chinese: "他中文越来越好。", pinyin: "Tā Zhōngwén yuèláiyuè hǎo.", english: "His Chinese is getting better and better." },
    ],
  },
  {
    id: "h3-07", level: 3, category: "conjunctions",
    pattern: "如果...就...", name: "If... then...",
    explanation: "如果 introduces a condition and 就 introduces the result.",
    structure: "如果 + Condition, (Subject) + 就 + Result",
    examples: [
      { chinese: "如果明天下雨，我就不去了。", pinyin: "Rúguǒ míngtiān xià yǔ, wǒ jiù bú qù le.", english: "If it rains tomorrow, I won't go." },
      { chinese: "如果你有时间，就来我家吧。", pinyin: "Rúguǒ nǐ yǒu shíjiān, jiù lái wǒ jiā ba.", english: "If you have time, come to my house." },
    ],
  },
  {
    id: "h3-08", level: 3, category: "conjunctions",
    pattern: "不但...而且...", name: "Not only... but also...",
    explanation: "不但 introduces the first point, 而且 adds another point.",
    structure: "不但 + A, 而且 + B",
    examples: [
      { chinese: "她不但漂亮，而且聪明。", pinyin: "Tā búdàn piàoliang, érqiě cōngming.", english: "She is not only pretty but also smart." },
      { chinese: "不但便宜，而且好吃。", pinyin: "Búdàn piányi, érqiě hǎochī.", english: "Not only cheap but also delicious." },
    ],
  },
  {
    id: "h3-09", level: 3, category: "adverbs",
    pattern: "又...又...", name: "Both... and...",
    explanation: "又...又... describes having two qualities simultaneously.",
    structure: "又 + Adj1 + 又 + Adj2",
    examples: [
      { chinese: "这个菜又便宜又好吃。", pinyin: "Zhège cài yòu piányi yòu hǎochī.", english: "This dish is both cheap and delicious." },
      { chinese: "她又唱又跳。", pinyin: "Tā yòu chàng yòu tiào.", english: "She sings and dances." },
    ],
  },
  {
    id: "h3-10", level: 3, category: "special-structures",
    pattern: "连...都/也...", name: "Even... (emphasis)",
    explanation: "连...都/也 emphasizes something unexpected or extreme.",
    structure: "连 + Noun + 都/也 + Verb",
    examples: [
      { chinese: "他连一个字都不认识。", pinyin: "Tā lián yí gè zì dōu bú rènshi.", english: "He doesn't even know a single character." },
      { chinese: "连小孩也知道。", pinyin: "Lián xiǎohái yě zhīdào.", english: "Even children know." },
    ],
  },
  {
    id: "h3-11", level: 3, category: "special-structures",
    pattern: "是...的", name: "Emphasis with 是...的",
    explanation: "Used to emphasize time, place, manner, or purpose of a past action.",
    structure: "Subject + 是 + (Detail) + Verb + 的",
    examples: [
      { chinese: "你是什么时候来的？", pinyin: "Nǐ shì shénme shíhou lái de?", english: "When did you come?" },
      { chinese: "我是坐飞机来的。", pinyin: "Wǒ shì zuò fēijī lái de.", english: "I came by plane." },
    ],
  },
  {
    id: "h3-12", level: 3, category: "time",
    pattern: "一...就...", name: "As soon as... then...",
    explanation: "一 + V1 + 就 + V2 means 'as soon as V1 happens, V2 follows'.",
    structure: "Subject + 一 + V1 + 就 + V2",
    examples: [
      { chinese: "我一回家就吃饭。", pinyin: "Wǒ yī huí jiā jiù chīfàn.", english: "As soon as I get home, I eat." },
      { chinese: "他一看书就睡觉。", pinyin: "Tā yī kàn shū jiù shuìjiào.", english: "He falls asleep as soon as he reads." },
    ],
  },
  {
    id: "h3-13", level: 3, category: "adverbs",
    pattern: "再/又", name: "Again — 再 vs 又",
    explanation: "再 is for future repetition; 又 is for past repetition.",
    structure: "Subject + 再/又 + Verb",
    examples: [
      { chinese: "请再说一次。", pinyin: "Qǐng zài shuō yī cì.", english: "Please say it again." },
      { chinese: "他又迟到了。", pinyin: "Tā yòu chídào le.", english: "He was late again." },
    ],
  },
  {
    id: "h3-14", level: 3, category: "particles",
    pattern: "着", name: "Ongoing state with 着",
    explanation: "着 indicates a continuing state resulting from an action.",
    structure: "Verb + 着",
    examples: [
      { chinese: "门开着呢。", pinyin: "Mén kāi zhe ne.", english: "The door is open." },
      { chinese: "他穿着一件红衣服。", pinyin: "Tā chuān zhe yī jiàn hóng yīfu.", english: "He is wearing a red shirt." },
    ],
  },
  {
    id: "h3-15", level: 3, category: "conjunctions",
    pattern: "除了...以外", name: "Besides / Except",
    explanation: "除了...以外 means 'besides/except for', depending on context (with 都 or 也).",
    structure: "除了 + X + 以外, Subject + 都/也 + Verb",
    examples: [
      { chinese: "除了中文以外，他也会说日语。", pinyin: "Chúle Zhōngwén yǐwài, tā yě huì shuō Rìyǔ.", english: "Besides Chinese, he can also speak Japanese." },
      { chinese: "除了他以外，大家都去了。", pinyin: "Chúle tā yǐwài, dàjiā dōu qù le.", english: "Except for him, everyone went." },
    ],
  },
];
