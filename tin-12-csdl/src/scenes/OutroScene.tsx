import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { NEO_URL } from '../data';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 16 } });
  const glow = interpolate(frame, [0, 45, 90], [0.5, 1, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#040711',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 780,
          background: '#F8FAFC',
          borderRadius: 32,
          padding: 28,
          opacity: s,
          transform: `scale(${0.9 + s * 0.1})`,
          boxShadow: `0 0 ${40 + glow * 60}px rgba(56, 189, 248, 0.45)`,
        }}
      >
        <Img src={staticFile('img/img-3.png')} style={{ width: '100%', borderRadius: 18 }} />
      </div>
      <div
        style={{
          marginTop: 44,
          fontFamily: MONO,
          fontSize: 52,
          fontWeight: 700,
          color: C.sqlBlue,
          opacity: s,
          letterSpacing: 2,
          textShadow: '0 0 24px rgba(56,189,248,0.5)',
        }}
      >
        {NEO_URL}
      </div>
    </AbsoluteFill>
  );
};
