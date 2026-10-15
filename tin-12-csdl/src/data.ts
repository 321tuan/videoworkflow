import { FPS } from './theme';
import voDurJson from './vo-durations.json';
import voJson from './vo.json';

export const SCENES = [
  's01_hook',
  's02_empathy',
  's03_dang1_khoa',
  's04_dang2_khoa_gop',
  's05_dang3_toan_ven',
  's06_dang4_sql',
  's07_meo_thi',
  's08_cta',
] as const;

export type SceneKey = (typeof SCENES)[number];

export const VO_LEAD = 8;
export const PAUSE_AFTER = 36;
export const OUTRO_HOLD = 90;

export const VO_SEC: Record<SceneKey, number> = {
  s01_hook: (voDurJson as Record<string, number>).s01_hook,
  s02_empathy: (voDurJson as Record<string, number>).s02_empathy,
  s03_dang1_khoa: (voDurJson as Record<string, number>).s03_dang1_khoa,
  s04_dang2_khoa_gop: (voDurJson as Record<string, number>).s04_dang2_khoa_gop,
  s05_dang3_toan_ven: (voDurJson as Record<string, number>).s05_dang3_toan_ven,
  s06_dang4_sql: (voDurJson as Record<string, number>).s06_dang4_sql,
  s07_meo_thi: (voDurJson as Record<string, number>).s07_meo_thi,
  s08_cta: (voDurJson as Record<string, number>).s08_cta,
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

export const IMG = {
  logoNeo: 'img/img-3.png',
};

export const NEO_URL = 'neoeducation.vn';
