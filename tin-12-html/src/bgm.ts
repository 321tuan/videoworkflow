import { SC, SCENES, TOTAL_FRAMES, VO_LEAD, VO_SEC } from './data';
import { FPS } from './theme';
import { BGM_GAIN } from './mix';

const DUCK = 0.35; // Khi có giọng nói, nhạc nền giảm xuống 35% âm lượng chuẩn
const FADE_IN = Math.round(1.5 * FPS);
const FADE_OUT = Math.round(1.5 * FPS);

export const VO_SPANS = (() => {
  const out: { key: string; from: number; to: number }[] = [];
  let t = 0;
  for (const k of SCENES) {
    out.push({
      key: k,
      from: t + VO_LEAD,
      to: t + VO_LEAD + Math.round(VO_SEC[k] * FPS),
    });
    t += SC[k];
  }
  return out;
})();

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (x: number) => x * x * (3 - 2 * x);
const RAMP = 10; // Transition ducking ~0.33s

export const bgmVolumeAt = (frame: number): number => {
  let v = 1.0; // Mức tỷ lệ chuẩn (kết hợp với BGM_GAIN = 0.45 trong mix.json)

  v *= clamp01(frame / FADE_IN);
  v *= clamp01((TOTAL_FRAMES - frame) / FADE_OUT);

  for (const s of VO_SPANS) {
    if (frame < s.from - RAMP || frame > s.to + RAMP) continue;
    let g = 0;
    if (frame < s.from) {
      const p = (frame - (s.from - RAMP)) / RAMP;
      g = smooth(clamp01(p));
    } else if (frame <= s.to) {
      g = 1;
    } else {
      const p = (frame - s.to) / RAMP;
      g = 1 - smooth(clamp01(p));
    }
    v *= 1 - g * (1 - DUCK);
  }

  return clamp01(v) * BGM_GAIN;
};
