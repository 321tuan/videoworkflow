import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s03_value1.json';

export const Value1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s03_value1;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enterY = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Nhịp xuất hiện 4 phương án đồng bộ giọng đọc (QUY TẮC 42: CHƯA ĐỌC TỚI ẨN HOÀN TOÀN, ĐỌC TỚI BẬT SÁNG)
  const actA = frame >= 155;
  const popA = spring({ frame: frame - 155, fps, config: { damping: 14, stiffness: 220 } });

  const actB = frame >= 325;
  const popB = spring({ frame: frame - 325, fps, config: { damping: 14, stiffness: 220 } });

  const actC = frame >= 485;
  const popC = spring({ frame: frame - 485, fps, config: { damping: 14, stiffness: 220 } });

  const actD = frame >= 645;
  const popD = spring({ frame: frame - 645, fps, config: { damping: 14, stiffness: 220 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s03_value1.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s03_value1', f, dur)}
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
          <Tag label="CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI" sub="ĐỀ THI 2026" color="#38BDF8" borderColor="rgba(56, 189, 248, 0.45)" />

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
            ĐOẠN CODE 20/10 TRÊN:<br />
            <span style={{ color: '#38BDF8' }}>THẨM ĐỊNH 4 PHƯƠNG ÁN</span> SAU
          </h2>
        </div>

        {/* KHUNG CỬA SỔ CHÍNH 4 PHƯƠNG ÁN — BỀ THẾ, RỘNG THOÁNG */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            width: '100%',
            maxWidth: 980,
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.35)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F43F5E' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontFamily: MONO, fontSize: 24, color: '#38BDF8', fontWeight: 800, marginLeft: 10 }}>
                [BÀI TẬP: XÁC ĐỊNH TÍNH ĐÚNG / SAI]
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.textDim, fontWeight: 700 }}>
              4 PHƯƠNG ÁN
            </span>
          </div>

          {/* ĐOẠN CODE ĐỀ BÀI HTML 20/10 — HIỂN THỊ TRỰC QUAN ĐỂ THẨM ĐỊNH */}
          <div
            style={{
              background: '#070A14',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 18,
              padding: '14px 22px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 20, color: '#38BDF8', fontWeight: 800 }}>
                📄 index.html — ĐOẠN CODE ĐỀ BÀI
              </span>
              <span style={{ fontFamily: MONO, fontSize: 18, color: '#F59E0B', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', padding: '2px 10px', borderRadius: 8 }}>
                HTML5
              </span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.5, color: '#E2E8F0' }}>
              <div>&lt;<span style={{ color: '#38BDF8' }}>title</span>&gt;<span style={{ color: '#F59E0B' }}>Mừng ngày 20-10</span>&lt;/<span style={{ color: '#38BDF8' }}>title</span>&gt;</div>
              <div style={{ background: 'rgba(255, 51, 102, 0.14)', borderRadius: 6, padding: '3px 8px', margin: '4px 0', borderLeft: '4px solid #FF3366' }}>
                &lt;<span style={{ color: '#FF3366', fontWeight: 800 }}>h1</span>&gt;<span style={{ color: '#FFFFFF', fontWeight: 800 }}>Chào mừng Ngày Phụ Nữ Việt Nam 20/10!</span>&lt;/<span style={{ color: '#FF3366', fontWeight: 800 }}>h1</span>&gt;
              </div>
              <div>&lt;<span style={{ color: '#38BDF8' }}>p</span>&gt;<span style={{ color: '#FDA4AF' }}>Chúc một nửa thế giới luôn rạng ngời hạnh phúc!</span>&lt;/<span style={{ color: '#38BDF8' }}>p</span>&gt;</div>
            </div>
          </div>

          {/* PHƯƠNG ÁN A */}
          {actA ? (
            <div
              style={{
                opacity: interpolate(popA, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(popA, [0, 1], [16, 0])}px)`,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid #38BDF8',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#38BDF8',
                  color: '#070A12',
                  fontFamily: MONO,
                  fontSize: 30,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div style={{ fontFamily: FONT, fontSize: 28, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.35 }}>
                Thẻ <span style={{ color: '#38BDF8', fontFamily: MONO, fontWeight: 800 }}>&lt;title&gt;</span> trong &lt;head&gt; hiển thị dòng chữ trên thanh tab của trình duyệt.
              </div>
            </div>
          ) : null}

          {/* PHƯƠNG ÁN B */}
          {actB ? (
            <div
              style={{
                opacity: interpolate(popB, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(popB, [0, 1], [16, 0])}px)`,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid #38BDF8',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#38BDF8',
                  color: '#070A12',
                  fontFamily: MONO,
                  fontSize: 28,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                B
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.35 }}>
                Thẻ <span style={{ color: '#FF3366', fontFamily: MONO, fontWeight: 800 }}>&lt;h1&gt;</span> là tiêu đề bậc lớn nhất, có cỡ chữ to nhất và được in đậm.
              </div>
            </div>
          ) : null}

          {/* PHƯƠNG ÁN C */}
          {actC ? (
            <div
              style={{
                opacity: interpolate(popC, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(popC, [0, 1], [16, 0])}px)`,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid #38BDF8',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#38BDF8',
                  color: '#070A12',
                  fontFamily: MONO,
                  fontSize: 28,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                C
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.35 }}>
                Giữa tiêu đề và lời chúc bên dưới, trình duyệt tự động ngắt dòng mà không cần thẻ <span style={{ color: '#F59E0B', fontFamily: MONO, fontWeight: 800 }}>&lt;br&gt;</span>.
              </div>
            </div>
          ) : null}

          {/* PHƯƠNG ÁN D (TRÌNH BÀY ĐỒNG BỘ KHÁCH QUAN NHƯ A, B, C) */}
          {actD ? (
            <div
              style={{
                opacity: interpolate(popD, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(popD, [0, 1], [16, 0])}px)`,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid #38BDF8',
                borderRadius: 18,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#38BDF8',
                  color: '#070A12',
                  fontFamily: MONO,
                  fontSize: 28,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                D
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.35 }}>
                Để lời chúc 20/10 nổi bật hơn nữa, ta hoàn toàn có thể thay thẻ &lt;h1&gt; bằng thẻ <span style={{ color: '#38BDF8', fontFamily: MONO, fontWeight: 800 }}>&lt;h7&gt;</span>.
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
