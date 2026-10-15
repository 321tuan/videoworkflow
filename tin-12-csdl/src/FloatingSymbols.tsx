import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MONO } from './theme';

interface FloatingSymbolConfig {
  text: string;
  startX: number;
  startY: number;
  speedY: number;      // Tốc độ rơi/trôi chậm (px/frame)
  driftAmp: number;    // Biên độ đung đưa ngang (px)
  driftFreq: number;   // Tần số đung đưa
  phase: number;
  fontSize: number;
  color: string;
  baseOpacity: number;
  blur: number;        // Chiều sâu trường ảnh (Depth of field)
}

const SYMBOLS: FloatingSymbolConfig[] = [
  // Tầng sâu (Blur cao, chuyển động rất chậm, tạo background depth)
  { text: '{ }', startX: 80, startY: 100, speedY: 0.6, driftAmp: 18, driftFreq: 0.03, phase: 0.5, fontSize: 36, color: '#38BDF8', baseOpacity: 0.22, blur: 2.5 },
  { text: '0101', startX: 920, startY: 160, speedY: 0.8, driftAmp: 22, driftFreq: 0.025, phase: 1.2, fontSize: 28, color: '#10B981', baseOpacity: 0.20, blur: 2.0 },
  { text: '< >', startX: 180, startY: 420, speedY: 0.5, driftAmp: 15, driftFreq: 0.035, phase: 2.1, fontSize: 32, color: '#38BDF8', baseOpacity: 0.18, blur: 3.0 },
  { text: 'SELECT', startX: 860, startY: 540, speedY: 0.7, driftAmp: 25, driftFreq: 0.02, phase: 3.4, fontSize: 26, color: '#F59E0B', baseOpacity: 0.22, blur: 1.8 },
  { text: '[ ]', startX: 120, startY: 780, speedY: 0.65, driftAmp: 20, driftFreq: 0.03, phase: 0.8, fontSize: 38, color: '#38BDF8', baseOpacity: 0.20, blur: 2.2 },
  { text: '&&', startX: 940, startY: 880, speedY: 0.55, driftAmp: 16, driftFreq: 0.028, phase: 4.1, fontSize: 34, color: '#10B981', baseOpacity: 0.18, blur: 2.8 },
  { text: '1010', startX: 150, startY: 1180, speedY: 0.75, driftAmp: 22, driftFreq: 0.022, phase: 1.7, fontSize: 28, color: '#38BDF8', baseOpacity: 0.22, blur: 2.0 },
  { text: 'WHERE', startX: 890, startY: 1300, speedY: 0.6, driftAmp: 18, driftFreq: 0.032, phase: 2.9, fontSize: 26, color: '#F59E0B', baseOpacity: 0.20, blur: 2.4 },
  { text: '( )', startX: 90, startY: 1560, speedY: 0.5, driftAmp: 14, driftFreq: 0.025, phase: 3.8, fontSize: 40, color: '#38BDF8', baseOpacity: 0.18, blur: 2.6 },
  { text: '||', startX: 930, startY: 1680, speedY: 0.7, driftAmp: 20, driftFreq: 0.03, phase: 0.3, fontSize: 32, color: '#10B981', baseOpacity: 0.20, blur: 2.2 },

  // Tầng tiền cảnh (Rõ nét, chuyển động sinh động hơn, biểu tượng môn CSDL/SQL)
  { text: 'FK', startX: 300, startY: 260, speedY: 0.9, driftAmp: 28, driftFreq: 0.035, phase: 1.5, fontSize: 30, color: '#10B981', baseOpacity: 0.40, blur: 0 },
  { text: 'PK', startX: 740, startY: 340, speedY: 0.85, driftAmp: 24, driftFreq: 0.03, phase: 2.8, fontSize: 30, color: '#F59E0B', baseOpacity: 0.40, blur: 0 },
  { text: '1', startX: 60, startY: 620, speedY: 1.1, driftAmp: 15, driftFreq: 0.04, phase: 0.4, fontSize: 28, color: '#38BDF8', baseOpacity: 0.35, blur: 0 },
  { text: '0', startX: 980, startY: 720, speedY: 1.05, driftAmp: 18, driftFreq: 0.038, phase: 3.2, fontSize: 28, color: '#38BDF8', baseOpacity: 0.35, blur: 0 },
  { text: 'JOIN', startX: 240, startY: 960, speedY: 0.8, driftAmp: 26, driftFreq: 0.026, phase: 4.5, fontSize: 28, color: '#38BDF8', baseOpacity: 0.38, blur: 0 },
  { text: 'NOT NULL', startX: 780, startY: 1100, speedY: 0.75, driftAmp: 22, driftFreq: 0.024, phase: 1.1, fontSize: 24, color: '#F43F5E', baseOpacity: 0.38, blur: 0 },
  { text: '{ }', startX: 320, startY: 1440, speedY: 0.95, driftAmp: 25, driftFreq: 0.033, phase: 2.4, fontSize: 34, color: '#38BDF8', baseOpacity: 0.38, blur: 0 },
  { text: 'TABLE', startX: 760, startY: 1540, speedY: 0.8, driftAmp: 20, driftFreq: 0.029, phase: 0.7, fontSize: 26, color: '#10B981', baseOpacity: 0.38, blur: 0 },
];

export const FloatingSymbols: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {SYMBOLS.map((item, idx) => {
        // Vị trí rơi tuần hoàn từ đỉnh màn hình xuống đáy (loop 1920px + margin)
        const totalH = 2100;
        const currentY = ((item.startY + frame * item.speedY) % totalH) - 100;

        // Đung đưa ngang mềm mại
        const currentX = item.startX + Math.sin(frame * item.driftFreq + item.phase) * item.driftAmp;

        // Độ nghiêng lắc lư theo dòng trôi
        const rotate = Math.sin(frame * item.driftFreq * 0.8 + item.phase) * 12;

        // Nhịp thở mờ nhẹ nhàng
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.05 + item.phase);
        const opacity = item.baseOpacity * pulse;

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
              opacity,
              filter: item.blur > 0 ? `blur(${item.blur}px)` : `drop-shadow(0 0 10px ${item.color}55)`,
              letterSpacing: 2,
              userSelect: 'none',
            }}
          >
            {item.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
