// Tao "nhac nen" hoan chinh tu 1 file nhac thong thuong:
//   1. cut dai 200Hz (4th order) — giong doc tony_hoang co 89% nang luong o 150-300Hz,
//      de nhac khong lan qua giong.
//   2. tu dong chon DOAN nhac on dinh nhat (it bien dong nhat) cho dung do dai video.
//   3. chuan hoa RMS ve muc dich + gioi han dinh de khong vo.
// Input : file WAV 44.1/48kHz mono (dung ffmpeg de tach tu mp3 truoc)
// Output: file WAV moi trong public/
import {readFileSync, writeFileSync} from 'node:fs';

const argv = process.argv.slice(2);
const opt = {};
for (let i = 0; i < argv.length; i += 2) opt[argv[i].replace(/^--/, '')] = argv[i + 1];
const IN = argv[0];
const OUT = argv[1];
const HIGHPASS = Number(opt.highpass || 200);
const ORDER = Number(opt.order || 2);
const TARGET_RMS = Number(opt['target-rms'] || -30);
const PEAK = Number(opt.peak || -14);
const LEN = Number(opt.length || 71.5);
const START = opt.start || 'auto';

function readWav(file) {
  const buf = readFileSync(file);
  let p = 12;
  let rate = 44100;
  let dataOff = 0;
  let dataLen = 0;
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4);
    const len = buf.readUInt32LE(p + 4);
    if (id === 'fmt ') rate = buf.readUInt32LE(p + 12);
    else if (id === 'data') {
      dataOff = p + 8;
      dataLen = Math.min(len, buf.length - dataOff);
      break;
    }
    p += 8 + len + (len % 2);
  }
  const n = Math.floor(dataLen / 2);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(dataOff + i * 2) / 32768;
  return {rate, samples: out};
}

function writeWav(file, rate, samples) {
  const n = samples.length;
  const data = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++)
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767))), i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([h, data]));
}

// Biquad highpass RBJ
function highpass(x, rate, f0, Q) {
  const w0 = (2 * Math.PI * f0) / rate;
  const alpha = Math.sin(w0) / (2 * Q);
  const a0 = 1 + alpha;
  const b0 = (1 + Math.cos(w0)) / 2 / a0;
  const b1 = (-(1 + Math.cos(w0))) / a0;
  const b2 = b0;
  const a1 = (-2 * Math.cos(w0)) / a0;
  const a2 = (1 - alpha) / a0;
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    y[i] = v;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
  }
  return y;
}

const db = (v) => (v <= 1e-12 ? -140 : 20 * Math.log10(v));
const rmsOf = (x, a, b) => {
  let e = 0;
  for (let i = a; i < b; i++) e += x[i] * x[i];
  return Math.sqrt(e / (b - a));
};

const {rate, samples} = readWav(IN);
console.log(`Nguon: ${IN}  ${(samples.length / rate).toFixed(1)}s @${rate}Hz`);

// --- 1. cat dai ---
let h = samples;
for (let k = 0; k < ORDER / 2; k++) h = highpass(h, rate, HIGHPASS, 0.707);
console.log(`Cat dai ${HIGHPASS}Hz (order ${ORDER})`);

// --- 2. chon doan on dinh nhat ---
const wantN = Math.round(LEN * rate);
let startSample = 0;
if (START === 'auto' && h.length >= wantN) {
  const frameN = Math.round(0.25 * rate);
  const nF = Math.floor((h.length - wantN) / frameN);
  let best = null;
  for (let k = 0; k < nF; k++) {
    const a = k * frameN;
    const b = a + wantN;
    const f = Math.floor((b - a) / frameN);
    const rs = [];
    for (let i = 0; i < f; i++) rs.push(rmsOf(h, a + i * frameN, a + (i + 1) * frameN));
    const sorted = [...rs].sort((x, y) => x - y);
    const med = sorted[Math.floor(sorted.length / 2)];
    let dev = 0;
    for (const v of rs) dev += Math.abs(db(v) - db(med));
    dev /= rs.length;
    // uu tien doan bat dau o noi nhac khong qua lon (de fade-in dep)
    const startLevel = db(rs[0]);
    const cost = dev + Math.max(0, startLevel - db(med)) * 0.6;
    if (!best || cost < best.cost) best = {cost, a, startLevel, medDb: db(med), dev};
  }
  startSample = best.a;
  console.log(
    `Doan on dinh nhat: bat dau ${(startSample / rate).toFixed(1)}s, ` +
      `sai lech trung binh ${best.dev.toFixed(2)}dB (nen ${best.medDb.toFixed(1)}dB)`
  );
} else if (START === 'auto') {
  startSample = 0;
  console.log(`Nguon ngan hon bed (${(samples.length / rate).toFixed(0)}s < ${LEN}s) — noi lap toan bo.`);
} else {
  startSample = Math.round(Number(START) * rate);
  console.log(`Bat dau thu cong: ${Number(START)}s`);
}

let seg = h.slice(startSample, startSample + wantN);
if (seg.length < wantN) {
  console.log('CANH BAO: file ngan hon video, noi lai phan dau.');
  while (seg.length < wantN) seg = new Float32Array([...seg, ...seg]);
  seg = seg.slice(0, wantN);
}

// --- 3. chuan hoa RMS + gioi han dinh ---
let cur = db(rmsOf(seg, 0, seg.length));
let gain = Math.pow(10, (TARGET_RMS - cur) / 20);
let pk = 0;
for (let i = 0; i < seg.length; i++) pk = Math.max(pk, Math.abs(seg[i]));
if (db(pk) + 20 * Math.log10(gain) > PEAK) {
  gain *= Math.pow(10, (PEAK - (db(pk) + 20 * Math.log10(gain))) / 20);
  console.log('Gioi han dinh: ha gain de khong vuot dinh');
}
for (let i = 0; i < seg.length; i++) seg[i] *= gain;
let outPk = 0;
for (let i = 0; i < seg.length; i++) outPk = Math.max(outPk, Math.abs(seg[i]));
console.log(
  `RMS: ${cur.toFixed(1)}dB -> ${db(rmsOf(seg, 0, seg.length)).toFixed(1)}dB (dinh ${db(outPk).toFixed(1)}dB, gain ${(20 * Math.log10(gain)).toFixed(1)}dB)`
);

writeWav(OUT, rate, seg);
console.log(`Da ghi ${OUT} (${(seg.length / rate).toFixed(2)}s, ${(rate * 2 * seg.length) / 1048576}MB)`);
