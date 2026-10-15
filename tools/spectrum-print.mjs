// In pho tan so theo dai rong (den 20kHz) de kiem tra file co bi "bep" (muffled) khong.
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

for (const f of process.argv.slice(2)) {
  const {rate, samples} = readWav(f);
  const N = 2048;
  const avg = new Float64Array(N / 2);
  let frames = 0;
  for (let off = 0; off + N < samples.length; off += N) {
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    for (let i = 0; i < N; i++)
      re[i] = samples[off + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)));
    fft(re, im);
    for (let k = 0; k < N / 2; k++) avg[k] += Math.hypot(re[k], im[k]);
    frames++;
  }
  // tan so cat duoc phat hien cao nhat
  let cut = 0;
  for (let k = 1; k < N / 2; k++) {
    const hz = (k * rate) / N;
    if (hz > 1000) {
      const mag = avg[k] / frames;
      if (mag > (avg[Math.round((1000 * N) / rate)] / frames) * 0.02) cut = Math.max(cut, hz);
    }
  }
  const edges = [0, 100, 250, 500, 1000, 2000, 4000, 6000, 8000, 12000, 16000, 20001];
  const bands = new Array(edges.length - 1).fill(0);
  let tot = 0;
  for (let k = 1; k < N / 2; k++) {
    const hz = (k * rate) / N;
    if (hz > 20000) break;
    const v = (avg[k] / frames) ** 2;
    tot += v;
    for (let bi = 0; bi < bands.length; bi++)
      if (hz >= edges[bi] && hz < edges[bi + 1]) bands[bi] += v;
  }
  const pct = bands.map((v) => (v / tot) * 100);
  console.log(f.split(/[\\/]/).pop());
  console.log(
    '  pho%: ' + pct.map((v, i) => `${edges[i]}-${edges[i + 1]}Hz:${v.toFixed(1)}`).join('  ')
  );
  console.log(
    `  tan so cat duoc phat hien: ~${Math.round(cut)}Hz (tren 1kHz)  |  tan so dat 50% noi luc: ${
      edges[Math.max(0, pct.findIndex((v) => v > 50))] + '-' + edges[Math.max(0, pct.findIndex((v) => v > 50)) + 1] + 'Hz'
    }`
  );
}
