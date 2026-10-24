import { FPS } from './theme';
import voDurJson from './vo-durations.json';
import voJson from './vo.json';

export const SCENES = [
  's01_hook',
  's02_empathy',
  's03_value1',
  's04_value2',
  's05_pitch_cta',
  's06_greeting',
] as const;

export type SceneKey = (typeof SCENES)[number];

export const VO_LEAD = 8;
export const PAUSE_AFTER = 22;
export const OUTRO_HOLD = 110; // Outro Logo Neo Education (~3.67s)

export const VO_SEC: Record<SceneKey, number> = {
  s01_hook: (voDurJson as Record<string, number>).s01_hook || 9.76,
  s02_empathy: (voDurJson as Record<string, number>).s02_empathy || 11.44,
  s03_value1: (voDurJson as Record<string, number>).s03_value1 || 27.32,
  s04_value2: (voDurJson as Record<string, number>).s04_value2 || 27.26,
  s05_pitch_cta: (voDurJson as Record<string, number>).s05_pitch_cta || 10.80,
  s06_greeting: (voDurJson as Record<string, number>).s06_greeting || 12.56,
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
