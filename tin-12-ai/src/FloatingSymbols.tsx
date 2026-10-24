import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MONO } from './theme';

interface FloatingSymbolConfig {
  text: string;
  startX: number;
  startY: number;
  speedY: number;      // Toc do roi/troi cham (px/frame)
  driftAmp: number;    // Bien do dung dua ngang (px)
  driftFreq: number;   // Tan so dung dua
  phase: number;
  fontSize: number;
  color: string;
  baseOpacity: number;
  blur: number;        // Chieu sau truong anh (Depth of field)
}

const SYMBOLS: FloatingSymbolConfig[] = [
  // Tang sau (Depth blur cao, troi rat cham)
  { text: 'W·x + b', startX: 100, startY: 120, speedY: 0.55, driftAmp: 18, driftFreq: 0.03, phase: 0.5, fontSize: 32, color: '#00FF87', baseOpacity: 0.22, blur: 2.2 },
  { text: '0101', startX: 920, startY: 180, speedY: 0.75, driftAmp: 22, driftFreq: 0.025, phase: 1.2, fontSize: 28, color: '#38BDF8', baseOpacity: 0.20, blur: 2.0 },
  { text: 'f(x)', startX: 160, startY: 460, speedY: 0.5, driftAmp: 15, driftFreq: 0.035, phase: 2.1, fontSize: 34, color: '#A855F7', baseOpacity: 0.20, blur: 2.5 },
  { text: 'Loss', startX: 860, startY: 520, speedY: 0.65, driftAmp: 20, driftFreq: 0.028, phase: 3.4, fontSize: 26, color: '#FBBF24', baseOpacity: 0.22, blur: 1.8 },
  { text: 'GPT', startX: 140, startY: 820, speedY: 0.6, driftAmp: 24, driftFreq: 0.026, phase: 0.8, fontSize: 30, color: '#00FF87', baseOpacity: 0.20, blur: 2.0 },
  { text: 'ReLU', startX: 930, startY: 900, speedY: 0.55, driftAmp: 16, driftFreq: 0.03, phase: 4.1, fontSize: 28, color: '#38BDF8', baseOpacity: 0.18, blur: 2.6 },
  { text: '1010', startX: 120, startY: 1200, speedY: 0.7, driftAmp: 22, driftFreq: 0.022, phase: 1.7, fontSize: 28, color: '#00FF87', baseOpacity: 0.22, blur: 2.0 },
  { text: 'Turing', startX: 890, startY: 1320, speedY: 0.6, driftAmp: 18, driftFreq: 0.032, phase: 2.9, fontSize: 26, color: '#A855F7', baseOpacity: 0.20, blur: 2.4 },
  { text: 'ANI', startX: 90, startY: 1580, speedY: 0.5, driftAmp: 14, driftFreq: 0.025, phase: 3.8, fontSize: 32, color: '#38BDF8', baseOpacity: 0.18, blur: 2.6 },
  { text: 'AGI', startX: 940, startY: 1690, speedY: 0.7, driftAmp: 20, driftFreq: 0.03, phase: 0.3, fontSize: 32, color: '#A855F7', baseOpacity: 0.20, blur: 2.2 },

  // Tang tien canh (Ro net, bieu tuong mon AI & Khoa hoc may tinh)
  { text: 'AI', startX: 300, startY: 280, speedY: 0.9, driftAmp: 26, driftFreq: 0.035, phase: 1.5, fontSize: 32, color: '#00FF87', baseOpacity: 0.42, blur: 0 },
  { text: 'Prompt', startX: 740, startY: 360, speedY: 0.85, driftAmp: 22, driftFreq: 0.03, phase: 2.8, fontSize: 28, color: '#FBBF24', baseOpacity: 0.40, blur: 0 },
  { text: '1', startX: 70, startY: 640, speedY: 1.1, driftAmp: 14, driftFreq: 0.04, phase: 0.4, fontSize: 28, color: '#00FF87', baseOpacity: 0.35, blur: 0 },
  { text: '0', startX: 980, startY: 740, speedY: 1.05, driftAmp: 18, driftFreq: 0.038, phase: 3.2, fontSize: 28, color: '#38BDF8', baseOpacity: 0.35, blur: 0 },
  { text: 'Data', startX: 250, startY: 980, speedY: 0.8, driftAmp: 25, driftFreq: 0.026, phase: 4.5, fontSize: 28, color: '#38BDF8', baseOpacity: 0.38, blur: 0 },
  { text: 'CNN', startX: 790, startY: 1120, speedY: 0.75, driftAmp: 22, driftFreq: 0.024, phase: 1.1, fontSize: 26, color: '#A855F7', baseOpacity: 0.38, blur: 0 },
  { text: '{ }', startX: 320, startY: 1460, speedY: 0.95, driftAmp: 24, driftFreq: 0.033, phase: 2.4, fontSize: 34, color: '#00FF87', baseOpacity: 0.38, blur: 0 },
  { text: 'Epoch', startX: 760, startY: 1560, speedY: 0.8, driftAmp: 20, driftFreq: 0.029, phase: 0.7, fontSize: 26, color: '#FBBF24', baseOpacity: 0.38, blur: 0 },
];

export const FloatingSymbols: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {SYMBOLS.map((item, idx) => {
        const totalH = 2100;
        const currentY = ((item.startY + frame * item.speedY) % totalH) - 100;
        const currentX = item.startX + Math.sin(frame * item.driftFreq + item.phase) * item.driftAmp;
        const rotate = Math.sin(frame * item.driftFreq * 0.8 + item.phase) * 12;
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.05 + item.phase);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: currentX,
              top: currentY,
              transform: `rotate(${rotate}deg)`,
              fontFamily: MONO,
              fontSize: item.fontSize,
              fontWeight: 700,
              color: item.color,
              opacity: item.baseOpacity * pulse,
              filter: item.blur > 0 ? `blur(${item.blur}px)` : `drop-shadow(0 0 10px ${item.color}88)`,
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {item.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
