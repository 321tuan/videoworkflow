// Tao tin hieu kiem chung da dai (co noi dung cao tan) de kiem tra ffmpeg co cat tan hay khong.
// Mac dinh 44100Hz, cac thanh phan 200Hz / 3kHz / 8kHz / 15kHz.
import {writeFileSync} from 'node:fs';

const rate = Number(process.argv[3] || 44100);
const dur = 3;
const n = rate * dur;
const data = Buffer.alloc(n * 2);
const comps = [
  [200, 0.5],
  [3000, 0.3],
  [8000, 0.2],
  [15000, 0.15],
];
for (let i = 0; i < n; i++) {
  const t = i / rate;
  let v = 0;
  for (const [f, a] of comps) v += a * Math.sin(2 * Math.PI * f * t);
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 18000))), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(process.argv[2] || 'D:/cache/tmp/check/wide.wav', Buffer.concat([header, data]));
console.log('da tao ' + (process.argv[2] || '') + ' @' + rate + 'Hz');
