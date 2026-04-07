import { MockExam } from "./mockExamTypes";

export const mockExam1: MockExam = {
  id: "mock-exam-1",
  title: "HSK 6 Mock Exam 1",
  titleZh: `HSK（六级）模拟试卷 1`,
  level: 6,
  sections: {
    reading: [
      {
        type: "error-identification",
        title: `第一部分`,
        instructions: `第 51—60 题：请选出有语病的一项。`,
        questions: [
          {
            id: 51,
            options: [
              `他得到了老师和同学们的赞扬。`,
              `他多么渴望有一个学习机会呀！`,
              `我发现他这个学期变化了很大。`,
              `大家一致称赞他是一个讲文明、懂礼貌的孩子。`
            ],
            correctAnswer: "C"
          },
          {
            id: 52,
            options: [
              `舞美设计艺术一向被人誉为\u201C眼睛的音乐\u201D、\u201C映花的绿叶\u201D。`,
              `人类自从开始采金以来，一共开采了近 11 万吨黄金。`,
              `他们分工非常严格细致，与自己无关的事绝不会去过问。`,
              `他呼吁非洲国家要重视女童的教育，而提高妇女的文化水平。`
            ],
            correctAnswer: "D"
          },
          {
            id: 53,
            options: [
              `以前我曾在英国牛津大学的巴顿学院留学两年了。`,
              `农民不堪重负，这个问题已到了非解决不可的程度了。`,
              `要花招比诚实容易得多，只是到头来聪明反被聪明误。`,
              `我觉得自己的知识储备还不够，还需要进一步充实。`
            ],
            correctAnswer: "A"
          },
          {
            id: 54,
            options: [
              `我初次来到，对北京不熟悉，对歌坛也不熟悉，又没有资历。`,
              `冠军毕竟只有一个，这是很残酷的事，但也正是比赛的魅力所在。`,
              `如果她没有接到我的电话，全替我担心得吃不下饭、睡不着觉的。`,
              `面前这个诚实的小伙子，对这位著名的音乐家来说显然也是很欣赏的。`
            ],
            correctAnswer: "D"
          },
          {
            id: 55,
            options: [
              `催化剂已成为现代化学工作者最得力的帮手，但尚有许多问题未弄清。`,
              `我就是这样一个人，又可以说是理想主义者，又可以说是实践主义者。`,
              `他的这种情绪还影响到了工作，影响了整个乐队的形象。`,
              `要创造条件让更多的青年科学家迅速成长，但万万不可揠苗助长。`
            ],
            correctAnswer: "B"
          },
          {
            id: 56,
            options: [
              `我们再三说也无济于事，真不知如何是好，所以恳请您来指导。`,
              `该国卫生部门正在积极采取措施，以防止炭疽病进一步扩散。`,
              `我们只有不断探索，才能取得成功，没有此外的好办法。`,
              `人类一旦遇到外星人，应该怎样与他们进行交谈？`
            ],
            correctAnswer: "C"
          },
          {
            id: 57,
            options: [
              `1988 年汉城奥运会，我记住了高敏，她好像国际比赛当中没输过。`,
              `老师答应了，但同时也要求我从此以后和马晓军断绝来往。`,
              `我把这一切都归结于她在那篇关于画家村的文章中对我的\u201C吹捧\u201D。`,
              `由于身处热带，他的脸被西双版纳的太阳晒得黑黑的。`
            ],
            correctAnswer: "A"
          },
          {
            id: 58,
            options: [
              `只要导演不喊\u201C过\u201D，我们就得一遍一遍地重来。`,
              `我觉得我们之间已经扯平了，因此对他的要求，我一概拒绝。`,
              `王治郅是凭他最后几场的表现，最终得以加入八一队的。`,
              `听说贵公司不仅在中国国内很畅销，而且外国顾客也很多。`
            ],
            correctAnswer: "D"
          },
          {
            id: 59,
            options: [
              `我们那所小学有 600 多名学生，光是女生就占了一多半。`,
              `对于是否担心流感疫情会蔓延的问题，近五成市民表现出乐观态度。`,
              `像我们这种的所谓艺术家，实际上根本就没人瞧得起。`,
              `著名画家林风眠一下子就看上了他的作品，认为他值得培养。`
            ],
            correctAnswer: "C"
          },
          {
            id: 60,
            options: [
              `我是一个人不愿意喝闷酒，所以想让他陪我，当然是由我请客。`,
              `几日降雨量在 10 毫米以下的称为小雨，10\u201425 毫米则为中雨。`,
              `减肥最为有效的办法就是要吃多一些含水量大的食物，如水果和蔬菜。`,
              `那个滑冰场可能是你在帕尔马滨唯一能找到冰的地方，至少夏天是如此。`
            ],
            correctAnswer: "C"
          }
        ]
      },
      {
        type: "cloze-words",
        title: `第二部分`,
        instructions: `第 61\u201470 题：选词填空。`,
        blanksPassage: [
          {
            text: `世界上有些______动物，尽管人们______去保护，仍然处于濒临灭绝的境地，有的已______毁灭。可是有些动物，比如老鼠，虽然人们在用各种方法消灭它们，但总是消灭______。`,
            options: [],
            questions: [{ id: 61, options: [`A 珍稀 千方百计 遭到 不了`, `B 珍惜 千军万马 得到 不得`, `C 珍惜 千方百计 得到 得了`, `D 珍奇 小心翼翼 遭到 了得`], correctAnswer: "A" }]
          },
          {
            text: `有的人有博士学位______没有修养品位，______没有什么魅力可言；所以我们______要从外表上修饰打扮自己，保持魅力不衰，更要从修养学识上不断______个人的魅力。`,
            options: [],
            questions: [{ id: 62, options: [`A 又 依旧 不但 增多`, `B 也 依然 不仅 增加`, `C 却 照样 既要 提升`, `D 倒 仍然 既然 提高`], correctAnswer: "C" }]
          },
          {
            text: `在奴隶制早已______的现代文明世界中，又出现了______新的\u201C奴隶\u201D，从发达国家，如美国，到发展中国家，如中国，______都是他们______自己叫\u201C房奴\u201D。`,
            options: [],
            questions: [{ id: 63, options: [`A 揭废 一群 处处 跟`, `B 废除 一批 到处 管`, `C 消除 一帮 随处 把`, `D 废弃 一团 哪里 对`], correctAnswer: "B" }]
          },
          {
            text: `有行业研究员______，______是中国电科院______国网电科院，到 2012 年都要实现 800 亿元的收入______，不过从靠现有的产业难以实现，需要继续兼并收购其他企业。`,
            options: [],
            questions: [{ id: 64, options: [`A 表达 不管 并且 意图`, `B 表明 不是 而是 目的`, `C 表示 无论 还是 目标`, `D 表现 不论 而且 达标`], correctAnswer: "C" }]
          },
          {
            text: `孩子在家庭里排行的顺序是人格形成的一个很重要的______。不过，孩子的性格______直接来自天生的排行顺序，______取决于父母所倾注的心力。当然，人格的形成也与家教______有着很大的关系。`,
            options: [],
            questions: [{ id: 65, options: [`A 因素 不是 而是 方式`, `B 要素 既是 又是 方略`, `C 素材 不但 更是 方法`, `D 元素 不仅 也是 策略`], correctAnswer: "A" }]
          },
          {
            text: `现在，钢笔已是人们______使用的书写工具，它______于 19 世纪初。1809 年，英国______了第一批关于贮水笔的专利证书，这______着钢笔的正式诞生。`,
            options: [],
            questions: [{ id: 66, options: [`A 遍及 创制 发布 标注`, `B 普通 创造 颁布 标记`, `C 普及 发现 公布 标明`, `D 普遍 发明 颁发 标志`], correctAnswer: "D" }]
          },
          {
            text: `中国目前的家庭教育______重视智力因素的开发和培养，而______非智力因素对孩子未来成功与命运的影响。______，我们______全面发展的家庭教育。`,
            options: [],
            questions: [{ id: 67, options: [`A 往往 忽视 也就是说 缺乏`, `B 常常 省略 换句话说 缺少`, `C 往常 忽略 老实说 短缺`, `D 经常 漠视 说真的 匮乏`], correctAnswer: "A" }]
          },
          {
            text: `当今，用英语进行交际，是学生们必须学习和掌握的一种______。原因之一就是因为英语是使用最为______的语言之一。为了______同世界的联系，更好地与世界各国进行学习和交流，掌握英语是很______的。`,
            options: [],
            questions: [{ id: 68, options: [`A 技艺 广阔 增大 需要`, `B 技术 宽广 增强 必须`, `C 技能 广泛 加强 必要`, `D 能力 宽泛 增加 必需`], correctAnswer: "C" }]
          },
          {
            text: `2009 年上半年，对于中国电影______，与其说是逆市上扬，______说是水到渠成。近年来，中国电影______改革所释放的市场潜能，______超过了经济环境的压力。`,
            options: [],
            questions: [{ id: 69, options: [`A 来谈 还是 产业界 显然`, `B 来说 不如 产业化 明显`, `C 而言 而且 产业性 显著`, `D 说来 或者 产业力 显现`], correctAnswer: "B" }]
          },
          {
            text: `佛山是一座历史名城，______中国南派武术的故乡，著名的洪拳、咏春拳都是以佛山______重要基地而______的，一大批武术名人，如黄飞鸿、李小龙的名字早已______。`,
            options: [],
            questions: [{ id: 70, options: [`A 而是 看做 发愤图强 深入人心`, `B 又是 当做 发奋图强 尽人皆知`, `C 还是 当成 奋发有为 众所周知`, `D 也是 为 发扬光大 家喻户晓`], correctAnswer: "D" }]
          }
        ]
      },
      {
        type: "cloze-sentences",
        title: `第三部分`,
        instructions: `第 71\u201480 题：选句填空。`,
        blanksPassage: [
          {
            text: `王阳是班里公认的技术尖子，从大三开始就在一些小的计算公司做项目，大四的时候他就能自己独立地做一些小项目了。\n\n自信的王阳一直梦想着大学毕业后能进入一家大的有名的电脑公司，(71)______。进入大四以后，王阳经过多方的联系了解到，进入大企业实习是毕业后进入这些企业的关键。积极的王阳为了找到实习机会，经常泡在北大或者清华的聊天室和应届生网站上，寻找跨国大企业的实习生招聘信息，(72)______。但是实习期结束后，王阳并没有被该公司录用。\n\n王阳经过认真总结后认为这次失败是以下几点原因造成的：\n\n第一，(73)______。学生时代做的项目是不少，但都比较小，通常是项目经理找几个像他这样能动手的学生，简单地碰个头就开始干了，没有特别严格的规范要求。但大公司不一样，每一步都需要说明规范的文档，需要进行评审之后才能交付给下一个环节，而且每个人都是做自己最擅长那一块，这和王阳以前需求、设计、编码、测试一条龙全做的方式完全不一样。\n\n第二，(74)______。王阳在同学中技术不错，导致自我评价过高。每当经理提出一些善意的批评，王阳都会认为是领导在否认自己，经常因此带着负面情绪工作，影响了整个团队的氛围。现在王阳明白了，工作需要协同合作的沟通能力，这一点在任何公司都非常重要。\n\n第三，(75)______。刚进入公司时，王阳常犯的错误是谁交代他任务，他会立即停下手头的事情去处理这件事，导致了一段时间考核下来，他一直在不断处理紧急但不重要的事情，重要的事情一件都没做。`,
            options: [],
            questions: [
              { id: 71, options: [`A 沟通有障碍`, `B 干活不规范`, `C 成为一名顶尖的软件工程师`, `D 不善于说\u201C不\u201D，不懂得时间管理`, `E 终于，他如愿以偿地进入了一家知名公司实习`], correctAnswer: "C" },
              { id: 72, options: [`A 沟通有障碍`, `B 干活不规范`, `C 成为一名顶尖的软件工程师`, `D 不善于说\u201C不\u201D，不懂得时间管理`, `E 终于，他如愿以偿地进入了一家知名公司实习`], correctAnswer: "E" },
              { id: 73, options: [`A 沟通有障碍`, `B 干活不规范`, `C 成为一名顶尖的软件工程师`, `D 不善于说\u201C不\u201D，不懂得时间管理`, `E 终于，他如愿以偿地进入了一家知名公司实习`], correctAnswer: "B" },
              { id: 74, options: [`A 沟通有障碍`, `B 干活不规范`, `C 成为一名顶尖的软件工程师`, `D 不善于说\u201C不\u201D，不懂得时间管理`, `E 终于，他如愿以偿地进入了一家知名公司实习`], correctAnswer: "A" },
              { id: 75, options: [`A 沟通有障碍`, `B 干活不规范`, `C 成为一名顶尖的软件工程师`, `D 不善于说\u201C不\u201D，不懂得时间管理`, `E 终于，他如愿以偿地进入了一家知名公司实习`], correctAnswer: "D" }
            ]
          },
          {
            text: `一年前的一个下着微微细雨的傍晚，下班后，我在我家小区门口遇到了一个久未谋面的老友，因为多聊了几句，耽误了回家的时间。这时，母亲打来了电话，想想离家也就一两分钟的工夫，我便没有接听。恰巧在这时，离小区不远的地方发生了一起车祸。听到消息的母亲顿时急了，穿着拖鞋就飞快地往楼下跑。不知是谁在楼道里扔了一块果皮，眼神不好的母亲不小心踩在了上面，重重地摔倒在地，(76)______。\n\n那天晚上见到母亲的时候，她已躺在了医院的病床上，(77)______。听医生说，母亲摔坏了腿，(78)______。我流着眼泪，后悔莫及地望着病床上睡去的母亲，心里有一种难以言说的疼痛。一个被我忽略的电话，却成了母亲为我担心的理由，正是因为她时刻把我放在心中最重要的位置，才使她遭受了这种折磨。\n\n正当我默默自责时，母亲翻了一下身，(79)______。我伸出手，将母亲那双被琐碎的家务磨得粗糙无比的手紧紧地放在我的怀里。母亲微微睁开眼睛，依稀看到了我，一丝开心的笑容立刻在她的脸上绽放开来。\u201C平安就好，平安就好\u2026\u2026\u201D 母亲那含混不清的言语，(80)______，剩那间，我的眼泪如开闸的洪水夺眶而出，久久不能干涸。`,
            options: [],
            questions: [
              { id: 76, options: [`A 神志也有些模糊`, `B 脚上打着石膏`, `C 嘴里不停地念叨着我的名字`, `D 顿时昏迷不醒`, `E 顿时刺中了我心中的最痛点`], correctAnswer: "D" },
              { id: 77, options: [`A 神志也有些模糊`, `B 脚上打着石膏`, `C 嘴里不停地念叨着我的名字`, `D 顿时昏迷不醒`, `E 顿时刺中了我心中的最痛点`], correctAnswer: "B" },
              { id: 78, options: [`A 神志也有些模糊`, `B 脚上打着石膏`, `C 嘴里不停地念叨着我的名字`, `D 顿时昏迷不醒`, `E 顿时刺中了我心中的最痛点`], correctAnswer: "A" },
              { id: 79, options: [`A 神志也有些模糊`, `B 脚上打着石膏`, `C 嘴里不停地念叨着我的名字`, `D 顿时昏迷不醒`, `E 顿时刺中了我心中的最痛点`], correctAnswer: "C" },
              { id: 80, options: [`A 神志也有些模糊`, `B 脚上打着石膏`, `C 嘴里不停地念叨着我的名字`, `D 顿时昏迷不醒`, `E 顿时刺中了我心中的最痛点`], correctAnswer: "E" }
            ]
          }
        ]
      },
      {
        type: "reading-comprehension",
        title: `第四部分`,
        instructions: `第 81\u2014100 题：请选出正确答案。`,
        passages: [
          {
            text: `当人夜间进入梦乡时，心脏还在值\u201C夜班\u201D。据记载，心脏停跳又复活的世界纪录为 3 小时 24 分，但在睡眠环境下，心脏恐怕一分钟也不能停止跳动。不过心脏并不是一刻不停地工作，它收缩时是在工作，它也在抽空休息。它舒张时是在休息，每分钟心跳 75 次时，每一次心跳，心房和心室的收缩时间分别为 0.1 秒和 0.3 秒，而舒张时间分别为 0.7 秒和 0.5 秒，休息时间倒比工作时间长。\n\n肺也要值\u201C夜班\u201D。肺就像一台鼓风机，不停地把富含氧气的空气吸入人体内\u201C助燃\u201D，把富含二氧化碳的废气排出。科学家们认为，只要这台鼓风机停止工作 5 分钟，人就会\u201C断气\u201D。当然，肺也要休息，肺泡采用轮休制，每次呼吸只有部分肺泡在工作。\n\n说到值\u201C夜班\u201D，也别忘记了消化系统。据试验，食物在胃内消化停留 3.48 小时，在小肠内吸收停留 5 小时，在结肠内停留 16.24 小时，在\u201C环卫部门\u201D直肠中经过 21.2 小时才能排出。照此算来，人在夜间睡眠时，消化系统的\u201C夜班工人\u201D还在对昨天早餐到今天晚餐的食物作一系列处理。\n\n人体的很多部分都坚守在\u201C夜班\u201D岗位上。例如腺垂体在夜间也会分泌一种生长激素，加速软骨与骨头生长，使人长高。大脑中的睡眠中枢也在工作，它会产生去甲肾上腺素在清晨把人唤醒，否则人就要无休止地睡下去。甚至主管思维的大脑也安排有\u201C夜班\u201D\u2014\u2014做梦。感谢这些\u201C夜班工人\u201D，它们使我们的生命平稳地延续下去。`,
            questions: [
              { id: 81, options: [`休息时间没有工作时间长`, `睡眠时一分钟也不能休息`, `停跳又复活的最长时间为 3 小时 24 分`, `舒张时也是在工作`], correctAnswer: "C" },
              { id: 82, options: [`5 分钟休息一次`, `把废气排出就是休息`, `肺泡采用轮休制`, `肺泡一边工作一边休息`], correctAnswer: "C" },
              { id: 83, options: [`3.48 个小时`, `21.2 个小时`, `16.24 个小时`, `45.92 个小时`], correctAnswer: "D" },
              { id: 84, options: [`人体所有部分时刻都在工作`, `心脏停跳不一定代表人已死亡`, `消化系统白天休息，晚上工作`, `大脑的睡眠中枢在人睡觉时不工作`], correctAnswer: "B" }
            ]
          },
          {
            text: `据统计，中国 2008 年 2 月 CPI 上涨 8.7%，商务部长陈德铭 3 月 12 日接受了中外记者的采访。他指出，造成 CPI 大幅上涨的原因主要有三点：\n\n中国食品价格的上涨是主要因素。2 月份食品价格上升了 23.3%，这主要是因为 2 月份北方和南方的天气都不好，农产品的生产和运输受到了影响，因此加大了运输成本，又正好赶上春节的购物高峰，从而造成了市场供不应求。但天气状况转好后，交通便利，这个原因的影响可能就会消除。\n\n第二，中国国内农产品价格的上涨是部分因素。中国农产品价格从 1997\u20142007 年 10 年时间的年平均增长在 0.7%左右，而这 10 年居民收入增长大大高于这个数字。因此，价格上涨又有一定的必然性和合理性。\n\n第三，国际初级产品的价格全面大幅度上升，包括能源、资源、农副产品等。今年 2 月份，国际初级产品价格同比上涨 44%，其中原油上涨 62.8%，食品上涨 39.1%，中国市场跟国际同步，这必然也对中国 CPI 有较大影响。\n\n综合以上的情况来看，造成 2 月份 CPI 上涨的部分原因可能在下半年消失，因此商务部长陈德铭预计中国下半年的 CPI 将有所下降。`,
            questions: [
              { id: 85, options: [`中国食品价格上涨`, `中国国内农产品价格上涨`, `农产品生产成本提高`, `国际初级产品价格全面大幅上升`], correctAnswer: "C" },
              { id: 86, options: [`天气不好，运输受影响`, `运输成本提高了`, `赶上春节的购物高峰`, `天气不好，食品生产量少，市场供不应求`], correctAnswer: "D" },
              { id: 87, options: [`10 年的平均增长低于居民收入增长`, `成本提高了`, `居民收入提高了，就有钱买贵的了`, `不可能总是保持不变`], correctAnswer: "A" },
              { id: 88, options: [`预计下半年的 CPI 将有所下降`, `食品价格下半年会下降`, `国际初级产品的价格下半年不会上升`, `中国国内农产品价格一定会继续上涨`], correctAnswer: "A" }
            ]
          },
          {
            text: `创新能力在当今社会越来越受到人们的重视，因为它是促进社会进步的原动力。那么如何培养创新能力呢？\n\n首先，在学习中，要知其然，也要知其所以然。我们在学习数学的时候，可能人人都会背数学公式，但是，聪明学生还会记住这个公式是如何推导出来的。知道了已经存在的事物的内在原因，才能根据这种根本性的原理来研究和创造出更新的东西。其次，遇到问题应试着从不同角度来思考。美国 3M 公司一位研究员想发明一种黏合力非常强的胶水，但因为种种原因失败了，实验得到的只是一种黏合力很差的液体。一段时间后，他发现人们有这样一种需求：把便条或书签贴到桌上或墙上，可以随时揭下来。他此前发现的黏合力差的液体不正可以派上场吗？就这样，一种险遭废弃的技术促成了即时贴的发明。第三，凡事要动手实践。小时候，老师让我们用 6 根火柴拼成 4 个大小一模一样的正三角形。通过动手实践，我们都找到了正确答案。同时我们也发现了六根火柴还能拼成直角三角形、正方形等，这样的实践让我们对几何空间知识记忆深刻。同时，在实践的过程中也很有可能做出一些连自己也意想不到的成果。\n\n在一种鼓励探索、重视实践的教育环境下，创新并不难。只要具备扎实的基本功和灵活的头脑，在不断实践的过程中，你是可以做出最新颖、最有用也最有可行性的创新来的！`,
            questions: [
              { id: 89, options: [`要知道它是这样的，才能知道它之所以是这样的`, `要知道它是什么样的，也要知道为什么这样`, `要知道原因，也要知道结果`, `必须要知道事物的内在原因`], correctAnswer: "B" },
              { id: 90, options: [`研究创造出来的东西一定能用得上`, `遇到问题应试着从不同角度来思考`, `实验研究出的质量差的东西也要保留`, `开始失败了也不要紧`], correctAnswer: "B" },
              { id: 91, options: [`有所创新`, `我们学习，他休息`, `通过动手深刻记忆几何空间知识`, `发现直角三角形和正方形的知识`], correctAnswer: "C" },
              { id: 92, options: [`要动手实践`, `遇到问题试着从不同角度来思考`, `学习时，要知其然并知其所以然`, `要寻找良好的教育环境`], correctAnswer: "D" }
            ]
          },
          {
            text: `前不久，中国国家旅游局副局长杜江表示，目前中国旅游业收入占 GDP 的比重超过了 4%，旅游业对经济增长的拉动作用日益明显。据介绍，旅游业综合性强，关联度大，产业链长，能够影响和促进与之相关联的 110 个行业发展。据世界旅游组织测算，旅游收入每增加 1 元，可带动相关行业增收 4.3 元。旅游业作为第三产业的重点，是现代服务业的重要组成部分，对文化交流、生态文明和人的全面发展都具有明显的促进作用，能够促进经济、社会协调发展。\n\n世界旅游组织秘书长佛朗西斯科\u00B7弗朗加利认为，中国旅游业在世界旅游业发展中发挥的作用越来越大，中国将在 2020 年超过法国、西班牙、美国而成为世界第一旅游目的地，同时，10 年后中国有望成为世界第一旅游大国。\n\n然而，中国旅游业还存在一定的问题。据国家旅游局有关负责人介绍，当前中国旅游业发展的一个基本情况，就是旅游需求远远大于旅游供给，呈现出明显的人民群众的需求大大上升，旅游的服务跟不上的短缺性情况。当前大众消费的热点，正由观光旅游向观光与休闲度假并重转变，消费方式灵活多变。但长期以来，中国的旅游产品以景区观光为主，远远满足不了大众休闲的需要。因此今后的中国旅游建设必须向这个方向发展。`,
            questions: [
              { id: 93, options: [`创收比较多`, `关联度大`, `产业链长`, `综合性强`], correctAnswer: "A" },
              { id: 94, options: [`能够促进经济社会协调发展`, `对文化交流具有促进作用`, `对生态文明具有促进作用`, `能使全社会的人全面发展`], correctAnswer: "D" },
              { id: 95, options: [`旅游资源短缺`, `正向观光与休闲度假并重转变`, `旅游需求远远大于旅游供给`, `没有大众休闲的服务`], correctAnswer: "C" },
              { id: 96, options: [`10 年后中国定会成为世界第一旅游大国`, `目前中国的旅游业还不如法、西、美三国`, `中国旅游业收入占 GDP 的比重是 4%`, `中国经济的增长完全由旅游业来拉动`], correctAnswer: "B" }
            ]
          },
          {
            text: `人们在实践中得出了这么一个结论：成功来自谦虚。\n\n为什么成功来自谦虚呢？\n\n庄子说：\u201C吾生也有涯，而知也无涯。\u201D他很明确地说明了学无止境的道理。也就是说，假如知识是辽阔无边的整个宇宙，那么你所知道的只是其中的一颗星星而已。只有掌握了许多必要的、有用的知识，成功的大门才会向你打开。因此，我们要谦虚好学。\n\n著名学者笛卡尔说过：\u201C越学习，越会发现自己的不足。\u201D是啊，只有经过学习，不断扩大知识领域，扩充知识面，储存更多的信息，你才能真正领悟到\u201C知也无涯\u201D的深刻含义。也只有这样，你才能做到谦虚成熟，不断进取，成功便自然会到来。\n\n那么，当我们在学习或事业上有了一定作为的时候，还要不要谦虚呢？答案是肯定的。因为\u201C谦虚使人进步，骄傲使人落后\u201D，有些人常常就是由于骄傲自大而陷入泥坑。如果取得了一点点成绩就沾沾自喜，被眼前的胜利冲昏头脑，就会把辛苦得来的成果毁于一旦。因此，只有在取得好成绩时不自满，才会使事业和学业都更上一层楼。\n\n此外，谦虚更是一种美德、一种修养。能否做到谦虚也是衡量一个人思想品质是否高尚的标准之一。真正优秀的人永远都怀着一颗谦虚谨慎的心，为人处世也远比其他人稳重成熟。\n\n成熟的谷穗低着头，成熟的苹果红着脸，它们都在启示我们：成功来自谦虚。`,
            questions: [
              { id: 97, options: [`知识是宇宙`, `只有努力学习才能学完知识`, `学无止境`, `要勤学好问`], correctAnswer: "C" },
              { id: 98, options: [`不要`, `要`, `不一定`, `文中没提到`], correctAnswer: "B" },
              { id: 99, options: [`取得好成绩时不自满`, `不断努力学习`, `沾沾自喜`, `被眼前的胜利冲昏头脑`], correctAnswer: "A" },
              { id: 100, options: [`高尚的品德`, `有钱有势`, `能力和知识`, `谦虚谨慎`], correctAnswer: "D" }
            ]
          }
        ]
      }
    ],
    listening: [
      {
        type: "short-conversations",
        title: `\u7B2C\u4E00\u90E8\u5206`,
        instructions: `\u7B2C 1\u201415 \u9898\uFF1A\u8BF7\u9009\u51FA\u4E0E\u6240\u542C\u5185\u5BB9\u4E00\u81F4\u7684\u4E00\u9879\u3002`,
        questions: [
          { id: 1, options: [`\u59D1\u5A18\u89C9\u5F97\u81EA\u5DF1\u5F88\u5E78\u8FD0`, `\u5BCC\u5546\u89C9\u5F97\u81EA\u5DF1\u5F88\u5E78\u8FD0`, `\u59D1\u5A18\u7684\u7237\u7237\u6BD4\u5BCC\u5546\u5927 5 \u5C81`, `\u5BCC\u5546\u6BD4\u59D1\u5A18\u7684\u7237\u7237\u5927 5 \u5C81`], correctAnswer: "C" },
          { id: 2, options: [`\u6D17\u8863\u673A\u5F88\u6709\u7528`, `\u4E08\u592B\u4E0D\u559C\u6B22\u505A\u5BB6\u52A1`, `\u4E08\u592B\u4E0D\u559C\u6B22\u7528\u6D17\u8863\u673A`, `\u4E08\u592B\u4E0D\u559C\u6B22\u7528\u6D17\u7897\u673A`], correctAnswer: "B" },
          { id: 3, options: [`\u5B5F\u5B50\u5F88\u6709\u793C\u8C8C`, `\u5B5F\u5B50\u5F88\u806A\u660E`, `\u5B66\u4E60\u73AF\u5883\u5F88\u91CD\u8981`, `\u5B66\u4E60\u73AF\u5883\u4E0D\u592A\u91CD\u8981`], correctAnswer: "C" },
          { id: 4, options: [`\u5C0F\u7537\u5B69\u5728\u5077\u82F9\u679C`, `\u5C0F\u7537\u5B69\u5728\u5403\u82F9\u679C`, `\u82F9\u679C\u6389\u4E0B\u6765\u4E86`, `\u82F9\u679C\u4E0D\u662F\u519C\u592B\u7684`], correctAnswer: "A" },
          { id: 5, options: [`\u5904\u7406\u95EE\u9898\u8981\u5728\u5B83\u53D1\u751F\u4E4B\u524D`, `\u6210\u529F\u662F\u9010\u6E10\u79EF\u7D2F\u8D77\u6765\u7684`, `\u5357\u8F95\u5317\u8F99`, `\u6EE5\u7ABD\u5145\u6570`], correctAnswer: "B" },
          { id: 6, options: [`\u59BB\u5B50\u52A8\u4F5C\u5F88\u5FEB`, `\u4E08\u592B\u559C\u6B22\u59BB\u5B50\u5316\u5986`, `\u4E08\u592B\u5DF2\u7ECF\u7B49\u4E86\u5F88\u4E45`, `\u4ED6\u4EEC\u5DF2\u7ECF\u79BB\u5A5A\u4E86`], correctAnswer: "C" },
          { id: 7, options: [`\u5C0F\u5F3A\u5F88\u806A\u660E`, `\u5A5A\u793C\u4E0D\u8BE5\u5728\u540C\u4E00\u5929`, `\u8FD9\u662F\u5DE7\u5408`, `\u8FD9\u4E0D\u662F\u5DE7\u5408`], correctAnswer: "D" },
          { id: 8, options: [`\u5C0F\u660E\u60F3\u8981\u66F4\u591A\u86CB\u7CD5`, `\u5C0F\u660E\u4E0D\u559C\u6B22\u8721\u70DB`, `\u86CB\u7CD5\u5F88\u5927`, `\u86CB\u7CD5\u5F88\u591A`], correctAnswer: "A" },
          { id: 9, options: [`\u5C0F\u5F3A\u80AF\u5B9A\u5728\u6E9C\u51B0`, `\u5C0F\u5F3A\u53EF\u80FD\u5728\u6E38\u6CF3`, `\u5C0F\u5F3A\u559C\u6B22\u6E9C\u51B0`, `\u5C0F\u5F3A\u559C\u6B22\u6E38\u6CF3`], correctAnswer: "C" },
          { id: 10, options: [`\u4E0A\u5B66\u662F\u5E94\u916C`, `\u513F\u5B50\u4E0D\u60F3\u4E0A\u5B66`, `\u513F\u5B50\u4E0D\u60F3\u56DE\u5BB6\u5403\u665A\u996D`, `\u7238\u7238\u4E5F\u5728\u4E0A\u5B66`], correctAnswer: "B" },
          { id: 11, options: [`\u5C0F\u738B\u559C\u6B22\u8001\u5976\u5976`, `\u5973\u670B\u53CB\u5F88\u5584\u826F`, `\u5C0F\u738B\u5F88\u5584\u826F`, `\u90A3\u4E2A\u670B\u53CB\u5F88\u5584\u826F`], correctAnswer: "C" },
          { id: 12, options: [`\u82F9\u679C\u5F88\u597D\u5403`, `\u5B69\u5B50\u4EEC\u5E38\u5077\u82F9\u679C`, `\u7267\u5E08\u591A\u5634\u591A\u820C`, `\u5B69\u5B50\u4EEC\u591A\u5634\u591A\u820C`], correctAnswer: "B" },
          { id: 13, options: [`\u58F0\u97F3\u662F\u56FA\u5B9A\u4E0D\u53D8\u7684`, `\u58F0\u97F3\u53EA\u6709\u4E00\u4E2A`, `\u6CA1\u6709\u7B2C\u4E8C\u79CD\u58F0\u97F3`, `\u6211\u4EEC\u6709\u4E24\u79CD\u58F0\u97F3`], correctAnswer: "D" },
          { id: 14, options: [`\u513F\u5B50\u5F88\u5173\u5FC3\u7238\u7238`, `\u513F\u5B50\u4E0D\u4F1A\u8003\u7B2C\u4E00\u540D`, `\u7238\u7238\u5F88\u9AD8\u5174`, `\u7238\u7238\u8981\u6B7B\u4E86`], correctAnswer: "B" },
          { id: 15, options: [`\u5988\u5988\u5C0F\u65F6\u5019\u5F88\u6DD8\u6C14`, `\u5988\u5988\u5F88\u6DD8\u6C14`, `\u5C0F\u5F3A\u7684\u5B69\u5B50\u5F88\u6DD8\u6C14`, `\u5C0F\u5F3A\u5F88\u6DD8\u6C14`], correctAnswer: "D" }
        ]
      },
      {
        type: "interviews",
        title: `\u7B2C\u4E8C\u90E8\u5206`,
        instructions: `\u7B2C 16\u201430 \u9898\uFF1A\u8BF7\u9009\u51FA\u6B63\u786E\u7B54\u6848\u3002`,
        questions: [
          { id: 16, options: [`\u4FEE\u8865\u7A97\u6237`, `\u88C5\u9970\u623F\u95F4`, `\u8868\u8FBE\u5185\u5FC3`, `\u6392\u9664\u65E0\u804A`], correctAnswer: "C" },
          { id: 17, options: [`\u59E5\u59E5\u548C\u5988\u5988`, `\u5976\u5976\u548C\u5988\u5988`, `\u5976\u5976\u548C\u59E5\u59E5`, `\u5976\u5976\u3001\u59E5\u59E5\u548C\u5988\u5988`], correctAnswer: "B" },
          { id: 18, options: [`\u63A5\u8FD1\u4E00\u4E07`, `\u4E00\u4E07`, `\u4E00\u4E07\u591A`, `\u4E24\u4E07`], correctAnswer: "A" },
          { id: 19, options: [`1996 \u5E74`, `1997 \u5E74`, `1998 \u5E74`, `1999 \u5E74`], correctAnswer: "C" },
          { id: 20, options: [`\u91D1\u5956`, `\u94F6\u5956`, `\u94DC\u5956`, `\u4F18\u79C0\u5956`], correctAnswer: "B" },
          { id: 21, options: [`\u6234\u52C7`, `\u5EFA\u7B51\u5E08`, `\u83AB\u5C1A\u52E4`, `\u5DE5\u7A0B\u5E08`], correctAnswer: "C" },
          { id: 22, options: [`\u9999\u6E2F`, `\u6DF1\u5733`, `\u5E7F\u5DDE`, `\u4E0A\u6D77`], correctAnswer: "A" },
          { id: 23, options: [`\u5B8C\u7F8E\u548C\u6C38\u8FDC`, `\u5B8C\u7F8E\u548C\u6C38\u6052`, `\u6EE1\u8DB3\u548C\u6052\u4E45`, `\u5B8C\u6574\u548C\u4E45\u8FDC`], correctAnswer: "B" },
          { id: 24, options: [`\u516C\u5BD3`, `\u56FE\u4E66\u9986`, `\u5546\u573A`, `\u529E\u516C\u697C`], correctAnswer: "D" },
          { id: 25, options: [`\u5F00\u516C\u53F8`, `\u5F00\u82B1\u5ECA`, `\u5F00\u753B\u5ECA`, `\u5F00\u82B1\u5E97`], correctAnswer: "C" },
          { id: 26, options: [`\u4E95\u91CC\u7684\u6C34`, `\u6CB3\u91CC\u7684\u6C34`, `\u4E0B\u96EA\u878D\u5316\u7684\u6C34`, `\u4E0B\u96E8\u84C4\u79EF\u7684\u6C34`], correctAnswer: "D" },
          { id: 27, options: [`\u4E0D\u80FD\u9002\u5E94\u90A3\u91CC\u7684\u73AF\u5883`, `\u5E0C\u671B\u56DE\u5230\u5927\u57CE\u5E02\u751F\u6D3B`, `\u60F3\u8BFB\u4E66\u5145\u5B9E\u4E30\u5BCC\u81EA\u5DF1`, `\u4E0D\u592A\u559C\u6B22\u90A3\u91CC\u7684\u5B69\u5B50`], correctAnswer: "C" },
          { id: 28, options: [`\u5BB6\u4EBA\u7684\u5E2E\u52A9`, `\u5F97\u5230\u7684\u6295\u8D44`, `\u81EA\u5DF1\u8D5A\u7684\u94B1`, `\u670B\u53CB\u7684\u5E2E\u52A9`], correctAnswer: "B" },
          { id: 29, options: [`\u751F\u6D3B\u95EE\u9898`, `\u5B66\u8D39\u95EE\u9898`, `\u8EAB\u4F53\u5065\u5EB7\u95EE\u9898`, `\u5FC3\u7406\u5065\u5EB7\u95EE\u9898`], correctAnswer: "D" },
          { id: 30, options: [`\u5E73\u7B49\u5173\u7CFB`, `\u5E2E\u52A9\u4E0E\u88AB\u5E2E\u52A9\u7684\u5173\u7CFB`, `\u5C0A\u91CD\u4E0E\u88AB\u5C0A\u91CD\u7684\u5173\u7CFB`, `\u7167\u987E\u4E0E\u88AB\u7167\u987E\u7684\u5173\u7CFB`], correctAnswer: "A" }
        ]
      },
      {
        type: "passages",
        title: `\u7B2C\u4E09\u90E8\u5206`,
        instructions: `\u7B2C 31\u201450 \u9898\uFF1A\u8BF7\u9009\u51FA\u6B63\u786E\u7B54\u6848\u3002`,
        questions: [
          { id: 31, options: [`\u5F88\u5BB9\u6613\u627E\u5230\u5DE5\u4F5C`, `\u6CA1\u4EC0\u4E48\u53D8\u5316`, `\u8D8A\u6765\u8D8A\u5BB9\u6613`, `\u8D8A\u6765\u8D8A\u96BE`], correctAnswer: "D" },
          { id: 32, options: [`\u5B66\u751F\u4EEC\u4E0D\u60F3\u627E\u5DE5\u4F5C`, `\u771F\u5B9E\u6709\u6548\u7684\u4FE1\u606F\u5C11`, `\u5B66\u751F\u4EEC\u4E0D\u559C\u6B22\u548C\u522B\u4EBA\u4E89`, `\u771F\u5B9E\u6709\u6548\u7684\u4FE1\u606F\u592A\u591A`], correctAnswer: "B" },
          { id: 33, options: [`\u5B66\u751F\u6761\u4EF6\u4E0D\u597D`, `\u5B66\u751F\u7F3A\u4E4F\u7ECF\u9A8C`, `\u5B66\u751F\u559C\u6B22\u7ADE\u4E89`, `\u4F01\u4E1A\u9700\u8981\u4EBA\u624D`], correctAnswer: "B" },
          { id: 34, options: [`\u505A\u751F\u610F`, `\u5BA3\u4F20\u4EA7\u54C1`, `\u62A2\u52AB`, `\u6536\u53D6\u8D39\u7528`], correctAnswer: "D" },
          { id: 35, options: [`\u90FD\u662F\u5BCC\u7FC1`, `\u5BCC\u7FC1\u548C\u5F3A\u76D7`, `\u5BCC\u7FC1\u548C\u62C9\u6BD4`, `\u62C9\u6BD4\u548C\u5F3A\u76D7`], correctAnswer: "C" },
          { id: 36, options: [`\u9700\u8981\u4F11\u606F`, `\u906D\u5230\u4E86\u62A2\u52AB`, `\u9047\u5230\u4E86\u5927\u98CE`, `\u9047\u5230\u4E86\u5F3A\u76D7`], correctAnswer: "C" },
          { id: 37, options: [`\u62C9\u6BD4\u5F88\u6709\u94B1`, `\u62C9\u6BD4\u6709\u77E5\u8BC6\u548C\u667A\u6167`, `\u62C9\u6BD4\u7ED9\u4ED6\u4EEC\u8BB2\u8BFE`, `\u62C9\u6BD4\u662F\u72B9\u592A\u4EBA`], correctAnswer: "B" },
          { id: 38, options: [`\u83B7\u53D6\u667A\u6167\u548C\u77E5\u8BC6`, `\u53D7\u5230\u522B\u4EBA\u7684\u8D4F\u8BC6`, `\u8D5A\u5230\u5F88\u591A\u94B1`, `\u4FDD\u62A4\u81EA\u5DF1\u7684\u4E1C\u897F\u4E0D\u88AB\u522B\u4EBA\u62A2\u8D70`], correctAnswer: "A" },
          { id: 39, options: [`\u9547\u9759\u5242`, `\u5496\u5561\u679C`, `\u5496\u5561\u8C46`, `\u5496\u5561\u56E0`], correctAnswer: "D" },
          { id: 40, options: [`0\u20141 \u676F`, `1\u20142 \u676F`, `2\u20143 \u676F`, `4\u20145 \u676F`], correctAnswer: "C" },
          { id: 41, options: [`\u6CA1\u6709\u5F71\u54CD`, `\u7834\u574F\u795E\u7ECF\u7CFB\u7EDF`, `\u809A\u5B50\u997F`, `\u8116\u5B50\u75BC`], correctAnswer: "B" },
          { id: 42, options: [`\u4E0D\u77E5\u9053`, `\u6CA1\u6709\u5F71\u54CD`, `\u5E2E\u52A9\u7761\u7720`, `\u7834\u574F\u7761\u7720`], correctAnswer: "D" },
          { id: 43, options: [`\u5317\u4EAC`, `\u4E39\u4E1C`, `\u5927\u8FDE`, `\u4E0A\u6D77`], correctAnswer: "B" },
          { id: 44, options: [`50 \u5E74`, `20 \u5E74`, `10 \u5E74`, `15 \u5E74`], correctAnswer: "B" },
          { id: 45, options: [`300 \u7C73`, `500 \u7C73`, `300\u2014500 \u7C73`, `3000\u20145000 \u7C73`], correctAnswer: "C" },
          { id: 46, options: [`\u8FBD\u5B81`, `\u5C71\u4E1C`, `\u6CB3\u5317`, `\u6CB3\u5357`], correctAnswer: "A" },
          { id: 47, options: [`\u611F\u5192`, `\u4E59\u6D41`, `\u7532\u6D41`, `\u79BD\u6D41\u611F`], correctAnswer: "C" },
          { id: 48, options: [`\u7F8E\u56FD\u6E38\u5BA2`, `\u58A8\u897F\u54E5\u6E38\u5BA2`, `\u60F3\u53BB\u56FD\u5916\u7684\u4E2D\u56FD\u4EBA`, `\u4ECE\u56FD\u5916\u56DE\u6765\u7684\u4E2D\u56FD\u4EBA`], correctAnswer: "D" },
          { id: 49, options: [`\u53D1\u70E7\u3001\u5934\u75DB`, `\u53D1\u70E7\u3001\u54B3\u55FD`, `\u54B3\u55FD\u3001\u6D41\u6D95`, `\u53D1\u70E7\u3001\u8179\u6CFB`], correctAnswer: "B" },
          { id: 50, options: [`\u9A6C\u4E0A\u56DE\u56FD`, `\u6682\u65F6\u4E0D\u8981\u56DE\u56FD`, `\u6CA1\u6709\u8981\u6C42`, `\u81EA\u6211\u89C2\u5BDF`], correctAnswer: "B" }
        ]
      }
    ],
    writing: {
      title: `\u4E09\u3001\u4E66 \u5199`,
      instructions: [
        `\u7B2C 101 \u9898\uFF1A\u7F29\u5199\u3002`,
        `(1) \u4ED4\u7EC6\u9605\u8BFB\u4E0B\u9762\u8FD9\u7BC7\u6587\u7AE0\uFF0C\u65F6\u95F4\u4E3A 10 \u5206\u949F\uFF0C\u9605\u8BFB\u65F6\u4E0D\u80FD\u6284\u5199\u3001\u8BB0\u5F55\u3002`,
        `(2) 10 \u5206\u949F\u540E\uFF0C\u76D1\u8003\u6536\u56DE\u9605\u8BFB\u6750\u6599\uFF0C\u8BF7\u4F60\u5C06\u8FD9\u7BC7\u6587\u7AE0\u7F29\u5199\u6210\u4E00\u7BC7\u77ED\u6587\uFF0C\u65F6\u95F4\u4E3A 35 \u5206\u949F\u3002`,
        `(3) \u6807\u9898\u81EA\u62DF\u3002\u53EA\u9700\u590D\u8FF0\u6587\u7AE0\u5185\u5BB9\uFF0C\u4E0D\u9700\u52A0\u5165\u81EA\u5DF1\u7684\u89C2\u70B9\u3002`,
        `(4) \u5B57\u6570\u4E3A 400 \u5B57\u5DE6\u53F3\u3002`,
        `(5) \u8BF7\u628A\u4F5C\u6587\u76F4\u63A5\u5199\u5728\u7B54\u9898\u5361\u4E0A\u3002`
      ],
      prompt: `\u591A\u5E74\u524D\u6709\u4E00\u4E2A\u978B\u5320\uFF0C\u5728\u5C0F\u57CE\u4E00\u6761\u8857\u7684\u62D0\u89D2\u5904\u6446\u6452\u4FEE\u978B\uFF0C\u5BD2\u6765\u6691\u5F80\uFF0C\u4E5F\u8BF4\u4E0D\u6E05\u6709\u591A\u5C11\u4E2A\u5E74\u5934\u4E86\u3002\n\n\u6709\u4E00\u4E2A\u51AC\u5929\u7684\u508D\u665A\uFF0C\u4ED6\u6B63\u8981\u6536\u6452\u56DE\u5BB6\u7684\u65F6\u5019\uFF0C\u4E00\u8F6C\u8EAB\uFF0C\u770B\u5230\u4E00\u4E2A\u5C0F\u5B69\u5728\u4E0D\u8FDC\u5904\u7AD9\u7740\u3002\u770B\u4E0A\u53BB\uFF0C\u5B69\u5B50\u51BB\u5F97\u4E0D\u8F7B\uFF0C\u8EAB\u5B50\u5FAE\u8E6D\u7740\uFF0C\u8033\u6735\u901A\u7EA2\u901A\u7EA2\u7684\uFF0C\u773C\u775B\u76F4\u60D1\u5730\u76EF\u7740\u4ED6\uFF0C\u773C\u795E\u5446\u6EDE\u800C\u53C8\u8292\u7136\u3002\n\n\u4ED6\u628A\u5B69\u5B50\u9886\u56DE\u5BB6\u7684\u90A3\u4E2A\u665A\u4E0A\uFF0C\u8001\u5A46\u5C31\u548C\u4ED6\u95F9\u522B\u626D\u3002\u5BF9\u4E8E\u8FD9\u6837\u4E00\u4E2A\u6D41\u6D6A\u7684\u5B69\u5B50\uFF0C\u6709\u8C01\u613F\u610F\u7BA1\u5462\uFF1F\u66F4\u4F55\u51B5\uFF0C\u4E00\u5BB6\u5927\u5C0F\u597D\u51E0\u5F20\u5634\uFF0C\u5403\u996D\u5DF2\u7ECF\u662F\u95EE\u9898\uFF0C\u518D\u6DFB\u4E00\u53E3\u4EBA\u5C31\u66F4\u663E\u56F0\u7A98\u3002\u4ED6\u5012\u4E5F\u4E0D\u4E89\u6267\uFF0C\u4F4E\u7740\u5934\u53EA\u6709\u4E00\u53E5\u8BDD\uFF1A\u201C\u6CA1\u4EBA\u7BA1\u7684\u5B69\u5B50\u6211\u770B\u770B\u53EF\u601C\u3002\u201D\u7136\u540E\u4FBF\u542C\u51ED\u8001\u5A46\u5570\u5570\u53E8\u53E8\u5730\u9A82\u3002\n\n\u5C3D\u7BA1\u8FD9\u6837\uFF0C\u8FD9\u5B69\u5B50\u8FD8\u662F\u7559\u4E86\u4E0B\u6765\u3002\u978B\u5320\u5219\u4E00\u8FB9\u5728\u8857\u4E0A\u9489\u978B\uFF0C\u4E00\u8FB9\u6253\u542C\u8C01\u5BB6\u8D70\u4E22\u4E86\u5B69\u5B50\u3002\u4E24\u5E74\u591A\u7684\u65F6\u95F4\u8FC7\u53BB\u4E86\uFF0C\u5E76\u6CA1\u6709\u4EBA\u6765\u8BA4\u9886\u8FD9\u4E2A\u5B69\u5B50\uFF0C\u5B69\u5B50\u5374\u957F\u5927\u4E86\u8BB8\u591A\uFF0C\u61C2\u4E8B\u3001\u542C\u8BDD\u800C\u4E14\u806A\u660E\u3002\u978B\u5320\u8001\u5A46\u6E10\u6E10\u559C\u6B22\u4E0A\u4E86\u8FD9\u4E2A\u5B69\u5B50\uFF0C\u5BB6\u91CC\u518D\u62EE\u636E\uFF0C\u4E5F\u820D\u5F97\u62FF\u94B1\u6765\u4E3A\u5B69\u5B50\u4E70\u7A7F\u7684\u548C\u73A9\u7684\u3002\u8857\u574A\u90BB\u5C45\u90FD\u529D\u4ED6\u4EEC\u628A\u5B69\u5B50\u7559\u4E0B\u6765\uFF0C\u978B\u5320\u8001\u5A46\u4E5F\u52A8\u4E86\u5FC3\u3002\u6709\u4E00\u5929\u5403\u996D\u65F6\uFF0C\u5979\u5BF9\u978B\u5320\u8BF4\uFF1A\u201C\u8981\u4E0D\uFF0C\u54B1\u4EEC\u628A\u4ED6\u7559\u4E0B\u6765\u5F53\u4EB2\u513F\u5B50\u517B\u5427\u3002\u201D\u978B\u5320\u95F7\u4E86\u534A\u54CD\u6CA1\u8BF4\u8BDD\uFF0C\u672B\u4E86\uFF0C\u628A\u7897\u5F80\u684C\u4E0A\u4E00\u4E22\uFF1A\u201C\u8D34\u5FC3\u8D34\u8089\uFF0C\u4ED6\u7236\u6BCD\u5FEB\u60F3\u75AF\u4E86\uFF0C\u4F60\u80E1\u8BF4\u4EC0\u4E48\uFF01\u201D\n\n\u978B\u5320\u8FD8\u662F\u56DB\u5904\u6253\u542C\uFF0C\u4ED6\u4E00\u523B\u4E5F\u6CA1\u6709\u653E\u677E\u5BF9\u5B69\u5B50\u7236\u6BCD\u7684\u627E\u5BFB\u3002\u4ED6\u6C42\u4EBA\u5199\u4E0B\u597D\u591A\u5BFB\u4EBA\u542F\u4E8B\uFF0C\u7136\u540E\u4E0D\u8F9E\u8F9B\u82E6\u5730\u8D34\u5230\u5927\u8857\u5C0F\u5DF7\u3002\u98CE\u522E\u96E8\u6DCB\u4E4B\u540E\uFF0C\u4ED6\u53C8\u91CD\u65B0\u518D\u6765\u4E00\u904D\u3002\u751A\u81F3\u6709\u719F\u4EBA\u53BB\u5916\u5730\uFF0C\u4ED6\u4E5F\u8981\u8BA9\u4EBA\u5BB6\u5E26\u4E0A\u51E0\u4EFD\uFF0C\u5E2E\u4ED6\u5F20\u8D34\u3002\u4ED6\u627E\u8FC7\u62A5\u793E\uFF0C\u6CA1\u6709\u4EBA\u613F\u610F\u5E2E\u8FD9\u4E2A\u5FD9\uFF0C\u7535\u89C6\u53F0\u4E5F\u6CA1\u6709\u5E2E\u52A9\u4ED6\u7684\u610F\u601D\u3002\u4ED6\u628A\u8BE5\u60F3\u7684\u529E\u6CD5\u90FD\u60F3\u4E86\uFF0C\u5FC3\u4E2D\u53EA\u6709\u4E00\u4E2A\u5FF5\u5934\uFF1A\u4E00\u5B9A\u8981\u627E\u5230\u5B69\u5B50\u7684\u7236\u6BCD\u3002\n\n\u7EC8\u4E8E\u6709\u4E00\u5929\uFF0C\u5B69\u5B50\u7684\u7236\u6BCD\u5BFB\u5230\u4E86\u8FD9\u4E2A\u5730\u65B9\u3002\u4ED6\u4EEC\u53EA\u662F\u8BF4\u4E86\u51E0\u53E5\u611F\u8C22\u7684\u8BDD\uFF0C\u5C31\u6025\u5306\u5306\u5730\u5E26\u7740\u5B69\u5B50\u8D70\u4E86\u3002\u978B\u5320\u5E76\u6CA1\u6709\u8BA1\u8F83\u4EC0\u4E48\uFF0C\u53EA\u662F\u4E00\u8D77\u6452\u6452\u7684\u4EBA\u90FD\u8BF4\u4ED6\u50CF\u3002\u4ED6\u603B\u662F\u563F\u563F\u4E00\u7B11\uFF0C\u4EC0\u4E48\u4E5F\u4E0D\u8BF4\u3002\n\n\u751F\u6D3B\u597D\u50CF\u771F\u7684\u8DDF\u978B\u5320\u5F00\u4E86\u4E2A\u73A9\u7B11\uFF0C\u8FD9\u4E4B\u540E\u4FBF\u518D\u6CA1\u6709\u6536\u5230\u5B69\u5B50\u7684\u4EFB\u4F55\u97F3\u4FE1\u3002\u540E\u6765\uFF0C\u4ED6\u642C\u79BB\u4E86\u90A3\u5EA7\u5C0F\u57CE\uFF0C\u4E00\u5BB6\u4EBA\u6273\u7740\u6307\u5934\u8BA1\u7B97\u7740\u5B69\u5B50\u7684\u5C81\u6570\uFF0C\u5E0C\u671B\u957F\u5927\u4E86\u7684\u5B69\u5B50\u80FD\u591F\u56DE\u6765\u770B\u770B\u4ED6\u4EEC\u3002\u4F46\u662F\uFF0C\u6CA1\u6709\u3002\u518D\u540E\u6765\u53C8\u6570\u6B21\u642C\u5BB6\uFF0C\u76F4\u5230\u4ED6\u6B7B\uFF0C\u4ED6\u4E5F\u6CA1\u6709\u7B49\u5230\u4EC0\u4E48\u3002\n\n\u82E5\u5E72\u5E74\u540E\uFF0C\u4E00\u4E2A\u6709\u5FB7\u6709\u624D\u7684\u5C0F\u4F19\u5B50\u56E0\u4E3A\u5E2E\u52A9\u5BFB\u627E\u5931\u6563\u7684\u4EBA\u6210\u4E86\u540D\uFF0C\u4ED6\u5728\u4E92\u8054\u7F51\u4E0A\u8FD8\u6CE8\u518C\u4E86\u4E00\u4E2A\u4E13\u95E8\u5BFB\u4EBA\u7684\u514D\u8D39\u7F51\u7AD9\u3002\u4EE4\u4EBA\u60CA\u5947\u7684\u662F\uFF0C\u7F51\u7AD9\u7ADF\u7136\u662F\u4EE5\u978B\u5320\u7684\u540D\u5B57\u547D\u540D\u7684\u3002\u8FDB\u5165\u7F51\u7AD9\uFF0C\u4EBA\u4EEC\u770B\u5230\uFF0C\u5728\u663E\u8981\u4F4D\u7F6E\u4E0A\uFF0C\u662F\u7F51\u7AD9\u521B\u59CB\u4EBA\u7684\u201C\u5BFB\u4EBA\u542F\u4E8B\u201D\u3002\u4ED6\u8981\u5BFB\u627E\u7684\uFF0C\u5C31\u662F\u5F88\u591A\u5E74\u4EE5\u524D\uFF0C\u66FE\u7ECF\u7ED9\u8FC7\u6D41\u843D\u5728\u8857\u5934\u7684\u4ED6\u65E0\u9650\u5173\u7231\u548C\u5E2E\u52A9\u7684\u90A3\u4E2A\u978B\u5320\u3002\n\n\u7F51\u7AD9\u4E3B\u9875\u4E0A\uFF0C\u6EDA\u52A8\u7740\u8FD9\u6837\u4E00\u53E5\u8010\u4EBA\u5BFB\u5473\u7684\u8BDD\uFF1A\u5F53\u4F60\u5F97\u5230\u8FC7\u522B\u4EBA\u7231\u7684\u6E29\u6696\uFF0C\u800C\u751F\u6D3B\u8BA9\u4F60\u61C2\u5F97\u4E86\u628A\u6E29\u6696\u53D8\u6210\u6C38\u6052\uFF0C\u4ECE\u800C\u53BB\u7167\u4EAE\u53E6\u5916\u7684\u4EBA\u7684\u65F6\u5019\uFF0C\u4E0D\u8981\u5FD8\u4E86\uFF0C\u8FD9\u5C31\u662F\u751F\u6D3B\u5BF9\u7231\u7684\u6700\u9AD8\u5956\u8D4F\u3002`,
      sampleAnswer: `\u751F\u6D3B\u5BF9\u7231\u7684\u6700\u9AD8\u5956\u8D4F\n\n\u5F88\u591A\u5E74\u4EE5\u524D\uFF0C\u5728\u4E00\u4E2A\u5C0F\u57CE\u91CC\uFF0C\u6709\u4E00\u4E2A\u978B\u5320\u6BCF\u5929\u8F9B\u82E6\u5730\u5DE5\u4F5C\u7740\u3002\u5728\u4E00\u4E2A\u51AC\u5929\u7684\u508D\u665A\uFF0C\u4ED6\u521A\u8981\u6536\u6452\u56DE\u5BB6\u7684\u65F6\u5019\uFF0C\u4E00\u8F6C\u8EAB\uFF0C\u770B\u89C1\u4E00\u4E2A\u5C0F\u7537\u5B69\u5728\u4E0D\u8FDC\u5904\u7AD9\u7740\u3002\u56E0\u4E3A\u5929\u6C14\u5F88\u51B7\uFF0C\u8FD9\u4E2A\u5B69\u5B50\u7A7F\u5F97\u5F88\u5C11\uFF0C\u4ED6\u7684\u8033\u6735\u88AB\u51BB\u5F97\u901A\u7EA2\uFF0C\u53EF\u662F\u978B\u5320\u5374\u628A\u8FD9\u4E2A\u53EF\u601C\u7684\u5B69\u5B50\u9886\u56DE\u4E86\u5BB6\u3002\n\n\u978B\u5320\u7684\u59BB\u5B50\u770B\u89C1\u4E08\u592B\u9886\u56DE\u4E00\u4E2A\u6D41\u6D6A\u7684\u5B69\u5B50\u5F88\u4E0D\u9AD8\u5174\u3002\u800C\u5BF9\u59BB\u5B50\u7684\u5570\u53E8\uFF0C\u978B\u5320\u53EA\u8BF4\u4E86\u4E00\u53E5\u8BDD\uFF1A\u201C\u6CA1\u4EBA\u7BA1\u7684\u5B69\u5B50\u6211\u770B\u770B\u53EF\u601C\u3002\u201D\u5B50\u662F\uFF0C\u8FD9\u4E2A\u5B69\u5B50\u5C31\u7559\u4E86\u4E0B\u6765\u3002\n\n\u4E24\u5E74\u591A\u65F6\u95F4\u8FC7\u53BB\u4E86\uFF0C\u5B69\u5B50\u957F\u5927\u4E86\u8BB8\u591A\uFF0C\u5E76\u4E14\u5F88\u61C2\u4E8B\u3001\u5F88\u806A\u660E\u3002\u978B\u5320\u60F3\u5B69\u5B50\u7684\u7236\u6BCD\u4E00\u5B9A\u5F88\u7740\u6025\uFF0C\u4ED6\u4E00\u76F4\u5728\u5E2E\u52A9\u8FD9\u5B69\u5B50\u5BFB\u627E\u4ED6\u7684\u4EB2\u751F\u7236\u6BCD\u3002\u978B\u5320\u56DB\u5904\u6253\u542C\uFF0C\u4ECE\u6765\u6CA1\u6709\u653E\u5F03\u5BF9\u5B69\u5B50\u7236\u6BCD\u7684\u5BFB\u627E\u3002\u7EC8\u4E8E\u6709\u4E00\u5929\uFF0C\u5B69\u5B50\u7684\u7236\u6BCD\u627E\u5230\u4E86\u8FD9\u4E2A\u978B\u5320\uFF0C\u4ED6\u4EEC\u53EA\u8BF4\u4E86\u51E0\u53E5\u611F\u8C22\u7684\u8BDD\uFF0C\u5C31\u628A\u5B69\u5B50\u5E26\u8D70\u4E86\u3002\n\n\u4ECE\u8FD9\u4EE5\u540E\uFF0C\u978B\u5320\u518D\u4E5F\u6CA1\u6709\u6536\u5230\u5B69\u5B50\u7684\u4EFB\u4F55\u97F3\u4FE1\uFF0C\u76F4\u5230\u53BB\u4E16\u3002\u82E5\u5E72\u5E74\u540E\uFF0C\u4E00\u4E2A\u6709\u5FB7\u6709\u624D\u7684\u5C0F\u4F19\u5B50\u56E0\u4E3A\u5E2E\u52A9\u5BFB\u627E\u5931\u6563\u7684\u4EBA\u6210\u4E86\u540D\uFF0C\u4ED6\u5728\u4E92\u8054\u7F51\u4E0A\u8FD8\u6CE8\u518C\u4E86\u4E00\u4E2A\u5BFB\u4EBA\u7684\u7F51\u7AD9\u3002\u7F51\u7AD9\u7ADF\u7136\u662F\u4EE5\u978B\u5320\u7684\u540D\u5B57\u547D\u540D\u7684\u3002\u4ED6\u8981\u5BFB\u627E\u7684\uFF0C\u5C31\u662F\u5F88\u591A\u5E74\u4EE5\u524D\uFF0C\u66FE\u7ECF\u7ED9\u8FC7\u6D41\u843D\u5728\u8857\u5934\u7684\u4ED6\u65E0\u9650\u5173\u7231\u548C\u5E2E\u52A9\u7684\u90A3\u4E2A\u978B\u5320\u3002`
    }
  }
};

import { mockExam4 } from "./mockExam4";
import { mockExam5 } from "./mockExam5";

export const allMockExams: MockExam[] = [mockExam1, mockExam4, mockExam5];
