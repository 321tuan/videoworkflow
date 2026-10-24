import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MONO } from './theme';

interface FloatingSymbolConfig {
  text: string;
  startX: number;
  startY: number;
  speedY: number;      // Toc do roi/troi cham
  driftAmp: number;    // Bien do dung dua ngang
  driftFreq: number;   // Tan so dung dua
  phase: number;
  fontSize: number;
  color: string;
  baseOpacity: number;
  blur: number;
}

// Chi dat o 2 BIEN LE NGOAI (X < 120 hoac X > 960) de khong bao gio de len the noi dung o giua (Quy tac 43)
const SYMBOLS: FloatingSymbolConfig[] = [
  // Bien trai (X: 30 - 110)
  { text: '<html>', startX: 60, startY: 150, speedY: 0.55, driftAmp: 14, driftFreq: 0.03, phase: 0.5, fontSize: 24, color: '#FF3366', baseOpacity: 0.14, blur: 1.5 },
  { text: '<h1>', startX: 80, startY: 480, speedY: 0.5, driftAmp: 12, driftFreq: 0.035, phase: 1.8, fontSize: 26, color: '#F97316', baseOpacity: 0.13, blur: 1.2 },
  { text: '<p>', startX: 50, startY: 820, speedY: 0.6, driftAmp: 16, driftFreq: 0.028, phase: 2.7, fontSize: 24, color: '#F59E0B', baseOpacity: 0.14, blur: 1.5 },
  { text: '<head>', startX: 70, startY: 1180, speedY: 0.52, driftAmp: 14, driftFreq: 0.032, phase: 0.8, fontSize: 24, color: '#38BDF8', baseOpacity: 0.12, blur: 1.8 },
  { text: '<body>', startX: 60, startY: 1520, speedY: 0.58, driftAmp: 15, driftFreq: 0.025, phase: 3.5, fontSize: 24, color: '#10B981', baseOpacity: 0.14, blur: 1.4 },

  // Bien phai (X: 960 - 1040)
  { text: '</html>', startX: 990, startY: 220, speedY: 0.62, driftAmp: 15, driftFreq: 0.026, phase: 1.2, fontSize: 24, color: '#FF3366', baseOpacity: 0.13, blur: 1.6 },
  { text: '<h6>', startX: 980, startY: 550, speedY: 0.55, driftAmp: 14, driftFreq: 0.034, phase: 4.1, fontSize: 24, color: '#F97316', baseOpacity: 0.14, blur: 1.4 },
  { text: '<br>', startX: 1000, startY: 890, speedY: 0.58, driftAmp: 16, driftFreq: 0.03, phase: 2.2, fontSize: 26, color: '#38BDF8', baseOpacity: 0.15, blur: 1.2 },
  { text: '</title>', startX: 970, startY: 1240, speedY: 0.5, driftAmp: 14, driftFreq: 0.028, phase: 3.1, fontSize: 24, color: '#F59E0B', baseOpacity: 0.13, blur: 1.5 },
  { text: '</div>', startX: 990, startY: 1600, speedY: 0.65, driftAmp: 15, driftFreq: 0.032, phase: 0.4, fontSize: 24, color: '#FF3366', baseOpacity: 0.12, blur: 1.8 },
];

export const FloatingSymbols: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {SYMBOLS.map((item, idx) => {
        const totalH = 2100;
        const currentY = ((item.startY + frame * item.speedY) % totalH) - 100;
        const currentX = item.startX + Math.sin(frame * item.driftFreq + item.phase) * item.driftAmp;
        const rotate = Math.sin(frame * item.driftFreq * 0.8 + item.phase) * 10;
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.04 + item.phase);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: currentX,
              top: currentY,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              fontFamily: MONO,
              fontSize: item.fontSize,
              fontWeight: 700,
              color: item.color,
              opacity: item.baseOpacity * pulse,
              filter: item.blur > 0 ? `blur(${item.blur}px)` : 'none',
              pointerEvents: 'none',
              letterSpacing: 1,
            }}
          >
            {item.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
