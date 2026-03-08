import { GrammarPoint } from "./grammarTypes";

export const hsk2Grammar: GrammarPoint[] = [
  {
    id: "h2-01", level: 2, category: "time",
    pattern: "正在...呢", name: "Progressive aspect",
    explanation: "Indicates an action is currently in progress, similar to '-ing' in English.",
    structure: "Subject + 正在 + Verb + (Object) + 呢",
    examples: [
      { chinese: "他正在看书呢。", pinyin: "Tā zhèngzài kàn shū ne.", english: "He is reading a book." },
      { chinese: "我正在吃饭呢。", pinyin: "Wǒ zhèngzài chīfàn ne.", english: "I am eating." },
    ],
  },
  {
    id: "h2-02", level: 2, category: "time",
    pattern: "过", name: "Experience with 过",
    explanation: "过 after a verb indicates having experienced something at least once.",
    structure: "Subject + Verb + 过 + Object",
    examples: [
      { chinese: "我去过中国。", pinyin: "Wǒ qù guo Zhōngguó.", english: "I have been to China." },
      { chinese: "你吃过北京烤鸭吗？", pinyin: "Nǐ chī guo Běijīng kǎoyā ma?", english: "Have you eaten Peking duck?" },
    ],
  },
  {
    id: "h2-03", level: 2, category: "comparison",
    pattern: "比", name: "Comparison with 比",
    explanation: "比 is used to compare two things. The adjective comes after the second item.",
    structure: "A + 比 + B + Adjective",
    examples: [
      { chinese: "他比我高。", pinyin: "Tā bǐ wǒ gāo.", english: "He is taller than me." },
      { chinese: "今天比昨天冷。", pinyin: "Jīntiān bǐ zuótiān lěng.", english: "Today is colder than yesterday." },
    ],
  },
  {
    id: "h2-04", level: 2, category: "complement",
    pattern: "得", name: "Degree complement with 得",
    explanation: "得 connects a verb to a complement describing how well the action was done.",
    structure: "Verb + 得 + Adjective/Description",
    examples: [
      { chinese: "她唱得很好。", pinyin: "Tā chàng de hěn hǎo.", english: "She sings very well." },
      { chinese: "你说得太快了。", pinyin: "Nǐ shuō de tài kuài le.", english: "You speak too fast." },
    ],
  },
  {
    id: "h2-05", level: 2, category: "adverbs",
    pattern: "就/才", name: "Emphasis with 就 and 才",
    explanation: "就 implies something happened sooner/easier than expected; 才 implies later/harder.",
    structure: "Subject + 就/才 + Verb",
    examples: [
      { chinese: "他八点就来了。", pinyin: "Tā bā diǎn jiù lái le.", english: "He came as early as 8." },
      { chinese: "她十点才来。", pinyin: "Tā shí diǎn cái lái.", english: "She didn't come until 10." },
    ],
  },
  {
    id: "h2-06", level: 2, category: "conjunctions",
    pattern: "因为...所以...", name: "Because... therefore...",
    explanation: "因为 introduces the cause and 所以 introduces the result.",
    structure: "因为 + Cause, 所以 + Result",
    examples: [
      { chinese: "因为下雨了，所以我没出去。", pinyin: "Yīnwèi xià yǔ le, suǒyǐ wǒ méi chūqù.", english: "Because it rained, I didn't go out." },
      { chinese: "因为太贵了，所以我没买。", pinyin: "Yīnwèi tài guì le, suǒyǐ wǒ méi mǎi.", english: "Because it was too expensive, I didn't buy it." },
    ],
  },
  {
    id: "h2-07", level: 2, category: "conjunctions",
    pattern: "虽然...但是...", name: "Although... but...",
    explanation: "虽然 introduces a concession and 但是 introduces the contrast.",
    structure: "虽然 + Concession, 但是 + Contrast",
    examples: [
      { chinese: "虽然很累，但是很开心。", pinyin: "Suīrán hěn lèi, dànshì hěn kāixīn.", english: "Although tired, I'm very happy." },
      { chinese: "虽然贵，但是质量好。", pinyin: "Suīrán guì, dànshì zhìliàng hǎo.", english: "Although expensive, the quality is good." },
    ],
  },
  {
    id: "h2-08", level: 2, category: "prepositions",
    pattern: "从...到...", name: "From... to...",
    explanation: "从 marks the starting point and 到 marks the ending point (time or place).",
    structure: "从 + Start + 到 + End",
    examples: [
      { chinese: "从北京到上海。", pinyin: "Cóng Běijīng dào Shànghǎi.", english: "From Beijing to Shanghai." },
      { chinese: "从早上到晚上。", pinyin: "Cóng zǎoshang dào wǎnshang.", english: "From morning to evening." },
    ],
  },
  {
    id: "h2-09", level: 2, category: "special-structures",
    pattern: "要...了", name: "About to happen with 要...了",
    explanation: "Indicates something is about to happen soon.",
    structure: "Subject + 要 + Verb + 了",
    examples: [
      { chinese: "火车要开了。", pinyin: "Huǒchē yào kāi le.", english: "The train is about to depart." },
      { chinese: "要下雨了。", pinyin: "Yào xià yǔ le.", english: "It's about to rain." },
    ],
  },
  {
    id: "h2-10", level: 2, category: "special-structures",
    pattern: "...的时候", name: "When... / At the time of...",
    explanation: "...的时候 is used to express 'when' or 'at the time of' an event.",
    structure: "Verb/Clause + 的时候",
    examples: [
      { chinese: "吃饭的时候不要说话。", pinyin: "Chīfàn de shíhou bùyào shuōhuà.", english: "Don't talk while eating." },
      { chinese: "我小的时候住在北京。", pinyin: "Wǒ xiǎo de shíhou zhù zài Běijīng.", english: "When I was young, I lived in Beijing." },
    ],
  },
  {
    id: "h2-11", level: 2, category: "adverbs",
    pattern: "最", name: "Superlative with 最",
    explanation: "最 means 'most' and is placed before an adjective to form the superlative.",
    structure: "最 + Adjective",
    examples: [
      { chinese: "她是最漂亮的。", pinyin: "Tā shì zuì piàoliang de.", english: "She is the most beautiful." },
      { chinese: "我最喜欢夏天。", pinyin: "Wǒ zuì xǐhuan xiàtiān.", english: "I like summer the most." },
    ],
  },
  {
    id: "h2-12", level: 2, category: "prepositions",
    pattern: "给", name: "For/To with 给",
    explanation: "给 means 'to give' or is used as a preposition meaning 'for/to someone'.",
    structure: "Subject + 给 + Person + Verb + Object",
    examples: [
      { chinese: "请给我一杯水。", pinyin: "Qǐng gěi wǒ yī bēi shuǐ.", english: "Please give me a glass of water." },
      { chinese: "妈妈给我做饭。", pinyin: "Māma gěi wǒ zuòfàn.", english: "Mom cooks for me." },
    ],
  },
  {
    id: "h2-13", level: 2, category: "complement",
    pattern: "到", name: "Result complement 到",
    explanation: "到 after a verb indicates the action reached a result or destination.",
    structure: "Verb + 到 + Result/Place",
    examples: [
      { chinese: "我找到了我的钥匙。", pinyin: "Wǒ zhǎodào le wǒ de yàoshi.", english: "I found my keys." },
      { chinese: "他学到了很多。", pinyin: "Tā xuédào le hěn duō.", english: "He learned a lot." },
    ],
  },
  {
    id: "h2-14", level: 2, category: "special-structures",
    pattern: "一边...一边...", name: "Doing two things at once",
    explanation: "一边...一边... indicates two actions happening simultaneously.",
    structure: "Subject + 一边 + V1 + 一边 + V2",
    examples: [
      { chinese: "他一边吃饭一边看电视。", pinyin: "Tā yībiān chīfàn yībiān kàn diànshì.", english: "He eats while watching TV." },
      { chinese: "我一边走一边想。", pinyin: "Wǒ yībiān zǒu yībiān xiǎng.", english: "I think while walking." },
    ],
  },
  {
    id: "h2-15", level: 2, category: "questions",
    pattern: "多 + Adj", name: "How (question) with 多",
    explanation: "多 before an adjective asks about degree: how tall, how old, etc.",
    structure: "多 + Adjective?",
    examples: [
      { chinese: "你多大了？", pinyin: "Nǐ duō dà le?", english: "How old are you?" },
      { chinese: "这条河多长？", pinyin: "Zhè tiáo hé duō cháng?", english: "How long is this river?" },
    ],
  },
];
