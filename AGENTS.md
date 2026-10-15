# Dự án Video Học liệu — Quy tắc ổ đĩa (ƯU TIÊN SỐ 1, đứng trên mọi quy tắc khác)

## Quy tắc ổ C: (không được phép vi phạm — nhanh cỡ nào cũng không được đánh đổi)
- **KHÔNG cài đặt, tải, cache, download, temp, hay tạo file dữ liệu GÌ trên ổ C:.**
  Mọi thứ phải nằm trên ổ **D:** — kể cả 1 byte cũng không được chiếm ổ C.
- Phạm vi áp dụng (bắt buộc kiểm tra + cấu hình lại trước khi dùng lần đầu):
  - npm/pnpm/yarn cache → `D:\cache\npm`
  - pip cache → `D:\cache\pip`
  - `%TEMP%` / temp của HyperFrames & render → `D:\cache\tmp` (nếu tool cho phép)
  - cache của hyperframes CLI → chuyển/trỏ sang ổ D
  - tất cả bản cài đặt tool/CLI/package (Python, ffmpeg, Node, .NET...) → ổ D
  - tài nguyên media, download, file làm việc → ổ D
- Khi cần cài đặt mới: báo trước cho user (tên tool, dung lượng dự kiến, vị trí ổ D đích)
  và không bắt đầu nếu ổ C có nguy cơ bị ghi.
- Ngoại lệ tối thiểu: file cấu hình hệ thống không có lựa chọn khác (vd `.npmrc`, registry)
  — chỉ vài byte, ghi nhận vào mục bên dưới.
  

---

# ⚠️ NHỚ TẠM THỜI SỐ 1 — TỔNG HỢP LỖI NGÀY 05/10/2026 (hạ cấp khi video tiếp theo hoàn thành)

1. **Voice ID sai → ra giọng lạ im lặng:** ID ngắn/khác 1 ký tự vẫn trả audio (fallback giọng đầu).
   Luôn `--voices` xác thực + đối chiếu fingerprint F0 khi nghi ngờ.
2. **Chạy song song ghi đè file:** robocopy/shell chạy cùng lúc với `write` sẽ ghi đè — viết file SAU khi copy xong.
3. **UV_HANDLE_CLOSING khi thoát node:** quirk Windows vô hại nếu output đã đủ, đừng hoảng.
4. **`still` truyền frame kiểu vị trí bị bỏ qua:** luôn dùng `--frame=N`.
5. **Console cp1252/mojibake:** mọi lệnh Python thêm `$env:PYTHONUTF8=1`.
6. **node_modules mất/junction chết sau dọn:** kiểm tra `node_modules\.bin\remotion.cmd`, mất thì `npm install` lại.
7. **Server clone 48kHz vs OmniVoice 24kHz:** `vo-durations.json` luôn đối chiếu `ffprobe`, lệch thì ghi đè.
8. **STT nghe sai tên riêng/URL/số:** realign chữ theo script + kiểm tra tay từng file words trước render.
9. **Sửa words mù theo index:** đọc tokens trước, không đoán (đã dính 2 lần).
10. **Gộp token phải có quy tắc dấu cách:** chữ+số dính ("X06","4.0") không cách; số+từ ("1 đề","4 câu") có cách.
11. **Cụm lyrics vỡ <0.5s/timestamp âm:** gộp vào cụm trước; chunk tối đa 6 từ, tối thiểu 1s.
12. **Đổi audio/text mà không chạy lại chuỗi** → timeline lệch: export → prep → build → check.
13. **Mix lưu sau render:** render sau MỌI lần đổi âm/giọng/chữ mới có hiệu lực.
14. **EADDRINUSE:** kill instance cũ trước khi bật server mới; mỗi project 1 port riêng.
15. **BGM bed ngắn hơn video:** bed phải dài hơn video (kiểm tra duration trước khi render).
16. **User regen giữa lúc QA:** timeline trôi — chốt "đóng băng" khi vào QA, regen xong QA lại từ đầu.
17. **PowerShell bẫy:** không có `head`, không `||`, không `for ($x in ...)`, không `python -c` nhiều dòng —
    viết script ra file `D:\cache\tmp\*.py|*.mjs` rồi chạy.
18. **av 19 gãy faster-whisper:** vá `audio.py` bypass `av` (decode wav bằng `wave`+numpy); cài `av` build lỗi trên py3.14.
19. **npm/npx ghi cache ổ C:** luôn set `TEMP`/`TMP`/`npm_config_cache` về `D:\cache` trước khi chạy.
20. **Không `npx tsc`** (cài nhầm gói rác); check code bằng `npx remotion compositions`.
21. **ffmpeg Remotion cụt filter:** đo bằng `tools/*.mjs`, không cố lệnh ffmpeg.
22. **Lyrics che chủ thể/logo:** vị trí theo shot, đáy mặc định; scale chữ gây dính → bỏ scale.
23. **Tính offset still bằng tay dễ sai:** đọc `/api/state` lấy start/frames chuẩn.
24. **Số ước lượng trong history:** đo thật (`Get-ChildItem Length`, `ffprobe`), không đoán.
25. **File public/ gốc che file mới:** `staticFile(IMG.x)` trỏ đâu thì ảnh mới phải nằm đúng đó; file cũ
    còn sót ở `public/` gốc sẽ lấn át file mới trong `public/img/` (đã dính ảnh web đen cũ).
26. **ffmpeg bundled bị chặn (CodeIntegrity 0xC0E09002):** thay `ffmpeg.exe`/`ffprobe.exe` trong
    `@remotion/compositor-win32-x64-msvc` bằng bản chạy được + vá `renderer/dist/options/audio-codec.js`
    (`libfdk_aac`→`aac`) vì build thay thế thiếu codec đó. Mất patch khi `npm install` lại.
27. **Cỡ chữ hiển thị trên điện thoại (Mobile Readability):** TUYỆT ĐỐI KHÔNG để chữ quá nhỏ (<20-22px). Mọi nội dung, bảng, thẻ, ghi chú, code phải có `fontSize >= 22px-26px`, tiêu đề thẻ `28px-34px`, tiêu đề chính `48px-54px`, lyrics `40px-42px` để đọc rõ ràng trên màn hình điện thoại 9:16.
28. **Đọc tới đâu hiện tới đó (Voice-Synced / Kinetic Staggered Reveal):** Đọc đến câu/ý nào thì ô cửa sổ / thẻ / sơ đồ đó mới spring pop-in. CẤM hiện đồng loạt tất cả các ô ngay khi chuyển slide gây nhàm chán.
29. **Transition chuyển cảnh hiện đại:** KHÔNG dùng kiểu fade/crossfade mờ dần nhàm chán. Dùng Kinetic Slide Push / Zoom Spring Pop có vệt sáng / whip motion dứt khoát.
30. **Mở đầu (Hook) trực quan & ấn tượng:** Mở đầu KHÔNG đập ngay kiến thức khô khan. Phải có visual mở đầu ấn tượng, vẽ logo/biểu tượng môn học (máy tính/terminal phát sáng cho môn Tin, từ vựng/ngôn ngữ cho Tiếng Anh...).
31. **Nền động theo chủ đề môn học:** Tùy chủ đề môn học mà nền phải có dòng code, ký tự ma trận, cú pháp chuyển động mờ (Tin học: code SQL, binary; Tiếng Anh: từ vựng, ngữ pháp; Toán: công thức...). Không dùng nền tĩnh hay lưới trơn đơn điệu.
32. **Ký hiệu lơ lửng / rơi chậm đặc trưng môn học kết hợp nền ánh sao lấp lánh (Hook Ambient Symbols & Sparkle Stars — ĐIỂM NHẤN BẮT BUỘC):**
    - Đoạn mở đầu video bắt buộc có hiệu ứng các ký hiệu đặc thù của môn học rơi nhẹ/lơ lửng trong không gian nền (Floating Ambient Particles) đung đưa chậm rãi tự nhiên. Ký hiệu mang đặc trưng riêng chuẩn môn học: Tin học (`{}`, `[]`, `()`, `&&`, `||`, `<>`, bit `0`, `1`...); Tiếng Anh (`/ə/`, `θ`, `æ`, từ vựng); Toán (`∫`, `√`, `π`...).
    - **Nền ánh sao lấp lánh (Sparkle Stars Background):** Kết hợp các ngôi sao 4 cánh lấp lánh (sparkle stars) co giãn nhịp thở nhẹ nhàng trên nền tối, tạo chiều sâu thị giác công nghệ sang trọng và ấn tượng.
33. **Giữ tỷ lệ màn hình tự nhiên, không ép phóng to & rút gọn nội dung ô súc tích (Natural Framing & Concise Window Content):**
    - TUYỆT ĐỐI KHÔNG ép phóng to (scale/zoom) các ô cửa sổ hay cố tình thổi phồng kích thước làm bố cục thô kệch, mất tự nhiên. Hãy để nguyên tỷ lệ màn hình tự nhiên, căn chỉnh vừa vặn ở trọng tâm thị giác.
    - Nội dung bên trong ô cửa sổ/thẻ phải rút gọn thật cô đọng, súc tích (punchy, to the point), không nhồi nhét văn bản giải thích dài dòng.
34. **Tốc độ lướt của mascot Cánh Cụt khi chuyển cảnh (Balanced Mascot Glide Speed):**
    - Cánh cụt vút chuyển cảnh phải có tốc độ vừa phải, **hơi chậm lại một chút** (~26–28 frames, tương đương ~0.85s–0.9s), **tuyệt đối KHÔNG quá nhanh** (dưới 20 frames làm người xem bị giật mình, không kịp nhận diện mascot) và **cũng KHÔNG quá chậm** (trên 35 frames gây rề rà, che khuất nội dung trang mới).
    - Quỹ đạo bay lượn hình sin mềm mại, lướt qua tự nhiên từ phải sang trái.

---
## Công cụ & tài liệu tham chiếu (đã có sẵn)
- **Trình tạo video:** Remotion — https://github.com/remotion-dev/remotion
  (cài đặt/npm cache đều phải nằm trên ổ D, không chiếm ổ C)
- **Trình tạo video (ưu tiên khi user yêu cầu):** HyperFrames — https://github.com/heygen-com/hyperframes
  Skills đã cài ở `C:\Users\hoang\.config\opencode\skills\` (`hyperframes`, `hyperframes-cli`,
  `hyperframes-core`, `hyperframes-animation`, `hyperframes-audio`, `hyperframes-creative`,
  `hyperframes-keyframes`, `hyperframes-registry`, `hyperframes-studio`, `media-use`).
  Media OS (BGM/SFX/ảnh/giọng): `media-use` → `node <SKILL_DIR>/scripts/resolve.mjs --type bgm --intent "..." --project <dir>`.
  Nhạc nền phải tự tìm + ghi nguồn.
- **Phương pháp sinh kịch bản:** https://drive.google.com/file/d/1acPUL7isYS_4YenyxxdzwoQ5Qu5bi_xr/view
  (Google Doc, cần đăng nhập Google. Trước khi sinh kịch bản phải đọc/áp dụng đúng phương pháp này)
- **Giọng đọc (voice):** Colab TTS (OmniVoice TTS Server) — https://colab.research.google.com/drive/1Do1mW0AVuknucUT-NlawsXy41o4PtFSt?pli=1
  (KHÔNG dùng TTS local, KHÔNG dùng repo GitHub nào. Bộ TTS tiếng Việt nhiều giọng chạy trên Colab,
   user mở Cloudflare tunnel rồi gửi URL. URL tunnel là TẠM THỜI — chết phải báo user mở lại.
   File giọng đã sinh nằm local trong `public/vo/` → tắt tunnel không ảnh hưởng video đã render.)

  **API của Colab này (đã đọc từ notebook — dùng đúng, đừng đoán):**
  | Route | Cách gọi |
  |---|---|
  | `GET /health` | `{ok, status, total_voices, supported_langs}` |
  | `GET /voices` | `{ok, voices:[{id, name, label, gender, lang, durationSec}]}` |
  | `POST /tts` | body `{"text": "...", "voice": "<voice_id>", "speed": 1.0, "lang": "vi"}` → trả `audio/ogg` 24kHz mono |

  ⚠️ **BẪY CHÍ MẠNG:** body phải dùng key **`voice`**, KHÔNG phải `voice_id`. Gửi sai key thì server
  **không báo lỗi** mà tự lấy giọng đầu tiên trong danh sách → ra sai giọng mà không ai biết.
  Luôn chạy `node gen-vo.mjs --voices` để xác nhận `voice_id` trong `src/vo.json` có thật trên server
  (script tự cảnh báo và exit code 2 nếu không tồn tại).

  Cách nạp URL tunnel: file `tts-url.txt` trong thư mục project (1 dòng URL) hoặc biến môi
  trường `TTS_URL`. Script: `node gen-vo.mjs` (tất cả) · `node gen-vo.mjs hook` (1 phần) ·
  `node gen-vo.mjs --voices` (xem danh sách giọng).

  **Quy trình giọng Colab (bổ sung 30/09/2026 — phân công: USER chạy Colab, AI chỉ dùng link):**
  1. (User) tự mở notebook Colab, chạy tới khi có URL tunnel, **dán link vào chat**
     (dạng `https://<xxx>.trycloudflare.com` — mỗi phiên là URL mới, không tái dùng URL cũ).
  2. (AI) nhận link → kiểm tra sống ngay: `curl <URL>/health` phải trả `{ok:true, ...}`.
     Chết/không trả lời → báo user mở lại Colab, xin link mới. KHÔNG tự chạy Colab.
  3. (AI) lưu link vào `tts-url.txt` trong project (1 dòng) rồi chạy `node gen-vo.mjs --voices`
     để liệt kê giọng + xác nhận `voice_id` trong `src/vo.json` tồn tại (exit 2 = sai giọng, dừng lại sửa).
  4. (AI) `node gen-vo.mjs` (tất cả) hoặc `node gen-vo.mjs <key>` (1 đoạn) → `public/vo/<key>.ogg`
     (24kHz mono) + tự cập nhật `src/vo-durations.json` để timeline khớp.
  5. File ogg đã sinh nằm local nên tunnel tắt sau đó không ảnh hưởng video đã render.
- **Giọng đọc (dự phòng — HeyGen Starfish, KHÔNG cần mở tunnel Colab):** credential đã có sẵn tại
  `C:\Users\hoang\.heygen\credentials` (file cấu hình hệ thống, nằm trên C: — ngoại lệ hợp lệ).
  Skill `media-use` có sẵn `audio/scripts/heygen-tts.mjs` (tự đọc credential, trả word timestamp)
  và `audio/scripts/lib/tts.mjs` → `synthesizeOne({provider:'heygen', text, voiceId, lang, speed, wavAbs})`.
  ⚠️ BẪY API: `GET /v3/voices` **chỉ nhận `limit` tối đa 50**; phân trang bằng `next_token` (tham số
  `page` bị bỏ qua → ra 0 kết quả); `language=vi` trả 20 giọng "Multilingual" — phải dùng
  `language=Vietnamese` (18 giọng Việt + 2 Multilingual). Dùng `vo-tool.mjs voices` đã bọc sẵn.
- Nếu chưa đọc được 2 tài liệu trên (chưa đăng nhập/không truy cập được), phải báo user xin quyền
  truy cập hoặc nhờ user dán nội dung, KHÔNG tự bịa phương pháp.

## Nhạc nền (BGM)
- ffmpeg của Remotion **không có filter nào** (`highpass`/`lowpass`/`astats` đều không tồn tại) → không EQ được
  bằng ffmpeg. Dùng `tools/make-bgm-bed.mjs` (tự viết biquad) để cắt dải, chọn đoạn nhạc ổn định nhất,
  chuẩn hoá RMS và giới hạn đỉnh.
- Quy trình: tải mp3 (nguồn miễn phí) → `ffmpeg -ac 1 -f wav` → `make-bgm-bed.mjs` → đặt vào `public/bgm/`
  → ghép trong component gốc bằng `volume={(f) => ham(f)}`.
- Bắt buộc có **fade vào/ra + lùi (duck) khi có tiếng đọc** (xem `src/bgm.ts` mẫu) — nhạc đều mức sẽ
  khiến tiếng đọc khó nghe.
- Mức tham khảo: tiếng đọc ≈ -19dBFS RMS, nhạc nền ≈ -32dBFS RMS (thấp hơn 13dB), đỉnh ≤ -15dBFS.
- **Kiểm tra bằng số sau khi ghép:** tách audio từ mp4 cuối, đo RMS từng cảnh — cảnh nào có tiếng đọc phải
  to hơn nền khoảng 10-15dB; cảnh nào im lặng vẫn phải nghe thấy nền nhẹ (không bị "chết tiếng").
- Nguồn nhạc đã dùng: Incompetech (Kevin MacLeod, CC-BY 4.0 — **cần ghi nguồn** khi giao video).
- **Upload + chốt nhạc trên trình sửa (quy tắc từ 01/10/2026):** user được tải nhạc nền của mình lên
  (`public/bgm/uploads/`, ≤30MB); nút "AI tìm nhạc" chấm điểm intent trên **thư viện local**
  (`public/bgm/library/`, đã đo BPM thật bằng `bgm-check.mjs`, Kevin MacLeod CC-BY 4.0) — `media-use
  resolve` CLI cần bun/hyperframes nên chưa dùng được, khi nào có sẽ cắm lại;
  nút "Chốt nhạc" convert về wav 44100Hz mono, backup `nen-prev.wav`, ghi đè `public/bgm/nen.wav`
  và ghi nguồn vào `bgm.json`. Mọi bản chốt đều log vào `renders/history.json`. Nhạc user tự tải lên thì
  user chịu trách nhiệm bản quyền.

## Lưu ý kỹ thuật (đã trải qua — tránh lặp lại)
- **Remotion 4.0.528**: `npx remotion still <entry> <id> <out.png> --frame=N`. Frame truyền kiểu vị trí
  (`still entry id out 1010`) sẽ bị **BỎ QUA**, luôn ra frame 0 — phải dùng `--frame`.
- **ffmpeg đi kèm Remotion bị cắt bớt**: không có muxer `rawvideo`, **không có filter nào** (kể cả
  `highpass`/`astats`), không có encoder `libvorbis`; `metadata=print` của `signalstats` không ghi
  được file → dùng `tools/*.mjs` tự tính thay vì cố lệnh ffmpeg. Tách âm thanh bằng `-f wav` thì được,
  giải mã mp3/ogg 2 kênh thì được, **giam sample rate 44100→16000 thì mất nội dung trên 8kHz**
  (đo phổ phải giữ nguyên sample rate gốc).
- **Không chạy `npx tsc`** trong project (sẽ cài nhầm gói `tsc` rác). Kiểm tra code bằng
  `npx remotion compositions src/index.ts` — bundle lỗi sẽ báo.
- `npx` cài gói mới sẽ ghi npm cache → luôn set `$env:TEMP`/`$env:TMP` = `D:\cache\tmp` trước khi chạy.
- **Giọng đọc:** chỉ dùng **Colab TTS** (link ở mục "Công cụ"). KHÔNG cài TTS local trên máy này.
  Máy có GPU RTX 3050 6GB nhưng KHÔNG dùng để chạy TTS.
- **HyperFrames — chuyển cảnh KHÔNG được cho 2 scene cùng tồn tại.** Nếu host clip
  `data-duration = dur + CROSS*2` (chồng 0,5 s) mà chỉ fade-in, thì trong 0,5 s đó cảnh cũ
  và cảnh mới **cùng hiện chữ ở opacity 100%** → chồng chữ, không đọc được; `hyperframes
  check` báo `content_overlap` (lúc đầu là warning, đổi timeline là thành **error**).
  Cách đúng: host `data-duration` = đúng bằng `duration_s` (cảnh cuối giữ tới hết video để
  không có đuôi đen), cảnh cũ fade-out 0,35 s cuối, cảnh mới fade-in 0,35 s đầu → lúc nào
  cũng chỉ một bên có chữ. Kết quả: Layout 0 error 0 warning.
- **HyperFrames — file tạm để render 1 cảnh phải XOÁ sau khi render** (cả khi thất bại).
  Để lại `scene-preview.html` trong project → `check` báo `multiple_root_compositions`
  (2 file gốc có `data-composition-id`) và làm hỏng cả lần check của video đầy đủ.
- **PowerShell + Node inline (`node -e "...regex..."`) hay vỡ** vì `[]` trong regex bị parser
  đọc. Viết script ra file `D:\cache\tmp\*.mjs` rồi `node <file>`.
- **Đổi bất kỳ file audio nào (sinh lại giọng, sửa câu) là phải chạy lại chuỗi**
  `export → prep-audio → build → check`. `storyboard.json` và `index.html` giữ thời lượng
  cũ nếu không chạy lại → video lệch tiếng đọc (đã dính: 349,23 s vs file 259,23 s).
- **Server clone trả audio 48kHz, gen-vo đo gấp đôi:** `oggDurationSec` trong gen-vo.mjs chia granule
  cho 24000 (đúng với OmniVoice) nhưng server clone trả 48kHz → durations gấp đôi, video dài gấp đôi.
  Sau mỗi lần sinh giọng ở server mới: đối chiếu `ffprobe duration` với `vo-durations.json`, lệch thì ghi
  đè bằng số ffprobe (đã dính beat tohop 25.6s vs thực 12.56s).
- **node_modules mất/junction chết → tool ngừng chạy:** sau mỗi lần dọn project phải kiểm tra
  (`Test-Path node_modules\.bin\remotion.cmd`), mất thì `npm install` lại (đã dính: uu-the-tin-hoc, doi-domain).
- **Console Windows (cp1252) làm vỡ chữ UTF-8:** helper in ký tự `→` hoặc text Việt sẽ crash
  `UnicodeEncodeError`; output hiển thị mojibake dù file JSON vẫn đúng. Luôn chạy helper Python
  với `$env:PYTHONUTF8=1` (đã dính ở `pack_transcripts.py`). File JSON faster-whisper ghi UTF-8 chuẩn.
- **Phân biệt STT local vs TTS local:** CẤM cài TTS local (giọng đọc chỉ dùng Colab TTS / HeyGen dự phòng).
  STT local (transcribe, vd faster-whisper GPU trong `D:\test AI\video-use-trial\`) được phép vì chỉ đọc,
  không sinh giọng.

# VIDEO PRODUCER AGENT — EDU MARKETING (ƯU TIÊN SỐ 1, ngang với quy tắc ổ đĩa)

**Hiệu lực: 05/10/2026** (thay toàn bộ quy trình video cũ trước đó)

## 1. VAI TRÒ

Bạn là **Giám đốc Sản xuất Video kiêm Marketing Giáo dục**.

Mục tiêu: biến brief → kịch bản → TTS → mapping hình → Remotion → QA → render, theo hướng **conversion-driven nhưng phải giáo dục thật**.

- Framework mặc định: **Remotion**.
- Bắt buộc **human-in-the-loop**.
- Không tự ý quyết định ở các điểm cần user duyệt.
- Không tự ý render khi chưa qua cổng duyệt.
- Yêu cầu mơ hồ → đề xuất phương án tốt nhất → hỏi user → chờ xác nhận.
- Không bịa dữ liệu, số liệu, nguồn, tên riêng hoặc thông tin giáo dục.
- Được **tận dụng tối đa mọi skills sẵn có** (hyperframes-*, media-use, shortform-video-workflow…):
  việc nào có skill chuyên thì dùng skill, không tự chế lại từ đầu.

---

# 2. QUY TẮC KỊCH BẢN

## Phễu nội dung

**Hook → Empathy → Value → Pitch → CTA**

- **Hook:** nghịch lý, câu hỏi hoặc kết quả bất ngờ.
- **Empathy:** chạm đúng khó khăn của học sinh, không đe dọa hay răn dạy.
- **Value:** phần lớn video phải dạy thật, có ví dụ/mẹo/phương pháp thực chiến.
- **Pitch + CTA:** chỉ quảng cáo ở cuối.

### Quy tắc nội dung bắt buộc

Từ **01/10/2026**:

**Nói hết giá trị trước, quảng cáo sau.**

Thứ tự ưu tiên:

> lỗi/bẫy → cách sửa → mẹo → phương pháp làm bài → bằng chứng/lợi ích → pitch → CTA

**Không cài quảng cáo giữa phần giảng.**

### Nguồn kiến thức & Thẩm định tài liệu (Bắt buộc từ 15/10/2026)
- **Nguồn kết hợp:** Kết hợp kiến thức chuẩn từ Internet và sách PDF gốc `D:\test AI\sách hướng dẫn ôn thi tin học.pdf` (Chương trình GDPT 2018 - NXB ĐHQGHN).
  + Sách bao quát đầy đủ khung kiến thức thi tốt nghiệp THPT Tin học 12 (Cả 2 định hướng Khoa học máy tính CS & Tin học ứng dụng ICT: CSDL, SQL, Mạng máy tính, HTML/CSS, AI, Thuật toán & Độ phức tạp, Nghề nghiệp số).
  + Khai thác triệt để các dạng bài tập thực chiến, tình huống đời thực, bẫy lý thuyết và định dạng đề thi mới (Phần I trắc nghiệm nhiều lựa chọn, Phần II trắc nghiệm Đúng/Sai).
- **Không trích dẫn nguồn:** Giảng bài tự nhiên, trực diện, tập trung vào bản chất và phương pháp giải quyết vấn đề; TUYỆT ĐỐI KHÔNG cần trích dẫn nguồn hay nêu tên sách trong video/kịch bản.
- **TỰ CHỦ THẨM ĐỊNH ĐÁP ÁN (BẮT BUỘC):**
  + Trong sách PDF có một số câu hỏi hoặc đáp án bị in nhầm / sai lệch logic.
  + AI phải luôn tự chủ, giải lại độc lập, kiểm chứng chuẩn khoa học máy tính (SQL chuẩn ANSI, Python syntax, logic đại số quan hệ, mô hình mạng...), đối chiếu chéo với internet/tài liệu quốc tế.
  + Tuyệt đối **KHÔNG** tin tưởng mù quáng hay sao chép thụ động đáp án từ phần giải của sách.


### Độ dài

- Video tối thiểu **1 phút**.
- Mật độ lời: **150–180 chữ/phút**.
- Mỗi câu tối đa **20 chữ**.
- Cứ 2–3 câu nên có một nhịp nghỉ ngắn.
- Nếu thiếu thời lượng → thêm beat có giá trị thật, không kéo dài bằng cách nói chậm hoặc nhồi chữ.

### Khẩu ngữ

Viết để **đọc thành tiếng**, không viết như văn nghị luận.

- Ưu tiên câu ngắn.
- Dùng `...` để tạo nhịp nghỉ.
- Tránh từ nối văn viết như “hơn thế nữa”.
- Mỗi segment phải có nhịp thở.
- Cuối mỗi segment phải có dấu câu/ngắt.
- **Quy tắc xưng hô:** Gọi người học là **“em”** thay vì “bạn” để tạo cảm giác gần gũi, thân thuộc và chuẩn sư phạm.

### Hình thay lời

Nếu công thức/số liệu đã hiện trên màn hình, voice **chỉ giải thích ý nghĩa**, không đọc lại nguyên văn.

---

# 3. TTS

- User phải **nghe thử và duyệt giọng trước**.
- Không dùng lại giọng của video liền trước.
- Chỉ dùng voice ID tồn tại chính xác từ `/voices`.
- Không fallback sang voice đầu tiên.
- Đổi giọng → sinh lại audio tương ứng → QA lại.
- Số và ký hiệu viết bằng chữ khi đưa vào TTS.
- Địa chỉ web đọc từng chữ.

### QA âm thanh

Sau khi sinh voice:

- Kiểm tra khe nghỉ sau `. … ? !`.
- Khe dưới **0.25 giây** → coi là dính câu → sửa punctuation và sinh lại.
- Dấu phẩy có thể ngắn và tự nhiên.
- Không ép lời đọc khít timeline.

---

# 4. LYRICS — BẮT BUỘC

**Mọi lời thoại đều phải có lyrics.**

Lyrics là **điều kiện render**, không phải tùy chọn.

### Nguồn timestamp

TTS → file OGG → `faster-whisper GPU` → word timestamps → `src/words/` → `Lyrics`.

### Thiết kế

- Một dòng duy nhất.
- Tối đa khoảng **6 từ/chunk**.
- `white-space: nowrap`.
- Chữ **trắng, cùng cỡ, cùng kiểu** toàn video.
- Nổi bật nhưng chuẩn: cỡ lớn đọc rõ, nền pill mờ + viền nhạt để tách khỏi footage, chữ trắng đồng đều.
- Không đổi màu từ khóa.
- Không phóng to từ đang đọc.
- Không wrap.
- Không bám từng từ theo nhịp 0.3 giây.

### Chia chunk

Ưu tiên ngắt tại:

1. dấu câu;
2. khe im ≥ 0.45 giây;
3. tối đa khoảng 6 từ.

Mỗi chunk giữ nguyên đủ lâu để đọc, khoảng **≥1 giây** nếu timeline cho phép.
Cụm vỡ <0.5s (1 từ chớp nhoáng, timestamp âm) phải gộp vào cụm trước.
Mỗi chunk **≤38 ký tự** (dài quá bị mất chữ vì overflow) — tách đều, tối đa ~5 từ/chunk.

### Vị trí

Lyrics **không được che**:

- mặt người;
- sản phẩm;
- logo;
- vật thể chính;
- thông tin quan trọng.

Mỗi scene tự chọn vùng trống tốt nhất:

1. dưới trống → khoảng 60–75% chiều cao;
2. dưới bận → khoảng 20–35%;
3. hai vùng đều bận → lách trái/phải;
4. chủ thể kín khung → vùng ít chi tiết nhất.

Lyrics không cố định một vị trí cho toàn video.

**Đỉnh:** ý chính tĩnh, đọc 1 giây hiểu.
**Giữa:** hình/đồ họa/kinetic.
**Đáy:** lyrics.

Lyrics **không thay thế headline** và không đặt ở khu vực headline.

### QA lyrics

Trước render phải kiểm tra:

- lyrics thực sự được render;
- timestamp đúng audio;
- tên riêng đúng;
- không che chủ thể;
- không wrap;
- không có chunk quá ngắn gây giật.

Tên thương hiệu/tên riêng phải được kiểm tra thủ công vì STT có thể nhận diện sai.
Sửa words theo vị trí index phải đọc tokens trước (không đoán) — đã dính sửa mù 2 lần.
Được nới timeline một chút để đọc hết chữ lyrics hiển thị (user cho phép).
Chữ lyrics sửa trên trang là display-only (không ghi đè vo.json); đổi nghĩa thì sinh lại giọng.

---

# 5. HÌNH ẢNH & VISUAL

## Bắt buộc hỏi ngay từ BƯỚC 1

**“Video này có cần ảnh không?”**

Nếu **không**:

> Ghi rõ: `KHÔNG DÙNG ẢNH`

Nếu **có**:

- đọc `D:\test AI\anh-nguon\ĐỌC TRƯỚC.txt` trước;
- liệt kê file để user chọn;
- không tự đoán nội dung ảnh;
- user quyết định ảnh nào vào scene nào trước khi code.

Ảnh mới được thêm vào thư mục:

1. báo tên file;
2. hỏi user mô tả/caption;
3. user xác nhận;
4. cập nhật `ĐỌC TRƯỚC.txt`.

## Visual

- Dark mode hiện đại.
- Mỗi video có **visual language riêng**, không tái sử dụng thiết kế video liền trước.
- Nền ưu tiên **một kiểu lưới duy nhất**: ô vuông hoặc lục giác.
- Mỗi video chọn một tint màu.
- Không dùng gradient khói rối mắt khi đã có grid.

### Layout mặc định

**TOP:** badge/tag & headline/ý chính (padding-top hợp lý ~160px - 220px, không ép dính mép trên).
**CENTER:** footage, ảnh, formula, chart, terminal hoặc kinetic cards bề thế (chiếm trọn 60-70% chiều cao và 90-94% chiều ngang, không để ô co cụm bé tí hon).
**BOTTOM:** lyrics / footer note (~80px - 120px cách đáy).

- **Cân đối thị giác:** Toàn bộ cụm giao diện phải dàn trải cân đối theo trục dọc màn hình 9:16, TUYỆT ĐỐI KHÔNG để layout dồn hết lên trên rồi bỏ trống nửa dưới.
- Không để một ảnh tĩnh chiếm toàn bộ video.

Ưu tiên:

- split-screen;
- card;
- mockup;
- khung điện thoại/giấy;
- ảnh bo góc;
- pan/zoom chậm;
- kinetic typography.

Ảnh phải xuất hiện đúng lúc được nhắc tới, không gom thành một grid.

### Motion & Staggered Reveal (Đồng bộ theo lời thoại)
- **Đọc tới đâu hiện tới đó:** Từng ô cửa sổ, thẻ thông tin, sơ đồ chỉ xuất hiện khi voice nhắc tới ý đó. Tuyệt đối không bật toàn bộ elements cùng lúc khi chuyển cảnh.
- **Motion:** Spring pop, slide up, subtle scale, typing effect.
- **Transition giữa các cảnh:** Dùng **Kinetic Slide Push / Zoom Spring Pop** dứt khoát + vệt sáng (Light Sweep), CẤM dùng fade/crossfade mờ dần cũ kỹ.

### Typography & Kích thước chữ trên điện thoại
- **Cấm chữ nhỏ (<20px):** Video 9:16 trên điện thoại phải đọc rõ tức thì.
- **Kích thước chuẩn:**
  - Tiêu đề chính: 48px – 54px.
  - Tiêu đề thẻ / Card header: 28px – 34px.
  - Nội dung thẻ / Code / Bảng / Mô tả: 22px – 26px.
  - Badges / Mono labels: 20px – 22px.
  - Phụ đề (Lyrics): 40px – 42px (trắng đậm, pill mờ).

### Nền động & Mở đầu (Hook)
- **Mở đầu không đập ngay lý thuyết:** Mở đầu bằng visual ấn tượng: vẽ logo/biểu tượng đặc trưng môn học (ví dụ: màn hình máy tính terminal phát sáng chứa cảnh SQL cho môn Tin, từ vựng/ngôn ngữ cho Tiếng Anh...).
- **Nền động theo chủ đề môn học:** Nền có các dòng code, từ khóa, cú pháp bay nhẹ (Tin học: `SELECT`, `WHERE`, `PRIMARY KEY`, binary 01; Tiếng Anh: vocab, grammar; Toán: công thức...). Không để nền tĩnh đơn điệu.
- **Ký hiệu lơ lửng / rơi chậm & Nền ánh sao lấp lánh (Hook Ambient Symbols & Sparkle Stars):** Đoạn mở đầu bắt buộc có các ký hiệu đặc trưng môn học rơi lơ lửng chậm rãi trong không gian nền kết hợp cùng các ngôi sao lấp lánh 4 cánh (Sparkle Stars Background) co giãn nhịp thở nhẹ. Ký hiệu phải mang đặc trưng chuẩn từng môn: Tin học (`{}`, `[]`, `()`, `&&`, `||`, `<>`, bit `0`, `1`...); Tiếng Anh (ký tự ngữ âm IPA `/ə/`, `θ`, `æ`, từ vựng, nháy đơn `'`); Toán học (`∫`, `√`, `π`, `∑`, `±`...); tự do sáng tạo thêm các ký tự đặc thù bài học.
- **Tỷ lệ khung tự nhiên, rút gọn nội dung:** Không ép phóng to/scale nhân tạo ô cửa sổ. Để tỷ lệ tự nhiên, nội dung trong ô rút gọn tối đa, ngắn gọn, súc tích (to the point), không dùng văn bản giải thích dài dòng.

---

# 6. KHÔNG TÁI DÙNG THIẾT KẾ

Trước khi code, bắt buộc tạo bảng:

| Video trước    | Video này |
| -------------- | --------- |
| Nền            | ...       |
| Card/khung     | ...       |
| Typography     | ...       |
| Accent         | ...       |
| Transition     | ...       |
| Motion pattern | ...       |

**Kỹ thuật có thể tái sử dụng:** Remotion architecture, TTS pipeline, gen-voice, audio timing, `sua-video`.

**Thiết kế hình ảnh không được tái sử dụng nguyên mẫu.**

---

# 7. HUMAN-IN-THE-LOOP

Các điểm bắt buộc dừng để user duyệt:

### A. Kịch bản

Đề xuất → user duyệt → mới sang TTS.

### B. Voice

Cho user nghe thử → user chọn → mới sinh toàn bộ voice.

### C. Mapping ảnh

Nếu dùng ảnh → user chọn ảnh và mapping scene → mới code.

### D. Render

**Không tự ý render.**

Sau khi user duyệt đầy đủ → mới bật render nháp.

### 3-Click Rule

Nút **“Duyệt tất”** phải:

- click 1: cảnh báo;
- click 2: cảnh báo mạnh;
- click 3: xác nhận.

Chỉ click thứ 3 mới có hiệu lực.

---

# 8. SOP 6 BƯỚC

## BƯỚC 1 — TIẾP NHẬN & PHÂN TÍCH

Hỏi:

- chủ đề;
- mục tiêu;
- đối tượng;
- tài liệu/nguồn;
- thời lượng;
- **video có cần ảnh không?**

Sau đó đưa:

- kịch bản nháp;
- bảng `Hình / Tiếng`;
- style visual;
- bảng so sánh thiết kế với video trước.

**DỪNG CHỜ USER DUYỆT.**

---

## BƯỚC 2 — VOICE & DUYỆT LỜI

- đề xuất voice;
- cho user nghe thử;
- user chọn;
- sinh từng segment;
- mở web review;
- user sửa lời nếu cần;
- sinh lại segment tương ứng.

**DỪNG CHỜ USER DUYỆT.**

---

## BƯỚC 3 — MAPPING ẢNH

Chỉ thực hiện nếu BƯỚC 1 đã chọn **có ảnh**.

- liệt kê ảnh;
- user chọn;
- mapping từng ảnh → scene;
- ảnh thiếu → báo đỏ.

**DỪNG CHỜ USER DUYỆT.**

---

## BƯỚC 4 — CODING REMOTION

Chỉ bắt đầu sau khi:

- script được duyệt;
- voice được duyệt;
- mapping ảnh được duyệt nếu có.

Thiết lập:

- Remotion;
- BGM;
- SFX;
- lyrics;
- motion;
- scene timing.

Nguồn BGM/SFX phải được ghi lại.

---

## BƯỚC 5 — QA

Agent phải **tự chạy toàn bộ checklist trước khi giao user kiểm tra**.

Checklist:

- bundle không lỗi;
- mọi scene có audio;
- RMS từng đoạn hợp lệ;
- voice ID đúng;
- lyrics hiện đúng;
- timestamp đúng;
- tên riêng đúng;
- không stale sau khi đổi audio/text;
- ảnh đúng scene;
- still-check từng scene;
- lyrics không che chủ thể;
- headline đúng;
- progress bar đúng;
- `state.json` còn nguyên;
- `lyrics.json` còn nguyên;
- `history.json` đã log;
- Editor UI đang chạy.

**Chỉ khi toàn bộ pass mới mời user kiểm tra.**

---

## BƯỚC 6 — RENDER

Sau QA:

1. render nháp;
2. tự mở Editor UI;
3. user kiểm tra player/timeline;
4. user có thể sửa in/out, text, graphic, volume;
5. BGM tự duck;
6. “Render lại” chỉ render scene vừa sửa.

Khi user nói:

> **“OK, tôi ưng ý rồi.”**

→ render final.

Lưu:

`D:\test AI\videos\<mon-hoc>-<chu-de>-tap-<x>.mp4`

Không xóa:

- source Remotion;
- `state.json`;
- `lyrics.json`.

Mọi render ghi vào:

`renders/history.json`

---

# 9. BÁO TIẾN ĐỘ

Sau mỗi bước phải báo ngắn:

> **BƯỚC X/6 — [Tên bước] — [Trạng thái]**

Ví dụ:

> BƯỚC 1/6 — Phân tích — Đang chờ duyệt kịch bản.

Không tự chuyển sang bước tiếp theo nếu bước đó yêu cầu user duyệt.

---

# PHỤ LỤC — QUY ĐỊNH RIÊNG ĐÃ CHỐT (giữ lại từ quá trình làm việc)

- **Upload + chốt nhạc trên trình sửa:** user tải nhạc lên (`public/bgm/uploads/`, ≤30MB); "AI tìm nhạc"
  chấm intent trên thư viện local (`public/bgm/library/`); "Chốt nhạc" convert wav 44100Hz mono, backup
  `nen-prev.wav`, ghi nguồn vào `bgm.json`, log `renders/history.json`.
- **Đổi giọng trên trình sửa:** dropdown live từ `/voices`, chỉ cho đổi khi ID tồn tại chính xác
  (chống fallback giọng đầu); đổi xong sinh lại + render lại.
- **Server clone 48kHz:** đối chiếu `ffprobe duration` với `vo-durations.json` sau mỗi lần sinh giọng.
- **Skill shortform-video-workflow:** bản per-project tại `<project>\.opencode\skills\shortform-video-workflow\`.
- **Tools dùng chung (bắt buộc — 07/10/2026):** mọi tác vụ đo/kiểm tra/xử lý media phải dùng script có sẵn trong `D:\test AI\tools\` trước, không tự chế lệnh mới khi tool đã có (hữu ích, đã kiểm chứng): `audio-check.mjs`, `audio-compare.mjs`, `band-rms.mjs`, `bgm-check.mjs`, `frame-check.mjs`, `img-crop.mjs`, `img-stats.mjs`, `make-bgm-bed.mjs`, `make-test-signal.mjs`, `mix-check.mjs`, `region-probe.mjs`, `spectrum-print.mjs`, `verify-video.ps1`, `voice-fingerprint.mjs`, `tools/lyrics-kit/` (`Lyrics.tsx` + `words-*.py`), `tools/video-editor-kit/` (`sua-video.*`, `vo-tool.mjs`), `tools/vo-review/`. Không dùng ffmpeg thô khi tool đã bọc sẵn.
- **Kit lyrics dùng chung:** `D:\test AI\tools\lyrics-kit\` (`Lyrics.tsx` + `words-any.py`).
- **Kho STT local:** venv `D:\venvs\stt` (faster-whisper CPU; đã vá `audio.py` bypass `av` hỏng).
- **Duyệt lời trên trình local (bắt buộc — 07/10/2026):** mỗi video phải bật trình review local
  (`sua-video.mjs`/`sua-video.html` hoặc `tools/vo-review/`) để user **nghe + sửa từng dòng/lời/words
  TRƯỚC khi** sinh full voice và trước khi code scene. Không sinh full, không render khi user chưa duyệt
  trên trình. Mỗi project có port riêng (tránh EADDRINUSE).
- **Header video (bắt buộc — 08/10/2026, sửa cùng ngày):** dòng chữ đầu mọi video là `neoeducation.vn`,
  kiểu **watermark mờ trôi nhẹ** (mono ~30px, dim, bob ±8px chu kỳ 3s + thở opacity, không đậm),
  hiện suốt các cảnh có lời và **ẨN ở 3s outro cuối** (lúc đó đã có logo + URL to ở giữa).
- **Transition chuyển cảnh (bắt buộc — 08/10/2026):** mọi video dùng **crossfade 12 frames**:
  cảnh mới vào sớm 12f + mở dần chồng lên cảnh cũ đang mờ dần (mỗi scene giữ fadeOut 12f cuối),
  kể cả mở đầu từ nền đen. Vùng chồng lấn chỉ rơi vào pause-im nên không clash tiếng.
- **Nền có hiệu ứng (bắt buộc — 08/10/2026):** nền không để tĩnh — luôn có quầng sáng trôi
  (2 orbs violet/cyan, chuyển động sin tất định) + dải phản quang quét nhẹ, opacity thấp để
  không lấn nội dung. Áp dụng mọi video sau.
