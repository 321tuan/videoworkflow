import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { OUTRO_HOLD, SC, SCENES, SCENES_FRAMES, TOTAL_FRAMES } from './data';
import { bgmVolumeAt } from './bgm';
import { HtmlCodeGrid, SparkleStars } from './decor';
import { FloatingSymbols } from './FloatingSymbols';
import { C, DISSOLVE_FRAMES } from './theme';

import { HookScene } from './scenes/HookScene';
import { EmpathyScene } from './scenes/EmpathyScene';
import { Value1Scene } from './scenes/Value1Scene';
import { Value2Scene } from './scenes/Value2Scene';
import { PitchCtaScene } from './scenes/PitchCtaScene';
import { GreetingScene } from './scenes/GreetingScene';
import { OutroScene } from './scenes/OutroScene';

const MAP = {
  s01_hook: HookScene,
  s02_empathy: EmpathyScene,
  s03_value1: Value1Scene,
  s04_value2: Value2Scene,
  s05_pitch_cta: PitchCtaScene,
  s06_greeting: GreetingScene,
} as const;

// Transition Tĩnh cho Outro (Logo Neo Education — Quy tắc Phần II, Mục 5)
// Để yên tĩnh tại chỗ và chỉ mờ dần êm ái, tuyệt đối không cuộn lướt hay xoay vặn
const StaticOutroTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, 14, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// WATERMARK NEOEDUCATION.VN DƯỚI CHÂN & THANH TIẾN TRÌNH VIDEO
// Giữ nguyên thương hiệu xuyên suốt video, đặt an toàn dưới chân màn hình (bottom)
const WatermarkAndProgress: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= SCENES_FRAMES) return null; // Ẩn khi đến Outro Logo

  const progress = Math.min(1, frame / SCENES_FRAMES);
  const floatY = Math.sin((frame * Math.PI * 2) / 80) * 4;
  const breathe = 0.45 + 0.15 * (0.5 + 0.5 * Math.sin((frame * Math.PI * 2) / 100));

  return (
    <>
      {/* Watermark dưới chân: neoeducation.vn */}
      <div
        style={{
          position: 'absolute',
          bottom: 86 + floatY,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: C.fontMono || 'monospace',
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 4,
          color: `rgba(226, 232, 240, ${breathe.toFixed(3)})`,
          textShadow: '0 2px 12px rgba(0,0,0,0.85)',
          zIndex: 45,
          pointerEvents: 'none',
        }}
      >
        neoeducation.vn
      </div>

      {/* Thanh tiến trình dưới chân màn hình */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 80,
          right: 80,
          height: 6,
          background: 'rgba(255, 255, 255, 0.14)',
          borderRadius: 3,
          overflow: 'hidden',
          zIndex: 45,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF3366, #F59E0B)',
            borderRadius: 3,
            boxShadow: '0 0 10px rgba(255, 51, 102, 0.8)',
          }}
        />
      </div>
    </>
  );
};

export const NeoVideo: React.FC = () => {
  let t = 0;
  const seqs = SCENES.map((k) => {
    const from = t;
    t += SC[k];
    const Comp = MAP[k];
    return (
      <Sequence key={k} from={from} durationInFrames={SC[k]}>
        <Comp />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      {/* 1. Nhạc nền: nen.wav qua bộ lọc biquad, chuẩn hóa RMS -32dBFS, tự động ducking */}
      <Audio src={staticFile('bgm/nen.wav')} volume={(f) => bgmVolumeAt(f)} />

      {/* 2. Lớp nền trực quan động theo chủ đề HTML & Rose Coral 20/10 */}
      <HtmlCodeGrid />
      <SparkleStars />
      <FloatingSymbols />

      {/* 3. Chuỗi các phân đoạn (Hook -> Empathy -> Value 1 -> Value 2 -> Pitch/CTA -> Greeting 20/10) */}
      {seqs}

      {/* 4. Đoạn kết Outro: Logo Neo Education tĩnh bo góc với viền hoa văn 20/10 */}
      <Sequence from={t} durationInFrames={OUTRO_HOLD}>
        <StaticOutroTransition durationInFrames={OUTRO_HOLD}>
          <OutroScene />
        </StaticOutroTransition>
      </Sequence>

      {/* 5. Watermark neoeducation.vn dưới chân + Thanh tiến trình */}
      <WatermarkAndProgress />
    </AbsoluteFill>
  );
};
