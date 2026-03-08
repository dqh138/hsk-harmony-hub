import { GrammarPoint } from "./grammarTypes";

export const hsk1Grammar: GrammarPoint[] = [
  {
    id: "h1-01", level: 1, category: "basic-sentence",
    pattern: "是", name: "The verb 是 (to be)",
    explanation: "Used to link a subject to a noun or noun phrase, similar to 'is/am/are' in English.",
    structure: "Subject + 是 + Noun",
    examples: [
      { chinese: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." },
      { chinese: "她是老师。", pinyin: "Tā shì lǎoshī.", english: "She is a teacher." },
    ],
  },
  {
    id: "h1-02", level: 1, category: "negation",
    pattern: "不", name: "Negation with 不",
    explanation: "Used before verbs and adjectives to negate them. Cannot be used with 有.",
    structure: "Subject + 不 + Verb/Adj",
    examples: [
      { chinese: "我不喝咖啡。", pinyin: "Wǒ bù hē kāfēi.", english: "I don't drink coffee." },
      { chinese: "他不高兴。", pinyin: "Tā bù gāoxìng.", english: "He is not happy." },
    ],
  },
  {
    id: "h1-03", level: 1, category: "negation",
    pattern: "没（有）", name: "Negation with 没(有)",
    explanation: "Used to negate 有 (to have) or to indicate an action hasn't happened.",
    structure: "Subject + 没(有) + Verb/Object",
    examples: [
      { chinese: "我没有钱。", pinyin: "Wǒ méiyǒu qián.", english: "I don't have money." },
      { chinese: "他没去学校。", pinyin: "Tā méi qù xuéxiào.", english: "He didn't go to school." },
    ],
  },
  {
    id: "h1-04", level: 1, category: "questions",
    pattern: "吗", name: "Yes/No questions with 吗",
    explanation: "Add 吗 at the end of a statement to turn it into a yes/no question.",
    structure: "Statement + 吗？",
    examples: [
      { chinese: "你是中国人吗？", pinyin: "Nǐ shì Zhōngguó rén ma?", english: "Are you Chinese?" },
      { chinese: "你喜欢猫吗？", pinyin: "Nǐ xǐhuan māo ma?", english: "Do you like cats?" },
    ],
  },
  {
    id: "h1-05", level: 1, category: "questions",
    pattern: "什么/谁/哪/哪儿", name: "Question words",
    explanation: "Chinese question words stay in the position of the answer within the sentence.",
    structure: "Subject + Verb + Question Word?",
    examples: [
      { chinese: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", english: "What is your name?" },
      { chinese: "谁是你的老师？", pinyin: "Shéi shì nǐ de lǎoshī?", english: "Who is your teacher?" },
      { chinese: "你住在哪儿？", pinyin: "Nǐ zhù zài nǎr?", english: "Where do you live?" },
    ],
  },
  {
    id: "h1-06", level: 1, category: "particles",
    pattern: "的", name: "Possession with 的",
    explanation: "的 indicates possession, similar to 's or 'of' in English.",
    structure: "Noun/Pronoun + 的 + Noun",
    examples: [
      { chinese: "这是我的书。", pinyin: "Zhè shì wǒ de shū.", english: "This is my book." },
      { chinese: "妈妈的朋友很好。", pinyin: "Māma de péngyou hěn hǎo.", english: "Mom's friend is very nice." },
    ],
  },
  {
    id: "h1-07", level: 1, category: "particles",
    pattern: "了", name: "Completed action with 了",
    explanation: "了 placed after a verb indicates the action has been completed.",
    structure: "Subject + Verb + 了 + Object",
    examples: [
      { chinese: "我吃了饭。", pinyin: "Wǒ chī le fàn.", english: "I ate." },
      { chinese: "她买了三本书。", pinyin: "Tā mǎi le sān běn shū.", english: "She bought three books." },
    ],
  },
  {
    id: "h1-08", level: 1, category: "adverbs",
    pattern: "很", name: "Adverb 很 with adjectives",
    explanation: "很 is used before adjectives. In simple statements, it's often required and doesn't always mean 'very'.",
    structure: "Subject + 很 + Adjective",
    examples: [
      { chinese: "天气很好。", pinyin: "Tiānqì hěn hǎo.", english: "The weather is good." },
      { chinese: "这个菜很好吃。", pinyin: "Zhège cài hěn hǎochī.", english: "This dish is very delicious." },
    ],
  },
  {
    id: "h1-09", level: 1, category: "measure-words",
    pattern: "量词 (个/本/杯...)", name: "Measure words",
    explanation: "Chinese requires a measure word between a number/demonstrative and a noun.",
    structure: "Number + Measure Word + Noun",
    examples: [
      { chinese: "三个人", pinyin: "sān gè rén", english: "three people" },
      { chinese: "两杯茶", pinyin: "liǎng bēi chá", english: "two cups of tea" },
      { chinese: "一本书", pinyin: "yī běn shū", english: "one book" },
    ],
  },
  {
    id: "h1-10", level: 1, category: "time",
    pattern: "时间词的位置", name: "Time word placement",
    explanation: "Time words are placed before or after the subject, but always before the verb.",
    structure: "Subject + Time + Verb + Object",
    examples: [
      { chinese: "我明天去北京。", pinyin: "Wǒ míngtiān qù Běijīng.", english: "I'm going to Beijing tomorrow." },
      { chinese: "他昨天没来。", pinyin: "Tā zuótiān méi lái.", english: "He didn't come yesterday." },
    ],
  },
  {
    id: "h1-11", level: 1, category: "prepositions",
    pattern: "在", name: "Location with 在",
    explanation: "在 indicates location, meaning 'at/in/on'.",
    structure: "Subject + 在 + Place + Verb",
    examples: [
      { chinese: "我在家吃饭。", pinyin: "Wǒ zài jiā chīfàn.", english: "I eat at home." },
      { chinese: "他在学校学习。", pinyin: "Tā zài xuéxiào xuéxí.", english: "He studies at school." },
    ],
  },
  {
    id: "h1-12", level: 1, category: "auxiliary-verbs",
    pattern: "想/要", name: "Want to with 想/要",
    explanation: "想 (want to/would like to) and 要 (want/will) express desire or intention.",
    structure: "Subject + 想/要 + Verb + Object",
    examples: [
      { chinese: "我想喝水。", pinyin: "Wǒ xiǎng hē shuǐ.", english: "I want to drink water." },
      { chinese: "她要去商店。", pinyin: "Tā yào qù shāngdiàn.", english: "She wants to go to the store." },
    ],
  },
  {
    id: "h1-13", level: 1, category: "auxiliary-verbs",
    pattern: "会/能/可以", name: "Can/able to",
    explanation: "会 (learned ability), 能 (physical ability/permission), 可以 (permission/possibility).",
    structure: "Subject + 会/能/可以 + Verb",
    examples: [
      { chinese: "我会说中文。", pinyin: "Wǒ huì shuō Zhōngwén.", english: "I can speak Chinese." },
      { chinese: "你可以坐这儿。", pinyin: "Nǐ kěyǐ zuò zhèr.", english: "You can sit here." },
    ],
  },
  {
    id: "h1-14", level: 1, category: "special-structures",
    pattern: "也/都", name: "Also/All with 也 and 都",
    explanation: "也 means 'also/too', 都 means 'all/both'. They come before the verb.",
    structure: "Subject + 也/都 + Verb",
    examples: [
      { chinese: "我也喜欢。", pinyin: "Wǒ yě xǐhuan.", english: "I also like it." },
      { chinese: "他们都是学生。", pinyin: "Tāmen dōu shì xuéshēng.", english: "They are all students." },
    ],
  },
  {
    id: "h1-15", level: 1, category: "particles",
    pattern: "呢", name: "Follow-up questions with 呢",
    explanation: "呢 is used to ask a follow-up question or ask 'what about...?'",
    structure: "Noun/Pronoun + 呢？",
    examples: [
      { chinese: "我很好，你呢？", pinyin: "Wǒ hěn hǎo, nǐ ne?", english: "I'm fine, and you?" },
      { chinese: "他去了，她呢？", pinyin: "Tā qù le, tā ne?", english: "He went, what about her?" },
    ],
  },
];
