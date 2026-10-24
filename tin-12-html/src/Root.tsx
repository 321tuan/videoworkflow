import React from 'react';
import { Composition } from 'remotion';
import { NeoVideo } from './NeoVideo';
import { TOTAL_FRAMES } from './data';
import { FPS, VIDEO_H, VIDEO_W } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TinHocHTML"
        component={NeoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={VIDEO_W}
        height={VIDEO_H}
      />
    </>
  );
};
