import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function readBase() {
  const f = path.join(ROOT, 'tts-url.txt');
  if (fs.existsSync(f)) {
    const t = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/)[0].trim();
    if (t) return t.replace(/\/+$/, '');
  }
  if (process.env.TTS_URL) return process.env.TTS_URL.replace(/\/+$/, '');
  console.error('CHUA CO URL TUNNEL trong tts-url.txt');
  process.exit(1);
}

const BASE = readBase();
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo.json'), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const args = process.argv.slice(2);

async function listVoices() {
  const r = await fetch(BASE + '/voices');
  const j = await r.json();
  const voices = j.voices || [];
  console.log(`Tunnel ${BASE} — ${voices.length} giong:`);
  for (const v of voices) {
    console.log(`  [${(v.gender || '?').padEnd(1)}] ${(v.lang || '?').padEnd(3)} ${v.id}`);
  }
  console.log(`\nDang dung: ${vo.voice_id}`);
  if (!voices.some((v) => v.id === vo.voice_id)) {
    console.error('!! voice_id trong src/vo.json KHONG TON TAI tren server — se bi sai giong!');
    process.exit(2);
  }
}

async function synth(text, voiceId) {
  const body = JSON.stringify({ text, voice: voiceId, speed: 1.0, lang: 'vi' });
  let lastErr = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(BASE + '/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const type = r.headers.get('content-type') || '';
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
      if (!type.includes('audio')) throw new Error('khong phai audio: ' + type);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1000) throw new Error('audio too small: ' + buf.length);
      return buf;
    } catch (e) {
      lastErr = e;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr;
}

if (args[0] === '--voices' || args[0] === 'voices') {
  await listVoices();
  process.exit(0);
}

const onlyKey = args[0];
const entries = Object.entries(vo.segments).filter(([k]) => !onlyKey || k === onlyKey);
if (onlyKey && entries.length === 0) {
  console.error('Khong co phan nao ten "' + onlyKey + '"');
  process.exit(1);
}

const outDir = path.join(ROOT, 'public', 'vo');
fs.mkdirSync(outDir, { recursive: true });

console.log(`Tunnel: ${BASE}`);
console.log(`Giong:  ${vo.voice_id}\n`);

function probeDuration(file) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`, { encoding: 'utf8' });
    const sec = parseFloat(out.trim());
    return isNaN(sec) ? 0 : sec;
  } catch (err) {
    console.error('ffprobe error:', err);
    return 0;
  }
}

const measured = {};
for (const [key, text] of entries) {
  try {
    const buf = await synth(text, vo.voice_id);
    const filePath = path.join(outDir, key + '.ogg');
    fs.writeFileSync(filePath, buf);
    const sec = probeDuration(filePath);
    measured[key] = Math.round(sec * 100) / 100;
    console.log(`OK ${key}: ${buf.length} bytes, ${sec.toFixed(2)}s -> public/vo/${key}.ogg`);
  } catch (err) {
    console.error(`FAIL ${key}:`, err.message);
  }
}

const durFile = path.join(ROOT, 'src', 'vo-durations.json');
let existing = {};
if (fs.existsSync(durFile)) {
  try { existing = JSON.parse(fs.readFileSync(durFile, 'utf8')); } catch {}
}
const finalDurs = { ...existing, ...measured };
fs.writeFileSync(durFile, JSON.stringify(finalDurs, null, 2));
console.log(`\nDa cap nhat src/vo-durations.json (${Object.keys(finalDurs).length} segments)`);
