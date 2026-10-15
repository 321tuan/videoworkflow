// Cat PNG theo bbox noi dung non-trang, giu nguyen nen trang.
// Dung de bo tri logo tren nen toi cua video ma khong bi vien trang thua.
import {readFileSync, writeFileSync} from 'node:fs';
import {inflateSync, deflateSync} from 'node:zlib';

function decodePng(buf) {
  let p = 8;
  let w = 0;
  let h = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (p + 8 <= buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
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

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function encodePng(w, h, channels, data) {
  const colorType = channels === 3 ? 2 : 6;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = colorType;
  const stride = w * channels;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, {level: 9})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const [inFile, outFile, mode = 'crop', thrStr = '242'] = process.argv.slice(2);
const thr = Number(thrStr);
const img = decodePng(readFileSync(inFile));
const ch = img.channels;

let minX = img.w;
let minY = img.h;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < img.h; y++) {
  for (let x = 0; x < img.w; x++) {
    const o = (y * img.w + x) * ch;
    const r = img.data[o];
    const g = img.data[o + 1];
    const b = img.data[o + 2];
    const a = ch === 4 ? img.data[o + 3] : 255;
    const isWhite = r >= thr && g >= thr && b >= thr;
    if (!isWhite && a > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) throw new Error('anh toan trang');
const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.03);
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(img.w - 1, maxX + pad);
maxY = Math.min(img.h - 1, maxY + pad);
const cw = maxX - minX + 1;
const chh = maxY - minY + 1;
const outCh = 3;
const out = Buffer.alloc(cw * chh * outCh);
for (let y = 0; y < chh; y++) {
  for (let x = 0; x < cw; x++) {
    const s = ((y + minY) * img.w + (x + minX)) * ch;
    const d = (y * cw + x) * outCh;
    // nen trang -> trang, noi dung giu nguyen
    out[d] = img.data[s];
    out[d + 1] = img.data[s + 1];
    out[d + 2] = img.data[s + 2];
  }
}
writeFileSync(outFile, encodePng(cw, chh, outCh, out));
console.log(
  JSON.stringify({
    in: inFile.split(/[\\/]/).pop(),
    out: outFile.split(/[\\/]/).pop(),
    from: `${img.w}x${img.h}`,
    to: `${cw}x${chh}`,
    contentBox: `${minX},${minY} -> ${maxX},${maxY}`,
    mode,
  })
);
