import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const projectDir = 'd:\\test AI\\tin-12-csdl';
const outDir = path.join(projectDir, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Danh sách các frame cần render still preview:
// - f 25: Hook mở đầu nhẹ nhàng, sạch sẽ, chỉ Tag + Chữ + Mascot chào (chưa có hộp câu hỏi nào)
// - f 85: Hook nảy cảnh báo 80% mất điểm oan
// - f 140: Hộp câu hỏi nảy ra + Đáp án A
// - f 175: Đáp án B đúng sáng bừng lên + mẹo nhớ
// - f 250: Pha 2 lộ trình nảy so le (Dạng 1, Dạng 2)
// - f 345: Khoảnh khắc lật trang giấy 3D chuyển cảnh sang Scene 2 (Empathy)
const frames = [
  { f: 25, name: 'hook_f025_intro.png' },
  { f: 85, name: 'hook_f085_alert.png' },
  { f: 140, name: 'hook_f140_question_optA.png' },
  { f: 175, name: 'hook_f175_optB_solved.png' },
  { f: 250, name: 'hook_f250_roadmap_stagger.png' },
  { f: 345, name: 'trans_f345_pageturn.png' },
];

for (const item of frames) {
  const outPath = path.join(outDir, item.name);
  console.log(`Rendering still frame ${item.f} -> ${item.name}...`);
  const cmd = `cmd.exe /c "set "TEMP=D:\\cache\\tmp"&&set "TMP=D:\\cache\\tmp"&&.\\node_modules\\.bin\\remotion.cmd still src/index.ts TinHocCSDL "${outPath}" --frame=${item.f} --gl=angle"`;
  try {
    execSync(cmd, { cwd: projectDir, stdio: 'inherit' });
    console.log(`OK: ${item.name}`);
  } catch (err) {
    console.error(`Error rendering frame ${item.f}:`, err);
  }
}
