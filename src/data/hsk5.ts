import { GrammarPoint } from "./grammarTypes";

export const hsk5Grammar: GrammarPoint[] = [
  {
    id: "h5-01", level: 5, category: "conjunctions",
    pattern: "与其...不如...", name: "Rather than... better to...",
    explanation: "与其 introduces the less preferred option; 不如 introduces the preferred one.",
    structure: "与其 + A, 不如 + B",
    examples: [
      { chinese: "与其在家看电视，不如出去走走。", pinyin: "Yǔqí zài jiā kàn diànshì, bùrú chūqù zǒuzǒu.", english: "Rather than watch TV at home, better to go for a walk." },
      { chinese: "与其抱怨，不如行动。", pinyin: "Yǔqí bàoyuàn, bùrú xíngdòng.", english: "Rather than complain, better to take action." },
    ],
  },
  {
    id: "h5-02", level: 5, category: "conjunctions",
    pattern: "宁可...也不/也要...", name: "Would rather... than...",
    explanation: "宁可 expresses a strong preference — willing to endure something to avoid/achieve something else.",
    structure: "宁可 + A, 也不/也要 + B",
    examples: [
      { chinese: "我宁可走路，也不坐他的车。", pinyin: "Wǒ nìngkě zǒulù, yě bú zuò tā de chē.", english: "I'd rather walk than ride in his car." },
      { chinese: "她宁可少睡觉，也要把工作做完。", pinyin: "Tā nìngkě shǎo shuìjiào, yě yào bǎ gōngzuò zuòwán.", english: "She'd rather sleep less and finish the work." },
    ],
  },
  {
    id: "h5-03", level: 5, category: "conjunctions",
    pattern: "不仅...反而...", name: "Not only not... but on the contrary...",
    explanation: "不仅 sets up expectation; 反而 shows the opposite happened.",
    structure: "不仅 + 没/不 + A, 反而 + B",
    examples: [
      { chinese: "他不仅没生气，反而笑了。", pinyin: "Tā bùjǐn méi shēngqì, fǎn'ér xiào le.", english: "He not only wasn't angry, he actually laughed." },
      { chinese: "问题不仅没解决，反而更严重了。", pinyin: "Wèntí bùjǐn méi jiějué, fǎn'ér gèng yánzhòng le.", english: "The problem not only wasn't solved, it got worse." },
    ],
  },
  {
    id: "h5-04", level: 5, category: "special-structures",
    pattern: "所 + Verb", name: "所 nominalization",
    explanation: "所 before a verb makes it function as a noun phrase (what is Verb-ed).",
    structure: "所 + Verb + 的 + Noun",
    examples: [
      { chinese: "这不是我所希望的。", pinyin: "Zhè búshì wǒ suǒ xīwàng de.", english: "This is not what I hoped for." },
      { chinese: "他所说的都是真的。", pinyin: "Tā suǒ shuō de dōu shì zhēn de.", english: "Everything he said is true." },
    ],
  },
  {
    id: "h5-05", level: 5, category: "formal-expressions",
    pattern: "以", name: "以 — by means of / in order to",
    explanation: "以 is a formal preposition meaning 'by/with/in order to'.",
    structure: "以 + Method/Purpose + Verb",
    examples: [
      { chinese: "以防万一。", pinyin: "Yǐ fáng wànyī.", english: "Just in case." },
      { chinese: "他以优异的成绩毕业了。", pinyin: "Tā yǐ yōuyì de chéngjì bìyè le.", english: "He graduated with excellent grades." },
    ],
  },
  {
    id: "h5-06", level: 5, category: "special-structures",
    pattern: "之所以...是因为...", name: "The reason why... is because...",
    explanation: "之所以 introduces the result first, then 是因为 gives the reason.",
    structure: "Subject + 之所以 + Result, 是因为 + Reason",
    examples: [
      { chinese: "我之所以学中文，是因为对中国文化感兴趣。", pinyin: "Wǒ zhī suǒyǐ xué Zhōngwén, shì yīnwèi duì Zhōngguó wénhuà gǎn xìngqù.", english: "The reason I study Chinese is because I'm interested in Chinese culture." },
      { chinese: "他之所以成功，是因为努力。", pinyin: "Tā zhī suǒyǐ chénggōng, shì yīnwèi nǔlì.", english: "The reason he succeeded is because of hard work." },
    ],
  },
  {
    id: "h5-07", level: 5, category: "special-structures",
    pattern: "由", name: "由 — by / from / composed of",
    explanation: "由 indicates the agent, source, or composition of something.",
    structure: "由 + Agent/Source + Verb",
    examples: [
      { chinese: "这个活动由学校组织。", pinyin: "Zhège huódòng yóu xuéxiào zǔzhī.", english: "This event is organized by the school." },
      { chinese: "水由氢和氧组成。", pinyin: "Shuǐ yóu qīng hé yǎng zǔchéng.", english: "Water is composed of hydrogen and oxygen." },
    ],
  },
  {
    id: "h5-08", level: 5, category: "emphasis",
    pattern: "难道...吗？", name: "Rhetorical question with 难道",
    explanation: "难道 makes a question rhetorical, implying the answer is obvious.",
    structure: "难道 + Statement + 吗？",
    examples: [
      { chinese: "难道你不知道吗？", pinyin: "Nándào nǐ bù zhīdào ma?", english: "Don't you know? (You should know!)" },
      { chinese: "难道这不重要吗？", pinyin: "Nándào zhè bú zhòngyào ma?", english: "Isn't this important? (Of course it is!)" },
    ],
  },
  {
    id: "h5-09", level: 5, category: "formal-expressions",
    pattern: "从而", name: "从而 — thereby / thus",
    explanation: "从而 connects a cause to a result in formal or written language.",
    structure: "Action, 从而 + Result",
    examples: [
      { chinese: "他努力学习，从而取得了好成绩。", pinyin: "Tā nǔlì xuéxí, cóng'ér qǔdé le hǎo chéngjì.", english: "He studied hard, thus achieving good grades." },
      { chinese: "政府采取了措施，从而减少了污染。", pinyin: "Zhèngfǔ cǎiqǔ le cuòshī, cóng'ér jiǎnshǎo le wūrǎn.", english: "The government took measures, thereby reducing pollution." },
    ],
  },
  {
    id: "h5-10", level: 5, category: "conjunctions",
    pattern: "一方面...另一方面...", name: "On one hand... on the other hand...",
    explanation: "Used to present two aspects of a situation.",
    structure: "一方面 + A, 另一方面 + B",
    examples: [
      { chinese: "一方面想去，另一方面没时间。", pinyin: "Yī fāngmiàn xiǎng qù, lìng yī fāngmiàn méi shíjiān.", english: "On one hand I want to go, on the other hand I don't have time." },
      { chinese: "一方面要学习，另一方面也要注意休息。", pinyin: "Yī fāngmiàn yào xuéxí, lìng yī fāngmiàn yě yào zhùyì xiūxi.", english: "On one hand study, on the other hand rest too." },
    ],
  },
  {
    id: "h5-11", level: 5, category: "special-structures",
    pattern: "以...为...", name: "Take... as...",
    explanation: "以...为... means 'to take/regard A as B'.",
    structure: "以 + A + 为 + B",
    examples: [
      { chinese: "他以教学为乐。", pinyin: "Tā yǐ jiāoxué wéi lè.", english: "He takes teaching as pleasure." },
      { chinese: "我们以质量为第一。", pinyin: "Wǒmen yǐ zhìliàng wéi dìyī.", english: "We put quality first." },
    ],
  },
  {
    id: "h5-12", level: 5, category: "adverbs",
    pattern: "毕竟", name: "After all / At the end of the day",
    explanation: "毕竟 emphasizes an underlying fact that should be considered.",
    structure: "毕竟 + Statement",
    examples: [
      { chinese: "毕竟他还是个孩子。", pinyin: "Bìjìng tā háishì gè háizi.", english: "After all, he's still a child." },
      { chinese: "毕竟这不是一件容易的事。", pinyin: "Bìjìng zhè búshì yī jiàn róngyì de shì.", english: "After all, this isn't easy." },
    ],
  },
  {
    id: "h5-13", level: 5, category: "special-structures",
    pattern: "何况", name: "Let alone / Not to mention",
    explanation: "何况 introduces an even stronger case to support the argument.",
    structure: "A, 何况 + B",
    examples: [
      { chinese: "大人都做不到，何况小孩？", pinyin: "Dàrén dōu zuò bú dào, hékuàng xiǎohái?", english: "Adults can't even do it, let alone children." },
      { chinese: "走路都很远，何况骑车？", pinyin: "Zǒulù dōu hěn yuǎn, hékuàng qí chē?", english: "It's far even on foot, let alone cycling." },
    ],
  },
  {
    id: "h5-14", level: 5, category: "formal-expressions",
    pattern: "不得不", name: "Have no choice but to",
    explanation: "不得不 is a double negative meaning 'must/have to'.",
    structure: "Subject + 不得不 + Verb",
    examples: [
      { chinese: "我不得不承认他说得对。", pinyin: "Wǒ bùdébù chéngrèn tā shuō de duì.", english: "I have to admit he's right." },
      { chinese: "由于天气原因，航班不得不取消。", pinyin: "Yóuyú tiānqì yuányīn, hángbān bùdébù qǔxiāo.", english: "Due to weather, the flight had to be cancelled." },
    ],
  },
  {
    id: "h5-15", level: 5, category: "special-structures",
    pattern: "动不动就...", name: "At the drop of a hat",
    explanation: "动不动就 means someone does something too easily or too often.",
    structure: "Subject + 动不动就 + Verb",
    examples: [
      { chinese: "她动不动就哭。", pinyin: "Tā dòngbudòng jiù kū.", english: "She cries at the slightest thing." },
      { chinese: "他动不动就生气。", pinyin: "Tā dòngbudòng jiù shēngqì.", english: "He gets angry at the drop of a hat." },
    ],
  },
];
