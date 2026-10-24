import React from 'react';
import { Composition } from 'remotion';
import { NeoVideo } from './NeoVideo';
import { TOTAL_FRAMES, SC } from './data';
import { HookScene } from './scenes/HookScene';
import { ValueScene } from './scenes/ValueScene';
import { OutroScene } from './scenes/OutroScene';

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. TOÀN BỘ VIDEO HOÀN CHỈNH 20S */}
      <Composition
        id="TinTest20s"
        component={NeoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 2. CÁC PHÂN ĐOẠN ĐỘC LẬP ĐỂ TEST STILL */}
      <Composition
        id="Scene1Hook"
        component={HookScene}
        durationInFrames={SC.s01_hook}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene2Value"
        component={ValueScene}
        durationInFrames={SC.s02_value}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene3Outro"
        component={OutroScene}
        durationInFrames={SC.s03_cta}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
