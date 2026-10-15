import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = fs.readFileSync(path.join(ROOT, 'tts-url.txt'), 'utf8').trim().split(/\r?\n/)[0].trim().replace(/\/+$/, '');

const text = "Đi thi Tin học, gặp câu hỏi... Đâu là khóa ngoài trong hai bảng sau? Dừng lại ba mươi giây, có một mẹo nhìn là ra ngay.";

const voices = [
  { id: "Thiện Minh", file: "sample-thien-minh.ogg" },
  { id: "Hải Đăng", file: "sample-hai-dang.ogg" },
  { id: "Trúc Ly", file: "sample-truc-ly.ogg" }
];

async function run() {
  for (const v of voices) {
    console.log(`Generating sample for ${v.id}...`);
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
    const outPath = path.join(ROOT, 'public', 'samples', v.file);
    fs.writeFileSync(outPath, buf);
    console.log(`-> Saved: ${outPath} (${buf.length} bytes)`);
  }
}

run().catch(console.error);
