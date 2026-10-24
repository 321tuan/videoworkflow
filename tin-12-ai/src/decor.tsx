import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from './theme';

// =====================================================================
// 1. NEN LUOI LUC GIAC CYBER (Cyber Hexagonal Matrix Grid)
// Thiet ke moi doc quyen cho chu de Tri tue nhan tao AI.
// =====================================================================
export const CyberHexagonGrid: React.FC = () => {
  const frame = useCurrentFrame();

  // Tia quet neural laser chay doc tu tren xuong
  const scanY = (frame * 3.8) % 2100 - 100;
  const pulse = 0.4 + 0.15 * Math.sin((frame * Math.PI * 2) / 100);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Background Gradient Void */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 90% 65% at 50% 15%, #0B1630 0%, #040711 75%)',
        }}
      />

      {/* Hexagon Pattern SVG */}
      <svg width={1080} height={1920} style={{ opacity: 0.45 }}>
        <defs>
          <pattern id="hexGrid" width={60} height={104} patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
            <path
              d="M 30,0 L 60,17.32 L 60,52 L 30,69.28 L 0,52 L 0,17.32 Z
                 M 30,52 L 60,69.28 L 60,104 L 30,121.24 L 0,104 L 0,69.28 Z"
              fill="none"
              stroke="#00FF87"
              strokeWidth={0.7}
              strokeOpacity={0.09}
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#hexGrid)" />

        {/* Ma tran toa do cong nghe mo o goc */}
        <g fontFamily={MONO} fontSize={13} fill="#00FF87" fillOpacity={0.18}>
          <text x={36} y={64}>[AI_CORE_0x7F]</text>
          <text x={36} y={480}>[NEURAL_NET_READY]</text>
          <text x={36} y={1860}>[MODEL_v2.6_ACTIVE]</text>
          <text x={840} y={64}>[BATCH_SIZE: 64]</text>
          <text x={870} y={1860}>[LOSS: 0.0014]</text>
        </g>

        {/* Tia quet du lieu Neural ngang */}
        <g transform={`translate(0, ${scanY})`}>
          <line
            x1={0}
            y1={0}
            x2={1080}
            y2={0}
            stroke="#00FF87"
            strokeWidth={2}
            strokeOpacity={0.35}
            filter="drop-shadow(0 0 8px #00FF87)"
          />
        </g>
      </svg>

      {/* 2 Quang sang troi (Glowing Orbs) Violet & Emerald */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          left: 100 + Math.sin(frame * 0.02) * 80,
          top: 200 + Math.cos(frame * 0.015) * 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          right: 50 + Math.cos(frame * 0.025) * 70,
          top: 800 + Math.sin(frame * 0.02) * 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 135, 0.14) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. TAG / BADGE TIEU DE
// =====================================================================
export const Tag: React.FC<{
  label: string;
  sub?: string;
  color?: string;
  borderColor?: string;
}> = ({ label, sub, color = C.accent, borderColor = 'rgba(0, 255, 135, 0.35)' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(9, 17, 37, 0.85)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 24,
        padding: '8px 22px',
        boxShadow: `0 4px 20px ${color}22`,
      }}
    >
      <div
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
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 800,
          color,
          letterSpacing: 0.8,
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 18,
            fontWeight: 600,
            color: C.textDim,
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            paddingLeft: 10,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
};

// =====================================================================
// 3. MASCOT CHIM NEO LƯỚT CHUYỂN CẢNH (Neo Penguin Transition Glide)
// Chú chim mascot Neo vút bay lướt qua màn hình nhẹ nhàng, tinh tế,
// NGUYÊN BẢN, KHÔNG CÓ VIỀN XUNG QUANH (Rule 34: 26-28 frames, ~0.85s).
// =====================================================================
export const PenguinPageTurn: React.FC<{
  progress: number; // 0 -> 1 trong suot thoi gian chuyen canh
}> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;

  // Quy dao bay luot muot ma theo nhip cuon trang (tu Phai sang Trai):
  const smoothP = 0.5 - 0.5 * Math.cos(progress * Math.PI);
  const x = interpolate(smoothP, [0, 1], [1120, -320]);
  const y = 920 + Math.sin(progress * Math.PI) * -180;

  // Goc nghieng luot bay nhe nhang
  const rotate = interpolate(progress, [0, 0.5, 1], [14, -2, -18]);
  const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1.12, 0.95]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Chu chim Neo vut bay luot qua sach se, nguyen ban, khong vien */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 270,
          transform: `scaleX(-1) rotate(${rotate}deg) scale(${scale})`,
          filter: 'drop-shadow(0 14px 26px rgba(0, 0, 0, 0.75))',
        }}
      >
        <Img
          src={staticFile('img/canh-cut.png')}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export const PenguinSwoop = PenguinPageTurn;

// =====================================================================
// 4. WATERMARK MO TROI NHE (Rule 652)
// =====================================================================
export const FloatingWatermark: React.FC<{ hide?: boolean }> = ({ hide = false }) => {
  const frame = useCurrentFrame();
  if (hide) return null;

  const bobY = Math.sin((frame * Math.PI * 2) / 90) * 8;
  const pulseOp = 0.28 + 0.08 * Math.sin((frame * Math.PI * 2) / 120);

  return (
    <div
      style={{
        position: 'absolute',
        top: 70 + bobY,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: MONO,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 2.5,
        color: '#FFFFFF',
        opacity: pulseOp,
        pointerEvents: 'none',
        zIndex: 20,
        textShadow: '0 0 12px rgba(0, 255, 135, 0.4)',
      }}
    >
      neoeducation.vn
    </div>
  );
};
