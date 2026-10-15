// Do RMS theo dai tan bang LOC THOI GIAN (biquad bandpass) — phuong phap doc lap
// voi FFT, dung de kiem chung: nhac that co that su co noi dung cao tan khong.
// In muc (dB) cua tung dai so voi tong the.
import {readFileSync} from 'node:fs';

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

// Biquad bandpass (RBJ, peak gain 0dB)
function bandpass(x, rate, f0, Q) {
  const w0 = (2 * Math.PI * f0) / rate;
  const alpha = Math.sin(w0) / (2 * Q);
  const a0 = 1 + alpha;
  const b0 = alpha / a0;
  const b1 = 0;
  const b2 = -alpha / a0;
  const a1 = (-2 * Math.cos(w0)) / a0;
  const a2 = (1 - alpha) / a0;
  const y = new Float32Array(x.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    y[i] = v;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = v;
  }
  return y;
}

const rms = (x) => {
  let e = 0;
  for (let i = 0; i < x.length; i++) e += x[i] * x[i];
  return Math.sqrt(e / x.length);
};
const db = (v) => (v <= 1e-12 ? -140 : 20 * Math.log10(v));

for (const f of process.argv.slice(2)) {
  const {rate, samples} = readWav(f);
  const full = db(rms(samples));
  const bands = [
    [60, 120],
    [120, 250],
    [250, 500],
    [500, 1000],
    [1000, 2000],
    [2000, 4000],
    [4000, 6000],
    [6000, 8000],
    [8000, 12000],
    [12000, 16000],
  ];
  const parts = [];
  for (const [lo, hi] of bands) {
    if (hi / 2 > rate / 2) break;
    const f0 = Math.sqrt(lo * hi);
    const Q = f0 / (hi - lo);
    // 2 tang de bo cat sat doi
    let y = bandpass(samples, rate, f0, Q);
    y = bandpass(y, rate, f0, Q);
    const v = db(rms(y));
    parts.push({lo, hi, db: v});
  }
  console.log(
    f.split(/[\\/]/).pop() + `  (tong ${full.toFixed(1)}dB, ${(samples.length / rate).toFixed(0)}s @${rate}Hz)`
  );
  console.log(
    '  ' +
      parts
        .map(
          (p) =>
            `${p.lo}-${p.hi >= 1000 ? p.hi / 1000 + 'k' : p.hi}:${(p.db - full >= 0 ? '+' : '') + (p.db - full).toFixed(1)}`
        )
        .join('  ')
  );
}
