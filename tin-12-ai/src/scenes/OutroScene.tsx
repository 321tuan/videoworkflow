import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { NEO_URL } from '../data';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 16 } });
  const glow = interpolate(frame, [0, 40, 80], [0.5, 1, 0.5], {
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
          width: 820,
          background: '#F8FAFC',
          borderRadius: 32,
          padding: 32,
          opacity: s,
          boxShadow: `0 0 ${40 + glow * 60}px rgba(0, 255, 135, 0.5)`,
        }}
      >
        <Img src={staticFile('img/img-3.png')} style={{ width: '100%', borderRadius: 18, display: 'block' }} />
      </div>
      <div
        style={{
          marginTop: 48,
          fontFamily: MONO,
          fontSize: 54,
          fontWeight: 800,
          color: C.accent,
          opacity: s,
          letterSpacing: 2.5,
          textShadow: '0 0 28px rgba(0,255,135,0.6)',
        }}
      >
        {NEO_URL}
      </div>
    </AbsoluteFill>
  );
};
