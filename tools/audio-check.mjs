// Moc canh: doc tu project (data.ts + vo-durations.json) de khong bao sai khi doi giong.
// Cach dung:
//   node audio-check.mjs <file.wav>                      -> tu tim project qua ten file
//   node audio-check.mjs <file.wav> --project <thu muc> -> chi dinh project
import {readFileSync, existsSync} from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const file = argv[0];
const pIdx = argv.indexOf('--project');
const buf = readFileSync(file);
let p = 12;
let fmt = null;
let dataOff = 0;
let dataLen = 0;
while (p + 8 <= buf.length) {
  const id = buf.toString('ascii', p, p + 4);
  const len = buf.readUInt32LE(p + 4);
  if (id === 'fmt ') {
    fmt = {ch: buf.readUInt16LE(p + 10), rate: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22)};
  } else if (id === 'data') {
    dataOff = p + 8;
    dataLen = Math.min(len, buf.length - dataOff);
    break;
  }
  p += 8 + len + (len % 2);
}
if (!fmt || !dataLen) throw new Error('WAV khong doc duoc');
const bytesPerSample = fmt.bits / 8;
const totalSamples = Math.floor(dataLen / bytesPerSample);
const seconds = totalSamples / fmt.rate;

const rmsDb = (fromSec, toSec) => {
  const a = Math.floor(fromSec * fmt.rate);
  const b = Math.min(Math.floor(toSec * fmt.rate), totalSamples);
  let sum = 0;
  let n = 0;
  for (let i = a; i < b; i++) {
    const v = buf.readInt16LE(dataOff + i * bytesPerSample) / 32768;
    sum += v * v;
    n++;
  }
  if (!n) return -99;
  const rms = Math.sqrt(sum / n);
  return rms > 0 ? 20 * Math.log10(rms) : -99;
};

// --- doc moc canh tu project ---
function findProject() {
  if (pIdx > 0) return argv[pIdx + 1];
  const guess = path.resolve(path.dirname(file), '..', '..', '..');
  return guess;
}
const project = findProject();
const durFile = path.join(project, 'src', 'vo-durations.json');
let SCENES;
let layoutNote = '';
if (existsSync(durFile)) {
  const dur = JSON.parse(readFileSync(durFile, 'utf8'));
  const keys = ['hook', 'score', 'problem', 'neo', 'showcase', 'cta'];
  const LEAD = 12;
  const TAIL = 22;
  const FPS = 30;
  let t = 0;
  SCENES = keys.map((k) => {
    const frames = LEAD + Math.round(dur[k] * FPS) + TAIL;
    const row = [k, t / FPS, (t + frames) / FPS];
    t += frames;
    return row;
  });
  layoutNote = ` (moc canh tu ${durFile})`;
} else {
  SCENES = [];
  layoutNote = ` — KHONG DOC DUOC ${durFile}, chia deu 6 phan`;
  const step = seconds / 6;
  for (let i = 0; i < 6; i++)
    SCENES.push([['hook', 'score', 'problem', 'neo', 'showcase', 'cta'][i], i * step, (i + 1) * step]);
}

console.log(`WAV: ${fmt.rate}Hz ${fmt.bits}bit mono=${fmt.ch === 1}  dai ${seconds.toFixed(2)}s${layoutNote}`);
let bad = 0;
for (const [name, a, b] of SCENES) {
  const db = rmsDb(a, b);
  const ok = db > -45;
  if (!ok) bad++;
  console.log(`  ${name.padEnd(9)} ${a.toFixed(1)}s-${b.toFixed(1)}s   RMS ${db.toFixed(1)} dB  ${ok ? 'OK' : '<-- CANH BAO IM LANG'}`);
}
console.log(bad === 0 ? '=> CA 6 CANH DEU CO AM THANH' : `=> ${bad} CANH VAN CO VAN DE`);
