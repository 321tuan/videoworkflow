import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(ROOT, 'out');
fs.mkdirSync(outDir, { recursive: true });

const scenes = [
  { key: 's01_hook', frame: 120 },
  { key: 's02_empathy', frame: 420 },
  { key: 's03_dang1_khoa', frame: 720 },
  { key: 's04_dang2_khoa_gop', frame: 1060 },
  { key: 's05_dang3_toan_ven', frame: 1410 },
  { key: 's06_dang4_sql', frame: 1760 },
  { key: 's07_meo_thi', frame: 2090 },
  { key: 's08_cta', frame: 2460 },
  { key: 'outro', frame: 2720 },
];

const env = {
  ...process.env,
  TEMP: 'D:\\cache\\tmp',
  TMP: 'D:\\cache\\tmp',
  npm_config_cache: 'D:\\cache\\npm',
};

console.log('Generating preview still frames...');
for (const s of scenes) {
  const outFile = path.join(outDir, `still-${s.key}.png`);
  console.log(`Still ${s.key} at frame ${s.frame}...`);
  try {
    execSync(
      `cmd /c ".\\node_modules\\.bin\\remotion.cmd still src/index.ts TinHocCSDL "${outFile}" --frame=${s.frame}"`,
      { cwd: ROOT, env, stdio: 'pipe' }
    );
    console.log(`-> Saved: ${outFile}`);
  } catch (err) {
    console.error(`Failed ${s.key}:`, err.message);
  }
}
console.log('Stills generation finished.');
