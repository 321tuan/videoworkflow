import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s04_value2.json';

export const Value2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s04_value2;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enterY = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Nhịp xuất hiện 3 thẻ giải mã theo lời đọc (QUY TẮC 42: CHƯA ĐỌC TỚI ẨN HOÀN TOÀN)
  const act1 = frame >= 0;
  const pop1 = spring({ frame, fps, config: { damping: 14, stiffness: 220 } });

  const act2 = frame >= 240;
  const pop2 = spring({ frame: frame - 240, fps, config: { damping: 14, stiffness: 220 } });

  const act3 = frame >= 510;
  const pop3 = spring({ frame: frame - 510, fps, config: { damping: 14, stiffness: 220 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s04_value2.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s04_value2', f, dur)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 235, // TOP SAFE ZONE: KHÔNG ĐẶT NỘI DUNG Ở Y < 220PX
          paddingLeft: 48,
          paddingRight: 48,
          height: '100%',
        }}
      >
        {/* HEADER & TIÊU ĐỀ */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            textAlign: 'center',
            marginBottom: 20,
            width: '100%',
          }}
        >
          <Tag label="BÓC TÁCH BẪY THỰC CHIẾN" sub="MẸO ĂN TRỌN ĐIỂM" color="#10B981" borderColor="rgba(16, 185, 129, 0.45)" />

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 16,
              marginBottom: 4,
              lineHeight: 1.25,
            }}
          >
            GIẢI MÃ ĐÁP ÁN:<br />
            <span style={{ color: '#F43F5E' }}>PHƯƠNG ÁN D LÀ BẪY SAI</span> HOÀN TOÀN!
          </h2>
        </div>

        {/* KHUNG CỬA SỔ BẢN CHẤT — 3 BÍ KÍP VÀNG */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            width: '100%',
            maxWidth: 980,
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 28,
            padding: '28px 32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 740,
          }}
        >
          {/* HEADER KHUNG CỬA SỔ */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 12,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 24, color: '#10B981', fontWeight: 800 }}>
              [BẢN CHẤT KHOA HỌC MÁY TÍNH & HTML5]
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 800,
                color: '#F43F5E',
                background: 'rgba(244, 63, 94, 0.18)',
                padding: '4px 14px',
                borderRadius: 10,
              }}
            >
              Ý D: SAI ❌
            </span>
          </div>

          {/* ĐOẠN CODE MINH HỌA BẪY THẺ TIÊU ĐỀ H1 -> H6 VS H7 */}
          <div
            style={{
              background: '#070A14',
              border: '1.5px solid rgba(244, 63, 94, 0.45)',
              borderRadius: 18,
              padding: '14px 22px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 20, color: '#10B981', fontWeight: 800 }}>
                💻 SO SÁNH CHUẨN CÚ PHÁP HEADING
              </span>
              <span style={{ fontFamily: MONO, fontSize: 18, color: '#F43F5E', fontWeight: 800, background: 'rgba(244, 63, 94, 0.15)', padding: '2px 10px', borderRadius: 8 }}>
                BẪY HTML5
              </span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.5 }}>
              <div style={{ color: '#10B981' }}>
                &lt;<span style={{ fontWeight: 800 }}>h1</span>&gt;...&lt;/h1&gt; <span style={{ color: '#94A3B8', fontSize: 20 }}>→ Cấp lớn nhất (Level 1) ✅</span>
              </div>
              <div style={{ color: '#38BDF8' }}>
                &lt;<span style={{ fontWeight: 800 }}>h6</span>&gt;...&lt;/h6&gt; <span style={{ color: '#94A3B8', fontSize: 20 }}>→ Cấp nhỏ nhất (Level 6) ✅</span>
              </div>
              <div style={{ color: '#F43F5E', background: 'rgba(244, 63, 94, 0.16)', borderRadius: 6, padding: '2px 8px', marginTop: 4 }}>
                &lt;<span style={{ fontWeight: 800, textDecoration: 'line-through' }}>h7</span>&gt;...&lt;/h7&gt; <span style={{ color: '#FFA4B0', fontWeight: 800, fontSize: 20 }}>→ KHÔNG TỒN TẠI TRONG HTML! ❌</span>
              </div>
            </div>
          </div>

          {/* THẺ 1: BẪY H7 (CHỈ CÓ H1 - H6) */}
          {act1 ? (
            <div
              style={{
                opacity: interpolate(pop1, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(pop1, [0, 1], [16, 0])}px)`,
                background: 'rgba(244, 63, 94, 0.12)',
                border: '2.5px solid #F43F5E',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.25)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: '#F43F5E',
                  color: '#FFFFFF',
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ❌
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 30, color: '#FFFFFF', fontWeight: 900 }}>
                  Không tồn tại thẻ &lt;h7&gt; trong chuẩn HTML!
                </div>
                <div style={{ fontFamily: FONT, fontSize: 26, color: '#FDA4AF', marginTop: 4, fontWeight: 700 }}>
                  Tiêu đề chỉ có đúng 6 cấp: từ <span style={{ color: '#FFFFFF', fontFamily: MONO }}>&lt;h1&gt;</span> (lớn nhất) đến <span style={{ color: '#FFFFFF', fontFamily: MONO }}>&lt;h6&gt;</span> (nhỏ nhất).
                </div>
              </div>
            </div>
          ) : null}

          {/* THẺ 2: CƠ CHẾ PHẦN TỬ KHỐI (BLOCK-LEVEL) */}
          {act2 ? (
            <div
              style={{
                opacity: interpolate(pop2, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(pop2, [0, 1], [16, 0])}px)`,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid #10B981',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#10B981',
                  color: '#070A12',
                  fontSize: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ✅
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 28, color: '#FFFFFF', fontWeight: 900 }}>
                  &lt;h1&gt; và &lt;p&gt; là phần tử khối (Block-level)
                </div>
                <div style={{ fontFamily: FONT, fontSize: 24, color: '#6EE7B7', marginTop: 2, fontWeight: 700 }}>
                  Tự động chiếm 100% chiều ngang và tự xuống dòng, KHÔNG CẦN dùng thẻ &lt;br&gt;.
                </div>
              </div>
            </div>
          ) : null}

          {/* THẺ 3: VỊ TRÍ THẺ TITLE */}
          {act3 ? (
            <div
              style={{
                opacity: interpolate(pop3, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(pop3, [0, 1], [16, 0])}px)`,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid #38BDF8',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.2)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#38BDF8',
                  color: '#070A12',
                  fontSize: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                🌐
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 28, color: '#FFFFFF', fontWeight: 900 }}>
                  Thẻ &lt;title&gt; chỉ là tên của tab trình duyệt
                </div>
                <div style={{ fontFamily: FONT, fontSize: 24, color: '#BAE6FD', marginTop: 2, fontWeight: 700 }}>
                  Nằm trong &lt;head&gt;, hoàn toàn không bao giờ xuất hiện ở phần thân &lt;body&gt;.
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
