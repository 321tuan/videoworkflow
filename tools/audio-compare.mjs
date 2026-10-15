// Phan tich pho tan so bang FFT that + so sanh truc tiep giua cac file giong.
// Muc dich: kiem tra 6 doan giong co that su khac nhau khong, va co phai giong nguoi that khong.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

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

// FFT radix-2
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

function analyze(file) {
  const {rate, samples} = readWav(file);
  const N = 1024;
  const hop = N / 2;
  const avg = new Float64Array(N / 2);
  let frames = 0;
  let zc = 0;
  let energy = 0;
  let peak = 0;
  for (let off = 0; off + N < samples.length; off += hop) {
    let e = 0;
    for (let i = 0; i < N; i++) e += samples[off + i] * samples[off + i];
    const rms = Math.sqrt(e / N);
    if (rms < 0.005) continue;
    frames++;
    for (let i = 1; i < N; i++)
      if (samples[off + i - 1] * samples[off + i] < 0) zc++;
    for (let i = 0; i < N; i++) {
      energy += samples[off + i] * samples[off + i];
      if (Math.abs(samples[off + i]) > peak) peak = Math.abs(samples[off + i]);
    }
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      re[i] = samples[off + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)));
    }
    fft(re, im);
    for (let k = 0; k < N / 2; k++) avg[k] += Math.hypot(re[k], im[k]);
  }
  // nang luong theo dai
  const edges = [0, 300, 1000, 2000, 4000, 6000, 8001];
  const bands = new Array(edges.length - 1).fill(0);
  let total = 0;
  for (let k = 1; k < N / 2; k++) {
    const hz = (k * rate) / N;
    if (hz > 8000) break;
    const v = avg[k] * avg[k];
    total += v;
    for (let bi = 0; bi < bands.length; bi++)
      if (hz >= edges[bi] && hz < edges[bi + 1]) bands[bi] += v;
  }
  const pctBands = bands.map((v) => Math.round((100 * v) / (total + 1e-12)));
  const md5 = createHash('md5').update(Buffer.from(samples.buffer, 0, samples.length * 4)).digest('hex');
  const zcr = frames ? zc / (frames * hop) : 0;
  return {
    file: file.split(/[\\/]/).pop(),
    dur: samples.length / rate,
    frames,
    peak: Math.round(peak * 100) / 100,
    zcr: Math.round(zcr * 1000) / 1000,
    bands: pctBands,
    md5: md5.slice(0, 12),
  };
}

const res = process.argv.slice(2).map(analyze);
console.log('file'.padEnd(28) + 'dai    frame  dinh_noi  dac_do_cao_dam  pho[0-0.3|0.3-1k|1-2k|2-4k|4-6k|6-8k]        md5');
for (const r of res) {
  console.log(
    r.file.padEnd(28) +
      `${r.dur.toFixed(1)}s`.padEnd(7) +
      String(r.frames).padEnd(7) +
      String(r.zcr).padEnd(9) +
      String(r.peak).padEnd(13) +
      r.bands.join('/').padEnd(32) +
      r.md5
  );
}
const hashes = new Set(res.map((r) => r.md5));
console.log(hashes.size === 1 ? '\n=> TAT CA FILE CUNG NOI DUNG AM THANH (trung yeu)' : `\n=> ${hashes.size} noi dung khac nhau`);
