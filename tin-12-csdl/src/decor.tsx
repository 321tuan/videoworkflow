import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from './theme';

// =====================================================================
// 1. NỀN LƯỚI BẢN VẼ DỮ LIỆU KỸ THUẬT (RDBMS Technical Blueprint Grid)
// Thiết kế hoàn toàn mới: Lưới trục tọa độ kép + Dấu chữ thập giao điểm +
// Tia quét dữ liệu ngang siêu êm ái. Không dùng quả cầu Lissajous cũ!
// =====================================================================
export const TechBlueprintGrid: React.FC = () => {
  const frame = useCurrentFrame();

  // Tia quét dòng dữ liệu ngang (Data Scanline) trôi nhẹ từ trên xuống dưới
  const scanY = (frame * 3.5) % 2100 - 100;

  // Nhịp thở mờ nhẹ của các điểm giao
  const crossPulse = 0.35 + 0.12 * Math.sin((frame * Math.PI * 2) / 120);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Lưới SVG: Trục chính 120px, Trục phụ 30px, Crosshairs tại giao điểm */}
      <svg width={1080} height={1920} style={{ opacity: 0.38 }}>
        <defs>
          {/* Lưới phụ 30px */}
          <pattern id="minorGrid" width={30} height={30} patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#0284c7"
              strokeWidth={0.8}
              strokeOpacity={0.06}
            />
          </pattern>

          {/* Lưới chính 120px */}
          <pattern id="majorGrid" width={120} height={120} patternUnits="userSpaceOnUse">
            <rect width={120} height={120} fill="url(#minorGrid)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeOpacity={0.16}
            />
            {/* Crosshair "+" tại giao điểm */}
            <path
              d="M -7 0 L 7 0 M 0 -7 L 0 7"
              stroke="#38bdf8"
              strokeWidth={1.4}
              strokeOpacity={crossPulse}
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#majorGrid)" />

        {/* Các ký hiệu tọa độ dữ liệu kỹ thuật mờ ở viền */}
        <g fontFamily={MONO} fontSize={14} fill="#38bdf8" fillOpacity={0.18}>
          <text x={30} y={60}>[0x00_SCHEMA]</text>
          <text x={30} y={480}>[0x1A_TABLE_STUDENT]</text>
          <text x={30} y={960}>[0x2B_RELATION_1_N]</text>
          <text x={30} y={1440}>[0x3C_INDEX_PRIMARY]</text>
          <text x={30} y={1860}>[0x4D_FOREIGN_KEY]</text>

          <text x={920} y={60} textAnchor="end">[SYS.RDBMS_2K9]</text>
          <text x={920} y={480} textAnchor="end">[KEY_INTEGRITY]</text>
          <text x={920} y={960} textAnchor="end">[QUERY_EXEC_PLAN]</text>
          <text x={920} y={1440} textAnchor="end">[COMMIT_TRANSACTION]</text>
          <text x={920} y={1860} textAnchor="end">[OPTIMIZED_SPEED]</text>
        </g>
      </svg>

      {/* Tia quét dữ liệu ngang (Horizontal Data Scanline) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 3,
          background:
            'linear-gradient(90deg, transparent 5%, rgba(56, 189, 248, 0.45) 50%, transparent 95%)',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)',
        }}
      />

      {/* Vignette xuyên tâm sâu: Làm chìm 4 góc, giữ khu vực giữa tối sáng tương phản cao */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(950px 950px at 50% 45%, transparent 20%, ${C.bg0} 85%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// =====================================================================
// 2. HIỆU ỨNG CÁNH CỤT KÉO LẬT TRANG GIẤY 3D (Penguin Page Turn Assistant)
// Chú cánh cụt mascot đeo kính, đeo balo bay vút từ phải sang trái,
// quặp kéo mép trang giấy lật qua để lộ trang mới, kèm dải sáng nếp gấp
// và vệt sao vàng lấp lánh, mô phỏng chuẩn xác việc lật trang đề thi!
// =====================================================================
// 2. HIỆU ỨNG CÁNH CỤT LƯỚT CHUYỂN CẢNH (Penguin Transition Glide)
// Chú cánh cụt mascot vút bay lướt qua màn hình nhẹ nhàng, tinh tế,
// KHÔNG CÓ thanh vệt xanh chéo làm phiền mắt người xem!
// =====================================================================
export const PenguinPageTurn: React.FC<{
  progress: number; // 0 -> 1 trong suốt thời gian chuyển cảnh
}> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;

  // Quỹ đạo bay lướt mượt mà theo nhịp cuộn trang (từ Phải sang Trái):
  const smoothP = 0.5 - 0.5 * Math.cos(progress * Math.PI);
  const x = interpolate(smoothP, [0, 1], [1100, -320]);
  const y = 940 + Math.sin(progress * Math.PI) * -180;

  // Góc nghiêng lướt bay nhẹ nhàng
  const rotate = interpolate(progress, [0, 0.5, 1], [14, -2, -18]);
  const scale = interpolate(progress, [0, 0.5, 1], [0.9, 1.1, 0.95]);

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
      {/* Chú cánh cụt vút bay lướt qua sạch sẽ, gọn gàng */}
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
// 3. TAG BADGE TIÊU ĐỀ
// =====================================================================
export const Tag: React.FC<{
  children: React.ReactNode;
  accent?: string;
  bg?: string;
}> = ({ children, accent = C.sqlBlue, bg = 'rgba(56, 189, 248, 0.12)' }) => (
  <div
    style={{
      display: 'inline-block',
      border: `2px solid ${accent}`,
      color: accent,
      padding: '12px 28px',
      borderRadius: 999,
      fontSize: 26,
      letterSpacing: 2,
      fontWeight: 800,
      fontFamily: FONT,
      background: bg,
      backdropFilter: 'blur(8px)',
      boxShadow: `0 0 24px ${accent}33`,
    }}
  >
    {children}
  </div>
);

// Alias cho tương thích ngược
export const MatrixGrid = TechBlueprintGrid;
export const BgFx: React.FC = () => null; // Loại bỏ BgFx cũ
