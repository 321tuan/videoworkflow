import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO, TIKTOK_SAFE } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import wordsJson from '../words/s03_cta.json';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SC.s03_cta;

  // StaticOutroTransition: mờ dần êm ái, yên tĩnh tại chỗ (Quy tắc 30)
  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut, fontFamily: FONT }}>
      <Audio
        src={staticFile('vo/s03_cta.ogg')}
        startFrom={0}
        volume={voiceVolAt(frame, dur)}
      />

      {/* KHUNG OUTRO TĨNH BO GÓC BÓNG BẨY — TRỌN VẸN TRONG HỘP AN TOÀN */}
      <div
        style={{
          position: 'absolute',
          left: TIKTOK_SAFE.BOX_LEFT,
          top: 0,
          width: TIKTOK_SAFE.BOX_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 160,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 36,
            padding: '44px 50px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            width: '100%',
            maxWidth: 760,
            textAlign: 'center',
          }}
        >
          {/* Logo Neo Education */}
          <div style={{ width: 220 }}>
            <Img
              src={staticFile('img/img-3.png')}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 22 }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: 0.5 }}>
              NEO EDUCATION
            </h2>
            <p style={{ fontSize: 24, color: C.accent, fontWeight: 700, marginTop: 10, marginBottom: 0 }}>
              Chuyên Gia Ôn Thi ĐGNL & Tốt Nghiệp 2026
            </p>
          </div>

          {/* Website Button */}
          <div
            style={{
              marginTop: 10,
              padding: '12px 28px',
              borderRadius: 24,
              background: 'rgba(56, 189, 248, 0.16)',
              border: '1.5px solid rgba(56, 189, 248, 0.5)',
              fontFamily: MONO,
              fontSize: 28,
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: 1,
              boxShadow: '0 0 20px rgba(56,189,248,0.3)',
            }}
          >
            🌐 neoeducation.vn
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} />
    </AbsoluteFill>
  );
};
