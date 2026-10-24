# BỆ ĐỠ BÀN GIAO — D:\test AI (lập 11/10/2026)

Tài liệu này để agent khác tiếp quản làm việc an toàn, tránh rủi ro. Luật cao nhất vẫn là `AGENTS.md`.

## 1. Bản đồ project

| Thư mục | Vai trò | Được đụng? |
|---|---|---|
| `tin-12-python/` | Project video CHÍNH (Python SGK 12, final đã giao 08/10) | Cẩn thận, đọc §3 trước |
| `tin-12-csdl/` | Project video CSDL & SQL 12 cho 2K9 (final đã giao) | Không xóa |
| `tin-12-ai/` | Project video MỚI: Trí tuệ nhân tạo (AI) Tin học 12 (final 16/10) | Đã chốt, bảo lưu source |
| `tin-chon-tin/` | Video test 20s cũ (giọng Nhật Phong) | Chỉ đọc tham khảo |
| `video-cu/` | Archive: 2 project Remotion cũ + `backup-tin-12-python-20261011.zip` (13MB, KHÔNG gồm node_modules) | Không xóa |
| `videos/` | MP4 final các video (`tin-12-ai.mp4` = bản mới nhất 16/10) | TUYỆT ĐỐI không ghi đè/xóa |
| `anh-nguon/` + `ĐỌC TRƯỚC.txt` | Kho ảnh + caption + nguồn bản quyền | Thêm ảnh mới phải cập nhật file này |
| `sách hướng dẫn ôn thi tin học.pdf` | Nguồn kiến thức ôn thi tốt nghiệp 2018 (NXB ĐHQGHN) + Internet. Không dẫn nguồn trong video; **tự chủ giải lại đáp án vì sách có chỗ in sai** | Tham khảo cốt lõi |
| `tools/` | Script đo/kiểm tra BẮT BUỘC dùng (bản nhớ) | Không xóa |
| `vo-mau/`, `skills/`, `agent/` | Mẫu giọng, skills | Không xóa |
| `auto-compare-video/` | Repo clone thử nghiệm HyperFrames (chưa dùng) | Tùy |
| `D:\LINH TINH\.npm-cache-testAI\` | npm cache cũ (192MB) đã dọn khỏi đây ngày 11/10 | Không cần |

## 2. Trạng thái hiện tại (16/10/2026)

### 2.1 Dự án vừa hoàn thành: `tin-12-ai/` (Tin học 12 — Trí tuệ nhân tạo AI)
- **Video final:** `D:\test AI\videos\tin-12-ai.mp4` (105.63s, 3169 frames, 36.44 MB, 1080x1920).
- **Giọng đọc:** Ninh Đôn (`clone_Ninh_Đôn__11Labs__M`).
- **Phát âm tiếng Việt chuẩn:** thuần tiếng Việt, không dùng gạch nối (`ây ai`, `chát di bi ti`, `a nờ i`, `a gi i`, `Giôn Mác Ca thi`, `Tu ring`, `đíp phếch`).
- **Phụ đề & Giao diện:** chuẩn orthography quốc tế (`AI`, `ChatGPT`, `ANI`, `AGI`, `John McCarthy`, `Turing`, `Deepfake`).
- **Nhạc nền:** `Kindness.mp3` (user upload, đã filter 200Hz, RMS -34.6dBFS, auto-ducking).
- **Mascot Chim Neo:** file gốc `public/img/canh-cut.png` giữ nguyên bản, không viền, CHỈ xuất hiện ở HookScene, ẩn hoàn toàn ở các cảnh sau.
- **Server review local:** `node sua-video.mjs` chạy tại cổng **5190** (`http://127.0.0.1:5190/`).

### 2.2 Dự án tham chiếu trước: `tin-12-csdl/` (Tin học 12 — Cơ sở dữ liệu & SQL)
- **Đối tượng:** Nghiêm ngặt **2K9** (không dùng 2K8).
- **Mở đầu (Hook):** Kinetic Staggered Reveal xuất hiện từng bước theo nhịp giọng đọc.
- **Chuyển cảnh:** Đã chuyển đổi sang chuẩn Dissolve / Fade nhẹ nhàng (bãi bỏ slide push và penguin swoop).
- **Server review local:** Cổng **5186**.


## 3. Bẫy đã biết — vi phạm là hỏng project

1. **ffmpeg patch (bẫy số 26):** `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe` là bản thay thế (file gốc đổi tên `*-blocked-orig.exe`) + đã vá `renderer/dist/options/audio-codec.js` (`libfdk_aac`→`aac`). **`npm install` lại sẽ MẤT patch** → render gãy EPIPE. Cài lại xong phải vá lại y hệt.
2. **Timeline = durations OGG** (`src/vo-durations.json`, đo bằng ffprobe), KHÔNG phải words STT (ngắn hơn ~0.3s/beat). Đổi audio/text → chạy lại chuỗi export → prep → build → check.
3. **User sửa lời trên trình giữa lúc QA → QA lại từ đầu** (đã dính 1 lần: hook/cpp/cta đổi durations).
4. Mọi lệnh npm/npx: set `TEMP`/`TMP`/`npm_config_cache` về `D:\cache` trước (hiện `D:\cache` không tồn tại — tạo lại khi cần).
5. KHÔNG cài/ghi bất cứ gì lên ổ C:. Python helper luôn `$env:PYTHONUTF8=1`.
6. **Bẫy thẩm mỹ UI & Safe Zone Mobile (Quy tắc 41-44):** 
   - Tuyệt đối cấm để thẻ chưa nói tới ở dạng mờ nhờ (`opacity: 0.35`) gây bẩn màn hình; phải `opacity: 0` và bung xuất hiện theo nhịp giọng đọc.
   - Tránh xa Top Safe Zone (`top < 220px`) để không bị thanh tìm kiếm TikTok đè.
   - Lyrics ở `bottom: 280-330px`, không để quá sát đáy. Không cho ký hiệu nền bay đè xuyên chữ.
7. **Thời lượng chuẩn (bắt buộc từ 20/10/2026):** Mọi video phải dài từ 1m30s đến 1m50s (90s – 110s, vùng lý tưởng 95s – 105s, ~260-290 từ). Tuyệt đối không làm video ngắn dưới 90s.

## 4. Khôi phục khi hỏng

- Nhẹ (mất node_modules): `npm install` trong project → **vá lại ffmpeg (§3.1)** → `npx remotion compositions src/index.ts` kiểm tra.
- Nặng (mất source): giải nén `video-cu/backup-tin-12-python-20261011.zip` đè lên `tin-12-python/` (zip KHÔNG có node_modules → làm tiếp bước nhẹ). File giọng `.ogg` CÓ trong zip; file `.wav` tự sinh lại từ ogg.
- Kiểm tra nhanh sau khôi phục: `Test-Path node_modules\.bin\remotion.cmd` phải True + bundle không lỗi.
