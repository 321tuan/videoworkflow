import mixJson from './mix.json';

type Mix = { voice: Record<string, number>; bgm: number };
const MIX = mixJson as Mix;

export const voiceGain = (key: string): number => {
  const v = MIX.voice[key];
  return typeof v === 'number' && v >= 0 && v <= 2 ? v : 1;
};

// Fade mem 2 dau doan giong de tranh pop: vao 4f, ra 8f.
export const voiceVolAt = (key: string, frame: number, dur: number): number => {
  const g = voiceGain(key);
  const fi = Math.min(1, Math.max(0, frame / 4));
  const fo = Math.min(1, Math.max(0, (dur - frame) / 8));
  return g * Math.min(fi, fo);
};

export const BGM_GAIN: number =
  typeof MIX.bgm === 'number' && MIX.bgm >= 0 && MIX.bgm <= 2 ? MIX.bgm : 0.35;
