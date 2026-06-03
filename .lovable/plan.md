# Kế hoạch: Thư viện video Dictation + phím tắt

## 1. Dữ liệu video curated

Tạo `src/data/dictationVideos.ts` (pattern giống `conversations.ts`):

```ts
export type DictationLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type DictationCategory = "news" | "vlog" | "cartoon" | "drama" | "education" | "other";

export interface DictationVideo {
  id: string;            // slug nội bộ
  youtubeId: string;     // mã video YouTube
  title: string;         // tiêu đề tiếng Trung
  titleVi?: string;      // tiêu đề tiếng Việt (tùy chọn)
  level: DictationLevel;
  category: DictationCategory;
  description?: string;
  durationLabel?: string; // "3:45" hiển thị nhanh
  thumbnail?: string;     // mặc định dùng https://i.ytimg.com/vi/<id>/hqdefault.jpg
}

export const DICTATION_VIDEOS: DictationVideo[] = [
  // bạn paste video tại đây
];

export const DICTATION_CATEGORIES: { id: DictationCategory; label: string }[] = [
  { id: "news", label: "Tin tức" },
  { id: "vlog", label: "Vlog" },
  { id: "cartoon", label: "Hoạt hình" },
  { id: "drama", label: "Phim" },
  { id: "education", label: "Học tập" },
  { id: "other", label: "Khác" },
];
```

Phụ đề vẫn lấy động qua edge function `youtube-captions` đã có — không cần paste segments thủ công.

## 2. Trang chọn video `src/pages/Dictation.tsx` (refactor)

Chia thành 2 chế độ qua `Tabs`:

- **Tab "Thư viện"** (mặc định):
  - Filter theo HSK level (1–6, dùng màu HSK trong `mem://style/color-palette`).
  - Filter theo category (chip).
  - Grid card: thumbnail YouTube + title + badge level + category. Click → vào chế độ luyện với `youtubeId` đó.
- **Tab "Dán link"**: giữ nguyên ô input + nút "Tải phụ đề" hiện tại.

Khi chọn xong video, hiển thị panel luyện (player + segment card) hiện có. Thêm nút "← Đổi video" để quay lại danh sách.

## 3. Phím tắt trong panel luyện

Đăng ký `useEffect` global keydown trên trang Dictation, chỉ active khi `data && seg`:

| Phím | Hành động |
|---|---|
| `Ctrl` (hoặc `Cmd`) đơn lẻ | Phát lại câu hiện tại (`playCurrent()`) |
| `Enter` (trong textarea, không Shift) | Nộp đáp án (`checkAnswer()`); nếu đã có score → đi câu tiếp |
| `Ctrl/Cmd + →` | Câu tiếp |
| `Ctrl/Cmd + ←` | Câu trước |

Chi tiết:
- `Ctrl` đơn lẻ: lắng nghe `keydown` với `e.key === "Control"` (hoặc Meta), bỏ qua nếu đang giữ thêm phím khác (check `e.repeat` để không spam). Để tránh trigger khi user dùng Ctrl+C copy, chỉ play khi `keyup` của Control mà không có phím nào khác bấm cùng (track flag `ctrlAlone`).
- `Enter` trong `<Textarea>`: xử lý ngay `onKeyDown` (đã có; thay thế shortcut Ctrl+Enter cũ). `Shift+Enter` vẫn xuống dòng bình thường.
- Mũi tên: handler global, `preventDefault` khi match.

Thêm khối "Phím tắt" nhỏ dưới card hướng dẫn cho người dùng.

## 4. Navbar / routing

Không đổi — route `/dictation` đã có, mục **听写** đã ở 学习工具.

## 5. Lưu ý kỹ thuật

- Chinese text trong `dictationVideos.ts` để trong backtick (theo `mem://architecture/encoding-standards`).
- Thumbnail dùng `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`, có fallback `mqdefault.jpg`.
- `localStorage` state hiện tại được giữ; khi chọn video mới từ thư viện thì reset như khi load URL.
- Không thêm DB / bảng mới.

## Files thay đổi

- **Tạo** `src/data/dictationVideos.ts`
- **Sửa** `src/pages/Dictation.tsx` (thêm Tabs, grid thư viện, filter, phím tắt)

## Ngoài phạm vi (có thể làm sau)

- Đánh dấu video đã hoàn thành / tiến độ theo từng video.
- Lưu segments đã cache để không phải gọi lại edge function.
- Admin UI thêm/sửa video.
