import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { ValueScene } from './scenes/ValueScene';
import { OutroScene } from './scenes/OutroScene';
import { TikTokOverlay } from './components/TikTokOverlay';

interface Props {
  showOverlay?: boolean;
}

export const MainVideo: React.FC<Props> = ({ showOverlay = false }) => {
  return (
    <AbsoluteFill style={{ background: '#0A0E1A' }}>
      {/* SCENE 1: HOOK & ĐOẠN CODE (3s = 90 frames) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>

      {/* SCENE 2: GIẢI THÍCH BẢN CHẤT & SO SÁNH 2 CARD (3s = 90 frames) */}
      <Sequence from={90} durationInFrames={90}>
        <ValueScene />
      </Sequence>

      {/* SCENE 3: OUTRO NHẬN DIỆN THƯƠNG HIỆU NEO (2s = 60 frames) */}
      <Sequence from={180} durationInFrames={60}>
        <OutroScene />
      </Sequence>

      {/* LỚP PHỦ MÔ PHỎNG GIAO DIỆN TIKTOK IPHONE (NẾU BẬT) */}
      {showOverlay && <TikTokOverlay showSafeBox={true} />}
    </AbsoluteFill>
  );
};
