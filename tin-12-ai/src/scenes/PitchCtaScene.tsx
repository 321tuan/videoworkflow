import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s06_pitch_cta.json';

export const PitchCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s06_pitch_cta;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Nhip 2: Kich hoat loi keu goi CTA neoeducation.vn (frame 146+, ~4.9s)
  const ctaActive = frame >= 146;
  const ctaOp = interpolate(frame, [146, 158], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [146, 160], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const buttonPulse = 1 + 0.04 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s06_pitch_cta.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s06_pitch_cta', f, dur)}
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
        {/* BADGE & TIEU DE PITCH CTA */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <Tag label="CHINH PHỤC ĐIỂM 10 TIN HỌC" sub="THPT 2026" color="#00FF87" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            TỰ TIN BỨT PHÁ<br />
            <span style={{ color: C.accent }}>ĐIỂM 10 TIN HỌC!</span>
          </h1>
        </div>

        {/* KHUNG CUA SO MOCKUP TRINH DUYET BE THE (WIDTH 980, MIN-HEIGHT 1020) */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            minHeight: 1020,
            background: 'linear-gradient(135deg, rgba(12, 20, 40, 0.96) 0%, rgba(6, 12, 26, 0.98) 100%)',
            border: '2px solid rgba(0, 255, 135, 0.4)',
            borderRadius: 32,
            padding: '34px 38px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          {/* Top Bar Mockup Browser */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 16 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981' }} />
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '8px 20px',
                fontFamily: MONO,
                fontSize: 22,
                color: C.accent,
                marginLeft: 14,
                textAlign: 'left',
                border: '1px solid rgba(0,255,135,0.2)',
              }}
            >
              https://neoeducation.vn/tin-hoc-12
            </div>
          </div>

          {/* 3 COT TOM TAT GIA TRI KIENTHUC */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid rgba(56, 189, 248, 0.4)', borderRadius: 20, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🧠</div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>Bản Chất Tư Duy</div>
              <div style={{ fontFamily: FONT, fontSize: 22, color: '#BAE6FD', lineHeight: 1.4 }}>Không nhầm lẫn tốc độ máy với trí tuệ</div>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1.5px solid rgba(168, 85, 247, 0.4)', borderRadius: 20, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>Phân Biệt ANI / AGI</div>
              <div style={{ fontFamily: FONT, fontSize: 22, color: '#E9D5FF', lineHeight: 1.4 }}>100% hiện nay là ANI, AGI chưa tồn tại</div>
            </div>

            <div style={{ background: 'rgba(251, 191, 36, 0.12)', border: '1.5px solid rgba(251, 191, 36, 0.4)', borderRadius: 20, padding: '20px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>Đạo Đức & An Ninh</div>
              <div style={{ fontFamily: FONT, fontSize: 22, color: '#FEF08A', lineHeight: 1.4 }}>Chuẩn mực dữ liệu & Cảnh giác Deepfake</div>
            </div>
          </div>

          {/* THE CTA KICH HOAT KHI Ninh Don DOC GHE NGAY NEOEDUCATION.VN */}
          <div
            style={{
              opacity: ctaActive ? ctaOp : 0.4,
              transform: ctaActive ? `translateY(${ctaY}px)` : 'none',
              background: ctaActive
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 78, 59, 0.45) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: ctaActive ? '2.5px solid #00FF87' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '28px 32px',
              textAlign: 'center',
              boxShadow: ctaActive ? '0 12px 36px rgba(0, 255, 135, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: '#FFFFFF', marginBottom: 8 }}>
              Học & Luyện Đề Thực Chiến Cùng <span style={{ color: C.accent }}>NEO EDUCATION</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 26, color: '#D1FAE5', marginBottom: 24, lineHeight: 1.45, fontWeight: 600 }}>
              Ngân hàng 50+ đề thi thử bám sát ma trận mới Bộ Giáo dục & Đào tạo<br />
              Phân tích chuyên sâu bẫy lý thuyết trắc nghiệm Đúng / Sai
            </div>

            {/* BUTTON CTA */}
            <div style={{ display: 'inline-block', transform: `scale(${ctaActive ? buttonPulse : 1})` }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  borderRadius: 20,
                  padding: '20px 58px',
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: 0.8,
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                LUYỆN ĐỀ THỰC CHIẾN NGAY 🚀
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
