import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ROOT = 'D:\\test AI\\tin-12-csdl';
const outDir = path.join(ROOT, 'out');
fs.mkdirSync(outDir, { recursive: true });

const env = {
  ...process.env,
  TEMP: 'D:\\cache\\tmp',
  TMP: 'D:\\cache\\tmp',
  npm_config_cache: 'D:\\cache\\npm',
};

const frames = [
  { name: 's01_p1_hook', f: 60 },
  { name: 's01_p2_roadmap', f: 200 },
  { name: 's02_p1_empathy', f: 350 },
  { name: 's02_p2_concepts', f: 480 },
  { name: 's03_p1_khoa', f: 610 },
  { name: 's03_p2_khoa_compare', f: 770 },
  { name: 's04_p1_khoa_gop', f: 940 },
  { name: 's04_p2_khoa_gop_sol', f: 1080 },
  { name: 's05_p1_toan_ven_hoi', f: 1300 },
  { name: 's05_p2_toan_ven_step', f: 1450 },
  { name: 's06_p1_sql_than_chu', f: 1650 },
  { name: 's06_p2_sql_query', f: 1800 },
  { name: 's07_p1_meo_thi', f: 1980 },
  { name: 's07_p2_meo_thi_steps', f: 2120 },
  { name: 's08_p1_cta_confidence', f: 2320 },
  { name: 's08_p2_cta_action', f: 2500 },
];

for (const { name, f } of frames) {
  const outPath = path.join(outDir, `${name}.png`);
  console.log(`Generating still ${name} at frame ${f}...`);
  try {
    execSync(
      `cmd /c ".\\node_modules\\.bin\\remotion.cmd still src/index.ts TinHocCSDL "${outPath}" --frame=${f}"`,
      { cwd: ROOT, env, stdio: 'inherit' }
    );
  } catch (err) {
    console.error(`Error on ${name}:`, err.message);
  }
}
console.log('All test stills generated!');
