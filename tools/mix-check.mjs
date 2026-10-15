// Kiem tra MIX am thanh cua video: so tieng doc voi nhac nen theo tung canh,
// do cac KHE IM LANG giua cac doan (nhac nen co len duoc khong), va tim dinh co bi vo.
import {readFileSync} from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const file = argv[0];
const pIdx = argv.indexOf('--project');
const project = pIdx > 0 ? argv[pIdx + 1] : path.resolve(path.dirname(file), '..', '..');

const buf = readFileSync(file);
let p = 12;
let fmt = null;
let dataOff = 0;
let dataLen = 0;
while (p + 8 <= buf.length) {
  const id = buf.toString('ascii', p, p + 4);
  const len = buf.readUInt32LE(p + 4);
  if (id === 'fmt ') {
    fmt = {ch: buf.readUInt16LE(p + 10), rate: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22)};
  } else if (id === 'data') {
    dataOff = p + 8;
    dataLen = Math.min(len, buf.length - dataOff);
    break;
  }
  p += 8 + len + (len % 2);
}
const ch = fmt.ch;
const bps = fmt.bits / 8;
const frames = Math.floor(dataLen / (bps * ch));
const db = (v) => (v <= 1e-9 ? -99 : 20 * Math.log10(v));

function rms(fromSec, toSec) {
  const a = Math.max(0, Math.floor(fromSec * fmt.rate));
  const b = Math.min(Math.floor(toSec * fmt.rate), frames);
  if (b <= a) return -99;
  let s = 0;
  for (let i = a; i < b; i++) {
    for (let c = 0; c < ch; c++) {
      const v = buf.readInt16LE(dataOff + (i * ch + c) * bps) / 32768;
      s += v * v;
    }
  }
  return db(Math.sqrt(s / ((b - a) * ch)));
}

function peak(fromSec, toSec) {
  const a = Math.max(0, Math.floor(fromSec * fmt.rate));
  const b = Math.min(Math.floor(toSec * fmt.rate), frames);
  let pk = 0;
  for (let i = a; i < b; i++)
    for (let c = 0; c < ch; c++) pk = Math.max(pk, Math.abs(buf.readInt16LE(dataOff + (i * ch + c) * bps) / 32768));
  return pk;
}

// RMS nho nhat cua mot cua so truot — dung de tim khe im lang trong canh
// (giua cac cau) ma khong phu thuoc LEAD/TAIL cua tung framework.
function minWindowRms(fromSec, toSec, winSec) {
  const a = Math.max(0, Math.floor(fromSec * fmt.rate));
  const b = Math.min(Math.floor(toSec * fmt.rate), frames);
  const w = Math.max(1, Math.round(winSec * fmt.rate));
  if (b - a < w) return rms(fromSec, toSec);
  let best = Infinity;
  for (let i = a; i + w <= b; i += Math.max(1, Math.round(w / 4))) {
    let s = 0;
    for (let k = i; k < i + w; k++)
      for (let c = 0; c < ch; c++) {
        const v = buf.readInt16LE(dataOff + (k * ch + c) * bps) / 32768;
        s += v * v;
      }
    const r = Math.sqrt(s / (w * ch));
    if (r < best) best = r;
  }
  return db(best);
}

// --- moc canh tu project ---
// Remotion: src/vo-durations.json (chi co do dai, moc = LEAD + dur*fps + TAIL)
// HyperFrames: storyboard.json — co san start_s + duration_s cho tung canh,
//             va do dai canh = dung do dai giong doc (khong co LEAD/TAIL).
const sbIdx = argv.indexOf('--storyboard');
let spans;
if (sbIdx > 0) {
  const sb = JSON.parse(readFileSync(argv[sbIdx + 1], 'utf8'));
  spans = sb.frames.map((f) => ({
    k: f.id,
    from: Number(f.start_s),
    to: Number(f.start_s) + Number(f.duration_s),
    voFrom: Number(f.start_s),
    voTo: Number(f.start_s) + Number(f.duration_s),
  }));
  // Trong project HyperFrames moi la do dai canh = dung do dai giong doc, nen
  // "khe im" cua canh = 0 giay va luon ra -99dB (do bao sai). Thay vao do, do
  // khoang IM LANG YEU NHAT trong chinh canh (cua so 0.4s truot) — do la noi
  // giua cac cau, noi nhac nen phai con nghe duoc.
  for (const s of spans) s.minGap = minWindowRms(s.from, s.to, 0.4);
} else {
  const dur = JSON.parse(readFileSync(path.join(project, 'src', 'vo-durations.json'), 'utf8'));
  const KEYS = ['hook', 'score', 'problem', 'neo', 'showcase', 'cta'];
  const LEAD = 12;
  const TAIL = 22;
  const FPS = 30;
  let t = 0;
  spans = KEYS.map((k) => {
    const sf = LEAD + Math.round(dur[k] * FPS) + TAIL;
    const row = {k, from: t / FPS, to: (t + sf) / FPS, voFrom: (t + LEAD) / FPS, voTo: (t + LEAD + Math.round(dur[k] * FPS)) / FPS};
    t += sf;
    return row;
  });
}
const total = spans.length ? spans[spans.length - 1].to : (frames / fmt.rate);

console.log(`MIX: ${path.basename(file)}  ${(frames / fmt.rate).toFixed(2)}s  ${fmt.rate}Hz  ${ch} kenh`);
console.log(`Video ${total.toFixed(2)}s — kiem tra ${spans.length} canh\n`);
console.log('canh        giong_doc        RMS(doan_doc)  RMS(khe_im)   dinh       ket');
let warn = 0;
for (const s of spans) {
  const rVo = rms(s.voFrom, s.voTo);
  // khe im: canh co LEAD/TAIL -> do phan sau giong; HyperFrames -> do khoang
  // im lang yeu nhat trong canh (giua cac cau), noi nhac nen phai con nghe.
  const rGap = s.minGap != null ? s.minGap : rms(s.voTo + 0.05, s.to);
  const pk = peak(s.from, s.to);
  const d = rGap - rVo;
  const okVo = rVo > -40;
  const okGap = rGap > -55; // nhac nen phai nghe thay, khong duoc chet tieng
  const okPeak = db(pk) < -0.3;
  if (!okVo || !okGap || !okPeak) warn++;
  console.log(
    `${s.k.padEnd(10)} ${s.voFrom.toFixed(1)}-${s.voTo.toFixed(1)}s`.padEnd(24) +
      `${rVo.toFixed(1)}dB`.padStart(9) +
      `${rGap.toFixed(1)}dB`.padStart(13) +
      `${db(pk).toFixed(1)}dB`.padStart(11) +
      '   ' +
      [!okVo ? 'IM LANG!' : '', !okGap ? 'NEN CHET!' : '', !okPeak ? 'VO DINH!' : '', `chenh ${d.toFixed(1)}dB`]
        .filter(Boolean)
        .join(' ')
  );
}
const pkAll = peak(0, total);
console.log(`\nDinh toan video: ${db(pkAll).toFixed(1)} dBFS`);
console.log(warn === 0 ? '=> OK: moi canh deu co giong doc + nhac nen, khong vuot dinh' : `=> ${warn} canh can xem lai`);
