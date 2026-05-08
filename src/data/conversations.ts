import type { Conversation } from "./conversationTypes";

export const conversationsBeginner: Conversation[] = [
  {
    id: "b1",
    level: "beginner",
    title: `\u521d\u6b21\u89c1\u9762`,
    titleVi: "Lần đầu gặp mặt",
    description: "Chào hỏi và giới thiệu bản thân.",
    lines: [
      { speaker: "A", hanzi: `\u4f60\u597d\uff01`, pinyin: "nǐ hǎo!", vi: "Xin chào!" },
      { speaker: "B", hanzi: `\u4f60\u597d\uff01\u4f60\u53eb\u4ec0\u4e48\u540d\u5b57\uff1f`, pinyin: "nǐ hǎo! nǐ jiào shénme míngzi?", vi: "Chào bạn! Bạn tên là gì?" },
      { speaker: "A", hanzi: `\u6211\u53eb\u674e\u660e\u3002\u4f60\u5462\uff1f`, pinyin: "wǒ jiào Lǐ Míng. nǐ ne?", vi: "Mình tên Lý Minh. Còn bạn?" },
      { speaker: "B", hanzi: `\u6211\u53eb\u738b\u5c0f\u96e8\u3002\u5f88\u9ad8\u5174\u8ba4\u8bc6\u4f60\u3002`, pinyin: "wǒ jiào Wáng Xiǎoyǔ. hěn gāoxìng rènshi nǐ.", vi: "Mình tên Vương Tiểu Vũ. Rất vui được gặp bạn." },
    ],
  },
  {
    id: "b2",
    level: "beginner",
    title: `\u4e70\u4e1c\u897f`,
    titleVi: "Mua đồ",
    lines: [
      { speaker: "A", hanzi: `\u8fd9\u4e2a\u591a\u5c11\u94b1\uff1f`, pinyin: "zhège duōshao qián?", vi: "Cái này bao nhiêu tiền?" },
      { speaker: "B", hanzi: `\u4e94\u5341\u5757\u3002`, pinyin: "wǔshí kuài.", vi: "Năm mươi tệ." },
      { speaker: "A", hanzi: `\u592a\u8d35\u4e86\uff0c\u4fbf\u5b9c\u4e00\u70b9\u513f\u5427\u3002`, pinyin: "tài guì le, piányi yìdiǎnr ba.", vi: "Đắt quá, rẻ một chút đi." },
      { speaker: "B", hanzi: `\u597d\u7684\uff0c\u56db\u5341\u5757\u3002`, pinyin: "hǎo de, sìshí kuài.", vi: "Được, bốn mươi tệ." },
    ],
  },
];

export const conversationsIntermediate: Conversation[] = [
  {
    id: "i1",
    level: "intermediate",
    title: `\u8ba8\u8bba\u5468\u672b\u8ba1\u5212`,
    titleVi: "Bàn về kế hoạch cuối tuần",
    lines: [
      { speaker: "A", hanzi: `\u8fd9\u4e2a\u5468\u672b\u4f60\u6709\u4ec0\u4e48\u8ba1\u5212\uff1f`, pinyin: "zhège zhōumò nǐ yǒu shénme jìhuà?", vi: "Cuối tuần này bạn có kế hoạch gì?" },
      { speaker: "B", hanzi: `\u6211\u6253\u7b97\u53bb\u722c\u5c71\uff0c\u4f60\u8981\u4e0d\u8981\u4e00\u8d77\u53bb\uff1f`, pinyin: "wǒ dǎsuàn qù páshān, nǐ yào bú yào yìqǐ qù?", vi: "Mình định đi leo núi, bạn có muốn đi cùng không?" },
      { speaker: "A", hanzi: `\u542c\u8d77\u6765\u4e0d\u9519\uff0c\u4f46\u5929\u6c14\u4e0d\u592a\u597d\u3002`, pinyin: "tīng qǐlai bú cuò, dàn tiānqì bú tài hǎo.", vi: "Nghe hay đấy nhưng thời tiết không tốt lắm." },
      { speaker: "B", hanzi: `\u90a3\u6211\u4eec\u6539\u53bb\u770b\u7535\u5f71\u5427\u3002`, pinyin: "nà wǒmen gǎi qù kàn diànyǐng ba.", vi: "Vậy chúng ta đổi đi xem phim đi." },
    ],
  },
  {
    id: "i2",
    level: "intermediate",
    title: `\u70b9\u83dc`,
    titleVi: "Gọi món",
    lines: [
      { speaker: "A", hanzi: `\u670d\u52a1\u5458\uff0c\u8bf7\u62ff\u83dc\u5355\u3002`, pinyin: "fúwùyuán, qǐng ná càidān.", vi: "Nhân viên ơi, làm ơn cho thực đơn." },
      { speaker: "B", hanzi: `\u597d\u7684\uff0c\u4e24\u4f4d\u60f3\u5403\u70b9\u4ec0\u4e48\uff1f`, pinyin: "hǎo de, liǎng wèi xiǎng chī diǎn shénme?", vi: "Vâng, hai vị muốn ăn gì ạ?" },
      { speaker: "A", hanzi: `\u6765\u4e00\u4e2a\u5bab\u4fdd\u9e21\u4e01\u548c\u4e00\u78df\u9c7c\u9999\u8302\u5b50\u3002`, pinyin: "lái yíge gōngbǎo jīdīng hé yì pán yúxiāng qiézi.", vi: "Cho một đĩa gà Cung Bảo và một đĩa cà tím xào." },
      { speaker: "B", hanzi: `\u8981\u996e\u6599\u5417\uff1f`, pinyin: "yào yǐnliào ma?", vi: "Có cần đồ uống không ạ?" },
    ],
  },
];

export const conversationsAdvanced: Conversation[] = [
  {
    id: "a1",
    level: "advanced",
    title: `\u73af\u5883\u4fdd\u62a4`,
    titleVi: "Bảo vệ môi trường",
    lines: [
      { speaker: "A", hanzi: `\u968f\u7740\u5de5\u4e1a\u5316\u7684\u53d1\u5c55\uff0c\u73af\u5883\u95ee\u9898\u8d8a\u6765\u8d8a\u4e25\u91cd\u3002`, pinyin: "suízhe gōngyèhuà de fāzhǎn, huánjìng wèntí yuè lái yuè yánzhòng.", vi: "Cùng với sự phát triển của công nghiệp hóa, vấn đề môi trường ngày càng nghiêm trọng." },
      { speaker: "B", hanzi: `\u6211\u8ba4\u4e3a\u653f\u5e9c\u5e94\u8be5\u51fa\u53f0\u66f4\u4e25\u683c\u7684\u6cd5\u89c4\u3002`, pinyin: "wǒ rènwéi zhèngfǔ yīnggāi chūtái gèng yángé de fǎguī.", vi: "Tôi cho rằng chính phủ nên ban hành các quy định nghiêm khắc hơn." },
      { speaker: "A", hanzi: `\u540c\u65f6\u4f01\u4e1a\u4e5f\u5e94\u5f53\u627f\u62c5\u76f8\u5e94\u7684\u793e\u4f1a\u8d23\u4efb\u3002`, pinyin: "tóngshí qǐyè yě yīngdāng chéngdān xiāngyìng de shèhuì zérèn.", vi: "Đồng thời doanh nghiệp cũng nên gánh vác trách nhiệm xã hội tương ứng." },
      { speaker: "B", hanzi: `\u6ca1\u9519\uff0c\u53ea\u6709\u591a\u65b9\u5408\u4f5c\u624d\u80fd\u89e3\u51b3\u8fd9\u4e2a\u95ee\u9898\u3002`, pinyin: "méi cuò, zhǐyǒu duōfāng hézuò cái néng jiějué zhège wèntí.", vi: "Đúng vậy, chỉ có hợp tác đa phương mới có thể giải quyết vấn đề này." },
    ],
  },
  {
    id: "a2",
    level: "advanced",
    title: `\u804c\u4e1a\u53d1\u5c55`,
    titleVi: "Phát triển sự nghiệp",
    lines: [
      { speaker: "A", hanzi: `\u6700\u8fd1\u6211\u5728\u8003\u8651\u662f\u5426\u8981\u8df3\u69fd\u3002`, pinyin: "zuìjìn wǒ zài kǎolǜ shìfǒu yào tiàocáo.", vi: "Gần đây tôi đang cân nhắc có nên nhảy việc không." },
      { speaker: "B", hanzi: `\u4f60\u5bf9\u73b0\u5728\u7684\u5de5\u4f5c\u6709\u4ec0\u4e48\u4e0d\u6ee1\u610f\u7684\u5730\u65b9\uff1f`, pinyin: "nǐ duì xiànzài de gōngzuò yǒu shénme bù mǎnyì de dìfang?", vi: "Bạn không hài lòng điều gì với công việc hiện tại?" },
      { speaker: "A", hanzi: `\u53d1\u5c55\u7a7a\u95f4\u6709\u9650\uff0c\u800c\u4e14\u85aa\u8d44\u4e5f\u4e0d\u5982\u540c\u884c\u3002`, pinyin: "fāzhǎn kōngjiān yǒuxiàn, érqiě xīnzī yě bùrú tóngháng.", vi: "Không gian phát triển hạn chế, lương cũng không bằng đồng nghiệp cùng ngành." },
      { speaker: "B", hanzi: `\u90a3\u4f60\u53ef\u4ee5\u5148\u8bd5\u8bd5\u9762\u8bd5\uff0c\u518d\u505a\u51b3\u5b9a\u3002`, pinyin: "nà nǐ kěyǐ xiān shìshi miànshì, zài zuò juédìng.", vi: "Vậy bạn có thể thử phỏng vấn trước rồi quyết định." },
    ],
  },
];

export function getAllConversations(): Conversation[] {
  return [...conversationsBeginner, ...conversationsIntermediate, ...conversationsAdvanced];
}

export function getConversationsByLevel(level: string): Conversation[] {
  if (level === "beginner") return conversationsBeginner;
  if (level === "intermediate") return conversationsIntermediate;
  if (level === "advanced") return conversationsAdvanced;
  return [];
}

export function getConversationById(id: string): Conversation | undefined {
  return getAllConversations().find((c) => c.id === id);
}
