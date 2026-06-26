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
      cn: "北京是中华人民共和国的首都，是全国的政治中心、文化中心、国际交往中心和科技创新中心。这座城市拥有三千多年的建城史和八百多年的建都史，先后曾是辽、金、元、明、清五个朝代的都城。北京至今保存着大量珍贵的历史文化遗产，其中故宫是世界上现存规模最大、保存最完整的木结构宫殿建筑群，长城则被誉为人类历史上最伟大的工程之一。除了悠久的历史，北京也是当代中国教育与科研的重镇，聚集了清华大学、北京大学等众多顶尖学府，以及位于中关村的科技产业园区。在饮食方面，北京烤鸭、炸酱面和老北京小吃享誉海内外，体现了京味文化的独特魅力。",
      pinyin: "",
      vn: "Bắc Kinh là thủ đô của nước Cộng hòa Nhân dân Trung Hoa, đồng thời là trung tâm chính trị, văn hóa, giao lưu quốc tế và đổi mới khoa học công nghệ của cả nước. Thành phố này có hơn ba nghìn năm lịch sử hình thành và hơn tám trăm năm là kinh đô, từng lần lượt là thủ đô của năm triều đại Liêu, Kim, Nguyên, Minh và Thanh. Cho đến ngày nay, Bắc Kinh vẫn lưu giữ một khối lượng lớn di sản văn hóa lịch sử quý giá, trong đó Cố Cung là quần thể cung điện bằng gỗ có quy mô lớn nhất và được bảo tồn nguyên vẹn nhất trên thế giới, còn Vạn Lý Trường Thành được xem là một trong những công trình vĩ đại nhất trong lịch sử nhân loại. Bên cạnh bề dày lịch sử, Bắc Kinh còn là trọng điểm giáo dục và nghiên cứu khoa học của Trung Quốc hiện đại, quy tụ nhiều trường đại học hàng đầu như Đại học Thanh Hoa, Đại học Bắc Kinh, cùng khu công nghệ Trung Quan Thôn nổi tiếng. Về ẩm thực, vịt quay Bắc Kinh, mì tương đen và các món ăn vặt truyền thống đã trở thành biểu tượng của văn hóa kinh đô, được yêu thích cả ở trong và ngoài nước.",
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
      cn: "上海位于中国东部沿海的长江入海口，是中国最大的经济、金融、贸易和航运中心，也是一座兼具历史底蕴与现代气息的国际大都市。十九世纪中叶以前，上海还只是江南地区的一个普通县城，开埠之后迅速发展成为远东最重要的商业港口之一。如今的上海拥有世界级的金融机构、繁忙的国际港口和发达的高新技术产业，浦东陆家嘴的摩天大楼群更是中国改革开放成就的象征。漫步外滩，可以同时欣赏到对岸现代化的城市天际线和身后保存完好的西洋古典建筑。除了经济与金融的繁荣，上海还以丰富的饮食文化和包容并蓄的城市精神著称，本帮菜、小笼包以及多元的咖啡与艺术场景，使这里成为中外文化交流的重要舞台。",
      pinyin: "",
      vn: "Thượng Hải nằm tại cửa sông Trường Giang ven biển miền đông Trung Quốc, là trung tâm kinh tế, tài chính, thương mại và vận tải biển lớn nhất Trung Quốc, đồng thời là một đô thị quốc tế hội tụ cả chiều sâu lịch sử lẫn nhịp sống hiện đại. Trước giữa thế kỷ mười chín, Thượng Hải chỉ là một huyện lỵ bình thường ở vùng Giang Nam, sau khi mở cửa thông thương đã nhanh chóng phát triển thành một trong những thương cảng quan trọng bậc nhất Viễn Đông. Ngày nay, Thượng Hải sở hữu hệ thống tổ chức tài chính tầm cỡ thế giới, cảng quốc tế sầm uất cùng các ngành công nghệ cao phát triển mạnh; quần thể nhà chọc trời ở Lục Gia Chủy, Phố Đông được xem là biểu tượng cho thành tựu cải cách mở cửa của Trung Quốc. Khi tản bộ trên bến Thượng Hải, du khách có thể cùng lúc chiêm ngưỡng đường chân trời đô thị hiện đại ở bờ đối diện và những công trình cổ điển phương Tây được gìn giữ nguyên vẹn ở phía sau. Bên cạnh sự phồn vinh về kinh tế và tài chính, Thượng Hải còn nổi tiếng với nền ẩm thực phong phú và tinh thần đô thị bao dung, nơi món Bản bang, tiểu long bao cùng các không gian cà phê và nghệ thuật đa sắc đã biến thành phố này thành sân khấu quan trọng cho giao lưu văn hóa Đông Tây.",
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
      cn: "广东省位于中国大陆的最南端，南临南海，与香港和澳门两个特别行政区相邻，是中国人口最多、经济总量最大的省份之一。广东自古以来就是海上丝绸之路的重要起点，广州港在唐宋时期便已成为对外贸易的中心之一。改革开放以后，广东率先设立经济特区，深圳从一个默默无闻的渔村迅速崛起为现代化的科技创新之城，孕育了华为、腾讯、比亚迪等众多在全球具有影响力的企业。广东的语言文化十分独特，粤语在世界各地的华人社区广泛流传，粤剧、舞狮、龙舟等传统艺术也充满地方特色。在饮食上，粤菜讲究食材新鲜、烹饪精细，早茶文化更是广东人生活方式的重要组成部分，一壶香茶、几笼点心便能让人享受悠闲的一天。",
      pinyin: "",
      vn: "Tỉnh Quảng Đông nằm ở cực nam đại lục Trung Quốc, phía nam giáp biển Đông, tiếp giáp với hai đặc khu hành chính Hồng Kông và Macao, là một trong những tỉnh có dân số đông nhất và quy mô kinh tế lớn nhất Trung Quốc. Từ xa xưa, Quảng Đông đã là điểm khởi đầu quan trọng của con đường tơ lụa trên biển; cảng Quảng Châu vào thời Đường và Tống đã trở thành một trong những trung tâm thương mại đối ngoại hàng đầu. Sau cải cách mở cửa, Quảng Đông là địa phương đầu tiên được thiết lập đặc khu kinh tế; Thâm Quyến từ một làng chài ít người biết đến đã vươn mình thành đô thị sáng tạo công nghệ hiện đại, là nơi sản sinh ra nhiều doanh nghiệp có ảnh hưởng toàn cầu như Huawei, Tencent và BYD. Văn hóa ngôn ngữ ở Quảng Đông cũng rất đặc sắc: tiếng Quảng Đông được sử dụng rộng rãi trong cộng đồng người Hoa khắp thế giới, các loại hình nghệ thuật truyền thống như Việt kịch, múa lân và đua thuyền rồng đều đậm đà bản sắc địa phương. Về ẩm thực, món Quảng Đông chú trọng nguyên liệu tươi và kỹ thuật chế biến tinh tế; văn hóa trà sáng đã trở thành một phần quan trọng trong lối sống của người dân nơi đây, chỉ với một ấm trà thơm và vài lồng điểm tâm là có thể tận hưởng cả một ngày thư thái.",
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
      cn: "四川省位于中国西南部，地处长江上游，四面环山，自古以来就有「天府之国」的美誉，土地肥沃、物产丰富，是中国重要的农业和粮食生产基地之一。四川也是大熊猫的故乡，省内分布着多个国家级自然保护区，吸引了世界各地的游客和科研人员前来观察和学习。省会成都不仅是中国西南地区的经济、文化和交通枢纽，也是一座以悠闲生活方式著称的历史文化名城，茶馆、川剧、变脸等传统艺术至今仍十分活跃。四川菜以麻辣鲜香闻名于世，麻婆豆腐、回锅肉、宫保鸡丁、夫妻肺片和重庆火锅等菜肴在世界各地都广受欢迎。此外，四川还拥有都江堰、九寨沟、峨眉山和乐山大佛等众多世界级的自然与文化遗产，是了解中国西部历史与自然风光的重要窗口。",
      pinyin: "",
      vn: "Tỉnh Tứ Xuyên nằm ở khu vực tây nam Trung Quốc, nơi thượng nguồn sông Trường Giang, bốn bề được bao bọc bởi núi non; từ xưa nơi đây đã được mệnh danh là Thiên Phủ Chi Quốc nhờ đất đai phì nhiêu, sản vật phong phú, và là một trong những vùng sản xuất nông nghiệp, lương thực quan trọng của Trung Quốc. Tứ Xuyên cũng là quê hương của gấu trúc lớn, với nhiều khu bảo tồn thiên nhiên cấp quốc gia trải rộng khắp tỉnh, thu hút du khách và các nhà nghiên cứu từ khắp nơi trên thế giới đến quan sát và học tập. Thành Đô, tỉnh lỵ của Tứ Xuyên, không chỉ là trung tâm kinh tế, văn hóa và giao thông của miền tây nam mà còn là một thành phố văn hóa lịch sử nổi tiếng với lối sống thư thái; các loại hình nghệ thuật truyền thống như quán trà, Xuyên kịch và nghệ thuật biến mặt cho đến nay vẫn rất sôi động. Ẩm thực Tứ Xuyên nổi danh trên thế giới với hương vị cay, tê, tươi, thơm; các món Mapo đậu phụ, thịt heo hai lần lửa, gà cung bảo, phế phiến phu thê và lẩu Trùng Khánh đều được ưa chuộng tại nhiều quốc gia. Ngoài ra, Tứ Xuyên còn sở hữu nhiều di sản tự nhiên và văn hóa tầm cỡ thế giới như công trình thủy lợi Đô Giang Yển, Cửu Trại Câu, núi Nga Mi và tượng Phật Lạc Sơn, là cánh cửa quan trọng để tìm hiểu lịch sử và cảnh quan thiên nhiên miền tây Trung Quốc.",
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
      cn: "西藏自治区位于中国西南边陲，平均海拔超过四千米，是世界上海拔最高的地区之一，因此被人们称为「世界屋脊」和「地球第三极」。这里地势辽阔，雪山连绵，湖泊星罗棋布，珠穆朗玛峰、纳木错和雅鲁藏布大峡谷都是举世闻名的自然景观。首府拉萨是西藏的政治、经济和文化中心，城内的布达拉宫始建于公元七世纪，是藏族建筑艺术的杰出代表，也是世界文化遗产。藏族人民有着悠久的历史和独特的文化传统，藏语、藏文以及藏传佛教在他们的日常生活中占有重要地位，唐卡绘画、藏戏和酥油茶等都是民族文化的重要组成部分。近年来，随着交通和基础设施的不断改善，越来越多的国内外游客来到西藏，亲身体验高原的壮丽风光和独具特色的民族风情。",
      pinyin: "",
      vn: "Khu tự trị Tây Tạng nằm ở vùng biên giới tây nam Trung Quốc, độ cao trung bình hơn bốn nghìn mét, là một trong những khu vực có địa thế cao nhất thế giới, vì vậy được mệnh danh là Mái nhà của thế giới và Cực thứ ba của Trái Đất. Địa hình nơi đây rộng lớn, núi tuyết trùng điệp, hồ nước chi chít; đỉnh Everest, hồ Namtso và đại hẻm núi Yarlung Tsangpo đều là những cảnh quan thiên nhiên nổi tiếng toàn cầu. Thủ phủ Lhasa là trung tâm chính trị, kinh tế và văn hóa của Tây Tạng; Cung điện Potala trong thành phố được khởi dựng từ thế kỷ thứ bảy, là đại diện xuất sắc của nghệ thuật kiến trúc dân tộc Tạng và đã được công nhận là di sản văn hóa thế giới. Người Tạng có lịch sử lâu đời và truyền thống văn hóa độc đáo; tiếng Tạng, chữ Tạng cùng Phật giáo Tạng truyền giữ vị trí quan trọng trong đời sống thường nhật, các nét văn hóa như tranh thangka, hí kịch Tạng và trà bơ đều là bộ phận không thể thiếu của bản sắc dân tộc. Trong những năm gần đây, nhờ giao thông và hạ tầng không ngừng được cải thiện, ngày càng nhiều du khách trong và ngoài nước đến Tây Tạng để trực tiếp trải nghiệm cảnh sắc hùng vĩ của cao nguyên cùng nét văn hóa dân tộc độc đáo nơi đây.",
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
      cn: "台湾位于中国东南沿海，与福建省隔台湾海峡相望，是中国最大的岛屿，四面环海，气候温暖湿润，自然风光秀丽。台湾岛地形多样，中央山脉纵贯南北，山地、平原、海岸和岛屿景观一应俱全，阿里山、日月潭和太鲁阁峡谷都是闻名遐迩的旅游胜地。台北是台湾人口最多、经济最发达的城市，台北一零一大楼曾经是世界上最高的建筑之一，至今仍是这座城市的重要地标。台湾在长期的发展过程中，较为完整地保留了中华传统文化，故宫博物院内珍藏着大量从北京迁来的珍贵文物，是研究中华文明的重要场所之一。在饮食方面，台湾以丰富多彩的小吃文化闻名，珍珠奶茶、卤肉饭、牛肉面以及各地夜市的特色美食，吸引着无数海内外游客前来品尝。",
      pinyin: "",
      vn: "Đài Loan nằm ở vùng ven biển đông nam Trung Quốc, cách tỉnh Phúc Kiến qua eo biển Đài Loan, là hòn đảo lớn nhất của Trung Quốc, bốn bề là biển, khí hậu ấm áp và ẩm ướt, cảnh quan thiên nhiên tươi đẹp. Địa hình đảo Đài Loan rất đa dạng, dãy Trung Ương Sơn chạy dọc theo trục bắc nam, hội tụ đủ các dạng địa hình từ núi non, đồng bằng, bờ biển đến các đảo nhỏ; núi A Lý, hồ Nhật Nguyệt và hẻm núi Taroko đều là những điểm du lịch nổi tiếng. Đài Bắc là thành phố đông dân và phát triển kinh tế bậc nhất Đài Loan; tòa nhà Taipei 101 từng là một trong những công trình cao nhất thế giới và đến nay vẫn là biểu tượng quan trọng của thành phố. Trong quá trình phát triển lâu dài, Đài Loan đã bảo tồn tương đối nguyên vẹn nhiều giá trị văn hóa truyền thống Trung Hoa; Bảo tàng Cố Cung Đài Bắc lưu giữ một khối lượng lớn cổ vật quý giá được chuyển đến từ Bắc Kinh, là một trong những địa điểm quan trọng để nghiên cứu nền văn minh Trung Hoa. Về ẩm thực, Đài Loan nổi tiếng với văn hóa đồ ăn vặt phong phú; trà sữa trân châu, cơm thịt kho, mì bò cùng các món đặc sản tại chợ đêm khắp các địa phương đã thu hút biết bao du khách trong và ngoài nước đến thưởng thức.",
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
