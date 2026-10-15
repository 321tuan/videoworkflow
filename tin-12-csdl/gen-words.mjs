import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo.json'), 'utf8'));
const durs = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo-durations.json'), 'utf8'));
const outDir = path.join(ROOT, 'src', 'words');
fs.mkdirSync(outDir, { recursive: true });

for (const [key, rawText] of Object.entries(vo.segments)) {
  const totalDur = durs[key] || 10.0;
  // Tokens
  const tokens = rawText.trim().split(/\s+/).filter(Boolean);
  
  // Calculate weights
  const weights = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let w = 1.0;
    if (/[…\.]{2,}/.test(t)) w += 1.8; // pause for ...
    else if (/[,\.:;?!]$/.test(t)) w += 1.0; // pause for punctuation
    weights.push(w);
  }
  const sumW = weights.reduce((a, b) => a + b, 0);
  
  let curT = 0.1; // start slightly after 0
  const words = [];
  const playableDur = totalDur - 0.2;
  
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const durShare = (weights[i] / sumW) * playableDur;
    const isPause = /[…,\.:;?!]/.test(t);
    const spokenPart = isPause ? durShare * 0.7 : durShare * 0.95;
    
    const start = Math.round(curT * 100) / 100;
    const end = Math.round((curT + spokenPart) * 100) / 100;
    
    words.push({
      text: t,
      start,
      end
    });
    curT += durShare;
  }
  
  const outFile = path.join(outDir, key + '.json');
  fs.writeFileSync(outFile, JSON.stringify({ words }, null, 2));
  console.log(`Generated ${key}: ${words.length} words -> ${outFile}`);
}
console.log('Words generation completed successfully.');
