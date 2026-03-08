import { GrammarPoint } from "./grammarTypes";

export const hsk4Grammar: GrammarPoint[] = [
  {
    id: "h4-01", level: 4, category: "causative",
    pattern: "让/使/叫", name: "Causative — make/let someone do",
    explanation: "让/使/叫 indicate that someone causes or allows another person to do something.",
    structure: "Subject + 让/使/叫 + Person + Verb",
    examples: [
      { chinese: "老师让我们写作业。", pinyin: "Lǎoshī ràng wǒmen xiě zuòyè.", english: "The teacher asked us to do homework." },
      { chinese: "这个消息使我很高兴。", pinyin: "Zhège xiāoxi shǐ wǒ hěn gāoxìng.", english: "This news made me happy." },
    ],
  },
  {
    id: "h4-02", level: 4, category: "conjunctions",
    pattern: "不管...都...", name: "No matter... all...",
    explanation: "不管 introduces a condition that doesn't affect the outcome.",
    structure: "不管 + Condition, Subject + 都 + Result",
    examples: [
      { chinese: "不管多忙，我都要锻炼。", pinyin: "Bùguǎn duō máng, wǒ dōu yào duànliàn.", english: "No matter how busy, I still exercise." },
      { chinese: "不管天气怎么样，他都出去。", pinyin: "Bùguǎn tiānqì zěnmeyàng, tā dōu chūqù.", english: "No matter the weather, he goes out." },
    ],
  },
  {
    id: "h4-03", level: 4, category: "conjunctions",
    pattern: "既然...就...", name: "Since... then...",
    explanation: "既然 states a known fact; 就 draws the logical conclusion.",
    structure: "既然 + Fact, (Subject) + 就 + Conclusion",
    examples: [
      { chinese: "既然你来了，就多待一会儿吧。", pinyin: "Jìrán nǐ lái le, jiù duō dāi yīhuìr ba.", english: "Since you're here, stay a while." },
      { chinese: "既然决定了，就不要后悔。", pinyin: "Jìrán juédìng le, jiù búyào hòuhuǐ.", english: "Since you decided, don't regret it." },
    ],
  },
  {
    id: "h4-04", level: 4, category: "conjunctions",
    pattern: "只要...就...", name: "As long as... then...",
    explanation: "只要 gives a sufficient condition for the result with 就.",
    structure: "只要 + Condition, Subject + 就 + Result",
    examples: [
      { chinese: "只要努力，就会成功。", pinyin: "Zhǐyào nǔlì, jiù huì chénggōng.", english: "As long as you work hard, you'll succeed." },
      { chinese: "只要你开心，我就满意。", pinyin: "Zhǐyào nǐ kāixīn, wǒ jiù mǎnyì.", english: "As long as you're happy, I'm satisfied." },
    ],
  },
  {
    id: "h4-05", level: 4, category: "conjunctions",
    pattern: "即使...也...", name: "Even if... still...",
    explanation: "即使 introduces a hypothetical concession; 也 shows it doesn't affect the result.",
    structure: "即使 + Hypothetical, Subject + 也 + Result",
    examples: [
      { chinese: "即使很难，我也不放弃。", pinyin: "Jíshǐ hěn nán, wǒ yě bú fàngqì.", english: "Even if it's hard, I won't give up." },
      { chinese: "即使下雨，比赛也会继续。", pinyin: "Jíshǐ xià yǔ, bǐsài yě huì jìxù.", english: "Even if it rains, the match will continue." },
    ],
  },
  {
    id: "h4-06", level: 4, category: "complement",
    pattern: "可能补语", name: "Potential complements",
    explanation: "Verb + 得/不 + Complement expresses ability or inability to achieve a result.",
    structure: "Verb + 得/不 + Complement",
    examples: [
      { chinese: "我看得见。", pinyin: "Wǒ kàn de jiàn.", english: "I can see it." },
      { chinese: "这个字我写不好。", pinyin: "Zhège zì wǒ xiě bù hǎo.", english: "I can't write this character well." },
      { chinese: "你听得懂吗？", pinyin: "Nǐ tīng de dǒng ma?", english: "Can you understand?" },
    ],
  },
  {
    id: "h4-07", level: 4, category: "special-structures",
    pattern: "越...越...", name: "The more... the more...",
    explanation: "越 A 越 B means the more A, the more B.",
    structure: "越 + A + 越 + B",
    examples: [
      { chinese: "越吃越胖。", pinyin: "Yuè chī yuè pàng.", english: "The more you eat, the fatter you get." },
      { chinese: "中文越学越有意思。", pinyin: "Zhōngwén yuè xué yuè yǒu yìsi.", english: "The more you study Chinese, the more interesting it gets." },
    ],
  },
  {
    id: "h4-08", level: 4, category: "emphasis",
    pattern: "不是...而是...", name: "Not A, but rather B",
    explanation: "Used to correct a misunderstanding or clarify a point.",
    structure: "不是 + A + 而是 + B",
    examples: [
      { chinese: "我不是不想去，而是没时间。", pinyin: "Wǒ búshì bù xiǎng qù, érshì méi shíjiān.", english: "It's not that I don't want to go, it's that I don't have time." },
      { chinese: "问题不是钱，而是时间。", pinyin: "Wèntí búshì qián, érshì shíjiān.", english: "The problem isn't money, it's time." },
    ],
  },
  {
    id: "h4-09", level: 4, category: "special-structures",
    pattern: "对...来说", name: "For/To someone",
    explanation: "对...来说 means 'for someone' or 'from the perspective of someone'.",
    structure: "对 + Person + 来说",
    examples: [
      { chinese: "对我来说，这很重要。", pinyin: "Duì wǒ lái shuō, zhè hěn zhòngyào.", english: "For me, this is very important." },
      { chinese: "对外国人来说，汉字很难。", pinyin: "Duì wàiguó rén lái shuō, hànzì hěn nán.", english: "For foreigners, Chinese characters are hard." },
    ],
  },
  {
    id: "h4-10", level: 4, category: "special-structures",
    pattern: "拿...来说", name: "Take... as an example",
    explanation: "Used to introduce an example to illustrate a point.",
    structure: "拿 + Example + 来说",
    examples: [
      { chinese: "拿中国来说，方言很多。", pinyin: "Ná Zhōngguó lái shuō, fāngyán hěn duō.", english: "Take China for example, there are many dialects." },
      { chinese: "拿我自己来说，我每天学习两个小时。", pinyin: "Ná wǒ zìjǐ lái shuō, wǒ měitiān xuéxí liǎng gè xiǎoshí.", english: "Take myself for example, I study two hours a day." },
    ],
  },
  {
    id: "h4-11", level: 4, category: "prepositions",
    pattern: "关于", name: "About/Regarding",
    explanation: "关于 means 'about' or 'regarding' and introduces the topic.",
    structure: "关于 + Topic, ...",
    examples: [
      { chinese: "关于这个问题，我有不同的看法。", pinyin: "Guānyú zhège wèntí, wǒ yǒu bùtóng de kànfǎ.", english: "Regarding this issue, I have a different opinion." },
      { chinese: "关于中国文化，你了解多少？", pinyin: "Guānyú Zhōngguó wénhuà, nǐ liǎojiě duōshao?", english: "How much do you know about Chinese culture?" },
    ],
  },
  {
    id: "h4-12", level: 4, category: "adverbs",
    pattern: "到底", name: "On earth / After all",
    explanation: "到底 adds emphasis to a question, expressing impatience or insistence.",
    structure: "Subject + 到底 + Question",
    examples: [
      { chinese: "你到底去不去？", pinyin: "Nǐ dàodǐ qù bú qù?", english: "Are you going or not?" },
      { chinese: "到底发生了什么？", pinyin: "Dàodǐ fāshēng le shénme?", english: "What on earth happened?" },
    ],
  },
  {
    id: "h4-13", level: 4, category: "special-structures",
    pattern: "据说", name: "It is said that...",
    explanation: "据说 introduces hearsay or reported information.",
    structure: "据说 + Statement",
    examples: [
      { chinese: "据说明天会下雪。", pinyin: "Jùshuō míngtiān huì xià xuě.", english: "It is said that it will snow tomorrow." },
      { chinese: "据说这家餐厅很有名。", pinyin: "Jùshuō zhè jiā cāntīng hěn yǒumíng.", english: "It is said this restaurant is famous." },
    ],
  },
  {
    id: "h4-14", level: 4, category: "special-structures",
    pattern: "反而", name: "On the contrary",
    explanation: "反而 indicates a result opposite to what was expected.",
    structure: "Subject + 反而 + Unexpected Result",
    examples: [
      { chinese: "我帮了他，他反而生气了。", pinyin: "Wǒ bāng le tā, tā fǎn'ér shēngqì le.", english: "I helped him, but he got angry instead." },
      { chinese: "吃了药，病反而更重了。", pinyin: "Chī le yào, bìng fǎn'ér gèng zhòng le.", english: "After taking medicine, the illness got worse instead." },
    ],
  },
  {
    id: "h4-15", level: 4, category: "adverbs",
    pattern: "恐怕", name: "I'm afraid that...",
    explanation: "恐怕 softens a negative prediction or unwanted result.",
    structure: "恐怕 + Statement",
    examples: [
      { chinese: "恐怕来不及了。", pinyin: "Kǒngpà lái bù jí le.", english: "I'm afraid it's too late." },
      { chinese: "恐怕他不会同意。", pinyin: "Kǒngpà tā bú huì tóngyì.", english: "I'm afraid he won't agree." },
    ],
  },
];
