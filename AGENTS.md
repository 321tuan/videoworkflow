# QUY CHUẨN SẢN XUẤT VIDEO HỌC LIỆU — NEO EDUCATION
> **Tài liệu Pháp quy & Cẩm nang Kỹ thuật Tối cao (Single Source of Truth)**  
> **Cập nhật & Tinh gọn toàn diện:** 20/10/2026. Mọi dự án video (Remotion, HyperFrames) bắt buộc bám sát 100%.

---

## PHẦN I: NGUYÊN TẮC HỆ THỐNG & QUY TẮC Ổ ĐĨA (ƯU TIÊN TUYỆT ĐỐI)

### 1. Quy tắc Ổ C: (Bất khả xâm phạm — 0 byte trên ổ C)
- **TUYỆT ĐỐI KHÔNG** cài đặt, tải về, cache, download, tạo file tạm hay lưu trữ dữ liệu trên ổ `C:`. Mọi thứ phải nằm trên ổ `D:`.
- **Cấu hình đường dẫn bắt buộc:**
  - npm/pnpm/yarn cache → `D:\cache\npm` (hoặc `D:\npm-cache`)
  - pip cache → `D:\cache\pip`
  - Biến môi trường `%TEMP%` / `%TMP%` → `D:\cache\tmp`
  - Toàn bộ source code, media, tools, venvs, packages → `D:\`
- **Mọi lệnh terminal (npm, npx, python):** Luôn đảm bảo trỏ cache và temp về `D:\cache` trước khi chạy.
- **Ngoại lệ tối thiểu duy nhất:** Các file cấu hình hệ thống không thể đổi đường dẫn (ví dụ: `.npmrc`, registry, HeyGen credentials tại `C:\Users\hoang\.heygen\credentials` — chỉ vài chục byte).

### 2. Vai trò & Nguyên tắc làm việc của Agent
- **Vai trò:** Bạn là **Giám đốc Sản xuất Video kiêm Marketing Giáo dục**.
- **Định hướng cốt lõi:** *Conversion-driven nhưng phải Giáo dục thật* (Nói hết giá trị trước, quảng cáo sau).
- **Framework mặc định:** **Remotion**.
- **Bắt buộc Human-in-the-loop:** Tuyệt đối không tự ý quyết định ở các điểm cần user duyệt, không tự ý render video final khi chưa qua cổng QA và user chưa nói *"OK, tôi ưng ý rồi"*.
- **Tính chính xác:** Không bịa đặt thông tin, công thức, số liệu giáo dục hay nguồn tài liệu.

---

## PHẦN II: TIÊU CHUẨN THỊ GIÁC & THIẾT KẾ ĐỒ HỌA (UI / VISUAL & MOTION)

### 1. Vùng an toàn Thực chiến trên TikTok iPhone (Mobile 9:16 Golden Safe Zone)
> **BÀI HỌC XƯƠNG MÁU TỪ ẢNH CHỤP THỰC TẾ IPHONE (`IMG_0467.webp`):**  
> Màn hình chuẩn `1080x1920` (dọc 9:16) khi hiển thị trên TikTok iPhone bị hệ thống UI nền tảng "xâm lấn" cực kỳ khốc liệt ở cả 3 phía: **Đỉnh (Top), Đáy (Bottom), và Lề phải (Right)**.  
> Mọi video từ nay về sau BẮT BUỘC thiết kế nằm trọn vẹn trong **HỘP AN TOÀN VÀNG (ACTIVE SAFE BOX)**:
> - **Chiều rộng an toàn:** `X = 45px -> 875px` (Rộng tối đa `830px`).
> - **Chiều cao an toàn:** `Y = 350px -> 1440px` (Cao tối đa `1090px`).

#### A. VÙNG CẤM ĐỈNH (TOP DEAD ZONE: Y = 0 -> 340px)
- **Thành phần đè:** Tai thỏ / Dynamic Island, status bar pin-sóng-giờ, nút `LIVE`, cụm tab `Bạn bè | Đã follow | Đề xuất`, và nút Tìm kiếm Kính lúp góc phải.
- **Lỗi thực tế đã dính:** Badge bị tab TikTok đè, Mascot chim Neo bị nút Kính lúp đâm xuyên đầu!
- **QUY TẮC BẮT BUỘC:**
  - Mọi nội dung hiển thị (Badge, Tiêu đề bài học, Khung cửa sổ) chỉ được bắt đầu từ **`Y >= 350px`** (`paddingTop: 350px` trên khung root).
  - **Mascot Chim Neo:** CẤM TUYỆT ĐỐI đặt ở góc `top < 340px` hoặc `right < 180px`. Phải đặt ở `top: 350px` và lùi sâu vào trong (`right: 190px - 210px`) hoặc đặt cạnh tiêu đề bên trái.

#### B. VÙNG CẤM LỀ PHẢI (RIGHT DEAD ZONE: X = 880px -> 1080px — DẢI RỘNG 200px)
- **Thành phần đè:** Cột 6 nút tương tác TikTok chiếm trọn lề phải từ trên xuống dưới:
  1. Avatar kênh (đường kính ~120px) + dấu cộng đỏ
  2. Nút Thả tim (Trái tim đỏ + số like)
  3. Nút Bình luận (Bong bóng chat + chữ "Bóc tem" / số comment)
  4. Nút Bookmark / Yêu thích (Ruy băng vàng + số lưu)
  5. Nút Chia sẻ (Mũi tên trắng + số share)
  6. Đĩa nhạc quay (Vinyl disc xoay tròn)
- **Lỗi thực tế đã dính:** Khung VS Code `maxWidth: 980px` bị Avatar đè mất đuôi code `20/10</h1>`, Tim đè thẻ `<p>`, Comment đè tag footer, Mũi tên Share đè mất chữ cuối của Lyrics!
- **QUY TẮC BẮT BUỘC:**
  - **CẤM BẤT KỲ CHỮ, CODE HAY ICON NÀO VƯỢT QUÁ `X = 875px`** (cách mép phải tối thiểu `205px`).
  - Mọi Card / Cửa sổ / Bảng code: `maxWidth <= 830px`, căn lề trái `marginLeft: 45px - 50px` (hoặc container có `paddingRight: 200px`, `paddingLeft: 45px`).
  - Font size code: `24px – 26px`, ngắt dòng chủ động, không để code dài kéo sát mép phải.

#### C. VÙNG CẤM ĐÁY (BOTTOM DEAD ZONE: Y = 1440px -> 1920px — DẢI CAO 480px)
- **Thành phần đè:** Thanh Scrubber tua video, thanh điều hướng TikTok đáy (`Trang chủ... Hồ sơ`), Caption bài đăng (Tên kênh in đậm `@NEO Education...` + 2-4 dòng mô tả + hashtag/icon).
- **Lỗi thực tế đã dính:** Watermark `neoeducation.vn` đặt ở `bottom: 86px` bị dìm nát dưới Caption, biến thành vệt mờ rác thị giác! Progress bar ở `bottom: 60px` biến mất hoàn toàn!
- **QUY TẮC BẮT BUỘC:**
  - **TUYỆT ĐỐI CẤM ĐẶT NỘI DUNG Ở `Y > 1440px` (tức `bottom < 480px` tính từ đáy 1920).**
  - **Vị trí Phụ đề (Lyrics) chuẩn:** Đặt tại **`bottom: 460px – 480px`** (tương đương `Y ≈ 1440px - 1460px`), pill phụ đề phải có `paddingRight: 180px` hoặc căn trong `maxWidth: 800px` để không bị nút Share đâm vào.
  - **Vị trí Watermark `neoeducation.vn`:** Đặt ngay trên Phụ đề Lyrics ở **`bottom: 560px - 570px`** (cách mép trên Lyrics ~25-30px, thoáng đãng, sắc nét 100%).
  - **Vị trí Progress Bar:** **CẤM TUYỆT ĐỐI ĐẶT Ở ĐỈNH (`top: 330px - 360px`)** vì sẽ cắt ngang thân chữ của Badge/Tiêu đề (lỗi chí mạng đã khắc phục). Nếu dùng thanh tiến trình, **CHỈ ĐẶT Ở `bottom: 450px`** (ngay dưới chân Lyrics) làm đường ranh giới thanh mảnh với Caption, HOẶC lược bỏ để giữ không gian sạch sẽ. CẤM để ở sát đáy màn hình.

### 2. Nguyên tắc Hiển thị Nội dung & Staggered Reveal
- **CẤM TUYỆT ĐỐI CHỮ MỜ CĂM, LỜ ĐỜ KHI CHƯA ĐỌC TỚI (`opacity: 0.2 - 0.35`):**
  - **Lỗi đã loại bỏ:** Việc để các thẻ, ô con hoặc dòng kết luận chưa đọc tới ở trạng thái `opacity: 0.35` với nền tối xám xịt làm xuất hiện những vệt đen đục ngầu, mờ căm như màn hình bị lỗi render, cực kỳ mất thẩm mỹ.
  - **QUY TẮC BẮT BUỘC:** Ý nào, thẻ nào, dòng kết luận nào **CHƯA ĐỌC TỚI THÌ PHẢI ẨN HOÀN TOÀN (`opacity: 0; pointerEvents: 'none'`)**.
  - Đọc đến câu/ý nào thì ô/thẻ đó mới xuất hiện dứt khoát bằng hiệu ứng `spring / pop-in` hoặc `fade-in + trượt nhẹ 15-20px`, màu sắc tươi sáng, tương phản cao, nét căng 100%.
- **CẤM HIỆU ỨNG PHÓNG TO "TO DẦN" CỦA Ô CỬA SỔ (`scale 0 -> 1`):**
  - Ô cửa sổ / thẻ chính phải được **thiết kế bề thế, to tự nhiên ngay từ đầu** (rộng rãi, phủ trọn không gian trọng tâm 60–70% màn hình, padding rộng thoáng).
  - Khung xuất hiện dứt khoát bằng `opacity: 0 -> 1` kết hợp trượt nhẹ, sau đó các phần tử bên trong mới xuất hiện dần theo nhịp giọng đọc.

### 3. Nền không gian, Ký hiệu môn học & Chống rác thị giác
- **Mở đầu trực quan (Hook Visual):** Không đập ngay lý thuyết khô khan. Mở đầu bằng visual ấn tượng, vẽ logo/biểu tượng đặc trưng môn học (màn hình máy tính terminal phát sáng cho Tin học, từ vựng/ngữ pháp cho Tiếng Anh, công thức cho Toán...).
- **Nền động theo chủ đề môn học:** Tùy chủ đề mà nền có code SQL/binary (Tin học), từ vựng/IPA (Tiếng Anh), công thức (Toán). Không dùng nền tĩnh hay lưới trơn đơn điệu.
- **Ký hiệu lơ lửng & Ánh sao lấp lánh (Hook Ambient Symbols & Sparkle Stars):**
  - Đoạn mở đầu bắt buộc có ký hiệu đặc trưng rơi nhẹ trong không gian (`{}`, `[]`, `<>`, bit `0`, `1` cho Tin; `/ə/`, `θ`, `æ` cho Anh; `∫`, `√`, `π` cho Toán) kết hợp các ngôi sao 4 cánh lấp lánh (Sparkle Stars) co giãn nhịp thở nhẹ nhàng.
- **KIỂM SOÁT KÝ HIỆU NỀN — LOẠI BỎ RÁC THỊ GIÁC (CLEAN BACKGROUND):**
  - Ký hiệu nền chỉ tạo chiều sâu không gian (ambience), TUYỆT ĐỐI KHÔNG làm ô nhiễm vùng nội dung chính.
  - CẤM để các chữ to (`Prompt`, `Loss`, `Data`, `f(x)`, `{}`) bay đâm xuyên qua khung cửa sổ, đè lên viền hộp hay nằm dưới chữ bài giảng.
  - Ký hiệu nền phải: độ mờ cực nhẹ (`opacity: 0.10 - 0.15`), kích thước nhỏ gọn vừa phải, trôi dạt chủ yếu ở 2 biên lề ngoài khung hoặc nằm sau lớp nền tối phủ mờ (*backdrop-filter / solid dark box*).

### 4. Quy chuẩn Mascot Chim Neo (Neo Penguin)
- Sử dụng file ảnh gốc `public/img/canh-cut.png` (từ `tin-12-csdl`). **LUÔN GIỮ NGUYÊN BẢN**, tuyệt đối không thêm khung tròn, viền stroke hay vẽ đè hình vector thay thế.
- **CHỈ XUẤT HIỆN Ở PHÂN ĐOẠN ĐẦU (HookScene):** Đặt ở góc trên bên phải, có không gian thở thông thoáng, kích thước cân đối, không chen lấn với tiêu đề và TUYỆT ĐỐI KHÔNG vi phạm Top Safe Zone (`top >= 230px`).
- **TẤT CẢ CÁC PHÂN ĐOẠN SAU (Empathy, Value, Pitch, CTA) BẮT BUỘC ẨN HOÀN TOÀN** để nhường trọn không gian cho bài giảng.
- **CẤM HOÀN TOÀN PENGUIN SWOOP:** Tuyệt đối không cho chim lướt hay bay quét qua màn hình khi chuyển cảnh.

### 5. Chuyển cảnh (Transitions) & Đoạn kết (Outro)
- **Transition chuyển cảnh Dissolve / Fade (ƯU TIÊN VĨNH VIỄN):**
  - Chuyển cảnh giữa các scene bằng hiệu ứng **Dissolve / Fade** nhẹ nhàng, êm ái: cảnh trước mờ dần ẩn đi (`opacity: 1 -> 0`), sau đó cảnh mới hiện lên (`opacity: 0 -> 1`) từ nền không gian sao.
  - TUYỆT ĐỐI KHÔNG dùng chuyển cảnh trượt lướt ngang màn hình (slide push) hay xoay vặn gây rối mắt.
- **Đoạn kết Outro Logo Neo (Neo Logo Outro Scene — BẮT BUỘC):**
  - Mọi video bắt buộc kết thúc bằng phân đoạn Outro tĩnh (`OutroScene`) để nhận diện thương hiệu: hiển thị Logo Neo Education (`public/img/img-3.png`) trong khung bo góc bóng bẩy kết hợp website `neoeducation.vn` bên dưới.
  - Sử dụng `StaticOutroTransition`: để yên tĩnh tại chỗ và chỉ mờ dần êm ái (`opacity: 0 -> 1 -> 0`), cấm cuộn lướt hay xoay vặn. Tuyệt đối không kết thúc đột ngột ở thẻ CTA mà thiếu logo Neo.

### 6. Typography & Cỡ chữ di động (Mobile Readability)
TUYỆT ĐỐI KHÔNG để chữ quá nhỏ (<22px). Trên màn hình dọc 9:16 của điện thoại, kích thước bắt buộc:
- Tiêu đề chính màn hình: `52px – 58px`.
- Tiêu đề thẻ / Card header: `36px – 44px`.
- Nội dung chi tiết / Giải thích / Code / Bảng: `28px – 34px` (CẤM chữ nhỏ <24px).
- Badges / Mono tags: `24px – 28px`.
- Từ khóa điểm nhấn / Số liệu nổi bật: `36px – 48px`.
- Phụ đề (Lyrics): `40px – 42px` (chữ trắng đồng nhất, pill mờ bo góc).

### 7. Bố cục Khung cửa sổ & Không tái dùng thiết kế nguyên mẫu
- **Tỷ lệ khung tự nhiên:** Giữ tỷ lệ màn hình tự nhiên, căn chỉnh vừa vặn ở trọng tâm thị giác, không ép co rúm ở giữa để lại khoảng trống đen vô nghĩa ở 2 đầu màn hình.
- **Rút gọn nội dung súc tích:** Nội dung bên trong thẻ phải cô đọng, súc tích (punchy, to the point), không nhồi nhét văn bản giải thích dài dòng.
- **Không tái dùng thiết kế nguyên mẫu:** Mỗi video phải có visual language, palette màu tint và layout thẻ riêng, không sao chép y hệt video liền trước.

---

## PHẦN III: TIÊU CHUẨN ÂM THANH (TTS, LYRICS, BGM)

### 1. Kịch bản & Giọng đọc (TTS)
- **Phát âm tiếng Việt thuần trong TTS & Không gạch nối:**
  - Trong kịch bản TTS (`vo.json`), tuyệt đối KHÔNG viết từ viết tắt hay gạch nối tiếng Anh như `A-I`, `A-N-I`, `Chát-G-P-T`, `A-G-I` khiến bộ đọc ngắt quãng, giật cục. Viết phiên âm thuần tiếng Việt: `ây ai`, `chát di bi ti`, `a nờ i`, `a gi i`, `Giôn Mác Ca thi`, `Tu ring`, `đíp phếch`.
  - Phụ đề (Lyrics) và Giao diện (UI) vẫn giữ chuẩn chính tả quốc tế: `AI`, `ChatGPT`, `ANI`, `AGI`, `Turing`, `John McCarthy`, `Deepfake`.
- **API Colab TTS (OmniVoice TTS Server):**
  - URL tunnel từ Google Colab (USER mở Colab và dán link vào chat, AI chỉ kiểm tra `curl /health`).
  - ⚠️ **BẪY CHÍ MẠNG API:** Body gọi `POST /tts` phải dùng key **`voice`**, KHÔNG phải `voice_id` (sai key server tự fallback giọng đầu tiên mà không báo lỗi).
  - Luôn chạy `node gen-vo.mjs --voices` để xác nhận ID tồn tại.
- **Giọng đọc dự phòng:** HeyGen Starfish qua `vo-tool.mjs voices` (chỉ dùng khi Colab không khả dụng).
- **QA Giọng đọc:** Kiểm tra khe nghỉ sau dấu câu (`. … ? !`), nếu khe < 0.25s là dính câu, phải sửa dấu ngắt và sinh lại.

### 2. Phụ đề (Lyrics — Bắt buộc 100%)
- **Mọi lời thoại bắt buộc phải có lyrics.** Nguồn timestamp: TTS → file OGG → `faster-whisper GPU` → word timestamps → `src/words/` → `Lyrics.tsx`.
- **Quy chuẩn hiển thị:** Một dòng duy nhất, chữ trắng cùng cỡ cùng kiểu toàn video, pill nền mờ bo góc, `white-space: nowrap`.
- **Chia chunk:** Tối đa 6 từ/chunk, ≤ 38 ký tự, tối thiểu 1s hiển thị nếu timeline cho phép. Cụm vỡ < 0.5s hoặc timestamp âm phải gộp vào cụm trước.
- **Realign & Sửa từ:** Tên riêng, URL, số từ vựng bắt buộc kiểm tra tay từng file words trước khi render. Khi sửa words theo vị trí index, phải đọc tokens trước, không đoán mò.

### 3. Nhạc nền (BGM)
- **Mức âm lượng mặc định: luôn ở mức 45% (`"bgm": 0.45` trong `src/mix.json`).**
- **Xử lý nhạc:** Nhạc nền phải qua `tools/make-bgm-bed.mjs` (cắt dải, EQ biquad, chuẩn hóa RMS -32dBFS, đỉnh ≤ -15dBFS).
- **Fade & Auto-ducking:** Bắt buộc có fade-in/fade-out và tự động giảm âm lượng (ducking) 10-15dB khi có giọng thuyết minh.
- **Thời lượng:** Bản nhạc nền (bed) bắt buộc phải dài hơn tổng thời lượng video.

---

## PHẦN IV: QUY TRÌNH SẢN XUẤT 6 BƯỚC (SOP) & HUMAN-IN-THE-LOOP

### Quy tắc Phễu Kịch bản:
**Hook → Empathy → Value → Pitch → CTA**
- **Nói hết giá trị trước, quảng cáo sau:** Dạy thật, giải bẫy thật, mẹo thực chiến trước; pitch và CTA chỉ đặt ở cuối.
- **Xưng hô chuẩn:** Gọi người học là **"em"** để tạo sự gần gũi, chuẩn mực sư phạm.
- **Độ dài chuẩn (BẮT BUỘC TỪ 20/10/2026):** Video từ nay về sau **PHẢI DÀI TRÊN 1 PHÚT 30 GIÂY ĐẾN TỐI ĐA 1 PHÚT 50 GIÂY (90s – 110s, vùng chuẩn lý tưởng: 95s – 105s)**. Mật độ 150-180 chữ/phút (dung lượng kịch bản ~250 – 290 từ), mỗi câu tối đa 20 chữ.
- **Tự chủ thẩm định đáp án tài liệu:** Tài liệu ôn thi `sách hướng dẫn ôn thi tin học.pdf` (Chương trình GDPT 2018) có chỗ in sai/nhầm. AI phải tự giải lại độc lập, kiểm chứng chuẩn khoa học máy tính, không sao chép mù quáng đáp án của sách.

---

### 6 Bước Triển khai:

```
[BƯỚC 1: Tiếp nhận & Phân tích] ──(Duyệt)──> [BƯỚC 2: Voice & Duyệt lời] ──(Duyệt)──> [BƯỚC 3: Mapping Visual/Ảnh]
                                                                                              │ (Duyệt)
                                                                                              ▼
[BƯỚC 6: Render & Bàn giao] <──(Duyệt)── [BƯỚC 5: QA Toàn diện] <───────────────── [BƯỚC 4: Code Remotion]
```

1. **BƯỚC 1 — TIẾP NHẬN & PHÂN TÍCH:**
   - Xác định chủ đề, đối tượng (2K9 ôn thi), hỏi rõ: *"Video này có cần ảnh không?"*.
   - Soạn kịch bản chi tiết, bảng Hình/Tiếng, bảng phong cách visual khác biệt với video trước.
   - **DỪNG CHỜ USER DUYỆT.**
2. **BƯỚC 2 — VOICE & DUYỆT LỜI:**
   - Đề xuất voice ID, gửi audio nghe thử để user chọn (không dùng lại giọng video liền trước).
   - Sinh voice từng đoạn, mở trình review local (`sua-video.mjs` / `sua-video.html`).
   - User nghe, chỉnh sửa câu chữ trực tiếp trên giao diện cho đến khi ưng ý.
   - **DỪNG CHỜ USER DUYỆT.**
3. **BƯỚC 3 — MAPPING VISUAL / ẢNH:**
   - Nếu có dùng ảnh: đọc `D:\test AI\anh-nguon\ĐỌC TRƯỚC.txt`, lập bảng ánh xạ từng ảnh vào từng scene.
   - **DỪNG CHỜ USER DUYỆT.**
4. **BƯỚC 4 — CODING REMOTION:**
   - Triển khai source code Remotion theo đúng bộ tiêu chuẩn thị giác (Phần II).
   - Thiết lập timeline, BGM, SFX, lyrics, motion reveal.
5. **BƯỚC 5 — QA TOÀN DIỆN (NỘI BỘ AGENT):**
   - Tự động chạy toàn bộ checklist trước khi báo user:
     - [ ] Vùng an toàn TikTok iPhone chuẩn 100%: 
       + Top Safe Zone: Y >= 350px (không để tab/kính lúp đè tiêu đề hay mascot).
       + Right Safe Zone: X <= 875px (maxWidth <= 830px, chừa lề phải >= 205px để không bị cột 6 nút Like/Share/Avatar đè).
       + Bottom Safe Zone: Y <= 1440px (Lyrics ở bottom 460-480px, Watermark ở bottom 520px hoặc Header, cấm để gì ở bottom < 480px).
     - [ ] Cấm chữ mờ căm: các thẻ chưa đọc tới phải `opacity: 0` hoàn toàn.
     - [ ] Nền sạch: không có chữ bay đâm xuyên khung nội dung.
     - [ ] Mascot Chim Neo chỉ xuất hiện ở HookScene, có không gian thở.
     - [ ] Outro có Logo Neo Education tĩnh bo góc mờ dần.
     - [ ] Mọi scene có audio, RMS hợp lệ, durations OGG khớp `vo-durations.json`.
     - [ ] Phụ đề lyrics đúng từ, không che chủ thể, không wrap.
6. **BƯỚC 6 — RENDER & BÀN GIAO:**
   - Render bản nháp (`out/draft.mp4`), mở Editor UI cho user xem preview.
   - Khi user chốt: *"OK, tôi ưng ý rồi"* → Render final vào `D:\test AI\videos\<mon>-<chu-de>.mp4`.
   - Log lịch sử render vào `renders/history.json`.

---

## PHẦN V: SỔ TAY KỸ THUẬT & TỔNG HỢP CÁC BẪY ĐÃ BIẾT (CRITICAL GOTCHAS)

### 1. Bẫy Remotion & ffmpeg
- **Bẫy ffmpeg 26 (CodeIntegrity 0xC0E09002):**
  - File binary ffmpeg đi kèm Remotion bị Windows chặn. Đã thay bằng bản chạy được trong `@remotion/compositor-win32-x64-msvc` và vá file `renderer/dist/options/audio-codec.js` (`libfdk_aac` → `aac`).
  - ⚠️ **`npm install` lại sẽ MẤT patch này** → render bị lỗi gãy EPIPE. Cài lại xong bắt buộc phải vá lại y hệt.
- **Remotion Still xuất frame:** Luôn dùng cú pháp `npx remotion still <entry> <id> <out.png> --frame=N`. Truyền frame theo kiểu vị trí sẽ bị bỏ qua và luôn trả về frame 0.
- **Không chạy `npx tsc`:** Tránh bị cài nhầm gói tsc rác vào project. Kiểm tra cú pháp/bundle bằng: `npx remotion compositions src/index.ts`.
- **ffmpeg Remotion bị cắt bớt filter:** Không có filter `highpass`, `lowpass`, `astats`. Muốn đo âm thanh hay phổ, phải dùng các script trong `D:\test AI\tools\`.

### 2. Bẫy Audio & Timeline
- **Server clone 48kHz vs OmniVoice 24kHz:**
  - Script `gen-vo.mjs` mặc định chia granule cho 24000 (OmniVoice). Server clone trả về 48kHz sẽ làm durations bị nhân đôi.
  - Sau mỗi lần sinh giọng: bắt buộc đối chiếu `ffprobe duration` với `vo-durations.json`, nếu lệch thì ghi đè bằng số đo thật từ ffprobe.
- **Đổi audio/text mà không chạy lại chuỗi:**
  - Bất kỳ thay đổi nào về lời thoại/audio đều phải chạy lại toàn bộ chuỗi: `export → prep-audio → build → check` để đồng bộ lại `vo-durations.json` và timeline.
- **Đóng băng timeline trong lúc QA:** Khi đã vào khâu QA, không regen voice tùy tiện vì timeline sẽ bị trôi lệch toàn bộ animation. Nếu buộc phải đổi lời, phải QA lại từ đầu.

### 3. Bẫy Môi trường & Hệ thống Windows
- **Console Windows cp1252 & Mojibake UTF-8:**
  - Mọi script Python helper chạy trong terminal bắt buộc thêm `$env:PYTHONUTF8=1` để tránh crash lỗi mã hóa ký tự tiếng Việt.
- **PowerShell Syntax Trap:**
  - PowerShell không có lệnh `head`, không dùng `||`, không viết inline script Node phức tạp chứa dấu ngoặc `[]`. Hãy viết script ra file `D:\cache\tmp\*.py|*.mjs` rồi thực thi.
- **Lỗi `UV_HANDLE_CLOSING`:** Là cơ chế thoát vô hại của Node trên Windows, không phải lỗi crash.
- **Lỗi `EADDRINUSE`:** Phải kill tiến trình server review cũ trước khi mở server mới (`Get-Process node`). Mỗi dự án phân chia một cổng port riêng.
- **Kiểm tra Junction sau khi dọn dẹp:** Sau khi xóa rác hoặc dọn thư mục, kiểm tra lại `Test-Path node_modules\.bin\remotion.cmd`. Nếu mất thì phải cài đặt lại.
- **Đường dẫn file `staticFile()`:** File ảnh trong `public/img/` phải trỏ đúng đường dẫn. Chú ý không để sót file cũ trùng tên ở thư mục `public/` gốc lấn át file mới trong `public/img/`.
