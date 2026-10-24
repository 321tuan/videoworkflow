import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const voPath = path.join(ROOT, 'src', 'vo.json');
const lyricsTextPath = path.join(ROOT, 'src', 'lyrics-text.json');

const vo = JSON.parse(fs.readFileSync(voPath, 'utf8'));
let lyricsDisplay = null;
if (fs.existsSync(lyricsTextPath)) {
  try {
    lyricsDisplay = JSON.parse(fs.readFileSync(lyricsTextPath, 'utf8'));
  } catch {}
}

const durs = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo-durations.json'), 'utf8'));
const outDir = path.join(ROOT, 'src', 'words');
fs.mkdirSync(outDir, { recursive: true });

for (const [key, rawText] of Object.entries(vo.segments)) {
  const totalDur = durs[key] || 10.0;
  
  // Use display lyrics text if available, fallback to vo text
  const displayText = (lyricsDisplay && lyricsDisplay[key]) ? lyricsDisplay[key] : rawText;
  const tokens = displayText.trim().split(/\s+/).filter(Boolean);
  
  // Calculate weights based on punctuation and length
  const weights = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let w = 1.0;
    if (/[.?!…]$/.test(t)) w += 2.8; // major sentence pause
    else if (/[,:;]$/.test(t)) w += 1.2; // clause pause
    if (t.length > 6) w += 0.2;
    weights.push(w);
  }
  const sumW = weights.reduce((a, b) => a + b, 0);
  
  let curT = 0.12; // slight start lead
  const words = [];
  const playableDur = totalDur - 0.25;
  
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const durShare = (weights[i] / sumW) * playableDur;
    const isSentenceEnd = /[.?!…]$/.test(t);
    const isClauseEnd = /[,:;]$/.test(t);
    
    let pause = 0.05;
    if (isSentenceEnd && i < tokens.length - 1) pause = Math.min(durShare * 0.5, 0.42);
    else if (isClauseEnd && i < tokens.length - 1) pause = Math.min(durShare * 0.3, 0.18);
    
    const spokenPart = Math.max(0.12, durShare - pause);
    
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
