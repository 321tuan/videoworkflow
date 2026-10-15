import React from 'react';
import { Composition } from 'remotion';
import { NeoVideo } from './NeoVideo';
import { TestThietKe20s } from './TestThietKe20s';
import { TestThietKe30s } from './TestThietKe30s';
import { TOTAL_FRAMES } from './data';
import { FPS, VIDEO_H, VIDEO_W } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TinHocCSDL"
        component={NeoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={VIDEO_W}
        height={VIDEO_H}
      />
      <Composition
        id="TestThietKe20s"
        component={TestThietKe20s}
        durationInFrames={600}
        fps={FPS}
        width={VIDEO_W}
        height={VIDEO_H}
      />
      <Composition
        id="TestThietKe30s"
        component={TestThietKe30s}
        durationInFrames={900}
        fps={FPS}
        width={VIDEO_W}
        height={VIDEO_H}
      />
    </>
  );
};

