## Khám Phá Trung Quốc — Interactive Map

Tạo mục mới trong menu 学习工具, tên **探索中国 Khám phá Trung Quốc**, route `/explore-china`.

### 1. Bản đồ
- **Nguồn dữ liệu:** GeoJSON tỉnh TQ (offline, tự host) tại `src/data/china-geo.json`. Mình sẽ dùng bản chuẩn từ repo công khai (Natural Earth + dataset province TQ phổ biến) và **chỉnh thủ công**:
  - Bao gồm 34 đơn vị: 23 tỉnh (gồm 台湾), 5 khu tự trị, 4 thành phố trực thuộc TW, 2 đặc khu (HK, Macau).
  - **Chủ quyền:** Loại bỏ/sửa các polygon "九段线" (đường lưỡi bò), đảm bảo Hoàng Sa (Paracel) và Trường Sa (Spratly) **không** thuộc lãnh thổ TQ trong file GeoJSON. Các quần đảo tranh chấp khác (Senkaku/Điếu Ngư, Scarborough) cũng không gắn nhãn TQ.
  - Vùng TQ tô màu nổi bật (gradient theo design token đỏ HSK); nước láng giềng (VN, Lào, Mông Cổ, Nga, Ấn Độ, Hàn, Nhật...) hiển thị mờ làm bối cảnh, không tô màu, không nhãn nổi bật.
- **Render:** `react-simple-maps` (D3 + SVG) — projection `geoMercator` hoặc `geoConicEquidistant` phù hợp với TQ.
- **Tương tác:**
  - Hover tỉnh → highlight viền vàng + tooltip nhỏ (tên CN + Pinyin + VN).
  - Click tỉnh → mở **Sheet/Drawer bên phải** với thông tin đầy đủ.
  - Zoom & pan bằng wheel/drag (react-simple-maps `ZoomableGroup`).
  - Sidebar trái: list 34 tỉnh có search (CN/Pinyin/VN), click cũng mở drawer.

### 2. Dữ liệu mỗi tỉnh (file `src/data/provinces.ts`)
Schema:
```ts
{
  id, nameCn, namePinyin, nameVn, capital, population,
  majorCities: [...],          // 3-5 thành phố
  highlights: {
    cuisine: string[],          // món ăn nổi tiếng
    universities: string[],
    industries: string[],
    famousPeople: string[],
    landmarks: string[],
    historical: string,         // VD: 古都 cố đô
  },
  readingPassage: {             // bài đọc hiểu ngắn
    cn: string,                 // ~80-120 chữ Hán
    pinyin: string,
    vn: string,
  },
  emoji: string,                // 🏯 🐼 ...
}
```

**Phase 1 (lần này):** soạn nội dung đầy đủ cho **6 đơn vị mẫu** để bạn duyệt format:
1. 北京 Bắc Kinh
2. 上海 Thượng Hải
3. 广东 Quảng Đông
4. 四川 Tứ Xuyên
5. 西藏 Tây Tạng
6. 台湾 Đài Loan

33 đơn vị còn lại: tạo stub `{ id, nameCn, namePinyin, nameVn, capital }` để map vẫn click được, hiển thị badge "Đang cập nhật". Sau khi bạn duyệt format, mình mở rộng tiếp.

### 3. UI / Drawer chi tiết
- Header: emoji + 名称 + Pinyin + tên Việt + badge loại (省/直辖市/自治区/特别行政区).
- Stats row: 首府 / 人口 / 面积.
- Sections (card grid):
  - 主要城市 Thành phố chính
  - 美食 Ẩm thực
  - 高校 Trường đại học
  - 产业 Ngành nghề
  - 名人 Người nổi tiếng
  - 地标 Địa danh
- **Bài đọc hiểu** (component reuse style hiện có): toggle hiện Pinyin / dịch VN, tích hợp `SelectionPopover` để tra từ như các trang khác.
- Nút "Phát âm" tên tỉnh dùng TTS hiện có (nếu có) hoặc bỏ qua.

### 4. Thay đổi file
- **Thêm:**
  - `src/pages/ExploreChina.tsx` — page chính (map + sidebar + drawer)
  - `src/components/explore/ChinaMap.tsx` — SVG map
  - `src/components/explore/ProvinceDrawer.tsx` — drawer chi tiết
  - `src/components/explore/ProvinceReadingCard.tsx` — bài đọc hiểu
  - `src/data/provinces.ts` — dataset 34 tỉnh
  - `src/data/china-geo.json` — GeoJSON đã sửa chủ quyền
- **Sửa:**
  - `src/App.tsx` — thêm route `/explore-china`
  - `src/components/Navbar.tsx` — thêm item "探索中国 Khám phá TQ" vào dropdown 学习工具 (cả desktop & mobile accordion) với icon `Map`/`Compass`
  - `src/components/StudyToolsLayer.tsx` — bật `SelectionPopover` cho route `/explore-china`
- **Dependency:** `bun add react-simple-maps @types/react-simple-maps d3-geo`

### 5. Chủ quyền — quy trình bảo đảm
Trước khi commit GeoJSON mình sẽ:
1. Mở file, grep các feature có name chứa "South China Sea", "Spratly", "Paracel", "Nansha", "Xisha", "Senkaku", "Diaoyu", "Scarborough" và **xoá khỏi China feature collection** nếu nằm trong.
2. Đảm bảo không render bất kỳ "U-shaped line" / nine-dash line nào.
3. Tooltip / styling cho vùng "Đài Loan" giữ tên 台湾 (theo yêu cầu user là một phần của map) nhưng phần xử lý chủ quyền biển đảo nói trên là **tuyệt đối**.

### 6. Sau khi hoàn tất
Demo 6 tỉnh mẫu + 28 stub. Bạn duyệt format và nội dung bài đọc, mình sẽ viết tiếp các tỉnh còn lại theo cùng schema trong các turn sau.
