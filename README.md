# 🎬 Hệ Thống Workflow Sản Xuất Video Học Liệu Ngắn (Edu Video AI Workflow)

> **Quy trình sản xuất video giáo dục ngắn (9:16) chuẩn sư phạm & chuyển đổi cao**, kết hợp sức mạnh của **Remotion**, **AI Agent (Antigravity / Cursor / Claude Code)** và **OmniVoice TTS (Colab)**.

---

## 📌 1. Giới thiệu tổng quan

Workflow này được thiết kế để tự động hóa và chuẩn hóa quy trình sản xuất video giáo dục ngắn từ khâu **Lên kịch bản** $\rightarrow$ **Sinh giọng đọc TTS** $\rightarrow$ **Thiết kế hoạt ảnh Remotion** $\rightarrow$ **Kiểm thử âm thanh / BGM** $\rightarrow$ **Render & QA**.

### 🌟 Điểm nổi bật:
- **Nguyên tắc kịch bản chuyển đổi:** Phễu `Hook → Empathy → Value → Pitch → CTA`, nói hết giá trị trước khi giới thiệu khóa học/sản phẩm.
- **Visual & Kinetic Animation:** Đọc tới đâu hiện tới đó (Kinetic Staggered Reveal), chuyển cảnh dứt khoát kết hợp mascot dẫn dắt, cỡ chữ tối ưu cho màn hình dọc điện thoại (Mobile Readability).
- **Trình chỉnh sửa nội bộ:** Có sẵn web server review (`sua-video.html` & `sua-video.mjs`) cho phép nghe thử giọng, sửa timeline và preview trực tiếp trên trình duyệt.
- **Bộ công cụ QA âm thanh tự động:** Script phân tích phổ âm (spectrum), đo loudness RMS, ducking BGM và cân bằng tần số.

---

## 📂 2. Cấu trúc thư mục

| Thư mục / Tập tin | Vai trò & Ý nghĩa |
|---|---|
| **[AGENTS.md](file:///d:/test%20AI/AGENTS.md)** | **Trái tim của hệ thống:** Bộ quy tắc ứng xử, 34 bẫy kỹ thuật & tiêu chuẩn sản xuất video cho AI Agent. |
| **[HANDOVER.md](file:///d:/test%20AI/HANDOVER.md)** | Hướng dẫn bàn giao nhanh, cảnh báo các lỗi nghiêm trọng và quy trình khôi phục. |
| **`skills/`** | Kỹ năng mở rộng cho AI Agent (`shortform-video-workflow` với schema kịch bản và checklist QA). |
| **`tools/`** | 14 script kiểm thử âm thanh, xử lý nhạc nền BGM (`make-bgm-bed.mjs`, `audio-check.mjs`, ...). |
| **`tin-12-csdl/`** | Dự án video mẫu (Remotion + React 19 + TypeScript + Web review server). |
| **`anh-nguon/`** | Kho hình ảnh, minh họa tư liệu kèm ghi chú bản quyền. |
| **`11 đề format/`** | Tài liệu cấu trúc đề thi và định dạng nội dung giảng dạy. |
| **`sách hướng dẫn ôn thi tin học.pdf`** | Tài liệu kiến thức gốc (Chương trình GDPT 2018). |

---

## 🚀 3. Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Yêu cầu môi trường
- **[Git](https://git-scm.com/)**
- **[Node.js](https://nodejs.org/)** (Khuyến nghị bản LTS v20 trở lên)
- **VS Code** hoặc trình soạn thảo hỗ trợ AI Agent (Antigravity, Cursor, Claude Code, Cline...)

### Bước 2: Clone repository về máy
```bash
git clone <URL_REPOSITORY_GITHUB>
cd <thu-muc-du-an>
```

### Bước 3: Cài đặt thư viện phụ thuộc cho project video
Di chuyển vào thư mục dự án video (ví dụ `tin-12-csdl`) và cài đặt:
```bash
cd tin-12-csdl
npm install
```

> **Lưu ý trên Windows:** Remotion sử dụng ffmpeg đi kèm. Nếu gặp lỗi CodeIntegrity hoặc codec âm thanh, vui lòng tham khảo mục **Bẫy số 26** trong file `AGENTS.md` hoặc `HANDOVER.md`.

---

## 🎙️ 4. Quy trình sản xuất video

### 1. Sinh giọng đọc (TTS)
1. Mở notebook Colab OmniVoice TTS: [Colab OmniVoice Notebook](https://colab.research.google.com/drive/1Do1mW0AVuknucUT-NlawsXy41o4PtFSt?pli=1).
2. Chạy notebook để lấy đường dẫn Cloudflare Tunnel (dạng `https://<random>.trycloudflare.com`).
3. Dán link vào file `tin-12-csdl/tts-url.txt` (hoặc set biến môi trường `TTS_URL`).
4. Kiểm tra danh sách giọng đọc:
   ```bash
   node gen-vo.mjs --voices
   ```
5. Sinh file audio cho toàn bộ kịch bản:
   ```bash
   node gen-vo.mjs
   ```

### 2. Xem trước và Tinh chỉnh
- **Remotion Studio:**
  ```bash
  npm run studio
  ```
  *(Truy cập `http://localhost:3000` để xem timeline, căn chỉnh từng frame).*

- **Trình chỉnh sửa nhanh (Web Review UI):**
  ```bash
  node sua-video.mjs
  ```
  *(Mở trình duyệt tại `http://127.0.0.1:5186/` để sửa kịch bản, nghe lại câu và đối chiếu duration).*

### 3. Xuất bản (Render)
```bash
npm run render
```
Video hoàn thiện sẽ được lưu tại `tin-12-csdl/out/video.mp4`.

---

## 🤖 5. Làm việc cùng AI Agent

Nếu bạn sử dụng AI Agent (như Antigravity, Cursor Agent, Claude Code):
1. Mở toàn bộ workspace này trong editor.
2. AI Agent sẽ tự động đọc **`AGENTS.md`** để nắm bắt toàn bộ vai trò **Giám đốc Sản xuất Video**, tuân thủ nghiêm ngặt 34 nguyên tắc vàng và quy trình kịch bản sư phạm.
