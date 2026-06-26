// Dữ liệu 34 đơn vị hành chính cấp tỉnh của Trung Quốc.
// `geoName` PHẢI khớp với thuộc tính `name` trong src/data/china-geo.json.
// Phase 1: 6 đơn vị có nội dung chi tiết, 28 đơn vị còn lại ở dạng stub.

export type ProvinceKind = "省" | "直辖市" | "自治区" | "特别行政区";

export type ProvinceReading = {
  cn: string;
  pinyin: string;
  vn: string;
};

export type ProvinceHighlights = {
  cuisine?: string[];
  universities?: string[];
  industries?: string[];
  famousPeople?: string[];
  landmarks?: string[];
  historical?: string;
};

export type Province = {
  id: string;            // mã 2 ký tự khớp china-geo.json
  geoName: string;       // tên tiếng Trung khớp china-geo.json
  nameCn: string;        // tên rút gọn để hiển thị
  namePinyin: string;
  nameVn: string;
  kind: ProvinceKind;
  emoji: string;
  capital?: string;
  capitalVn?: string;
  population?: string;
  area?: string;
  majorCities?: { cn: string; vn: string }[];
  highlights?: ProvinceHighlights;
  reading?: ProvinceReading;
};

export const PROVINCES: Province[] = [
  // ============ 6 ĐƠN VỊ MẪU CÓ NỘI DUNG ĐẦY ĐỦ ============
  {
    id: "11",
    geoName: "北京市",
    nameCn: "北京",
    namePinyin: "Běijīng",
    nameVn: "Bắc Kinh",
    kind: "直辖市",
    emoji: "🏯",
    capital: "北京",
    capitalVn: "Bắc Kinh",
    population: "≈ 21.8 triệu",
    area: "16 411 km²",
    majorCities: [
      { cn: "海淀区", vn: "Hải Điến (khu đại học)" },
      { cn: "朝阳区", vn: "Triều Dương (CBD)" },
      { cn: "东城区", vn: "Đông Thành (Tử Cấm Thành)" },
    ],
    highlights: {
      cuisine: ["北京烤鸭 Vịt quay Bắc Kinh", "炸酱面 Mì tương đen", "豆汁 Đậu trấp"],
      universities: ["清华大学 Đại học Thanh Hoa", "北京大学 Đại học Bắc Kinh", "中国人民大学"],
      industries: ["Chính trị – Trung tâm Đảng & Chính phủ", "Công nghệ (中关村)", "Giáo dục, Truyền thông"],
      famousPeople: ["老舍 Lão Xá (văn hào)", "梅兰芳 Mai Lan Phương (Kinh kịch)"],
      landmarks: ["故宫 Cố Cung", "长城 Vạn Lý Trường Thành (đoạn 八达岭)", "天安门 Thiên An Môn", "颐和园 Di Hoà Viên"],
      historical: "Cố đô của 5 triều đại: Liêu, Kim, Nguyên, Minh, Thanh",
    },
    reading: {
      cn: "北京是中华人民共和国的首都，也是中国的政治、文化和国际交往中心。这座古老的城市有三千多年的历史，曾经是元、明、清三个朝代的首都。游客来到北京，一定会去参观故宫、长城和天安门广场。除了名胜古迹，北京烤鸭也是世界闻名的美食。",
      pinyin: "Běijīng shì Zhōnghuá Rénmín Gònghéguó de shǒudū, yě shì Zhōngguó de zhèngzhì, wénhuà hé guójì jiāowǎng zhōngxīn. Zhè zuò gǔlǎo de chéngshì yǒu sān qiān duō nián de lìshǐ, céngjīng shì Yuán, Míng, Qīng sān ge cháodài de shǒudū. Yóukè lái dào Běijīng, yīdìng huì qù cānguān Gùgōng, Chángchéng hé Tiān'ānmén Guǎngchǎng. Chúle míngshèng gǔjì, Běijīng kǎoyā yěshì shìjiè wénmíng de měishí.",
      vn: "Bắc Kinh là thủ đô của Cộng hoà Nhân dân Trung Hoa, đồng thời là trung tâm chính trị, văn hoá và giao lưu quốc tế của Trung Quốc. Thành phố cổ kính này có hơn ba nghìn năm lịch sử, từng là kinh đô của ba triều đại Nguyên, Minh, Thanh. Du khách đến Bắc Kinh nhất định sẽ ghé thăm Cố Cung, Vạn Lý Trường Thành và Quảng trường Thiên An Môn. Ngoài các danh thắng cổ tích, vịt quay Bắc Kinh cũng là món ăn nổi tiếng khắp thế giới.",
    },
  },
  {
    id: "31",
    geoName: "上海市",
    nameCn: "上海",
    namePinyin: "Shànghǎi",
    nameVn: "Thượng Hải",
    kind: "直辖市",
    emoji: "🌃",
    capital: "上海",
    capitalVn: "Thượng Hải",
    population: "≈ 24.9 triệu",
    area: "6 340 km²",
    majorCities: [
      { cn: "浦东新区", vn: "Phố Đông (tài chính)" },
      { cn: "黄浦区", vn: "Hoàng Phố (bến Thượng Hải)" },
      { cn: "徐汇区", vn: "Từ Hối" },
    ],
    highlights: {
      cuisine: ["小笼包 Tiểu long bao", "生煎包 Sinh tiên bao", "本帮菜 Bản bang thái"],
      universities: ["复旦大学 Đại học Phục Đán", "上海交通大学 Giao Thông", "同济大学 Đồng Tế"],
      industries: ["Tài chính (sàn 上交所)", "Cảng biển lớn nhất TG", "Sản xuất ô tô, hàng không"],
      famousPeople: ["鲁迅 Lỗ Tấn (sống & làm việc lâu năm)", "周璇 Chu Tuyền (ca sĩ)"],
      landmarks: ["外滩 Bến Thượng Hải", "东方明珠 Đông Phương Minh Châu", "豫园 Dự Viên", "迪士尼乐园 Disneyland"],
      historical: "Làng chài nhỏ → trung tâm thương mại quốc tế từ thế kỷ 19",
    },
    reading: {
      cn: "上海位于中国东部，是中国最大的经济和金融中心。一百多年前，上海还只是一个小渔村，后来发展成了国际化的大都市。今天的上海高楼林立，外滩的夜景非常美丽。这里既有古老的豫园，也有现代化的东方明珠塔，传统和现代在这里完美结合。",
      pinyin: "Shànghǎi wèiyú Zhōngguó dōngbù, shì Zhōngguó zuì dà de jīngjì hé jīnróng zhōngxīn. Yībǎi duō nián qián, Shànghǎi hái zhǐshì yī ge xiǎo yúcūn, hòulái fāzhǎn chéngle guójìhuà de dà dūshì. Jīntiān de Shànghǎi gāolóu línlì, Wàitān de yèjǐng fēicháng měilì. Zhèlǐ jì yǒu gǔlǎo de Yùyuán, yě yǒu xiàndàihuà de Dōngfāng Míngzhū tǎ, chuántǒng hé xiàndài zài zhèlǐ wánměi jiéhé.",
      vn: "Thượng Hải nằm ở miền đông Trung Quốc, là trung tâm kinh tế và tài chính lớn nhất nước. Hơn một trăm năm trước, Thượng Hải chỉ là một làng chài nhỏ, về sau phát triển thành đô thị quốc tế. Thượng Hải ngày nay nhà cao tầng san sát, cảnh đêm bến Thượng Hải vô cùng tráng lệ. Nơi đây vừa có Dự Viên cổ kính, vừa có tháp Đông Phương Minh Châu hiện đại — truyền thống và hiện đại hoà quyện hoàn hảo.",
    },
  },
  {
    id: "44",
    geoName: "广东省",
    nameCn: "广东",
    namePinyin: "Guǎngdōng",
    nameVn: "Quảng Đông",
    kind: "省",
    emoji: "🥟",
    capital: "广州",
    capitalVn: "Quảng Châu",
    population: "≈ 126.8 triệu (đông nhất TQ)",
    area: "179 800 km²",
    majorCities: [
      { cn: "广州", vn: "Quảng Châu" },
      { cn: "深圳", vn: "Thâm Quyến" },
      { cn: "佛山", vn: "Phật Sơn" },
      { cn: "东莞", vn: "Đông Hoản" },
    ],
    highlights: {
      cuisine: ["粤菜 Ẩm thực Quảng Đông", "早茶/点心 Điểm tâm dim sum", "白切鸡 Gà luộc"],
      universities: ["中山大学", "华南理工大学", "南方科技大学 (Thâm Quyến)"],
      industries: ["Điện tử (Hoa Vĩ, Tencent, DJI tại Thâm Quyến)", "Sản xuất xuất khẩu", "Thương mại quốc tế"],
      famousPeople: ["孙中山 Tôn Trung Sơn", "李小龙 Lý Tiểu Long (gốc Thuận Đức)", "马化腾 Mã Hoá Đằng (Tencent)"],
      landmarks: ["广州塔 Tháp Quảng Châu", "深圳世界之窗", "开平碉楼 Lô cổ Khai Bình (UNESCO)"],
      historical: "Cửa ngõ thương mại Hải Thượng Tơ Lụa; quê hương cải cách mở cửa 1978",
    },
    reading: {
      cn: "广东省位于中国南部，靠近香港和澳门，是中国人口最多的省份。广州是广东的省会，也是著名的美食之城，广东人爱喝早茶，吃各种各样的点心。深圳从一个小渔村发展成为科技创新中心，许多有名的公司比如华为和腾讯都在这里。粤语是广东人的方言，世界各地的华人社区都能听到。",
      pinyin: "Guǎngdōng shěng wèiyú Zhōngguó nánbù, kàojìn Xiānggǎng hé Àomén, shì Zhōngguó rénkǒu zuì duō de shěngfèn. Guǎngzhōu shì Guǎngdōng de shěnghuì, yěshì zhùmíng de měishí zhī chéng, Guǎngdōng rén ài hē zǎochá, chī gè zhǒng gè yàng de diǎnxīn. Shēnzhèn cóng yī ge xiǎo yúcūn fāzhǎn chéngwéi kējì chuàngxīn zhōngxīn, xǔduō yǒumíng de gōngsī bǐrú Huáwéi hé Téngxùn dōu zài zhèlǐ. Yuèyǔ shì Guǎngdōng rén de fāngyán, shìjiè gèdì de huárén shèqū dōu néng tīng dào.",
      vn: "Tỉnh Quảng Đông nằm ở phía nam Trung Quốc, sát cạnh Hồng Kông và Macao, là tỉnh đông dân nhất Trung Quốc. Quảng Châu là tỉnh lỵ của Quảng Đông, cũng là thành phố ẩm thực nổi tiếng; người Quảng Đông thích uống trà sáng và ăn đủ loại điểm tâm. Thâm Quyến từ một làng chài nhỏ đã phát triển thành trung tâm sáng tạo công nghệ, nhiều công ty nổi tiếng như Huawei và Tencent đều đặt trụ sở ở đây. Tiếng Quảng Đông là phương ngữ của người Quảng Đông, có thể nghe thấy trong cộng đồng người Hoa khắp thế giới.",
    },
  },
  {
    id: "51",
    geoName: "四川省",
    nameCn: "四川",
    namePinyin: "Sìchuān",
    nameVn: "Tứ Xuyên",
    kind: "省",
    emoji: "🐼",
    capital: "成都",
    capitalVn: "Thành Đô",
    population: "≈ 83.7 triệu",
    area: "486 000 km²",
    majorCities: [
      { cn: "成都", vn: "Thành Đô" },
      { cn: "绵阳", vn: "Miên Dương" },
      { cn: "乐山", vn: "Lạc Sơn" },
    ],
    highlights: {
      cuisine: ["川菜 Ẩm thực Tứ Xuyên (cay tê)", "麻婆豆腐 Mapo tofu", "火锅 Lẩu Tứ Xuyên", "回锅肉"],
      universities: ["四川大学", "电子科技大学", "西南交通大学"],
      industries: ["Điện tử – Quân công (Thành Đô)", "Du lịch sinh thái", "Trồng trà, trồng lúa"],
      famousPeople: ["李白 Lý Bạch (lớn lên ở Tứ Xuyên)", "苏轼 Tô Thức (Mi Sơn)", "邓小平 Đặng Tiểu Bình"],
      landmarks: ["都江堰 Thuỷ lợi Đô Giang Yển (UNESCO)", "九寨沟 Cửu Trại Câu", "乐山大佛 Tượng Phật Lạc Sơn", "大熊猫基地 Trung tâm gấu trúc"],
      historical: "Đất Thục cổ; ba lần là kinh đô tạm trong nội chiến TQ",
    },
    reading: {
      cn: "四川省在中国的西南部，被称为「天府之国」，因为这里土地肥沃，物产丰富。成都是四川的省会，也是大熊猫的故乡，许多游客来这里就是为了看可爱的大熊猫。四川菜以麻辣著名，麻婆豆腐和火锅都是四川的代表菜。除了美食，九寨沟的彩色湖水和乐山大佛的宏伟也吸引着世界各地的游客。",
      pinyin: "Sìchuān shěng zài Zhōngguó de xīnánbù, bèi chēng wéi «Tiānfǔ zhī Guó», yīnwèi zhèlǐ tǔdì féiwò, wùchǎn fēngfù. Chéngdū shì Sìchuān de shěnghuì, yěshì dà xióngmāo de gùxiāng, xǔduō yóukè lái zhèlǐ jiùshì wèile kàn kě'ài de dà xióngmāo. Sìchuān cài yǐ málà zhùmíng, Mápó dòufu hé huǒguō dōu shì Sìchuān de dàibiǎo cài. Chúle měishí, Jiǔzhàigōu de cǎisè húshuǐ hé Lèshān Dàfó de hóngwěi yě xīyǐn zhe shìjiè gèdì de yóukè.",
      vn: "Tỉnh Tứ Xuyên ở phía tây nam Trung Quốc, được mệnh danh là «Thiên Phủ Chi Quốc» vì đất đai phì nhiêu, sản vật dồi dào. Thành Đô là tỉnh lỵ của Tứ Xuyên, cũng là quê hương của gấu trúc lớn, rất nhiều du khách đến đây chính là để ngắm những chú gấu trúc đáng yêu. Món Tứ Xuyên nổi tiếng với vị cay tê; Mapo tofu và lẩu Tứ Xuyên đều là món đặc trưng. Ngoài ẩm thực, hồ nước nhiều màu Cửu Trại Câu và tượng Phật Lạc Sơn hùng vĩ cũng thu hút du khách khắp thế giới.",
    },
  },
  {
    id: "54",
    geoName: "西藏自治区",
    nameCn: "西藏",
    namePinyin: "Xīzàng",
    nameVn: "Tây Tạng",
    kind: "自治区",
    emoji: "⛰️",
    capital: "拉萨",
    capitalVn: "Lhasa",
    population: "≈ 3.6 triệu",
    area: "1 228 400 km²",
    majorCities: [
      { cn: "拉萨", vn: "Lhasa" },
      { cn: "日喀则", vn: "Shigatse" },
      { cn: "林芝", vn: "Nyingchi" },
    ],
    highlights: {
      cuisine: ["酥油茶 Trà bơ", "糌粑 Tsampa (bột lúa mạch)", "藏式火锅"],
      universities: ["西藏大学", "西藏民族大学"],
      industries: ["Du lịch tâm linh", "Chăn nuôi bò Tây Tạng (yak)", "Năng lượng mặt trời"],
      famousPeople: ["仓央嘉措 Tsangyang Gyatso (Đạt Lai Lạt Ma đời 6, nhà thơ)"],
      landmarks: ["布达拉宫 Cung điện Potala", "大昭寺 Đại Chiêu Tự", "珠穆朗玛峰 Đỉnh Everest", "纳木错 Hồ Namtso"],
      historical: "Trung tâm Phật giáo Tạng truyền; «mái nhà của thế giới» (TB 4 500 m)",
    },
    reading: {
      cn: "西藏在中国的西南边，平均海拔超过四千米，被称为「世界屋脊」。拉萨是西藏的首府，那里的布达拉宫是一座建在山上的宏伟宫殿，已经有一千三百多年的历史。藏族人民有自己独特的文化、语言和宗教，藏传佛教对他们的生活影响很大。每年都有很多人来西藏旅行，欣赏雪山、湖泊和美丽的草原。",
      pinyin: "Xīzàng zài Zhōngguó de xīnán biān, píngjūn hǎibá chāoguò sì qiān mǐ, bèi chēng wéi «Shìjiè Wūjǐ». Lāsà shì Xīzàng de shǒufǔ, nàlǐ de Bùdálā gōng shì yī zuò jiàn zài shān shàng de hóngwěi gōngdiàn, yǐjīng yǒu yī qiān sān bǎi duō nián de lìshǐ. Zàngzú rénmín yǒu zìjǐ dútè de wénhuà, yǔyán hé zōngjiào, Zàngchuán Fójiào duì tāmen de shēnghuó yǐngxiǎng hěn dà. Měi nián dōu yǒu hěn duō rén lái Xīzàng lǚxíng, xīnshǎng xuěshān, húpō hé měilì de cǎoyuán.",
      vn: "Tây Tạng nằm ở rìa tây nam Trung Quốc, độ cao trung bình hơn bốn nghìn mét, được mệnh danh là «mái nhà của thế giới». Lhasa là thủ phủ của Tây Tạng, tại đó Cung điện Potala là một quần thể tráng lệ xây trên núi, đã có lịch sử hơn một nghìn ba trăm năm. Người Tạng có văn hoá, ngôn ngữ và tôn giáo riêng độc đáo; Phật giáo Tạng truyền ảnh hưởng rất sâu đến đời sống của họ. Mỗi năm có rất nhiều người đến Tây Tạng du lịch để chiêm ngưỡng núi tuyết, hồ và những thảo nguyên xinh đẹp.",
    },
  },
  {
    id: "71",
    geoName: "台湾省",
    nameCn: "台湾",
    namePinyin: "Táiwān",
    nameVn: "Đài Loan",
    kind: "省",
    emoji: "🧋",
    capital: "台北",
    capitalVn: "Đài Bắc",
    population: "≈ 23.4 triệu",
    area: "36 197 km²",
    majorCities: [
      { cn: "台北", vn: "Đài Bắc" },
      { cn: "高雄", vn: "Cao Hùng" },
      { cn: "台中", vn: "Đài Trung" },
      { cn: "台南", vn: "Đài Nam" },
    ],
    highlights: {
      cuisine: ["珍珠奶茶 Trà sữa trân châu", "牛肉面 Mì bò", "卤肉饭 Cơm thịt kho", "夜市小吃 Đồ ăn vặt chợ đêm"],
      universities: ["台湾大学 NTU", "清华大学 (新竹)", "成功大学"],
      industries: ["Bán dẫn (TSMC)", "Điện tử công nghệ cao", "Du lịch văn hoá"],
      famousPeople: ["邓丽君 Đặng Lệ Quân", "李安 Lý An (đạo diễn)", "周杰伦 Châu Kiệt Luân"],
      landmarks: ["台北101 Toà tháp Taipei 101", "故宫博物院 Bảo tàng Cố Cung", "日月潭 Hồ Nhật Nguyệt", "阿里山 Núi A Lý"],
      historical: "Hòn đảo trung tâm văn hoá Hán truyền thống, nơi gìn giữ chữ phồn thể và nhiều cổ vật từ Bắc Kinh",
    },
    reading: {
      cn: "台湾是中国东南沿海的一个美丽岛屿，四面环海，气候温暖。台北是最大的城市，台北101曾经是世界上最高的建筑物之一。台湾的夜市文化非常有名，人们晚上喜欢去士林夜市吃小吃，比如珍珠奶茶、卤肉饭和牛肉面。除了美食，台湾还保存了很多中国传统文化，故宫博物院里有许多珍贵的文物。",
      pinyin: "Táiwān shì Zhōngguó dōngnán yánhǎi de yī ge měilì dǎoyǔ, sìmiàn huánhǎi, qìhòu wēnnuǎn. Táiběi shì zuì dà de chéngshì, Táiběi yāolíngyī céngjīng shì shìjiè shàng zuì gāo de jiànzhúwù zhī yī. Táiwān de yèshì wénhuà fēicháng yǒumíng, rénmen wǎnshàng xǐhuān qù Shìlín yèshì chī xiǎochī, bǐrú zhēnzhū nǎichá, lǔròu fàn hé niúròu miàn. Chúle měishí, Táiwān hái bǎocúnle hěn duō Zhōngguó chuántǒng wénhuà, Gùgōng bówùyuàn lǐ yǒu xǔduō zhēnguì de wénwù.",
      vn: "Đài Loan là một hòn đảo xinh đẹp ven biển đông nam Trung Quốc, bốn bề là biển, khí hậu ấm áp. Đài Bắc là thành phố lớn nhất; toà tháp Taipei 101 từng là một trong những công trình cao nhất thế giới. Văn hoá chợ đêm của Đài Loan vô cùng nổi tiếng, mọi người buổi tối thích đến chợ đêm Sĩ Lâm ăn đồ vặt như trà sữa trân châu, cơm thịt kho và mì bò. Ngoài ẩm thực, Đài Loan còn lưu giữ rất nhiều văn hoá truyền thống Trung Hoa; Bảo tàng Cố Cung có rất nhiều cổ vật quý giá.",
    },
  },

  // ============ 28 ĐƠN VỊ STUB (sẽ mở rộng sau) ============
  { id: "12", geoName: "天津市", nameCn: "天津", namePinyin: "Tiānjīn", nameVn: "Thiên Tân", kind: "直辖市", emoji: "⚓", capital: "天津", capitalVn: "Thiên Tân", population: "≈ 13.7 triệu" },
  { id: "50", geoName: "重庆市", nameCn: "重庆", namePinyin: "Chóngqìng", nameVn: "Trùng Khánh", kind: "直辖市", emoji: "🌶️", capital: "重庆", capitalVn: "Trùng Khánh", population: "≈ 32.1 triệu" },
  { id: "13", geoName: "河北省", nameCn: "河北", namePinyin: "Héběi", nameVn: "Hà Bắc", kind: "省", emoji: "🏔️", capital: "石家庄", capitalVn: "Thạch Gia Trang", population: "≈ 74.2 triệu" },
  { id: "14", geoName: "山西省", nameCn: "山西", namePinyin: "Shānxī", nameVn: "Sơn Tây", kind: "省", emoji: "🍜", capital: "太原", capitalVn: "Thái Nguyên", population: "≈ 34.8 triệu" },
  { id: "21", geoName: "辽宁省", nameCn: "辽宁", namePinyin: "Liáoníng", nameVn: "Liêu Ninh", kind: "省", emoji: "🏭", capital: "沈阳", capitalVn: "Thẩm Dương", population: "≈ 42.6 triệu" },
  { id: "22", geoName: "吉林省", nameCn: "吉林", namePinyin: "Jílín", nameVn: "Cát Lâm", kind: "省", emoji: "❄️", capital: "长春", capitalVn: "Trường Xuân", population: "≈ 24.1 triệu" },
  { id: "23", geoName: "黑龙江省", nameCn: "黑龙江", namePinyin: "Hēilóngjiāng", nameVn: "Hắc Long Giang", kind: "省", emoji: "🐻‍❄️", capital: "哈尔滨", capitalVn: "Cáp Nhĩ Tân", population: "≈ 31.9 triệu" },
  { id: "32", geoName: "江苏省", nameCn: "江苏", namePinyin: "Jiāngsū", nameVn: "Giang Tô", kind: "省", emoji: "🌉", capital: "南京", capitalVn: "Nam Kinh", population: "≈ 85.1 triệu" },
  { id: "33", geoName: "浙江省", nameCn: "浙江", namePinyin: "Zhèjiāng", nameVn: "Chiết Giang", kind: "省", emoji: "🍵", capital: "杭州", capitalVn: "Hàng Châu", population: "≈ 65.8 triệu" },
  { id: "34", geoName: "安徽省", nameCn: "安徽", namePinyin: "Ānhuī", nameVn: "An Huy", kind: "省", emoji: "🗻", capital: "合肥", capitalVn: "Hợp Phì", population: "≈ 61.0 triệu" },
  { id: "35", geoName: "福建省", nameCn: "福建", namePinyin: "Fújiàn", nameVn: "Phúc Kiến", kind: "省", emoji: "🫖", capital: "福州", capitalVn: "Phúc Châu", population: "≈ 41.7 triệu" },
  { id: "36", geoName: "江西省", nameCn: "江西", namePinyin: "Jiāngxī", nameVn: "Giang Tây", kind: "省", emoji: "🏞️", capital: "南昌", capitalVn: "Nam Xương", population: "≈ 45.2 triệu" },
  { id: "37", geoName: "山东省", nameCn: "山东", namePinyin: "Shāndōng", nameVn: "Sơn Đông", kind: "省", emoji: "🍑", capital: "济南", capitalVn: "Tế Nam", population: "≈ 101.6 triệu" },
  { id: "41", geoName: "河南省", nameCn: "河南", namePinyin: "Hénán", nameVn: "Hà Nam", kind: "省", emoji: "🥋", capital: "郑州", capitalVn: "Trịnh Châu", population: "≈ 98.7 triệu" },
  { id: "42", geoName: "湖北省", nameCn: "湖北", namePinyin: "Húběi", nameVn: "Hồ Bắc", kind: "省", emoji: "🌊", capital: "武汉", capitalVn: "Vũ Hán", population: "≈ 58.4 triệu" },
  { id: "43", geoName: "湖南省", nameCn: "湖南", namePinyin: "Húnán", nameVn: "Hồ Nam", kind: "省", emoji: "🌶️", capital: "长沙", capitalVn: "Trường Sa", population: "≈ 66.2 triệu" },
  { id: "45", geoName: "广西壮族自治区", nameCn: "广西", namePinyin: "Guǎngxī", nameVn: "Quảng Tây", kind: "自治区", emoji: "🪨", capital: "南宁", capitalVn: "Nam Ninh", population: "≈ 50.1 triệu" },
  { id: "46", geoName: "海南省", nameCn: "海南", namePinyin: "Hǎinán", nameVn: "Hải Nam", kind: "省", emoji: "🏝️", capital: "海口", capitalVn: "Hải Khẩu", population: "≈ 10.2 triệu" },
  { id: "52", geoName: "贵州省", nameCn: "贵州", namePinyin: "Guìzhōu", nameVn: "Quý Châu", kind: "省", emoji: "🥃", capital: "贵阳", capitalVn: "Quý Dương", population: "≈ 38.6 triệu" },
  { id: "53", geoName: "云南省", nameCn: "云南", namePinyin: "Yúnnán", nameVn: "Vân Nam", kind: "省", emoji: "🌸", capital: "昆明", capitalVn: "Côn Minh", population: "≈ 46.9 triệu" },
  { id: "61", geoName: "陕西省", nameCn: "陕西", namePinyin: "Shǎnxī", nameVn: "Thiểm Tây", kind: "省", emoji: "🐲", capital: "西安", capitalVn: "Tây An", population: "≈ 39.5 triệu" },
  { id: "62", geoName: "甘肃省", nameCn: "甘肃", namePinyin: "Gānsù", nameVn: "Cam Túc", kind: "省", emoji: "🐪", capital: "兰州", capitalVn: "Lan Châu", population: "≈ 24.9 triệu" },
  { id: "63", geoName: "青海省", nameCn: "青海", namePinyin: "Qīnghǎi", nameVn: "Thanh Hải", kind: "省", emoji: "🏞️", capital: "西宁", capitalVn: "Tây Ninh", population: "≈ 5.9 triệu" },
  { id: "64", geoName: "宁夏回族自治区", nameCn: "宁夏", namePinyin: "Níngxià", nameVn: "Ninh Hạ", kind: "自治区", emoji: "☪️", capital: "银川", capitalVn: "Ngân Xuyên", population: "≈ 7.2 triệu" },
  { id: "65", geoName: "新疆维吾尔自治区", nameCn: "新疆", namePinyin: "Xīnjiāng", nameVn: "Tân Cương", kind: "自治区", emoji: "🍇", capital: "乌鲁木齐", capitalVn: "Urumqi", population: "≈ 25.9 triệu" },
  { id: "15", geoName: "内蒙古自治区", nameCn: "内蒙古", namePinyin: "Nèiměnggǔ", nameVn: "Nội Mông", kind: "自治区", emoji: "🐎", capital: "呼和浩特", capitalVn: "Hô Hoà Hạo Đặc", population: "≈ 24.0 triệu" },
  { id: "81", geoName: "香港特别行政区", nameCn: "香港", namePinyin: "Xiānggǎng", nameVn: "Hồng Kông", kind: "特别行政区", emoji: "🌆", capital: "香港", capitalVn: "Hồng Kông", population: "≈ 7.5 triệu" },
  { id: "82", geoName: "澳门特别行政区", nameCn: "澳门", namePinyin: "Àomén", nameVn: "Ma Cao", kind: "特别行政区", emoji: "🎰", capital: "澳门", capitalVn: "Ma Cao", population: "≈ 0.68 triệu" },
];

export const PROVINCE_BY_GEONAME = new Map(PROVINCES.map((p) => [p.geoName, p]));
