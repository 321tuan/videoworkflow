# Trình sửa video dùng chung (video-editor-kit)
Copy 4 file này vào thư mục project video rồi chạy. Không cần sửa code, trừ PORT.

## Lắp vào project mới (2 phút)
1. Copy `sua-video.mjs`, `sua-video.html`, `vo-tool.mjs`, `chon-giong.html` vào `<project>\tools\`
   (hoặc thẳng thư mục project với `sua-video.*`).
2. Mở `sua-video.mjs`, đổi `PORT` cho khỏi đụng project khác
   (đã dùng: 5177 review, 5178 review, 5179/5181/5182/5183 sua-video).
3. Project cần có sẵn: `tts-url.txt`, `src/vo.json` (`{voice_id, segments}`),
   `src/vo-durations.json`, `public/vo/*.ogg`, `out/still-<key>.png`, `renders/history.json` (tạo rỗng `[]`).
4. Chạy: `node tools\sua-video.mjs` → mở `http://127.0.0.1:<PORT>`.

## Chức năng có sẵn
- Xem nháp + nhảy cảnh theo vạch; sửa lời → sinh lại giọng từng cảnh/tất cả (qua tunnel Colab).
- Đổi giọng (dropdown live `/voices`, chặn ID sai tuyệt đối).
- Sửa chữ lyrics trực tiếp từng ô (không cần sinh lại giọng).
- Upload nhạc / AI tìm nhạc (thư viện local) / chốt nhạc (backup + `bgm.json` + log history).
- Trộn âm: từng cảnh + nhạc nền (lưu `src/mix.json`, render lại để nghe).
- Render lại full + log `renders/history.json` (đọc mới mỗi request).

## Quy ước project để tool chạy đúng
- `src/vo.json`: `{voice_id, segments: {key: text}}`.
- `src/vo-durations.json`: `{key: seconds}`.
- `public/vo/<key>.ogg`, `out/still-<key>.png`, `out/draft.mp4`.
- `src/mix.json`: `{voice: {key: gain}, bgm: gain}` (không bắt buộc — thiếu thì tool vẫn chạy, render dùng gain 1.0;
  để render tôn trọng gain thì scenes phải đọc `mix.ts` như mẫu).
