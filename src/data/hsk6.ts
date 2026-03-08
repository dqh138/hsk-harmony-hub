import { GrammarPoint } from "./grammarTypes";

export const hsk6Grammar: GrammarPoint[] = [
  {
    id: "h6-01", level: 6, category: "formal-expressions",
    pattern: "以免", name: "以免 — so as to avoid",
    explanation: "以免 introduces the undesirable result that the previous action aims to prevent.",
    structure: "Action, 以免 + Undesirable Result",
    examples: [
      { chinese: "多穿点，以免感冒。", pinyin: "Duō chuān diǎn, yǐmiǎn gǎnmào.", english: "Dress warmly to avoid catching a cold." },
      { chinese: "早点出发，以免迟到。", pinyin: "Zǎo diǎn chūfā, yǐmiǎn chídào.", english: "Leave early to avoid being late." },
    ],
  },
  {
    id: "h6-02", level: 6, category: "formal-expressions",
    pattern: "何必", name: "何必 — Why bother",
    explanation: "何必 is a rhetorical expression meaning something is unnecessary.",
    structure: "何必 + Verb/Action",
    examples: [
      { chinese: "何必那么着急呢？", pinyin: "Hébì nàme zhāojí ne?", english: "Why bother being so anxious?" },
      { chinese: "何必跟他生气？", pinyin: "Hébì gēn tā shēngqì?", english: "Why bother getting angry with him?" },
    ],
  },
  {
    id: "h6-03", level: 6, category: "formal-expressions",
    pattern: "与其说...不如说...", name: "Rather than saying... better to say...",
    explanation: "A more nuanced comparison — reframing how to describe something.",
    structure: "与其说 + A, 不如说 + B",
    examples: [
      { chinese: "与其说他聪明，不如说他勤奋。", pinyin: "Yǔqí shuō tā cōngming, bùrú shuō tā qínfèn.", english: "Rather than saying he's smart, better to say he's hardworking." },
      { chinese: "与其说是运气，不如说是实力。", pinyin: "Yǔqí shuō shì yùnqi, bùrú shuō shì shílì.", english: "Rather than luck, it's really skill." },
    ],
  },
  {
    id: "h6-04", level: 6, category: "complex-structures",
    pattern: "非...不可", name: "Must / Have to (emphatic)",
    explanation: "非...不可 is an emphatic way to say something must happen.",
    structure: "非 + Verb + 不可",
    examples: [
      { chinese: "这件事非做不可。", pinyin: "Zhè jiàn shì fēi zuò bùkě.", english: "This must be done." },
      { chinese: "今天非去不可。", pinyin: "Jīntiān fēi qù bùkě.", english: "I absolutely must go today." },
    ],
  },
  {
    id: "h6-05", level: 6, category: "complex-structures",
    pattern: "无论如何", name: "No matter what / In any case",
    explanation: "无论如何 means 'regardless of circumstances'.",
    structure: "无论如何, Subject + 都/也 + Verb",
    examples: [
      { chinese: "无论如何，我都会支持你。", pinyin: "Wúlùn rúhé, wǒ dōu huì zhīchí nǐ.", english: "No matter what, I will support you." },
      { chinese: "无论如何，你得去试试。", pinyin: "Wúlùn rúhé, nǐ děi qù shìshi.", english: "No matter what, you have to try." },
    ],
  },
  {
    id: "h6-06", level: 6, category: "complex-structures",
    pattern: "岂不是", name: "Wouldn't that be... (rhetorical)",
    explanation: "岂不是 asks a rhetorical question implying the obvious answer.",
    structure: "岂不是 + Result + 吗？",
    examples: [
      { chinese: "那岂不是浪费时间吗？", pinyin: "Nà qǐ búshì làngfèi shíjiān ma?", english: "Wouldn't that be a waste of time?" },
      { chinese: "岂不是更好吗？", pinyin: "Qǐ búshì gèng hǎo ma?", english: "Wouldn't that be even better?" },
    ],
  },
  {
    id: "h6-07", level: 6, category: "formal-expressions",
    pattern: "势必", name: "势必 — is bound to",
    explanation: "势必 indicates something is an inevitable consequence.",
    structure: "Subject + 势必 + Result",
    examples: [
      { chinese: "这样做势必引起争议。", pinyin: "Zhèyàng zuò shìbì yǐnqǐ zhēngyì.", english: "Doing this will inevitably cause controversy." },
      { chinese: "环境污染势必影响健康。", pinyin: "Huánjìng wūrǎn shìbì yǐngxiǎng jiànkāng.", english: "Pollution is bound to affect health." },
    ],
  },
  {
    id: "h6-08", level: 6, category: "complex-structures",
    pattern: "就...而言", name: "In terms of / As far as... is concerned",
    explanation: "就...而言 narrows the scope of discussion to a specific aspect.",
    structure: "就 + Aspect + 而言",
    examples: [
      { chinese: "就价格而言，这个很便宜。", pinyin: "Jiù jiàgé ér yán, zhège hěn piányi.", english: "In terms of price, this is very cheap." },
      { chinese: "就目前情况而言，前景不错。", pinyin: "Jiù mùqián qíngkuàng ér yán, qiánjǐng búcuò.", english: "As far as the current situation goes, the outlook is good." },
    ],
  },
  {
    id: "h6-09", level: 6, category: "formal-expressions",
    pattern: "总而言之", name: "总而言之 — In conclusion",
    explanation: "总而言之 is used to summarize or conclude a discussion.",
    structure: "总而言之, + Summary",
    examples: [
      { chinese: "总而言之，学习需要坚持。", pinyin: "Zǒng ér yán zhī, xuéxí xūyào jiānchí.", english: "In conclusion, studying requires persistence." },
      { chinese: "总而言之，我们需要更多时间。", pinyin: "Zǒng ér yán zhī, wǒmen xūyào gèng duō shíjiān.", english: "In conclusion, we need more time." },
    ],
  },
  {
    id: "h6-10", level: 6, category: "complex-structures",
    pattern: "不可避免", name: "Unavoidable / Inevitable",
    explanation: "不可避免 is used to describe something that cannot be prevented.",
    structure: "Subject + 不可避免地 + Verb",
    examples: [
      { chinese: "全球化不可避免地影响每个国家。", pinyin: "Quánqiúhuà bùkě bìmiǎn de yǐngxiǎng měi gè guójiā.", english: "Globalization inevitably affects every country." },
      { chinese: "变化是不可避免的。", pinyin: "Biànhuà shì bùkě bìmiǎn de.", english: "Change is inevitable." },
    ],
  },
  {
    id: "h6-11", level: 6, category: "rhetoric",
    pattern: "无非", name: "无非 — Nothing more than",
    explanation: "无非 downplays something, saying it's merely or nothing but.",
    structure: "无非 + (是) + Explanation",
    examples: [
      { chinese: "他无非是想让你帮忙。", pinyin: "Tā wúfēi shì xiǎng ràng nǐ bāngmáng.", english: "He merely wants your help." },
      { chinese: "无非就是两个选择。", pinyin: "Wúfēi jiùshì liǎng gè xuǎnzé.", english: "It's nothing more than two choices." },
    ],
  },
  {
    id: "h6-12", level: 6, category: "rhetoric",
    pattern: "不过是...罢了", name: "Merely... that's all",
    explanation: "不过是...罢了 minimizes the significance of something.",
    structure: "不过是 + Statement + 罢了",
    examples: [
      { chinese: "不过是开个玩笑罢了。", pinyin: "Búguò shì kāi gè wánxiào bàle.", english: "It's merely a joke, that's all." },
      { chinese: "不过是小事罢了。", pinyin: "Búguò shì xiǎoshì bàle.", english: "It's just a small matter, that's all." },
    ],
  },
  {
    id: "h6-13", level: 6, category: "formal-expressions",
    pattern: "乃至", name: "乃至 — and even / even to the extent of",
    explanation: "乃至 escalates from one thing to an even more extreme example.",
    structure: "A, 乃至 + B (more extreme)",
    examples: [
      { chinese: "这影响了整个城市，乃至全国。", pinyin: "Zhè yǐngxiǎng le zhěnggè chéngshì, nǎizhì quánguó.", english: "This affected the entire city, and even the whole country." },
      { chinese: "他的作品影响了亚洲，乃至世界。", pinyin: "Tā de zuòpǐn yǐngxiǎng le Yàzhōu, nǎizhì shìjiè.", english: "His works influenced Asia, and even the world." },
    ],
  },
  {
    id: "h6-14", level: 6, category: "complex-structures",
    pattern: "归根结底", name: "归根结底 — At the root / Ultimately",
    explanation: "归根结底 gets to the fundamental cause or conclusion.",
    structure: "归根结底, + Core Statement",
    examples: [
      { chinese: "归根结底，还是教育的问题。", pinyin: "Guīgēn jiédǐ, háishì jiàoyù de wèntí.", english: "At the root, it's still an education issue." },
      { chinese: "归根结底，成功靠的是努力。", pinyin: "Guīgēn jiédǐ, chénggōng kào de shì nǔlì.", english: "Ultimately, success depends on effort." },
    ],
  },
  {
    id: "h6-15", level: 6, category: "formal-expressions",
    pattern: "有目共睹", name: "有目共睹 — Obvious to all",
    explanation: "有目共睹 means something is clear for everyone to see.",
    structure: "Subject + 是有目共睹的",
    examples: [
      { chinese: "中国的发展是有目共睹的。", pinyin: "Zhōngguó de fāzhǎn shì yǒumù gòngdǔ de.", english: "China's development is obvious to all." },
      { chinese: "他的努力是有目共睹的。", pinyin: "Tā de nǔlì shì yǒumù gòngdǔ de.", english: "His efforts are visible to everyone." },
    ],
  },
];
