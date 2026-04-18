import { MockExam } from "./mockExamTypes";

// Helper for placeholder questions where the source document only provided partial data.
const placeholder = (id: number, correct: string = "A") => ({
  id,
  options: ["（请参考原题册）A", "（请参考原题册）B", "（请参考原题册）C", "（请参考原题册）D"],
  correctAnswer: correct,
});

export const mockExam3: MockExam = {
  id: "mock-exam-3",
  title: "HSK 6 Mock Exam 3",
  titleZh: "HSK（六级）模拟试卷 3",
  level: 6,
  sections: {
    listening: [
      {
        type: "short-conversations",
        title: "第一部分",
        instructions: "第 1—15 题：请选出与所听内容一致的一项。",
        questions: [
          { id: 1, options: ["小王的弟弟身体很好", "小王的弟弟爱做游戏", "小王的弟弟做游戏时受伤了", "小王喜欢开玩笑"], correctAnswer: "C" },
          { id: 2, options: ["孩子又睡着了", "父亲不会哄孩子", "父亲唱歌很难听", "邻居喜欢孩子哭"], correctAnswer: "C" },
          { id: 3, options: ["水可以随便喝", "少喝水才健康", "多喝水很重要", "应该科学喝水"], correctAnswer: "D" },
          { id: 4, options: ["威士忌是给这位男子喝的", "威士忌很好喝", "女士不喜欢威士忌", "乘客很担心这位男子"], correctAnswer: "A" },
          { id: 5, options: ["小张喜欢救人", "消防员们都想救女孩", "小张很勇敢", "小张很善良"], correctAnswer: "B" },
          { id: 6, options: ["苹果已经睡了", "小苹果已经睡了", "妈妈困了", "弟弟很聪明"], correctAnswer: "D" },
          { id: 7, options: ["假发很好看", "商标做得很假", "商标在假发上", "朋友在开玩笑"], correctAnswer: "C" },
          { id: 8, options: ["书店老板觉得很惭愧", "医生不喜欢吃药", "医生很有意思", "医生没吃过所有的药"], correctAnswer: "D" },
          { id: 9, options: ["女儿的成绩非常好", "女儿的成绩没有前座的好", "女儿觉得很委屈", "爸爸对女儿的成绩很满意"], correctAnswer: "C" },
          { id: 10, options: ["人的烦恼很多", "太会计划是聪明", "太会计划是自以为聪明", "我们应该计划未来"], correctAnswer: "C" },
          placeholder(11, "A"),
          placeholder(12, "B"),
          placeholder(13, "D"),
          placeholder(14, "C"),
          placeholder(15, "A"),
        ],
        scripts: [
          { questionRange: "1", text: "小王和朋友在闲聊。朋友问小王：\u201C你弟弟最近好吗？\u201D 小王说：\u201C住院了，他昨天受伤了。\u201D 朋友很惊愕地说道：\u201C真糟糕！怎么回事？\u201D 小王说：\u201C我们做游戏，看谁能把身子探出窗外最远，他赢了。\u201D" },
          { questionRange: "2", text: "深夜，睡着的孩子又哭了起来。怕打扰邻居的睡眠，父亲决定唱一段催眠曲哄孩子入睡。刚开了个头儿，邻居就抗议了：\u201C还是让孩子继续哭吧。\u201D" },
        ],
      },
      {
        type: "interviews",
        title: "第二部分",
        instructions: "第 16—30 题：请选出正确答案。",
        questions: [
          placeholder(16, "A"), placeholder(17, "B"), placeholder(18, "A"),
          placeholder(19, "C"), placeholder(20, "D"), placeholder(21, "D"),
          placeholder(22, "A"), placeholder(23, "B"), placeholder(24, "C"),
          placeholder(25, "A"), placeholder(26, "C"), placeholder(27, "D"),
          placeholder(28, "B"), placeholder(29, "A"), placeholder(30, "C"),
        ],
        scripts: [
          { questionRange: "16-20", text: "主持人：今天的话题是关于梦想。我们请到的嘉宾叫杜国峰，他的梦想是成为驾驶动力三角翼飞越全球的第一位华人。问一下，您是什么时候有这个梦想的？杜国峰：一直都有。我 1986 年入伍，从第一次跳伞到现在已经 20 多年了……" },
          { questionRange: "21-25", text: "主持人：今天我们请到的是《广告导报》出版人兼主编、智慧工场传播机构的 CEO、著名名人凌平先生。凌先生，您好！凌平：这部电影叫《恋爱前规则》。我们预期票房突破 3000 万。" },
        ],
      },
      {
        type: "passages",
        title: "第三部分",
        instructions: "第 31—50 题：请选出正确答案。",
        questions: [
          placeholder(31, "B"), placeholder(32, "C"), placeholder(33, "D"), placeholder(34, "A"),
          placeholder(35, "B"), placeholder(36, "D"), placeholder(37, "C"), placeholder(38, "C"),
          placeholder(39, "D"), placeholder(40, "B"),
          placeholder(41), placeholder(42), placeholder(43), placeholder(44), placeholder(45),
          placeholder(46), placeholder(47), placeholder(48), placeholder(49), placeholder(50),
        ],
        scripts: [
          { questionRange: "31-34", text: "一只狐狸不小心掉到了井里，不论它如何挣扎，仍然没法爬上去。一只公山羊觉得口渴极了，来到井边，狐狸极力赞美井水好喝，公山羊跳了下去。狐狸说：\u201C我倒有一个办法，你用前脚扒在井墙上，我从你后背跳上去，再拉你上来。\u201D 狐狸上去后却准备独自离去。公山羊指责狐狸不信守诺言。狐狸回过头对他说：\u201C喂，朋友，你的头脑如果像你的胡须那样完美，你就不至于在没看清出口之前就盲目地跳下去了。\u201D" },
        ],
      },
    ],
    reading: [
      {
        type: "error-identification",
        title: "第一部分",
        instructions: "第 51—60 题：请选出有语病的一项。",
        questions: [
          { id: 51, options: [
            "我对外语教学一窍不通，主要是让学生背生词、课文。",
            "李淑芳第一场就败给了一名加拿大选手，没有获得名次。",
            "有些人将电视比作家常便饭，而视电影为大餐。",
            "这看起来固然好笑，但它说明古印度人已知道情绪的秘密。",
          ], correctAnswer: "A" },
          { id: 52, options: [
            "中药很讲究煎药的方法和服药的时间，有的药还有禁忌。",
            "这份报告为我国的经济建设提供了可靠的依据，节约了人力。",
            "他已经暗下决心，一定要把武汉演讲水平再提高一个层次。",
            "门卫老头儿把我们叫醒后，他睡眼惺忪地让我们出示住宿证。",
          ], correctAnswer: "D" },
          { id: 53, options: [
            "社会发展与各类人才培养有密切的相关，这已经成为一种共识。",
            "瞳孔鼠标仅通过转动眼睛和眨眼就能控制电脑，操作十分简单。",
            "作为太阳系八大行星之一，海王星本身并没有什么特别的地方。",
            "积多年之经验教训，只有严格依法管理，方能收到事半功倍的效果。",
          ], correctAnswer: "A" },
          placeholder(54, "B"),
          placeholder(55, "C"),
          placeholder(56, "B"),
          placeholder(57, "B"),
          placeholder(58, "D"),
          placeholder(59, "C"),
          placeholder(60, "B"),
        ],
      },
      {
        type: "cloze-words",
        title: "第二部分",
        instructions: "第 61—70 题：请选出最恰当的一项填入空白处。",
        blanksPassage: [
          {
            text: "为了使汉语水平考试更好地______海外不断增长的汉语学习者对汉语考试的新要求，中国国家汉办组织中外汉语教学、语言学、心理学和教育测量学等领域的专家，在______调查、了解海外实际汉语教学的基础上，______近年来国际语言测试研究最新成果，______研发并于 2009 年 11 月推出了新汉语水平考试。",
            options: [],
            questions: [
              { id: 61, options: ["满意 充足 参考 再次", "满足 充分 借鉴 重新", "适合 充满 参照 重复", "适应 充沛 利用 反复"], correctAnswer: "B" },
            ],
          },
          { text: "（第 62 题：请参考原题册）", options: [], questions: [{ id: 62, options: ["A", "B", "C", "D"], correctAnswer: "A" }] },
          { text: "（第 63 题：请参考原题册）", options: [], questions: [{ id: 63, options: ["A", "B", "C", "D"], correctAnswer: "B" }] },
          { text: "（第 64 题：请参考原题册）", options: [], questions: [{ id: 64, options: ["A", "B", "C", "D"], correctAnswer: "C" }] },
          { text: "（第 65 题：请参考原题册）", options: [], questions: [{ id: 65, options: ["A", "B", "C", "D"], correctAnswer: "A" }] },
          { text: "（第 66 题：请参考原题册）", options: [], questions: [{ id: 66, options: ["A", "B", "C", "D"], correctAnswer: "C" }] },
          { text: "（第 67 题：请参考原题册）", options: [], questions: [{ id: 67, options: ["A", "B", "C", "D"], correctAnswer: "D" }] },
          { text: "（第 68 题：请参考原题册）", options: [], questions: [{ id: 68, options: ["A", "B", "C", "D"], correctAnswer: "B" }] },
          { text: "（第 69 题：请参考原题册）", options: [], questions: [{ id: 69, options: ["A", "B", "C", "D"], correctAnswer: "A" }] },
          { text: "（第 70 题：请参考原题册）", options: [], questions: [{ id: 70, options: ["A", "B", "C", "D"], correctAnswer: "C" }] },
        ],
      },
      {
        type: "cloze-sentences",
        title: "第三部分",
        instructions: "第 71—80 题：请选出最恰当的一项填入空白处。",
        blanksPassage: [
          {
            text: "（第 71—75 题：请参考原题册的完形填空段落）",
            options: [],
            questions: [
              { id: 71, options: ["A", "B", "C", "D", "E"], correctAnswer: "A" },
              { id: 72, options: ["A", "B", "C", "D", "E"], correctAnswer: "B" },
              { id: 73, options: ["A", "B", "C", "D", "E"], correctAnswer: "C" },
              { id: 74, options: ["A", "B", "C", "D", "E"], correctAnswer: "D" },
              { id: 75, options: ["A", "B", "C", "D", "E"], correctAnswer: "E" },
            ],
          },
          {
            text: "（第 76—80 题：请参考原题册的完形填空段落）",
            options: [],
            questions: [
              { id: 76, options: ["A", "B", "C", "D", "E"], correctAnswer: "A" },
              { id: 77, options: ["A", "B", "C", "D", "E"], correctAnswer: "B" },
              { id: 78, options: ["A", "B", "C", "D", "E"], correctAnswer: "C" },
              { id: 79, options: ["A", "B", "C", "D", "E"], correctAnswer: "D" },
              { id: 80, options: ["A", "B", "C", "D", "E"], correctAnswer: "E" },
            ],
          },
        ],
      },
      {
        type: "reading-comprehension",
        title: "第四部分",
        instructions: "第 81—100 题：请选出正确答案。",
        passages: [
          {
            text: "人们喜欢用\u201C左耳进，右耳出\u201D来形容不听话的人。最新的科学研究显示，这句话还真有一定的道理，如果希望别人更容易接受你所传达的信息或是下达的指令，最好对着他的右耳说话。据英国媒体报道，这种现象被科学家称为\u201C右耳优势\u201D。右耳由左脑掌管，而左脑主要负责语言和逻辑思维，因此通过右耳传达的语言信息更容易被人接受。意大利利基耶地大学的科研小组进行了这项实验。研究小组在三家夜总会里调查了数百人的行为，观察他们如何在自然环境下倾听他人讲话以及接下来作何反应。研究人员一共向 176 人说出了索要雪茄烟的请求，结果发现，当对着人的右耳说出请求时，获得雪茄的几率明显高于对着左耳说出请求。因此，意大利科学家得出的结论是，当进行语言交流时，存在着一种\u201C右耳优势\u201D，可以提高说话对象接受请求或者指令的意愿。研究还显示，人类的左耳在接收诸如\u201C我爱你\u201D等甜言蜜语时比右耳更敏锐，因此如果想对情人示爱，最好站在对方的左边。",
            questions: [
              { id: 81, options: [
                "因为不听话所以左耳进右耳出",
                "右耳由左脑掌管，左脑负责语言和逻辑思维",
                "对左耳说话效果更好",
                "右耳的听力比左耳灵敏",
              ], correctAnswer: "B" },
              { id: 82, options: [
                "在三家夜总会里调查了数百人",
                "对 176 人说出索要雪茄的请求",
                "对着右耳说出请求获得雪茄的几率高",
                "以上都对",
              ], correctAnswer: "D" },
              { id: 83, options: [
                "右耳更敏锐",
                "左耳在接收甜言蜜语时更敏锐",
                "两只耳朵一样",
                "文中没有提到",
              ], correctAnswer: "B" },
              { id: 84, options: [
                "站在对方的右边",
                "站在对方的左边",
                "站在对方的正面",
                "无所谓",
              ], correctAnswer: "B" },
            ],
          },
          {
            text: "（第 85—100 题：请参考原题册的阅读篇章）",
            questions: [
              placeholder(85, "C"), placeholder(86, "A"), placeholder(87, "D"), placeholder(88, "B"),
              placeholder(89, "C"), placeholder(90, "A"), placeholder(91, "B"), placeholder(92, "D"),
              placeholder(93, "C"), placeholder(94, "A"), placeholder(95, "B"), placeholder(96, "D"),
              placeholder(97, "A"), placeholder(98, "B"), placeholder(99, "C"), placeholder(100, "D"),
            ],
          },
        ],
      },
    ],
    writing: {
      title: "书写",
      instructions: [
        "10 分钟阅读，35 分钟书写。",
        "将文章缩写成 400 字左右的短文。",
        "标题自拟。",
        "只复述内容，不加入个人观点。",
      ],
      prompt: "城市里有一家小吃店，这里的饭菜非常好吃，小店的老板和老板娘非常热情。一天中午，饭店里来了一位老奶奶和一个小男孩。他们两个人只要了一份牛肉汤饭。老奶奶把碗推到孙子面前，小男孩问奶奶说：\u201C奶奶，您真的吃过中午饭了吗？\u201D 老奶奶含着一块免费赠送的咸萝卜慢慢咀嚼着。当老奶奶准备结账时，善良的老板走到两个人面前说：\u201C老太太，恭喜您，您是我们今天的第 100 位客人，所以今天的饭免费。\u201D 一个多月后的某一天，老板发现那个小男孩在饭店对面用石子数着进店吃饭的客人。可是午饭的时间就要过去了，也只有不到 50 人，于是老板打电话给老顾客，请他们来吃饭。当第 99 位客人进店时，小男孩带着奶奶进来了。他还是要了一份牛肉汤饭，这次只是奶奶一个人吃。老板娘想再送小男孩一份饭，老板说：\u201C我们不应该破坏孩子对奶奶的回报。\u201D 小男孩学着奶奶的样子咀嚼赠送的咸萝卜，还说自己吃得很饱。",
      sampleAnswer: "《免费的午餐》\n\n城市里有一家温馨的小吃店。一天中午，一对寒酸的祖孙进店只点了一碗牛肉汤饭。老奶奶慈祥地看着小男孩大口吃肉，自己却舍不得动筷子，只是一遍遍重复已经吃过了。结账时，老板为了维护祖孙俩的自尊心，谎称老奶奶是今天的第 100 位客人，餐费全免。\n\n一个月后，老板发现小男孩蹲在店外，用石子数着进店的客人。直到午餐时间快结束，客人还不满 50 位。老板看穿了孩子想通过这种方式让奶奶也吃上\u201C免费午餐\u201D的心思，于是赶紧打电话请老顾客们来凑数。\n\n随着客人接踵而至，当第 99 颗石子放下时，小男孩兴奋地拉着奶奶进了店。这次，他把汤饭推向奶奶。老板娘本想多送一份饭，却被老板拦住了，因为他明白孩子是在用自己的方式回报奶奶的爱。\n\n这顿\u201C免费的午餐\u201D包裹着老板夫妇的善意，也见证了一个孩子的纯真与孝心。善良在小店里默默流淌，温暖了每一个人。",
    },
  },
};
