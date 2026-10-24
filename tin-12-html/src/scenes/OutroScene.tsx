import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { NEO_URL } from '../data';

// SVG Bông hoa nở rộ trang trí viền (Blooming Flower Vector SVG)
const CornerFlower: React.FC<{ size?: number; rot?: number }> = ({ size = 68, rot = 0 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rot}deg)`,
        filter: 'drop-shadow(0 4px 10px rgba(244, 63, 94, 0.45))',
      }}
    >
      <svg width={size} height={size} viewBox="-30 -30 60 60">
        {/* Lớp lá xanh ngọc kim loại */}
        <path d="M 0,0 C 15,-20 25,-10 20,5 C 15,15 0,0 0,0 Z" fill="#10B981" fillOpacity={0.8} />
        <path d="M 0,0 C -20,15 -10,25 5,20 C 15,15 0,0 0,0 Z" fill="#059669" fillOpacity={0.8} />
        {/* Lớp cánh hoa ngoài (Rose Pink) */}
        <circle cx="0" cy="-14" r="9" fill="#FB7185" />
        <circle cx="14" cy="0" r="9" fill="#F43F5E" />
        <circle cx="0" cy="14" r="9" fill="#E11D48" />
        <circle cx="-14" cy="0" r="9" fill="#FB7185" />
        <circle cx="10" cy="-10" r="8" fill="#FDA4AF" />
        <circle cx="10" cy="10" r="8" fill="#F43F5E" />
        <circle cx="-10" cy="10" r="8" fill="#E11D48" />
        <circle cx="-10" cy="-10" r="8" fill="#FDA4AF" />
        {/* Lớp cánh hoa trong (Crimson) */}
        <circle cx="0" cy="0" r="11" fill="#9F1239" />
        <circle cx="0" cy="0" r="7" fill="#FDE047" />
        <circle cx="0" cy="0" r="3.5" fill="#D97706" />
      </svg>
    </div>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hiệu ứng lò xo êm ái khi xuất hiện
  const s = spring({ frame: frame - 4, fps, config: { damping: 16 } });

  // Nhịp thở phát sáng lung linh của viền hoa 20/10
  const breathe = Math.sin((frame * Math.PI * 2) / 45);
  const glow = interpolate(frame, [0, 45, 90], [0.5, 1, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05070E',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
      }}
    >
      {/* KHUNG THẺ LOGO NEO CÓ VIỀN HOA HỌA TIẾT 20/10 CHÂU CHUỐT */}
      <div
        style={{
          position: 'relative',
          width: 840,
          opacity: s,
          transform: `scale(${0.92 + s * 0.08})`,
        }}
      >
        {/* VIỀN HOA VECTOR SVG QUANH KHUNG LOGO */}
        <div
          style={{
            position: 'absolute',
            inset: -22,
            borderRadius: 44,
            border: '2.5px solid rgba(251, 113, 133, 0.5)',
            boxShadow: `0 0 ${40 + glow * 50}px rgba(255, 51, 102, 0.35), inset 0 0 30px rgba(251, 113, 133, 0.2)`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* HỌA TIẾT HOA 4 GÓC & 4 CẠNH */}
          <div style={{ position: 'absolute', top: -34, left: -34 }}>
            <CornerFlower size={78} rot={frame * 0.5} />
          </div>
          <div style={{ position: 'absolute', top: -34, right: -34 }}>
            <CornerFlower size={78} rot={-frame * 0.5} />
          </div>
          <div style={{ position: 'absolute', bottom: -34, left: -34 }}>
            <CornerFlower size={78} rot={-frame * 0.5 + 90} />
          </div>
          <div style={{ position: 'absolute', bottom: -34, right: -34 }}>
            <CornerFlower size={78} rot={frame * 0.5 - 90} />
          </div>

          {/* Cụm hoa nhí và chồi lá điểm xuyết ở giữa các cạnh */}
          <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }}>
            <CornerFlower size={52} rot={breathe * 15} />
          </div>
          <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)' }}>
            <CornerFlower size={52} rot={-breathe * 15} />
          </div>
          <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)' }}>
            <CornerFlower size={52} rot={breathe * 15 + 45} />
          </div>
          <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }}>
            <CornerFlower size={52} rot={-breathe * 15 - 45} />
          </div>
        </div>

        {/* KHUNG TRẮNG BÓNG BẨY CHỨA LOGO NEO */}
        <div
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
            borderRadius: 36,
            padding: 32,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            position: 'relative',
            zIndex: 5,
          }}
        >
          <Img
            src={staticFile('img/img-3.png')}
            style={{
              width: '100%',
              borderRadius: 22,
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* DÒNG WEBSITE NEO CHUẨN NHẬN DIỆN THƯƠNG HIỆU */}
      <div
        style={{
          marginTop: 46,
          fontFamily: MONO,
          fontSize: 50,
          fontWeight: 800,
          color: '#38BDF8',
          opacity: s,
          letterSpacing: 2.5,
          textShadow: '0 0 28px rgba(56, 189, 248, 0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span>🌐</span>
        <span>{NEO_URL}</span>
      </div>

      {/* TAG CHÚC MỪNG 20/10 TINH TẾ */}
      <div
        style={{
          marginTop: 20,
          opacity: s,
          background: 'rgba(255, 51, 102, 0.15)',
          border: '1.5px solid rgba(251, 113, 133, 0.5)',
          borderRadius: 24,
          padding: '12px 28px',
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 800,
          color: '#FDA4AF',
          letterSpacing: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
      >
        <span>🌺</span>
        <span>CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10</span>
        <span>🌺</span>
      </div>
    </AbsoluteFill>
  );
};
