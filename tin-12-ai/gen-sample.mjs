import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const f = path.join(ROOT, 'tts-url.txt');
if (!fs.existsSync(f)) {
  console.error('CHUA CO tts-url.txt');
  process.exit(1);
}
const BASE = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/)[0].trim().replace(/\/+$/, '');

const text = "Đừng để cú lừa này khiến em mất toi điểm mười môn Tin học đấy nhé! Một siêu máy tính xử lý hàng tỷ phép tính mỗi giây, ấy thế mà lại chịu thua một em bé ba tuổi khi nhận diện một chú mèo con cơ đấy!";

const voices = [
  { id: "Thiện Minh", file: "sample-thien-minh.ogg", label: "Thiện Minh (Nam Bắc - Truyền cảm)" },
  { id: "Hải Đăng", file: "sample-hai-dang.ogg", label: "Hải Đăng (Nam Bắc - Năng động)" },
  { id: "Trúc Ly", file: "sample-truc-ly.ogg", label: "Trúc Ly (Nữ Nam - Tự nhiên)" },
  { id: "Quỳnh Như", file: "sample-quynh-nhu.ogg", label: "Quỳnh Như (Nữ Bắc - Chuẩn thanh)" },
  { id: "Duy Anh", file: "sample-duy-anh.ogg", label: "Duy Anh (Nam Nam - Ấm áp)" }
];

async function run() {
  const outDir = path.join(ROOT, 'public', 'samples');
  fs.mkdirSync(outDir, { recursive: true });
  
  console.log(`Connecting to TTS: ${BASE}`);
  for (const v of voices) {
    console.log(`Generating sample for ${v.id}...`);
    try {
      const res = await fetch(`${BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: v.id,
          speed: 1.0,
          lang: 'vi'
        })
      });
      if (!res.ok) {
        console.error(`Failed ${v.id}: ${res.status} ${res.statusText}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const outPath = path.join(outDir, v.file);
      fs.writeFileSync(outPath, buf);
      console.log(`-> Saved: ${outPath} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Error ${v.id}:`, e.message);
    }
  }
}

run().catch(console.error);
