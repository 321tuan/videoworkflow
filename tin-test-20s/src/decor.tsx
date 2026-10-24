import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, MONO } from './theme';

// =====================================================================
// 1. NỀN CODE MATRIX GRID & ORBS SANG TRỌNG
// =====================================================================
export const CodeMatrixGrid: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Nền Gradient Đen Ánh Xanh Sâu */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 90% 70% at 50% 15%, #0F172A 0%, #070A12 85%)',
        }}
      />

      {/* Grid SVG */}
      <svg width={1080} height={1920} style={{ opacity: 0.35 }}>
        <defs>
          <pattern id="codeGrid" width={64} height={64} patternUnits="userSpaceOnUse">
            <rect width={64} height={64} fill="none" stroke="#38BDF8" strokeWidth={0.6} strokeOpacity={0.08} />
            <circle cx={32} cy={32} r={1} fill="#38BDF8" fillOpacity={0.12} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#codeGrid)" />
      </svg>

      {/* Ánh sáng mờ nhẹ ở 2 góc */}
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          left: 40,
          top: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          right: 40,
          top: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163, 230, 53, 0.1) 0%, transparent 70%)',
          filter: 'blur(55px)',
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. NGÔI SAO LẤP LÁNH 4 CÁNH (Sparkle Stars)
// =====================================================================
const STARS = [
  { x: 80, y: 260, size: 20, phase: 0.2, speed: 0.05, color: '#38BDF8' },
  { x: 990, y: 310, size: 22, phase: 1.5, speed: 0.045, color: '#F59E0B' },
  { x: 100, y: 650, size: 18, phase: 2.8, speed: 0.055, color: '#A3E635' },
  { x: 970, y: 880, size: 20, phase: 0.9, speed: 0.04, color: '#38BDF8' },
  { x: 90, y: 1250, size: 22, phase: 3.4, speed: 0.048, color: '#F59E0B' },
  { x: 980, y: 1350, size: 20, phase: 2.1, speed: 0.052, color: '#A3E635' },
];

export const SparkleStars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {STARS.map((s, idx) => {
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame * s.speed + s.phase));
        const rot = frame * 0.4 + s.phase * 40;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pulse})`,
              opacity: pulse * 0.8,
            }}
          >
            <svg width={s.size} height={s.size} viewBox="-20 -20 40 40">
              <path
                d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z"
                fill={s.color}
                filter={`drop-shadow(0 0 6px ${s.color})`}
              />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. TAG TIÊU ĐỀ CHUẨN
// =====================================================================
export const Tag: React.FC<{
  label: string;
  sub?: string;
  color?: string;
  borderColor?: string;
}> = ({ label, sub, color = C.accent, borderColor = 'rgba(56, 189, 248, 0.4)' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: 20,
        background: 'rgba(15, 23, 42, 0.9)',
        border: `1.5px solid ${borderColor}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: '#FFFFFF',
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 700,
            color: color,
            paddingLeft: 10,
            borderLeft: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
};
