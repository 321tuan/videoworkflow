import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s05_pitch_cta.json';

export const PitchCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s05_pitch_cta;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enterY = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ctaPop = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 220 } });
  const glowPulse = 0.7 + 0.3 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s05_pitch_cta.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s05_pitch_cta', f, dur)}
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
          <Tag label="LUYỆN ĐỀ THỰC CHIẾN" sub="TIN HỌC 12" color="#FF3366" borderColor="rgba(255, 51, 102, 0.45)" />

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 14,
              marginBottom: 4,
              lineHeight: 1.25,
            }}
          >
            QUÉT SẠCH BẪY THI TỐT NGHIỆP<br />
            <span style={{ color: '#FF3366' }}>BỨT PHÁ ĐIỂM 10</span> CÙNG NEO!
          </h2>
        </div>

        {/* THẺ CTA BỀ THẾ KÈM MOCKUP TRANG WEB NEO */}
        <div
          style={{
            opacity: interpolate(ctaPop, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(ctaPop, [0, 1], [24, 0])}px)`,
            width: '100%',
            maxWidth: 980,
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
            border: '2px solid rgba(255, 51, 102, 0.45)',
            borderRadius: 28,
            padding: '24px 28px',
            boxShadow: `0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 51, 102, ${glowPulse * 0.25})`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* HÌNH ẢNH GIAO DIỆN NỀN TẢNG NEO THỰC TẾ */}
          <div
            style={{
              width: '100%',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: `0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255, 51, 102, ${glowPulse * 0.3})`,
              border: '2px solid rgba(255, 51, 102, 0.5)',
              background: '#0F121C',
            }}
          >
            <Img
              src={staticFile('img/neo-web.png')}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* LỢI ÍCH HỌC TẬP & NÚT LINK WEBSITE */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
              border: '2px solid #FF3366',
              borderRadius: 20,
              padding: '18px 26px',
              textAlign: 'center',
              boxShadow: `0 8px 26px rgba(255, 51, 102, ${glowPulse * 0.35})`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 900, color: '#FFFFFF', letterSpacing: 1.5 }}>
              🌐 neoeducation.vn
            </div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: '#FDA4AF', marginTop: 4 }}>
              Nền tảng ôn thi Tin Học — Luyện đề Phần II Đúng/Sai có giải thích chi tiết!
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
