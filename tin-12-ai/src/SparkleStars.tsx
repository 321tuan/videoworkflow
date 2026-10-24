import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// Nguoi sao 4 canh (4-point Sparkle Star SVG)
const SparkleStarSvg: React.FC<{ size: number; color: string; opacity: number; rotate: number }> = ({
  size,
  color,
  opacity,
  rotate,
}) => {
  const r = size / 2;
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

const STARS: StarConfig[] = [
  { x: 120, y: 180, size: 24, color: '#00FF87', speed: 0.08, phase: 0.2, baseRotate: 12 },
  { x: 340, y: 120, size: 16, color: '#FBBF24', speed: 0.06, phase: 1.1, baseRotate: 45 },
  { x: 880, y: 220, size: 28, color: '#A855F7', speed: 0.09, phase: 2.3, baseRotate: 0 },
  { x: 960, y: 380, size: 18, color: '#38BDF8', speed: 0.07, phase: 0.8, baseRotate: 30 },
  { x: 80, y: 520, size: 20, color: '#00FF87', speed: 0.05, phase: 3.4, baseRotate: 15 },
  { x: 260, y: 440, size: 14, color: '#FBBF24', speed: 0.08, phase: 4.1, baseRotate: 60 },
  { x: 920, y: 680, size: 26, color: '#A855F7', speed: 0.07, phase: 1.7, baseRotate: 10 },
  { x: 140, y: 880, size: 18, color: '#00FF87', speed: 0.06, phase: 2.9, baseRotate: 25 },
  { x: 1000, y: 920, size: 22, color: '#FBBF24', speed: 0.08, phase: 0.5, baseRotate: 40 },
  { x: 70, y: 1140, size: 16, color: '#38BDF8', speed: 0.07, phase: 3.8, baseRotate: 5 },
  { x: 240, y: 1280, size: 22, color: '#FFFFFF', speed: 0.09, phase: 1.4, baseRotate: 50 },
  { x: 950, y: 1240, size: 24, color: '#00FF87', speed: 0.06, phase: 4.7, baseRotate: 20 },
  { x: 860, y: 1420, size: 16, color: '#A855F7', speed: 0.08, phase: 2.1, baseRotate: 35 },
  { x: 110, y: 1540, size: 26, color: '#38BDF8', speed: 0.07, phase: 0.9, baseRotate: 15 },
  { x: 300, y: 1680, size: 18, color: '#FBBF24', speed: 0.05, phase: 3.2, baseRotate: 45 },
  { x: 920, y: 1720, size: 28, color: '#00FF87', speed: 0.09, phase: 1.8, baseRotate: 0 },
];

export const SparkleStars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {STARS.map((star, idx) => {
        const pulse = 0.5 + 0.5 * Math.sin(frame * star.speed + star.phase);
        const scale = 0.75 + 0.35 * pulse;
        const opacity = 0.3 + 0.6 * pulse;
        const rotate = star.baseRotate + Math.sin(frame * 0.02 + star.phase) * 15;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <SparkleStarSvg size={star.size} color={star.color} opacity={opacity} rotate={rotate} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
