import React from 'react';
import { Audio, staticFile, useCurrentFrame } from 'remotion';
import { bgmVolAt } from './mix';
import { TOTAL_FRAMES } from './data';

export const BgmPlayer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Audio
      src={staticFile('bgm/nen.wav')}
      volume={bgmVolAt(frame, TOTAL_FRAMES)}
      loop
    />
  );
};
