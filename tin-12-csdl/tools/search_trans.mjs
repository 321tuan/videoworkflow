import fs from 'node:fs';
import path from 'node:path';

const brainDir = 'C:\\Users\\hoang\\.gemini\\antigravity-ide\\brain';
const convs = fs.readdirSync(brainDir);

for (const c of convs) {
  const trans = path.join(brainDir, c, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(trans)) {
    const text = fs.readFileSync(trans, 'utf8');
    const matches = [];
    if (text.includes('2k8')) matches.push('2k8');
    if (text.includes('đặc quyền')) matches.push('đặc quyền');
    if (text.includes('dac quyen')) matches.push('dac quyen');
    if (matches.length > 0) {
      console.log(`Conv ${c} has: ${matches.join(', ')}`);
      // print matching user inputs
      const lines = text.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const j = JSON.parse(line);
          if (j.type === 'USER_INPUT' || j.content?.includes('đặc quyền') || j.content?.includes('2k8')) {
            const snippet = (j.content || '').slice(0, 200).replace(/\r?\n/g, ' ');
            if (snippet.includes('2k8') || snippet.includes('đặc quyền') || snippet.includes('dac quyen')) {
              console.log(`  [${j.type}] ${snippet}`);
            }
          }
        } catch {}
      }
    }
  }
}
