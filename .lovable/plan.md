# Gom menu thành 学习工具

## Mục tiêu
Trên `src/components/Navbar.tsx`, thay 4 link rời (对话, 新闻, 被动听力, và mục 抽认卡 hiện nằm trong dropdown user) bằng **một dropdown duy nhất tên 学习工具** (Công cụ học tập).

## Thay đổi cụ thể

### Desktop nav
Giữ thứ tự: `语法` · `生词` · `模拟考试` · **`学习工具 ▾`** · `生词本` · (user menu) · ThemeToggle.

Dropdown `学习工具` chứa 4 mục với icon:
- `MessageSquare` — 对话 Hội thoại → `/conversations`
- `Newspaper` — 新闻 Tin Trung Quốc → `/news`
- `Headphones` — 被动听力 Nghe thụ động → `/passive-listening`
- `Layers` — 抽认卡 Flashcards → `/flashcards`

Trigger active khi `pathname` khớp một trong các route trên (highlight `bg-muted`).

### User dropdown
Bỏ mục `抽认卡 Flashcards` khỏi cả nhánh logged-in và logged-out (đã chuyển sang 学习工具). Giữ: Thông tin tài khoản, Đăng xuất / Đăng nhập.

### Mobile menu
Thay 4 link rời bằng một accordion/section `学习工具` chứa 4 link con (thụt lề nhẹ). Dùng `Collapsible` của shadcn hoặc `<details>` đơn giản. Cũng bỏ Flashcards khỏi phần user mobile.

## Phạm vi
- Chỉ sửa `src/components/Navbar.tsx`.
- Không đổi route, không đổi trang đích, không đổi logic auth.
