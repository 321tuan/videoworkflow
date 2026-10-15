import { execSync } from 'child_process';

const stills = [
  { name: 's01_p1_hook.png', frame: 70 },
  { name: 's01_p2_roadmap.png', frame: 220 },
  { name: 's02_p1_empathy.png', frame: 363 },
  { name: 's02_p2_concepts.png', frame: 493 },
  { name: 's03_p1_khoa.png', frame: 672 },
  { name: 's03_p2_khoa_compare.png', frame: 822 },
  { name: 's04_p1_khoa_gop.png', frame: 1002 },
  { name: 's04_p2_khoa_gop_sol.png', frame: 1172 },
  { name: 's05_p1_toan_ven_hoi.png', frame: 1353 },
  { name: 's05_p2_toan_ven_step.png', frame: 1523 },
  { name: 's06_p1_sql_than_chu.png', frame: 1711 },
  { name: 's06_p2_sql_query.png', frame: 1881 },
  { name: 's07_p1_meo_thi.png', frame: 2069 },
  { name: 's07_p2_meo_thi_steps.png', frame: 2239 },
  { name: 's08_p1_cta_confidence.png', frame: 2423 },
  { name: 's08_p2_cta_action.png', frame: 2613 },
];

console.log('Rendering all 16 stills...');
for (const s of stills) {
  process.stdout.write(`Rendering ${s.name} (frame ${s.frame})... `);
  const cmd = `.\\node_modules\\.bin\\remotion.cmd still src/index.ts TinHocCSDL out/${s.name} --frame=${s.frame}`;
  execSync(cmd, {
    env: { ...process.env, TEMP: 'D:\\cache\\tmp', TMP: 'D:\\cache\\tmp' },
    stdio: 'ignore',
  });
  console.log('OK');
}
console.log('All 16 stills rendered successfully!');
