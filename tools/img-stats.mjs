// Doc PNG khong can thu vien: tach IHDR/IDAT, inflate, undo filter, tinh thong ke.
// Dung de kiem tra nen cua anh (logo nen sang/toi) truoc khi bo tri trong video.
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('khong phai PNG');
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
      if (data[12] !== 0) throw new Error('interlaced khong ho tro');
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    p += 12 + len;
  }
  if (bitDepth !== 8) throw new Error('bitDepth=' + bitDepth);
  const channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[colorType];
  if (!channels) throw new Error('colorType=' + colorType);
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
      } else if (filter !== 0) {
        throw new Error('filter=' + filter);
      }
      cur[x] = v;
    }
  }
  return {w, h, channels, colorType, data: out};
}

const px = (img, x, y) => {
  const o = (y * img.w + x) * img.channels;
  return [img.data[o], img.data[o + 1], img.data[o + 2], img.channels === 4 ? img.data[o + 3] : 255];
};

const report = (path) => {
  const img = decodePng(readFileSync(path));
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  let bright = 0;
  let dark = 0;
  let transp = 0;
  for (let y = 0; y < img.h; y += 2) {
    for (let x = 0; x < img.w; x += 2) {
      const [pr, pg, pb, pa] = px(img, x, y);
      if (img.channels === 4 && pa < 20) {
        transp++;
        continue;
      }
      r += pr;
      g += pg;
      b += pb;
      n++;
      const l = (pr + pg + pb) / 3;
      if (l > 200) bright++;
      if (l < 40) dark++;
    }
  }
  const corner = (fx, fy) => px(img, Math.round((img.w - 1) * fx), Math.round((img.h - 1) * fy)).slice(0, 3).join(',');
  return {
    file: path.split(/[\\/]/).pop(),
    size: `${img.w}x${img.h}`,
    colorType: img.colorType === 6 ? 'RGBA (co alpha)' : img.colorType === 2 ? 'RGB' : 'type' + img.colorType,
    avgRGB: [Math.round(r / n), Math.round(g / n), Math.round(b / n)].join(','),
    sang: Math.round((100 * bright) / n) + '%',
    toi: Math.round((100 * dark) / n) + '%',
    trongSuot: Math.round((100 * transp) / (n + transp)) + '%',
    goc_TL: corner(0.02, 0.02),
    goc_TR: corner(0.98, 0.02),
    goc_BL: corner(0.02, 0.98),
    goc_BR: corner(0.98, 0.98),
    giua: px(img, img.w >> 1, img.h >> 1).slice(0, 3).join(','),
  };
};

for (const f of process.argv.slice(2)) {
  try {
    console.log(JSON.stringify(report(f)));
  } catch (e) {
    console.log(JSON.stringify({file: f, error: String(e.message || e)}));
  }
}
