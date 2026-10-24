import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s02_empathy.json';

export const EmpathyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s02_empathy;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stagger 3 Pha xuat hien dan (Opacity + translateY, KHONG DUNG SCALE TO DAN):
  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pha 2: Hoc sinh voi vang danh dau dung (frame 136+, ~4.5s)
  const p2Active = frame >= 136;
  const p2Op = interpolate(frame, [136, 148], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2Y = interpolate(frame, [136, 150], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pha 3: Ban chat de thi danh gia tu duy (frame 270+, ~9.0s)
  const p3Active = frame >= 270;
  const p3Op = interpolate(frame, [270, 282], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p3Y = interpolate(frame, [270, 284], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s02_empathy.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s02_empathy', f, dur)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 140,
          paddingLeft: 50,
          paddingRight: 50,
          height: '100%',
        }}
      >
        {/* BADGE & TIEU DE EMPATHY */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          <Tag label="BẪY TRẮC NGHIỆM ĐÚNG / SAI" sub="PHẦN II — 2026" color="#F43F5E" borderColor="rgba(244, 63, 94, 0.4)" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 8,
              lineHeight: 1.25,
              textShadow: '0 4px 24px rgba(0,0,0,0.8)',
            }}
          >
            MẤT ĐIỂM OAN UỔNG VÌ<br />
            <span style={{ color: '#F43F5E' }}>HIỂU SAI BẢN CHẤT</span> ĐỀ THI!
          </h1>
        </div>

        {/* KHUNG CUA SO DE THI MINH HOA BE THE (WIDTH 980, MIN-HEIGHT 1000) */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            minHeight: 1000,
            background: 'linear-gradient(135deg, rgba(12, 18, 36, 0.95) 0%, rgba(6, 10, 24, 0.98) 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 32,
            padding: '36px 36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 22,
          }}
        >
          {/* HEADER DE THI */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontFamily: MONO, fontSize: 24, color: '#38BDF8', fontWeight: 800, marginLeft: 10 }}>
                  [ĐỀ THI TỐT NGHIỆP THPT — BỘ GIÁO DỤC]
                </span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 24, color: '#F43F5E', fontWeight: 900, background: 'rgba(244,63,94,0.15)', padding: '6px 14px', borderRadius: 10, border: '1px solid rgba(244,63,94,0.35)' }}>
                BẪY MẤT 1.0 ĐIỂM
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 34, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.45, marginBottom: 10 }}>
              "Khẳng định c): Một hệ thống máy tính có tốc độ tính toán siêu nhanh thì chắc chắn sở hữu Trí tuệ nhân tạo (AI)."
            </div>
          </div>

          {/* NUT TICK PHONG THI (KICH HOAT FRAME 110+) */}
          <div
            style={{
              opacity: p2Active ? p2Op : 0.35,
              transform: p2Active ? `translateY(${p2Y}px)` : 'none',
              padding: '24px 30px',
              borderRadius: 22,
              background: p2Active ? 'rgba(244, 63, 94, 0.18)' : 'rgba(255, 255, 255, 0.03)',
              border: p2Active ? '2px solid #F43F5E' : '1.5px solid rgba(255, 255, 255, 0.1)',
              boxShadow: p2Active ? '0 8px 30px rgba(244, 63, 94, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: p2Active ? '#F43F5E' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 26,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: p2Active ? '#F43F5E' : '#E2E8F0' }}>
                  Thí sinh vội vàng tích: [ ĐÚNG ]
                </div>
                <div style={{ fontFamily: FONT, fontSize: 24, color: p2Active ? '#FDA4AF' : C.textDim, marginTop: 4 }}>
                  Sai lầm phổ biến của 80% học sinh khi mới tiếp cận môn Tin
                </div>
              </div>
            </div>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 28,
                fontWeight: 900,
                color: p2Active ? '#F43F5E' : C.textDim,
                background: p2Active ? '#F43F5E22' : 'rgba(255, 255, 255, 0.05)',
                padding: '10px 18px',
                borderRadius: 14,
                border: p2Active ? '1px solid #F43F5E66' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              -1.0 ĐIỂM ⚠️
            </span>
          </div>

          {/* THE 2: BAN CHAT DE THI (KICH HOAT FRAME 270+) */}
          <div
            style={{
              opacity: p3Active ? p3Op : 0.35,
              transform: p3Active ? `translateY(${p3Y}px)` : 'none',
              background: p3Active
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(9, 20, 42, 0.98) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
              border: p3Active ? '2.5px solid #00FF87' : '1.5px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 24,
              padding: '30px 36px',
              boxShadow: p3Active ? '0 0 40px rgba(0, 255, 135, 0.3)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 36 }}>💡</span>
              <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: p3Active ? '#00FF87' : '#94A3B8' }}>
                BẢN CHẤT ĐỀ THI TỐT NGHIỆP:
              </span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 30, color: '#FFFFFF', lineHeight: 1.5, fontWeight: 700, marginBottom: 10 }}>
              Đề thi đánh giá <span style={{ color: p3Active ? '#00FF87' : '#94A3B8', textDecoration: 'underline' }}>NĂNG LỰC TƯ DUY & HỌC HỎI</span>, chứ không bao giờ hỏi về tốc độ cơ học đơn thuần!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 26, color: C.textDim, lineHeight: 1.45 }}>
              👉 Cỗ máy tính triệu phép tính/giây nếu chỉ chạy code lập trình sẵn thì KHÔNG CÓ TRÍ TUỆ!
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
