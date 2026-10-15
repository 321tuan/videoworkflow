// Nhan dien giong bang SO LIEU: cao do F0 (trung vị) + ho so pho tan so.
// Dung de kiem tra 6 doan giong trong video co cung mot giong hay khac nhau.
import {readFileSync} from 'node:fs';

function readWav(file) {
  const buf = readFileSync(file);
  let p = 12;
  let rate = 16000;
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

// Uoc luong F0 bang tuong quan, lay trung vi de tranh sai octave
function f0(frame, rate, minHz = 65, maxHz = 340) {
  const minLag = Math.floor(rate / maxHz);
  const maxLag = Math.min(Math.floor(rate / minHz), frame.length - 2);
  if (maxLag <= minLag) return 0;
  let best = -Infinity;
  let bestLag = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    let e1 = 0;
    let e2 = 0;
    for (let i = 0; i < frame.length - lag; i++) {
      s += frame[i] * frame[i + lag];
      e1 += frame[i] * frame[i];
      e2 += frame[i + lag] * frame[i + lag];
    }
    const norm = s / (Math.sqrt(e1 * e2) + 1e-9);
    if (norm > best) {
      best = norm;
      bestLag = lag;
    }
  }
  return best > 0.35 ? rate / bestLag : 0;
}

// Nang luong theo dai tan (Goertzel) -> ho so pho
function bandProfile(samples, rate) {
  const freqs = [150, 300, 600, 1200, 2400, 4000];
  const win = Math.min(4096, samples.length);
  const nWin = Math.max(1, Math.floor((samples.length - win) / win));
  const bands = new Array(freqs.length).fill(0);
  const w = new Array(win);
  for (let k = 0; k < win; k++) w[k] = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / (win - 1));
  for (let f = 0; f < nWin; f++) {
    const off = f * win;
    for (let bi = 0; bi < freqs.length; bi++) {
      const k = (2 * Math.PI * freqs[bi]) / rate;
      const c = 2 * Math.cos(k);
      let s1 = 0;
      let s2 = 0;
      for (let i = 0; i < win; i++) {
        const s0 = w[i] * samples[off + i] + c * s1 - s2;
        s2 = s1;
        s1 = s0;
      }
      bands[bi] += s1 * s1 + s2 * s2 - c * s1 * s2;
    }
  }
  const total = bands.reduce((a, b) => a + b, 0) + 1e-9;
  return bands.map((v) => Math.round((100 * v) / total));
}

for (const f of process.argv.slice(2)) {
  const {rate, samples} = readWav(f);
  const frameLen = Math.floor(rate * 0.045);
  const hop = Math.floor(rate * 0.02);
  const f0s = [];
  let silent = 0;
  let total = 0;
  for (let off = 0; off + frameLen < samples.length; off += hop) {
    let e = 0;
    for (let i = 0; i < frameLen; i++) e += samples[off + i] * samples[off + i];
    const rms = Math.sqrt(e / frameLen);
    total++;
    if (rms < 0.01) {
      silent++;
      continue;
    }
    const v = f0(samples.subarray(off, off + frameLen), rate);
    if (v > 0) f0s.push(v);
  }
  f0s.sort((a, b) => a - b);
  const med = f0s.length ? f0s[Math.floor(f0s.length / 2)] : 0;
  const p10 = f0s.length ? f0s[Math.floor(f0s.length * 0.1)] : 0;
  const p90 = f0s.length ? f0s[Math.floor(f0s.length * 0.9)] : 0;
  const prof = bandProfile(samples, rate);
  console.log(
    `${f.split(/[\\/]/).pop().padEnd(28)} dai=${(samples.length / rate).toFixed(1)}s  ` +
      `F0 trung_vi=${med.toFixed(0)}Hz  p10-p90=${p10.toFixed(0)}-${p90.toFixed(0)}Hz  ` +
      `pho[150,300,600,1.2k,2.4k,4k]=${prof.join('/')}  ` +
      `khong/noi=${Math.round((100 * silent) / total)}%`
  );
}
