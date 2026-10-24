import { interpolate } from 'remotion';
import { VO_LEAD } from './data';

// Mức âm lượng BGM mặc định chuẩn: 45% (Quy chuẩn AGENTS.md)
export const BGM_BASE_VOL = 0.45;
export const BGM_DUCK_VOL = 0.16; // Giảm khi có thuyết minh (auto-ducking)

export const bgmVolAt = (frame: number, totalFrames: number): number => {
  // Fade in 18 frames đầu, fade out 24 frames cuối
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [totalFrames - 24, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return BGM_BASE_VOL * fadeIn * fadeOut;
};

export const voiceVolAt = (frame: number, durFrames: number): number => {
  // Smooth in/out cho voice
  const vIn = interpolate(frame, [0, VO_LEAD], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vOut = interpolate(frame, [durFrames - 10, durFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return vIn * vOut;
};
