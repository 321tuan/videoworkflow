import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const NPX = 'C:\\Program Files\\nodejs\\npx.cmd';

fs.mkdirSync(path.join(ROOT, 'renders'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });

const logFile = path.join(ROOT, 'renders', 'render.log');
const log = fs.createWriteStream(logFile, { flags: 'w' });

const env = {
  ...process.env,
  TEMP: 'D:\\cache\\tmp',
  TMP: 'D:\\cache\\tmp',
  npm_config_cache: 'D:\\cache\\npm'
};

console.log('Rendering draft.mp4 for TinHocHTML...');
const t0 = Date.now();

const proc = spawn('cmd', ['/c', NPX, 'remotion', 'render', 'src/index.ts', 'TinHocHTML', 'out/draft.mp4', '--concurrency=4'], {
  cwd: ROOT,
  env,
  stdio: ['inherit', 'pipe', 'pipe']
});

proc.stdout.on('data', (d) => {
  process.stdout.write(d);
  log.write(d);
});

proc.stderr.on('data', (d) => {
  process.stderr.write(d);
  log.write(d);
});

proc.on('close', (code) => {
  log.end();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  if (code === 0) {
    const outPath = path.join(ROOT, 'out', 'draft.mp4');
    const st = fs.existsSync(outPath) ? fs.statSync(outPath) : { size: 0 };
    let realDur = 105.63;
    try {
      const pOut = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outPath}"`, { encoding: 'utf8' });
      realDur = parseFloat(pOut.trim()) || 105.63;
    } catch {}
    const vo = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo.json'), 'utf8'));
    const hist = path.join(ROOT, 'renders', 'history.json');
    const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
    const totalFrames = 3326;
    h.push({
      name: 'tin-12-html.mp4',
      kind: 'final',
      time: new Date().toISOString(),
      size: st.size,
      duration: Math.round(realDur * 100) / 100,
      frames: totalFrames,
      res: '1080x1920',
      voice_id: vo.voice_id,
      elapsedSeconds: parseFloat(elapsed),
      exitCode: 0
    });
    fs.writeFileSync(hist, JSON.stringify(h, null, 2) + '\n');
    console.log(`Render HOÀN THÀNH trong ${elapsed}s! Dung lượng: ${(st.size / 1048576).toFixed(2)} MB`);

    const publicVideosDir = 'D:\\test AI\\videos';
    if (fs.existsSync(publicVideosDir)) {
      const dest = path.join(publicVideosDir, 'tin-12-html.mp4');
      fs.copyFileSync(outPath, dest);
      console.log(`Đã đồng bộ bản final sang: ${dest}`);
    }
  } else {
    console.error(`Render THẤT BẠI với mã thoát: ${code}`);
  }
});
