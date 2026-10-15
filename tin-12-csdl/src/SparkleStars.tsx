import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

// Ngôi sao 4 cánh (4-point Sparkle Star SVG)
const SparkleStarSvg: React.FC<{ size: number; color: string; opacity: number; rotate: number }> = ({
  size,
  color,
  opacity,
  rotate,
}) => {
  const r = size / 2;
  // Đường cong bezier tạo 4 cánh sao nhọn thanh thoát
  const pathData = `M 0 ${-r} Q 0 0 ${r} 0 Q 0 0 0 ${r} Q 0 0 ${-r} 0 Q 0 0 0 ${-r} Z`;

  return (
    <svg
      width={size * 1.6}
      height={size * 1.6}
      viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`}
      style={{
        overflow: 'visible',
        transform: `rotate(${rotate}deg)`,
        filter: `drop-shadow(0 0 ${size * 0.4}px ${color})`,
      }}
    >
      <path d={pathData} fill={color} fillOpacity={opacity} />
      {/* Vòng hào quang sáng ở tâm */}
      <circle cx={0} cy={0} r={r * 0.25} fill="#FFFFFF" fillOpacity={opacity * 0.9} />
    </svg>
  );
};

interface StarConfig {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  baseRotate: number;
}

// 22 ngôi sao 4 cánh được định vị hài hòa tạo chiều sâu vũ trụ công nghệ
const STARS: StarConfig[] = [
  { x: 120, y: 180, size: 24, color: '#38BDF8', speed: 0.08, phase: 0.2, baseRotate: 12 },
  { x: 340, y: 120, size: 16, color: '#FDE68A', speed: 0.06, phase: 1.1, baseRotate: 45 },
  { x: 880, y: 220, size: 28, color: '#FFFFFF', speed: 0.09, phase: 2.3, baseRotate: 0 },
  { x: 960, y: 380, size: 18, color: '#38BDF8', speed: 0.07, phase: 0.8, baseRotate: 30 },
  { x: 80, y: 520, size: 20, color: '#A7F3D0', speed: 0.05, phase: 3.4, baseRotate: 15 },
  { x: 260, y: 440, size: 14, color: '#FDE68A', speed: 0.08, phase: 4.1, baseRotate: 60 },
  { x: 920, y: 680, size: 26, color: '#38BDF8', speed: 0.07, phase: 1.7, baseRotate: 10 },
  { x: 140, y: 880, size: 18, color: '#FFFFFF', speed: 0.06, phase: 2.9, baseRotate: 25 },
  { x: 1000, y: 920, size: 22, color: '#FDE68A', speed: 0.08, phase: 0.5, baseRotate: 40 },
  { x: 70, y: 1140, size: 16, color: '#38BDF8', speed: 0.07, phase: 3.8, baseRotate: 5 },
  { x: 240, y: 1280, size: 22, color: '#FFFFFF', speed: 0.09, phase: 1.4, baseRotate: 50 },
  { x: 950, y: 1240, size: 24, color: '#A7F3D0', speed: 0.06, phase: 4.7, baseRotate: 20 },
  { x: 860, y: 1420, size: 16, color: '#FDE68A', speed: 0.08, phase: 2.1, baseRotate: 35 },
  { x: 110, y: 1540, size: 26, color: '#38BDF8', speed: 0.07, phase: 0.9, baseRotate: 15 },
  { x: 300, y: 1680, size: 18, color: '#FFFFFF', speed: 0.05, phase: 3.2, baseRotate: 45 },
  { x: 920, y: 1720, size: 28, color: '#38BDF8', speed: 0.09, phase: 1.8, baseRotate: 0 },
  { x: 500, y: 260, size: 14, color: '#FFFFFF', speed: 0.06, phase: 2.7, baseRotate: 20 },
  { x: 580, y: 780, size: 16, color: '#FDE68A', speed: 0.07, phase: 4.3, baseRotate: 55 },
  { x: 520, y: 1360, size: 15, color: '#38BDF8', speed: 0.08, phase: 0.4, baseRotate: 12 },
  { x: 620, y: 1620, size: 14, color: '#A7F3D0', speed: 0.06, phase: 3.6, baseRotate: 30 },
  { x: 180, y: 340, size: 15, color: '#38BDF8', speed: 0.07, phase: 2.0, baseRotate: 18 },
  { x: 820, y: 1100, size: 17, color: '#FFFFFF', speed: 0.08, phase: 1.2, baseRotate: 42 },
];

export const SparkleStars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {STARS.map((star, idx) => {
        // Nhịp thở mềm mại: scale và opacity co giãn theo hình sin
        const t = frame * star.speed + star.phase;
        const breath = 0.5 + 0.5 * Math.sin(t);
        const scale = 0.4 + 0.6 * breath;
        const opacity = 0.25 + 0.75 * Math.pow(breath, 1.4);
        const rotate = star.baseRotate + Math.sin(t * 0.5) * 15;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <SparkleStarSvg
              size={star.size}
              color={star.color}
              opacity={opacity}
              rotate={rotate}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
