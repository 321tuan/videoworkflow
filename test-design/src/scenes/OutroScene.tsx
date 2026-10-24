import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SAFE_ZONE, C, FONT, MONO } from '../theme';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.X_MIN,
          top: SAFE_ZONE.Y_MIN,
          width: SAFE_ZONE.WIDTH,
          height: SAFE_ZONE.HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fadeIn,
        }}
      >
        {/* LOGO NEO EDUCATION TRONG KHUNG KÍNH MỜ BO GÓC BÓNG BẨY */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 36,
            padding: '40px 60px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(56, 189, 248, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div style={{ width: 220 }}>
            <Img
              src={staticFile('img/img-3.png')}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              NEO EDUCATION
            </h2>
            <p style={{ fontSize: 26, color: C.accentBlue, fontWeight: 700, marginTop: 8, marginBottom: 0 }}>
              Chuyên Gia Ôn Thi Đánh Giá Năng Lực & Tốt Nghiệp
            </p>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: '10px 24px',
              borderRadius: 24,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontFamily: MONO,
              fontSize: 26,
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: 1,
            }}
          >
            🌐 neoeducation.vn
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
