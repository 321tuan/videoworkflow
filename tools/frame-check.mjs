// Kiem tra bo cuc khung hinh bang so lieu (khong can nhin tung pixel).
// Bao cao: khung noi dung, cham vao mep (bi cat), ho so hang/cot, vung sang.
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

for (const f of process.argv.slice(2)) {
  const img = decodePng(readFileSync(f));
  const {w, h, channels, data} = img;

  // nen = mau pho bien nhat (lay mau o goc duoi phai)
  const br = data[((h - 4) * w + (w - 4)) * channels];
  const bg = [data[br], data[br + 1], data[br + 2]];
  const isBg = (r, g, b) =>
    Math.abs(r - bg[0]) < 26 && Math.abs(g - bg[1]) < 26 && Math.abs(b - bg[2]) < 26;

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  let edge = 0;
  let content = 0;
  // vung sang (anh san / giay de thi / plate logo)
  let bMinX = w;
  let bMinY = h;
  let bMaxX = -1;
  let bMaxY = -1;
  let bCount = 0;
  const rowBands = new Array(12).fill(0);
  const colBands = new Array(9).fill(0);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * channels;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      if (isBg(r, g, b)) continue;
      content++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x < 4 || x > w - 5 || y < 4 || y > h - 5) edge++;
      rowBands[Math.min(11, Math.floor((y / h) * 12))]++;
      colBands[Math.min(8, Math.floor((x / w) * 9))]++;
      if (lum(r, g, b) > 165) {
        bCount++;
        if (x < bMinX) bMinX = x;
        if (x > bMaxX) bMaxX = x;
        if (y < bMinY) bMinY = y;
        if (y > bMaxY) bMaxY = y;
      }
    }
  }

  const pct = (v) => Math.round((100 * v) / (w * h)) + '%';
  console.log('=== ' + f.split(/[\\/]/).pop() + '  ' + w + 'x' + h);
  console.log('  nen goc      : ' + bg.join(','));
  console.log('  noi dung     : ' + pct(content) + '  khung=[' + minX + ',' + minY + ' -> ' + maxX + ',' + maxY + ']');
  console.log('  cham mep     : ' + edge + ' px  ' + (edge > 200 ? '<-- CANH BAO CAT MEP' : 'OK'));
  console.log(
    '  vung sang    : ' +
      (bCount ? pct(bCount) + '  khung=[' + bMinX + ',' + bMinY + ' -> ' + bMaxX + ',' + bMaxY + ']' : 'khong co')
  );
  console.log('  doc (12 dai) : ' + rowBands.map((v) => Math.round((100 * v) / (w * h / 12))).join(' '));
  console.log('  ngang (9 cot): ' + colBands.map((v) => Math.round((100 * v) / (w * h / 9))).join(' '));
}
