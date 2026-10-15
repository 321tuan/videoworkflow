import fs from 'node:fs';

const code = fs.readFileSync('d:\\test AI\\tin-12-csdl\\src\\scenes\\HookScene.tsx', 'utf8');
const lines = code.split('\n');

let stack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  if (opens > 0 || closes > 0) {
    for (let o = 0; o < opens; o++) stack.push(i + 1);
    for (let c = 0; c < closes; c++) {
      const popped = stack.pop();
    }
    console.log(`Line ${i + 1}: +${opens} -${closes} | current unclosed: ${stack.length}`);
  }
}
console.log('Unclosed div lines:', stack);
