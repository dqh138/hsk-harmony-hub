# Kế hoạch: Video Dictation (听写) từ YouTube

## Luồng người dùng

1. Vào trang mới `/dictation` (thêm vào dropdown 学习工具 với icon `PenLine`, label `听写 / Chép chính tả`).
2. Dán URL YouTube tiếng Trung → bấm "Tải phụ đề".
3. App nhúng YouTube player + hiển thị danh sách câu (segment) từ phụ đề (chỉ thời gian, ẩn hanzi).
4. Người dùng bấm **▶ Câu N** → player phát đúng đoạn từ `start` đến `start+duration` rồi tự pause.
5. Người dùng gõ hanzi vào ô input → bấm "Kiểm tra" → so sánh với transcript gốc, highlight đúng/sai theo ký tự (tái dùng `scorePronunciation` từ `src/lib/pronunciationScore.ts`, lấy `hanziDiff`).
6. Có nút "Hiện đáp án", "Pinyin", "Nghĩa VN" (dịch lười, gọi khi cần), "Câu trước/sau", "Nghe lại".
7. Tổng điểm trung bình ở cuối, lưu lịch sử video gần đây vào `localStorage`.

## Kiến trúc kỹ thuật

### 1. Lấy phụ đề YouTube — Edge Function mới `youtube-captions`

Trình duyệt không gọi trực tiếp được endpoint phụ đề YT (CORS + nhiều endpoint cần token). Cần edge function:

- Input: `{ videoId }` (parse từ URL ở client).
- Bước 1: GET `https://www.youtube.com/watch?v=<id>` (User-Agent giả lập), regex lấy `ytInitialPlayerResponse` → `captions.playerCaptionsTracklistRenderer.captionTracks[]`.
- Bước 2: Chọn track tiếng Trung theo thứ tự ưu tiên: `zh-Hans` > `zh-CN` > `zh` > `zh-Hant` > track đầu tiên có `languageCode` bắt đầu `zh`. Nếu không có → trả lỗi rõ ràng "Video này không có phụ đề tiếng Trung".
- Bước 3: GET `baseUrl + "&fmt=json3"` → parse `events[]` thành mảng `{ start, duration, text }`. Lọc bỏ event rỗng, ghép các segment cực ngắn (<1.5s) với segment kế tiếp để câu đủ dài để chép.
- Bước 4: Trả về JSON `{ title, segments: [{ idx, start, dur, hanzi }] }`.
- CORS chuẩn, dùng `corsHeaders` từ `npm:@supabase/supabase-js@2/cors`. `verify_jwt = false` (mặc định).

### 2. Pinyin & dịch nghĩa (lazy, theo câu)

- **Pinyin**: tạo client-side bằng `pinyin-pro` (đã có trong project).
- **Dịch VN**: tái dùng edge function `pinyin-translate` (đã có) — chỉ gọi khi user bấm "Nghĩa VN" cho 1 câu, không dịch hàng loạt để tiết kiệm.

### 3. YouTube player — kiểm soát pause theo segment

- Dùng IFrame Player API qua component nhỏ `YouTubeSegmentPlayer.tsx`:
  - Load `https://www.youtube.com/iframe_api` 1 lần.
  - Expose method `playSegment(start, dur)`: `seekTo(start, true)` → `playVideo()` → `setTimeout(pauseVideo, dur*1000)`. Có cờ cancel khi user bấm câu khác.
  - Nút "Nghe lại" gọi lại `playSegment` của câu hiện tại.

### 4. Trang `src/pages/Dictation.tsx`

Layout:

```text
[Navbar]
[Input URL YT] [Tải phụ đề]
─────────────────────────────
[YouTube iframe player 16:9]
─────────────────────────────
[Card câu hiện tại]
  Câu 3 / 42   ⏱ 00:42 → 00:48     [▶ Nghe]
  [Input hanzi __________________]
  [Kiểm tra] [Hiện đáp án] [Pinyin] [Nghĩa VN]
  → so sánh: 我❌爱✓中✓国✓
[← Câu trước]  [Câu sau →]
─────────────────────────────
Tiến độ: 12/42 câu • Điểm TB: 86%
```

Quản lý state với `useState`/`useMemo`. Lưu `{ url, segments, scores, currentIdx }` vào `localStorage` theo `videoId` để quay lại học tiếp.

### 5. Menu & routing

- Thêm route `/dictation` vào `src/App.tsx`.
- Thêm vào dropdown **学习工具** (desktop + mobile accordion) trong `src/components/Navbar.tsx`, icon `PenLine` từ lucide-react, label `听写`.

## Files cần tạo / sửa

- **Tạo** `supabase/functions/youtube-captions/index.ts` — fetch + parse phụ đề.
- **Tạo** `src/pages/Dictation.tsx` — trang chính.
- **Tạo** `src/components/YouTubeSegmentPlayer.tsx` — wrapper IFrame API.
- **Sửa** `src/App.tsx` — thêm route.
- **Sửa** `src/components/Navbar.tsx` — thêm item vào 学习工具.

## Hạn chế & rủi ro cần biết trước

1. **Phụ đề YT có thể bị chặn**: YouTube đôi khi yêu cầu token (`pot`/`signatureCipher`) cho `timedtext`. Phương án regex `ytInitialPlayerResponse` hoạt động cho ~90% video công khai có sub thủ công; với video chỉ có **auto-generated caption** (asr) tỉ lệ thành công thấp hơn và cần thêm tham số `&kind=asr`. Plan này cover cả 2 trường hợp nhưng vẫn có thể fail với video bị giới hạn vùng/age-restricted — khi đó hiện lỗi rõ ràng cho user.
2. **Không phải video nào cũng có sub tiếng Trung**: cần kiểm tra và báo lỗi sớm.
3. **Auto-caption thường thiếu dấu câu** → câu sẽ dài/khó tách. Có thể bổ sung bước cắt theo độ dài (>15 ký tự thì cắt) ở phase 2.
4. **Chấm điểm**: dùng lại thuật toán LCS hiện có, so theo ký tự hanzi (bỏ qua dấu câu) — đủ tốt cho dictation, không cần Soniox/STT.
5. **Tốc độ phát**: YT IFrame API hỗ trợ `setPlaybackRate(0.75 / 1 / 1.25)` — sẽ thêm 3 nút tốc độ.

## Phase 2 (không làm ở plan này)

- Lưu video & tiến độ lên Lovable Cloud thay vì localStorage.
- Curated library video HSK theo cấp độ.
- Chế độ cloze (điền chỗ trống).
- Export kết quả dictation ra PDF.
