import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { OUTRO_HOLD, SC, SCENES, TOTAL_FRAMES } from './data';
import { bgmVolumeAt } from './bgm';
import { CyberHexagonGrid, FloatingWatermark } from './decor';
import { SparkleStars } from './SparkleStars';
import { FloatingSymbols } from './FloatingSymbols';

import { HookScene } from './scenes/HookScene';
import { EmpathyScene } from './scenes/EmpathyScene';
import { Value1Scene } from './scenes/Value1Scene';
import { Value2Scene } from './scenes/Value2Scene';
import { Value3Scene } from './scenes/Value3Scene';
import { PitchCtaScene } from './scenes/PitchCtaScene';
import { OutroScene } from './scenes/OutroScene';

const StaticOutroTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, 14, durationInFrames - 10, durationInFrames],
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

// Chuyen canh Dissolve / Fade em diu, khong luot ngang, khong canh cut
const DissolveFadeTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ children, durationInFrames, isFirst = false, isLast = false }) => {
  const f = useCurrentFrame();
  const FADE = 12; // ~0.4s dissolve / fade nhe nhang

  const enterOp = isFirst
    ? 1
    : interpolate(f, [0, FADE], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const exitStart = Math.max(0, durationInFrames - FADE);
  const exitOp = isLast
    ? 1
    : interpolate(f, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: Math.min(enterOp, exitOp),
      }}
    >
      {children}
    </div>
  );
};

export const NeoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Tinh frame bat dau cho tung scene
  let curFrame = 0;
  const sceneOffsets: Record<string, number> = {};
  for (const k of SCENES) {
    sceneOffsets[k] = curFrame;
    curFrame += SC[k];
  }

  // An watermark o doan outro logo cuoi cung
  const hideWatermark = frame >= TOTAL_FRAMES - OUTRO_HOLD;

  return (
    <AbsoluteFill style={{ backgroundColor: '#040711' }}>
      {/* 1. NEN HE THONG */}
      <CyberHexagonGrid />
      <SparkleStars />
      <FloatingSymbols />

      {/* 2. NHAC NEN (WALLPAPER - KEVIN MACLEOD) */}
      <Audio
        src={staticFile('bgm/nen.wav')}
        volume={(f) => bgmVolumeAt(f)}
      />

      {/* 3. WATERMARK MO TROI NHE */}
      <FloatingWatermark hide={hideWatermark} />

      {/* 4. CHUOI SCENES (DISSOLVE / FADE TRANSITION) */}
      <Sequence from={sceneOffsets.s01_hook} durationInFrames={SC.s01_hook}>
        <DissolveFadeTransition durationInFrames={SC.s01_hook} isFirst>
          <HookScene />
        </DissolveFadeTransition>
      </Sequence>

      <Sequence from={sceneOffsets.s02_empathy} durationInFrames={SC.s02_empathy}>
        <DissolveFadeTransition durationInFrames={SC.s02_empathy}>
          <EmpathyScene />
        </DissolveFadeTransition>
      </Sequence>

      <Sequence from={sceneOffsets.s03_value1} durationInFrames={SC.s03_value1}>
        <DissolveFadeTransition durationInFrames={SC.s03_value1}>
          <Value1Scene />
        </DissolveFadeTransition>
      </Sequence>

      <Sequence from={sceneOffsets.s04_value2} durationInFrames={SC.s04_value2}>
        <DissolveFadeTransition durationInFrames={SC.s04_value2}>
          <Value2Scene />
        </DissolveFadeTransition>
      </Sequence>

      <Sequence from={sceneOffsets.s05_value3} durationInFrames={SC.s05_value3}>
        <DissolveFadeTransition durationInFrames={SC.s05_value3}>
          <Value3Scene />
        </DissolveFadeTransition>
      </Sequence>

      <Sequence from={sceneOffsets.s06_pitch_cta} durationInFrames={SC.s06_pitch_cta}>
        <DissolveFadeTransition durationInFrames={SC.s06_pitch_cta}>
          <PitchCtaScene />
        </DissolveFadeTransition>
      </Sequence>

      {/* 5. OUTRO LOGO NEO EDUCATION — TĨNH TẠI CHỖ, MỜ DẦN ÊM ÁI */}
      <Sequence
        from={sceneOffsets.s06_pitch_cta + SC.s06_pitch_cta - 14}
        durationInFrames={OUTRO_HOLD + 14}
      >
        <StaticOutroTransition durationInFrames={OUTRO_HOLD + 14}>
          <OutroScene />
        </StaticOutroTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
