
## Mục tiêu
Thêm tính năng **Hội thoại** vào HSK Hub với:
- 3 cấp độ: Sơ cấp / Trung cấp / Cao cấp
- Chế độ luyện kiểu **karaoke**: phát từng câu, hiển thị câu đang đọc, ghi âm user → so sánh với câu mẫu
- 2 chế độ hiển thị: **có Pinyin** / **chỉ Hán tự**
- Tô màu đúng/sai theo cả ký tự Hán và Pinyin (bỏ qua thanh điệu)
- STT dùng **Soniox** (cần secret `SONIOX_API_KEY`)

---

## 1. Navigation & Routing

```text
Navbar
└─ Hội thoại  (mục mới, ngang hàng với HSK / Ngữ pháp / Đề thi)
   └─ /conversations            → trang chọn 3 level (card Sơ/Trung/Cao cấp)
      └─ /conversations/:level  → danh sách bài hội thoại của level
         └─ /conversations/:level/:id → trang luyện karaoke
```

- Cập nhật `src/components/Navbar.tsx` (cả desktop + mobile accordion)
- Thêm 3 route mới vào `src/App.tsx`

## 2. Cấu trúc dữ liệu

`src/data/conversationTypes.ts`
```ts
export type ConvLevel = "beginner" | "intermediate" | "advanced";

export interface ConvLine {
  speaker: string;        // "A" | "B" | tên nhân vật
  hanzi: string;
  pinyin: string;
  vi: string;             // dịch tiếng Việt
  audioStart?: number;    // giây trong file audio chung (optional)
  audioEnd?: number;
}

export interface Conversation {
  id: string;
  level: ConvLevel;
  title: string;
  titleVi: string;
  description?: string;
  audioSrc?: string;      // audio cả bài (optional)
  lines: ConvLine[];
}
```

File data:
- `src/data/conversationsBeginner.ts`
- `src/data/conversationsIntermediate.ts`
- `src/data/conversationsAdvanced.ts`
- `src/data/conversations.ts` (gom + helper `getConversation(level, id)`)

→ Sau khi user gửi file Excel/DOCX, parse và đổ data thật vào 3 file trên. Trước đó dùng 2-3 bài mẫu mỗi level để dev UI.

## 3. Trang Karaoke (`ConversationPractice.tsx`)

Layout:
```text
┌────────────────────────────────────────────┐
│ [← Back]   Tiêu đề bài         [Toggle 拼音]│
├────────────────────────────────────────────┤
│  Speaker A:  你好，最近怎么样？              │
│              nǐ hǎo, zuìjìn zěnme yàng?    │  ← câu hiện tại (highlight)
│              Chào, dạo này thế nào?        │
│                                            │
│  Speaker B:  ... (mờ, chưa tới)           │
├────────────────────────────────────────────┤
│  [▶ Bắt đầu]  [⏸] [⏭ Câu tiếp] [🔁 Lặp lại]│
│  [🎙 Nói]   ●REC 00:03                     │
│                                            │
│  Bạn đọc:  你好  最近  怎么洋               │
│            ✓✓   ✓✓    ✓✓✗                 │
│  Pinyin:   ✓    ✓     ✗ (yáng vs yàng OK) │
│  Điểm: 92%                                 │
└────────────────────────────────────────────┘
```

Flow karaoke:
1. User bấm **Bắt đầu** → highlight câu 1, (optional) phát audio đoạn câu 1
2. Khi audio xong (hoặc user bấm 🎙) → mở mic, gọi Soniox STT
3. Khi user bấm dừng / im lặng → nhận transcript → so sánh
4. Tô màu kết quả → tự động chuyển câu tiếp theo (hoặc user bấm Tiếp)
5. Cuối bài hiển thị tổng điểm

Toggle 拼音: ẩn/hiện dòng pinyin. Việc chấm vẫn so cả Hán + Pinyin.

## 4. So sánh & chấm điểm

`src/lib/pronunciationScore.ts`
- Chuẩn hoá: bỏ dấu câu, khoảng trắng, lowercase
- **Hán tự**: so từng ký tự, đánh dấu `match | wrong | missing | extra`
- **Pinyin**: convert Hán transcript → pinyin (dùng lib `pinyin-pro` đã có hoặc thêm), strip thanh điệu (ā/á/ǎ/à → a), so từng âm tiết
- Điểm = % ký tự đúng (trọng số: Hán 60%, Pinyin 40%)
- Trả về `{ hanziDiff[], pinyinDiff[], score }` để render màu xanh/đỏ

## 5. Tích hợp Soniox STT

**Cách hoạt động**: Soniox hỗ trợ realtime WebSocket. Để bảo mật API key, dùng **temporary API key** flow:

- Edge function `supabase/functions/soniox-token/index.ts`:
  - Verify user session (JWT)
  - Gọi `POST https://api.soniox.com/v1/auth/temporary-api-key` với `SONIOX_API_KEY` để lấy token ngắn hạn
  - Trả về token cho client
- Client mở WebSocket trực tiếp tới `wss://stt-rt.soniox.com/transcribe-websocket` với token này
- Cấu hình: `model: "stt-rt-preview"`, `language_hints: ["zh"]`, `enable_endpoint_detection: true`
- Stream PCM/Opus từ MediaRecorder → nhận transcript final khi user dừng nói

→ Cần secret: **`SONIOX_API_KEY`** (sẽ yêu cầu user thêm khi implement)

Hook tái sử dụng: `src/hooks/useSonioxRecognition.ts`
```ts
const { start, stop, transcript, isRecording, error } = useSonioxRecognition({
  language: "zh",
  onFinal: (text) => { /* chấm điểm */ }
});
```

## 6. Files mới / sửa

**Mới:**
- `src/data/conversationTypes.ts`
- `src/data/conversationsBeginner.ts` / `Intermediate.ts` / `Advanced.ts`
- `src/data/conversations.ts`
- `src/pages/Conversations.tsx` (chọn level)
- `src/pages/ConversationLevel.tsx` (list bài)
- `src/pages/ConversationPractice.tsx` (karaoke)
- `src/components/KaraokeLine.tsx` (1 dòng hội thoại với highlight)
- `src/components/PronunciationResult.tsx` (hiển thị diff màu)
- `src/lib/pronunciationScore.ts`
- `src/hooks/useSonioxRecognition.ts`
- `supabase/functions/soniox-token/index.ts`
- `mem://features/conversations` (memory mới)

**Sửa:**
- `src/App.tsx` — thêm 3 route
- `src/components/Navbar.tsx` — thêm menu "Hội thoại" + accordion mobile
- `mem://index.md` — thêm reference

## 7. Triển khai theo thứ tự

1. Tạo types + data mẫu (2 bài/level) + routing + 3 trang skeleton
2. Trang luyện karaoke với điều khiển play/next/prev (chưa có STT)
3. Implement `pronunciationScore.ts` + UI tô màu (test bằng input giả)
4. Yêu cầu secret `SONIOX_API_KEY` → tạo edge function token
5. Hook `useSonioxRecognition` + nối vào trang luyện
6. Sau khi nhận file Excel/DOCX của user → parse và thay data thật

## Câu hỏi xác nhận trước khi build
- File audio cho từng câu sẽ có sẵn hay chỉ hiển thị text? (nếu không có audio mẫu, "phát" sẽ chỉ là highlight + đếm thời gian, hoặc dùng TTS browser)
- Có cần lưu lịch sử điểm luyện không? (chưa có DB cho user data hiện tại — có thể lưu localStorage)
