// Do mot vung anh xac dinh: bao cao phan trang, toi, va mau dac trung trong vung.
// Dung de xac nhan ANH USER da that su render (khong phai khung rong).
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';

function decodePng(buf) {
  let p = 8;
  let w = 0;
  let h = 0;
  let colorType = 0;
  const idat = [];
  while (p + 8 <= buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      colorType = data[9];
      if (data[12] !== 0) throw new Error('interlaced');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  const channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[colorType];
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = Buffer.alloc(h * stride);
  let rp = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[rp++];
    const line = raw.subarray(rp, rp + stride);
    rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= channels ? prev[x - channels] : 0;
      let v = line[x];
      if (filter === 1) v = (v + a) & 255;
      else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a);
        const pb = Math.abs(pp - b);
        const pc = Math.abs(pp - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      cur[x] = v;
    }
  }
  return {w, h, channels, data: out};
}

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 5) {
  const [f, x0, y0, x1, y1] = args.slice(i, i + 5);
  const img = decodePng(readFileSync(f));
  let n = 0;
  let bright = 0;
  let dark = 0;
  let sum = 0;
  const hues = {};
  for (let y = Number(y0); y < Math.min(Number(y1), img.h); y++) {
    for (let x = Number(x0); x < Math.min(Number(x1), img.w); x++) {
      const o = (y * img.w + x) * img.channels;
      const r = img.data[o];
      const g = img.data[o + 1];
      const b = img.data[o + 2];
      const l = lum(r, g, b);
      n++;
      sum += l;
      if (l > 170) bright++;
      if (l < 45) dark++;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      if (mx - mn > 45) {
        let hue = 0;
        if (mx === r) hue = ((g - b) / (mx - mn)) * 60;
        else if (mx === g) hue = 60 + ((b - r) / (mx - mn)) * 60;
        else hue = 120 + ((r - g) / (mx - mn)) * 60;
        if (hue < 0) hue += 360;
        const bucket = Math.round(hue / 30) * 30;
        hues[bucket] = (hues[bucket] || 0) + 1;
      }
    }
  }
  const topHues = Object.entries(hues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${k}deg:${Math.round((100 * v) / n)}%`)
    .join(' ');
  console.log(
    `${f.split(/[\\/]/).pop()} vung[${x0},${y0}-${x1},${y1}]  ` +
      `TBsang=${Math.round(sum / n)}  trang>170=${Math.round((100 * bright) / n)}%  ` +
      `toi<45=${Math.round((100 * dark) / n)}%  mauNoi bat: ${topHues || 'khong co mau noi bat'}`
  );
}
