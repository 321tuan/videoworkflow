# BỆ ĐỠ BÀN GIAO — D:\test AI (lập 11/10/2026)

Tài liệu này để agent khác tiếp quản làm việc an toàn, tránh rủi ro. Luật cao nhất vẫn là `AGENTS.md`.

## 1. Bản đồ project

| Thư mục | Vai trò | Được đụng? |
|---|---|---|
| `tin-12-python/` | Project video CHÍNH (Python SGK 12, final đã giao 08/10) | Cẩn thận, đọc §3 trước |
| `tin-12-csdl/` | Project video ĐANG LÀM (CSDL & SQL 12 cho 2K9, Remotion) | Đang phát triển, xem §2.1 |
| `tin-chon-tin/` | Video test 20s cũ (giọng Nhật Phong) | Chỉ đọc tham khảo |
| `video-cu/` | Archive: 2 project Remotion cũ + `backup-tin-12-python-20261011.zip` (13MB, KHÔNG gồm node_modules) | Không xóa |
| `videos/` | MP4 final các video (`tin-hoc-ngon-ngu-lap-trinh-tap-1.mp4` = bản mới nhất) | TUYỆT ĐỐI không ghi đè/xóa |
| `anh-nguon/` + `ĐỌC TRƯỚC.txt` | Kho ảnh + caption + nguồn bản quyền | Thêm ảnh mới phải cập nhật file này |
| `sách hướng dẫn ôn thi tin học.pdf` | Nguồn kiến thức ôn thi tốt nghiệp 2018 (NXB ĐHQGHN) + Internet. Không dẫn nguồn trong video; **tự chủ giải lại đáp án vì sách có chỗ in sai** | Tham khảo cốt lõi |
| `tools/` | Script đo/kiểm tra BẮT BUỘC dùng (bản nhớ) | Không xóa |
| `vo-mau/`, `skills/`, `agent/` | Mẫu giọng, skills | Không xóa |
| `auto-compare-video/` | Repo clone thử nghiệm HyperFrames (chưa dùng) | Tùy |
| `D:\LINH TINH\.npm-cache-testAI\` | npm cache cũ (192MB) đã dọn khỏi đây ngày 11/10 | Không cần |

## 2. Trạng thái hiện tại (13/10/2026)

### 2.1 Dự án đang chạy: `tin-12-csdl/` (Tin học 12 — Cơ sở dữ liệu & SQL)
- **Đối tượng:** Nghiêm ngặt **2K9** (không dùng 2K8).
- **Mở đầu (Hook):** Kinetic Staggered Reveal xuất hiện từng bước theo nhịp giọng đọc (Headline -> Cảnh báo 80% mất điểm oan -> Hộp câu hỏi bẫy -> Đáp án A -> Đáp án B đúng -> 4 dạng bài nảy so le lần lượt).
- **Chuyển cảnh:** Smooth Slide Push liền mạch, sạch sẽ; chú cánh cụt vút bay lướt qua với tốc độ chuẩn 26 frames (~0.87s), êm ái vừa vặn, không quá nhanh cũng không quá chậm.
- **Đoạn kết (Outro logo Neo):** Giữ yên tại chỗ tĩnh, chỉ mờ dần nhẹ nhàng ở đầu và cuối (`StaticOutroTransition`).
- **Server review local:** `node sua-video.mjs` chạy tại cổng **5186** (`http://127.0.0.1:5186/`).
- **Video render mới nhất:** `out/draft.mp4` (96.33s, 2890 frames, 18.7 MB).


## 3. Bẫy đã biết — vi phạm là hỏng project

1. **ffmpeg patch (bẫy số 26):** `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe` là bản thay thế (file gốc đổi tên `*-blocked-orig.exe`) + đã vá `renderer/dist/options/audio-codec.js` (`libfdk_aac`→`aac`). **`npm install` lại sẽ MẤT patch** → render gãy EPIPE. Cài lại xong phải vá lại y hệt.
2. **Timeline = durations OGG** (`src/vo-durations.json`, đo bằng ffprobe), KHÔNG phải words STT (ngắn hơn ~0.3s/beat). Đổi audio/text → chạy lại chuỗi export → prep → build → check.
3. **User sửa lời trên trình giữa lúc QA → QA lại từ đầu** (đã dính 1 lần: hook/cpp/cta đổi durations).
4. Mọi lệnh npm/npx: set `TEMP`/`TMP`/`npm_config_cache` về `D:\cache` trước (hiện `D:\cache` không tồn tại — tạo lại khi cần).
5. KHÔNG cài/ghi bất cứ gì lên ổ C:. Python helper luôn `$env:PYTHONUTF8=1`.

## 4. Khôi phục khi hỏng

- Nhẹ (mất node_modules): `npm install` trong project → **vá lại ffmpeg (§3.1)** → `npx remotion compositions src/index.ts` kiểm tra.
- Nặng (mất source): giải nén `video-cu/backup-tin-12-python-20261011.zip` đè lên `tin-12-python/` (zip KHÔNG có node_modules → làm tiếp bước nhẹ). File giọng `.ogg` CÓ trong zip; file `.wav` tự sinh lại từ ogg.
- Kiểm tra nhanh sau khôi phục: `Test-Path node_modules\.bin\remotion.cmd` phải True + bundle không lỗi.
