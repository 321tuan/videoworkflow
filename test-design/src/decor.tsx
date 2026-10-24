import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from './theme';

// =====================================================================
// 1. NEN LUOI CODE MATRIX & ORBS 20/10
// Thiet ke rieng cho Tin hoc 12: Thiet ke Web voi HTML
// =====================================================================
export const HtmlCodeGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const scanY = (frame * 3.5) % 2100 - 100;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Background Gradient Void */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 90% 70% at 50% 12%, #141B32 0%, #070A12 80%)',
        }}
      />

      {/* Modern Square Grid SVG */}
      <svg width={1080} height={1920} style={{ opacity: 0.4 }}>
        <defs>
          <pattern id="codeGrid" width={64} height={64} patternUnits="userSpaceOnUse">
            <rect width={64} height={64} fill="none" stroke="#F97316" strokeWidth={0.6} strokeOpacity={0.08} />
            <circle cx={32} cy={32} r={1} fill="#FF3366" fillOpacity={0.15} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#codeGrid)" />

        {/* Ma tran ky hieu web o bien ngoai (khong de vao vung noi dung) */}
        <g fontFamily={MONO} fontSize={14} fill="#FF3366" fillOpacity={0.18}>
          <text x={40} y={245}>&lt;!DOCTYPE html&gt;</text>
          <text x={40} y={1580}>&lt;meta charset=&quot;utf-8&quot;&gt;</text>
          <text x={840} y={245}>[HTML5_DOM]</text>
          <text x={860} y={1580}>[OCT_20_2026]</text>
        </g>

        {/* Tia quet ngang nhe nhang */}
        <g transform={`translate(0, ${scanY})`}>
          <line
            x1={0}
            y1={0}
            x2={1080}
            y2={0}
            stroke="#FF3366"
            strokeWidth={1.5}
            strokeOpacity={0.25}
            filter="drop-shadow(0 0 6px #FF3366)"
          />
        </g>
      </svg>

      {/* Glowing Orbs: Rose Coral & Amber Gold */}
      <div
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          left: 60 + Math.sin(frame * 0.02) * 60,
          top: 180 + Math.cos(frame * 0.015) * 50,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          right: 50 + Math.cos(frame * 0.018) * 50,
          top: 600 + Math.sin(frame * 0.022) * 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. NGOI SAO LAP LANH 4 CANH (Sparkle Stars)
// =====================================================================
interface StarConfig {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  color?: string;
}

const STARS: StarConfig[] = [
  { x: 90, y: 280, size: 20, phase: 0.2, speed: 0.05, color: '#FF3366' },
  { x: 980, y: 320, size: 24, phase: 1.5, speed: 0.045, color: '#F59E0B' },
  { x: 120, y: 640, size: 18, phase: 2.8, speed: 0.055, color: '#FDA4AF' },
  { x: 960, y: 880, size: 22, phase: 0.9, speed: 0.04, color: '#FF3366' },
  { x: 80, y: 1220, size: 22, phase: 3.4, speed: 0.048, color: '#F59E0B' },
  { x: 990, y: 1360, size: 20, phase: 2.1, speed: 0.052, color: '#FDA4AF' },
  { x: 140, y: 1540, size: 26, phase: 4.2, speed: 0.042, color: '#FF3366' },
];

export const SparkleStars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {STARS.map((s, idx) => {
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame * s.speed + s.phase));
        const rot = frame * 0.4 + s.phase * 40;
        const col = s.color || '#FF3366';

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${pulse})`,
              opacity: pulse * 0.85,
              pointerEvents: 'none',
            }}
          >
            <svg width={s.size} height={s.size} viewBox="-20 -20 40 40">
              <path
                d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z"
                fill={col}
                filter="drop-shadow(0 0 6px rgba(255,51,102,0.8))"
              />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. TAG / BADGE TIEU DE CHUAN
// =====================================================================
export const Tag: React.FC<{
  label: string;
  sub?: string;
  color?: string;
  borderColor?: string;
}> = ({ label, sub, color = C.accent, borderColor = 'rgba(255, 51, 102, 0.4)' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: 20,
        background: 'rgba(17, 24, 39, 0.85)',
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
