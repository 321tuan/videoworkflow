// Do dac nhanh file nhac nen de chon nhanh bi (khong nghe duoc).
// Do: nhac/lay, pho tan so, nhip BPM (uoc luong), do dong (RMS p10/p50/p90) — de biet
// nhip co deu khong, co "giong hat" hay khong (do lech pho trong dai 200-1500Hz so voi nen).
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

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k];
        const ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr;
        im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;
        im[i + k + len / 2] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
}

const db = (x) => (x <= 0 ? -99 : 20 * Math.log10(x));

for (const f of process.argv.slice(2)) {
  const {rate, samples} = readWav(f);
  const name = f.split(/[\\/]/).pop();

  // --- bao luc o hoaam de uoc luong nhip ---
  const hop = Math.floor(rate * 0.01); // 10ms
  const win = Math.floor(rate * 0.02);
  const nFrames = Math.floor((samples.length - win) / hop);
  const flux = new Float64Array(nFrames);
  let prev = new Float64Array(win / 2 + 1);
  const bands = new Float64Array(8);
  let framesUsed = 0;
  for (let k = 0; k < nFrames; k++) {
    const off = k * hop;
    const re = new Float64Array(1024);
    const im = new Float64Array(1024);
    let e = 0;
    for (let i = 0; i < 1024 && off + i < samples.length; i++) {
      const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / 1023);
      const v = samples[off + i] * w;
      re[i] = v;
      e += samples[off + i] * samples[off + i];
    }
    fft(re, im);
    const half = 512;
    let sum = 0;
    for (let bi = 0; bi < half; bi++) {
      const m = Math.hypot(re[bi], im[bi]);
      sum += m;
      const hz = (bi * rate) / 1024;
      if (hz < 150) bands[0] += m * m;
      else if (hz < 400) bands[1] += m * m;
      else if (hz < 800) bands[2] += m * m;
      else if (hz < 1500) bands[3] += m * m;
      else if (hz < 3000) bands[4] += m * m;
      else if (hz < 6000) bands[5] += m * m;
      else bands[6] += m * m;
      if (m > prev[bi]) flux[k] += m - prev[bi];
    }
    prev = re.map((v, bi) => Math.hypot(v, im[bi]));
    framesUsed++;
  }

  // --- nhip: tu dong quan cua chuong pho (onset) ---
  let bestBpm = 0;
  let bestScore = -1;
  for (let bpm = 60; bpm <= 180; bpm += 0.5) {
    const lag = Math.round((60 / bpm) * 100); // 10ms hop -> frames per beat
    if (lag < 20 || lag + lag > nFrames - 1) continue;
    let s = 0;
    for (let i = 0; i + lag * 2 < nFrames; i++) s += flux[i] * flux[i + lag] + flux[i] * flux[i + 2 * lag];
    if (s > bestScore) {
      bestScore = s;
      bestBpm = bpm;
    }
  }

  // --- do dong: RMS theo khung 200ms ---
  const w2 = Math.floor(rate * 0.2);
  const rmsList = [];
  for (let off = 0; off + w2 <= samples.length; off += w2) {
    let e = 0;
    for (let i = 0; i < w2; i++) e += samples[off + i] * samples[off + i];
    rmsList.push(Math.sqrt(e / w2));
  }
  rmsList.sort((a, b) => a - b);
  const q = (p) => (rmsList.length ? rmsList[Math.floor(rmsList.length * p)] : 0);
  let peak = 0;
  for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));

  // --- do phan bo pho + chi so "giong hat" ---
  const tot = bands.reduce((a, b) => a + b, 0) + 1e-12;
  const pct = Array.from(bands).map((v) => Math.round((100 * v) / tot));
  // giong hat: nhac co hat thi da dai 150-1500Hz nem bien va pho noi bat, phan cao deo
  const vocalIdx = Math.round(100 * pct.slice(0, 4).reduce((a, b) => a + b, 0) / 100);
  const br = db(q(0.1));
  const bm = db(q(0.5));
  const b9 = db(q(0.9));

  console.log(
    `${name.padEnd(20)} ${(samples.length / rate).toFixed(0)}s  ` +
      `nhip~${bestBpm.toFixed(0)}BPM  ` +
      `RMS p10/p50/p90=${br.toFixed(1)}/${bm.toFixed(1)}/${b9.toFixed(1)}dB  ` +
      `peak=${db(peak).toFixed(1)}dB  ` +
      `pho[0-150|150-400|400-800|0.8-1.5k|1.5-3k|3-6k|6k+]=${pct.join('/')}`
  );
  console.log(
    `${''.padEnd(20)} -> do phan bo noi/dong ${(b9 - br).toFixed(1)}dB ` +
      `| nhac lot vao tieng noi (150-1500Hz) = ${vocalIdx}%  ` +
      `${vocalIdx > 55 ? 'CANH BAO: nhac lot tieng vao tieng doc' : 'OK: nen an phu hop tieng doc'}`
  );
}
