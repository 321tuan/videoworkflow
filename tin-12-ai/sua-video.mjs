// Trình xem và sửa video cho Tin học 12: Trí tuệ nhân tạo (tin-12-ai)
// Port: 5190 — Remotion composition: TinHocAI
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { spawn, execSync } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5190;
const FPS = 30, LEAD = 8, TAIL = 36;
const NPX = 'C:\\Program Files\\nodejs\\npx.cmd';
const FFMPEG = 'ffmpeg';

const voJson = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo.json'), 'utf8'));
const voDur = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo-durations.json'), 'utf8'));
const ttsUrl = () => {
  const p = path.join(ROOT, 'tts-url.txt');
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8').trim().split(/\r?\n/)[0].trim().replace(/\/+$/, '');
};

function readBody(req, max = 32 << 20) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let n = 0;
    req.on('data', (c) => {
      n += c.length;
      if (n > max) { reject(new Error('du lieu qua lon')); try { req.destroy(); } catch {} }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function probeDuration(file) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`, { encoding: 'utf8' });
    const sec = parseFloat(out.trim());
    return isNaN(sec) ? 0 : sec;
  } catch {
    return 0;
  }
}

function runProc(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, opts);
    let out = '', err = '';
    if (p.stdout) p.stdout.on('data', (d) => (out += d));
    if (p.stderr) p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => resolve({ code, out, err }));
    p.on('error', (e) => resolve({ code: -1, out, err: e.message }));
  });
}

function getScenes() {
  const vo = voJson(), durs = voDur();
  let cur = 0;
  const keys = Object.keys(vo.segments || {});
  const scenes = keys.map((key) => {
    const text = vo.segments[key] || '';
    const dur = durs[key] || 5;
    const start = Math.round(cur * 100) / 100;
    const frames = Math.ceil(dur * FPS) + LEAD + TAIL;
    cur += dur + (LEAD + TAIL) / FPS;
    return { key, text, dur, start, frames };
  });
  return { scenes, total_dur: Math.round(cur * 10) / 10 };
}

async function synth(text, voiceId) {
  const BASE = ttsUrl();
  if (!BASE) throw new Error('Chua co URL TTS trong tts-url.txt');
  const body = JSON.stringify({ text, voice: voiceId, speed: 1.0, lang: 'vi' });
  const r = await fetch(BASE + '/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

let renderProc = null;
function startRender() {
  if (renderProc) return { ok: false, error: 'Đang render bản khác, vui lòng đợi…' };
  fs.mkdirSync(path.join(ROOT, 'renders'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  const logFile = path.join(ROOT, 'renders', 'render.log');
  const log = fs.openSync(logFile, 'w');
  const env = { ...process.env, TEMP: 'D:\\cache\\tmp', TMP: 'D:\\cache\\tmp', npm_config_cache: 'D:\\cache\\npm' };

  renderProc = spawn('cmd', ['/c', NPX, 'remotion', 'render', 'src/index.ts', 'TinHocAI', 'out/draft.mp4', '--concurrency=4'], {
    cwd: ROOT,
    env,
    stdio: ['ignore', log, log]
  });

  renderProc.on('error', (e) => {
    try { fs.appendFileSync(logFile, '\nSPAWN ERROR: ' + e.message + '\n'); } catch {}
    renderProc = null;
  });

  renderProc.on('exit', (code) => {
    try {
      const outPath = path.join(ROOT, 'out', 'draft.mp4');
      const st = fs.existsSync(outPath) ? fs.statSync(outPath) : { size: 0 };
      const hist = path.join(ROOT, 'renders', 'history.json');
      const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
      const { scenes, total_dur } = getScenes();
      h.push({
        name: 'draft.mp4',
        kind: 'draft',
        time: new Date().toISOString(),
        size: st.size,
        duration: total_dur,
        voice_id: voJson().voice_id,
        exitCode: code
      });
      fs.writeFileSync(hist, JSON.stringify(h, null, 2) + '\n');
      const publicVideosDir = 'D:\\test AI\\videos';
      if (fs.existsSync(publicVideosDir) && fs.existsSync(outPath) && st.size > 0) {
        fs.copyFileSync(outPath, path.join(publicVideosDir, 'tin-12-ai.mp4'));
      }
    } catch {}
    renderProc = null;
  });

  return { ok: true };
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function send(res, code, type, data) {
  res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
  res.end(data);
}

function serveFile(res, file) {
  if (!fs.existsSync(file)) return send(res, 404, 'text/plain', 'not found');
  send(res, 200, MIME[path.extname(file)] || 'application/octet-stream', fs.readFileSync(file));
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1:' + PORT);
  const p = u.pathname;

  try {
    if (p === '/' || p === '/index.html' || p === '/sua-video.html') {
      return serveFile(res, path.join(ROOT, 'sua-video.html'));
    }

    if (p === '/chon-giong' || p === '/chon-giong.html') {
      return serveFile(res, path.join(ROOT, 'chon-giong.html'));
    }

    if (p === '/api/state') {
      const { scenes, total_dur } = getScenes();
      return send(res, 200, 'application/json', JSON.stringify({ voice_id: voJson().voice_id, scenes, total_dur }));
    }

    if (p === '/api/history') {
      const histFile = path.join(ROOT, 'renders', 'history.json');
      const h = fs.existsSync(histFile) ? JSON.parse(fs.readFileSync(histFile, 'utf8')) : [];
      return send(res, 200, 'application/json', JSON.stringify(h));
    }

    if (p === '/api/voices') {
      try {
        const BASE = ttsUrl();
        if (!BASE) throw new Error('Chưa cấu hình tts-url.txt');
        const r = await fetch(BASE + '/voices');
        const j = await r.json();
        return send(res, 200, 'application/json', JSON.stringify({ ok: true, current: voJson().voice_id, voices: j.voices || [] }));
      } catch (e) {
        return send(res, 200, 'application/json', JSON.stringify({ ok: false, current: voJson().voice_id, error: e.message, voices: [] }));
      }
    }

    if (p === '/api/voice' && req.method === 'POST') {
      try {
        const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
        if (!b.voice_id) throw new Error('thiếu voice_id');
        const vo = voJson();
        vo.voice_id = b.voice_id;
        fs.writeFileSync(path.join(ROOT, 'src', 'vo.json'), JSON.stringify(vo, null, 2) + '\n');
        return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
      } catch (e) {
        return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: e.message }));
      }
    }

    if (p === '/api/regen' && req.method === 'POST') {
      try {
        const body = JSON.parse((await readBody(req)).toString('utf8'));
        const vo = voJson();
        if (!body.key || !body.text) throw new Error('thiếu key/text');
        vo.segments[body.key] = body.text;
        fs.writeFileSync(path.join(ROOT, 'src', 'vo.json'), JSON.stringify(vo, null, 2) + '\n');

        const buf = await synth(body.text, vo.voice_id);
        const outPath = path.join(ROOT, 'public', 'vo', body.key + '.ogg');
        fs.writeFileSync(outPath, buf);
        const dur = probeDuration(outPath);

        const durs = voDur();
        durs[body.key] = Math.round(dur * 100) / 100;
        fs.writeFileSync(path.join(ROOT, 'src', 'vo-durations.json'), JSON.stringify(durs, null, 2) + '\n');

        return send(res, 200, 'application/json', JSON.stringify({ ok: true, dur: durs[body.key] }));
      } catch (e) {
        return send(res, 200, 'application/json', JSON.stringify({ ok: false, error: e.message }));
      }
    }

    if (p === '/api/regen-all' && req.method === 'POST') {
      try {
        const vo = voJson();
        const results = [];
        for (const [k, text] of Object.entries(vo.segments)) {
          try {
            const buf = await synth(text, vo.voice_id);
            const outPath = path.join(ROOT, 'public', 'vo', k + '.ogg');
            fs.writeFileSync(outPath, buf);
            const dur = probeDuration(outPath);
            const durs = voDur();
            durs[k] = Math.round(dur * 100) / 100;
            fs.writeFileSync(path.join(ROOT, 'src', 'vo-durations.json'), JSON.stringify(durs, null, 2) + '\n');
            results.push({ key: k, ok: true, dur: durs[k] });
          } catch (err) {
            results.push({ key: k, ok: false, error: err.message });
            break;
          }
        }
        return send(res, 200, 'application/json', JSON.stringify({ ok: true, results }));
      } catch (e) {
        return send(res, 500, 'application/json', JSON.stringify({ ok: false, error: e.message }));
      }
    }

    if (p === '/api/words') {
      const key = path.basename(u.searchParams.get('key') || '');
      const wf = path.join(ROOT, 'src', 'words', key + '.json');
      if (!/^[a-z0-9_]+$/.test(key)) {
        return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: 'key không hợp lệ' }));
      }

      if (req.method === 'POST') {
        try {
          const b = JSON.parse((await readBody(req, 1 << 20)).toString('utf8'));
          if (typeof b.text !== 'string') throw new Error('thiếu text');
          const oldData = fs.existsSync(wf) ? JSON.parse(fs.readFileSync(wf, 'utf8')) : { words: [] };
          const oldWords = oldData.words || [];

          const newTokens = b.text.trim().split(/\s+/).filter(Boolean);
          let newWords = [];
          if (oldWords.length > 0 && newTokens.length > 0) {
            const t0 = oldWords[0].start;
            const t1 = oldWords[oldWords.length - 1].end;
            const dur = Math.max(0.1, t1 - t0);
            const step = dur / newTokens.length;
            newWords = newTokens.map((w, i) => ({
              text: w,
              start: +(t0 + i * step).toFixed(2),
              end: +(t0 + (i + 1) * step).toFixed(2)
            }));
          } else {
            newWords = newTokens.map((w, i) => ({
              text: w,
              start: +(i * 0.3).toFixed(2),
              end: +((i + 1) * 0.3).toFixed(2)
            }));
          }
          fs.writeFileSync(wf, JSON.stringify({ words: newWords }, null, 2) + '\n');
          return send(res, 200, 'application/json', JSON.stringify({ ok: true, count: newWords.length }));
        } catch (e) {
          return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: e.message }));
        }
      }

      if (!fs.existsSync(wf)) return send(res, 200, 'application/json', JSON.stringify({ words: [] }));
      return send(res, 200, 'application/json', fs.readFileSync(wf, 'utf8'));
    }

    if (p === '/api/mix') {
      const mf = path.join(ROOT, 'src', 'mix.json');
      if (req.method === 'POST') {
        try {
          const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
          const cur = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : { bgm: 1, voice: {} };
          if (b.voice) {
            cur.voice = cur.voice || {};
            for (const k of Object.keys(b.voice)) {
              cur.voice[k] = Math.min(2, Math.max(0, Math.round(Number(b.voice[k]) * 100) / 100));
            }
          }
          if (b.bgm !== undefined) {
            cur.bgm = Math.min(2, Math.max(0, Math.round(Number(b.bgm) * 100) / 100));
          }
          fs.writeFileSync(mf, JSON.stringify(cur, null, 2) + '\n');
          return send(res, 200, 'application/json', JSON.stringify({ ok: true, mix: cur }));
        } catch (e) {
          return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: e.message }));
        }
      }
      const cur = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : { bgm: 1, voice: {} };
      return send(res, 200, 'application/json', JSON.stringify(cur));
    }

    if (p === '/api/render' && req.method === 'POST') {
      return send(res, 200, 'application/json', JSON.stringify(startRender()));
    }

    if (p === '/api/render-status') {
      let tail = '';
      try {
        const l = fs.readFileSync(path.join(ROOT, 'renders', 'render.log'), 'utf8');
        tail = l.slice(-1500);
      } catch {}
      return send(res, 200, 'application/json', JSON.stringify({ running: !!renderProc, log: tail }));
    }

    if (p === '/api/bgm') {
      const bj = path.join(ROOT, 'public', 'bgm', 'bgm.json');
      const info = fs.existsSync(bj) ? JSON.parse(fs.readFileSync(bj, 'utf8'))
        : { file: 'nen.wav', source: "'Carefree' - Kevin MacLeod (CC-BY 4.0)" };
      const up = path.join(ROOT, 'public', 'bgm', 'uploads');
      const uploads = fs.existsSync(up) ? fs.readdirSync(up) : [];
      return send(res, 200, 'application/json', JSON.stringify({ ...info, uploads }));
    }

    if (p === '/api/bgm-upload' && req.method === 'POST') {
      try {
        const name = (u.searchParams.get('name') || 'upload.mp3').split(/[\\/]/).pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        const buf = await readBody(req);
        const up = path.join(ROOT, 'public', 'bgm', 'uploads');
        fs.mkdirSync(up, { recursive: true });
        fs.writeFileSync(path.join(up, name), buf);
        console.log(`[BGM Upload] Da nhan file nhac: ${name} (${(buf.length / 1048576).toFixed(2)} MB)`);
        return send(res, 200, 'application/json', JSON.stringify({ ok: true, name, size: buf.length }));
      } catch (e) {
        return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    }

    if (p === '/api/bgm-lock' && req.method === 'POST') {
      try {
        const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
        const dir = b.dir === 'library' ? 'library' : 'uploads';
        const srcPath = path.join(ROOT, 'public', 'bgm', dir, path.basename(b.file || ''));
        if (!fs.existsSync(srcPath)) return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: 'File khong ton tai trong uploads' }));
        const bgmDir = path.join(ROOT, 'public', 'bgm');
        const nen = path.join(bgmDir, 'nen.wav');
        if (!fs.existsSync(path.join(bgmDir, 'nen-orig.wav'))) fs.copyFileSync(nen, path.join(bgmDir, 'nen-orig.wav'));
        fs.copyFileSync(nen, path.join(bgmDir, 'nen-prev.wav'));
        const r = await runProc(FFMPEG, ['-y', '-i', srcPath, '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', nen], { cwd: ROOT });
        if (r.code !== 0) {
          fs.copyFileSync(path.join(bgmDir, 'nen-prev.wav'), nen);
          return send(res, 500, 'application/json', JSON.stringify({ ok: false, error: 'ffmpeg loi: ' + r.err.slice(-500) }));
        }
        fs.writeFileSync(path.join(bgmDir, 'bgm.json'), JSON.stringify({
          file: dir + '/' + path.basename(srcPath),
          source: b.source || (dir === 'library' ? 'thu vien local' : 'user upload: ' + path.basename(srcPath)),
          lockedAt: new Date().toISOString()
        }, null, 2) + '\n');
        const hist = path.join(ROOT, 'renders', 'history.json');
        const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
        h.push({
          name: 'nen.wav',
          kind: 'bgm-lock',
          time: new Date().toISOString(),
          size: fs.statSync(nen).size,
          note: 'Chốt nhạc: ' + path.basename(srcPath)
        });
        fs.writeFileSync(hist, JSON.stringify(h, null, 2) + '\n');
        console.log(`[BGM Lock] Da chot nhac nen moi: ${path.basename(srcPath)}`);
        return send(res, 200, 'application/json', JSON.stringify({ ok: true }));
      } catch (e) {
        return send(res, 500, 'application/json', JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    }

    if (p.startsWith('/public/')) {
      const f = path.join(ROOT, p.replace(/^\//, ''));
      return serveFile(res, f);
    }

    if (p.startsWith('/samples/')) {
      const f = path.join(ROOT, 'public', p.replace(/^\//, ''));
      return serveFile(res, f);
    }

    if (p.startsWith('/vo/')) {
      const f = path.join(ROOT, 'public', p.replace(/^\//, ''));
      return serveFile(res, f);
    }

    if (p.startsWith('/out/')) {
      const f = path.join(ROOT, p.replace(/^\//, ''));
      return serveFile(res, f);
    }

    return send(res, 404, 'text/plain', 'not found');
  } catch (e) {
    send(res, 500, 'application/json', JSON.stringify({ ok: false, error: String(e) }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server sua-video dang chay tai: http://127.0.0.1:${PORT}`);
});
