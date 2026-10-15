import fs from 'fs';
const path = 'C:\\Users\\hoang\\.gemini\\antigravity-ide\\brain\\a08e4dd4-ea0f-4dec-b04c-b80473800648\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(path, 'utf8').trim().split('\n');
console.log('Total lines:', lines.length);
for (let i = Math.max(0, lines.length - 20); i < lines.length; i++) {
  try {
    const obj = JSON.parse(lines[i]);
    console.log(i, obj.type, obj.source, typeof obj.content === 'string' ? obj.content.slice(0, 80) : 'not-string');
  } catch(e) {}
}
