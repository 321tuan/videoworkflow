import { FPS } from './theme';
import voDurJson from './vo-durations.json';
import voJson from './vo.json';

export const SCENES = [
  's01_hook',
  's02_empathy',
  's03_value1',
  's04_value2',
  's05_value3',
  's06_pitch_cta',
] as const;

export type SceneKey = (typeof SCENES)[number];

export const VO_LEAD = 8;
export const PAUSE_AFTER = 36;
export const OUTRO_HOLD = 60;

export const VO_SEC: Record<SceneKey, number> = {
  s01_hook: (voDurJson as Record<string, number>).s01_hook || 15.62,
  s02_empathy: (voDurJson as Record<string, number>).s02_empathy || 14.96,
  s03_value1: (voDurJson as Record<string, number>).s03_value1 || 21.67,
  s04_value2: (voDurJson as Record<string, number>).s04_value2 || 22.7,
  s05_value3: (voDurJson as Record<string, number>).s05_value3 || 14.33,
  s06_pitch_cta: (voDurJson as Record<string, number>).s06_pitch_cta || 10.96,
};

export const SC = SCENES.reduce(
  (acc, k) => {
    acc[k] = VO_LEAD + Math.round(VO_SEC[k] * FPS) + PAUSE_AFTER;
    return acc;
  },
  {} as Record<SceneKey, number>
);

export const SCENES_FRAMES = SCENES.reduce((a, k) => a + SC[k], 0);
export const TOTAL_FRAMES = SCENES_FRAMES + OUTRO_HOLD;

export const VOICE_ID = (voJson as { voice_id: string }).voice_id;

export const NEO_URL = 'neoeducation.vn';
