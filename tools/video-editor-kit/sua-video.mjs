// Sua-video server cho neo-tin-hoc-2 — node:http thuan, khong them dep.
// Chuc nang: markers+jump, sinh lai giong tung canh (qua Colab tunnel), render lai full, lich su renders/.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import http from 'node:http';
import {spawn} from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5183;
const FPS = 30, LEAD = 12, TAIL = 22;

const voJson = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo.json'), 'utf8'));
const voDur = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'vo-durations.json'), 'utf8'));
const ttsUrl = () => fs.readFileSync(path.join(ROOT, 'tts-url.txt'), 'utf8').trim().split(/\r?\n/)[0].trim().replace(/\/+$/, '');

const NODE = 'C:\\Program Files\\nodejs\\node.exe';
const FFMPEG = 'C:\\Users\\hoang\\AppData\\Local\\ffmpeg\\bin\\ffmpeg.exe';
const MEDIA_SKILL = 'C:\\Users\\hoang\\.config\\opencode\\skills\\media-use';

// Thu vien nhac local (do BPM that bang bgm-check.mjs, tat ca Kevin MacLeod CC-BY 4.0).
const BGM_LIB = [
  {file: 'bgm-c-corporate.mp3', mood: 'corporate, nang dong', bpm: 119, secs: 158, desc: 'Nang dong, hien dai — hop quang cao giao duc'},
  {file: 'bgm-b-optimistic.mp3', mood: 'lac quan, nhe', bpm: 63, secs: 165, desc: 'Lac quan, tuoi sang'},
  {file: 'km-wallpaper.mp3', mood: 'nen nhe', bpm: 62, secs: 220, desc: 'Nen mo, dai — khong tranh giong doc'},
  {file: 'bgm-a-ambient.mp3', mood: 'ambient, diu', bpm: 62, secs: 155, desc: 'Ambient tram, tinh lang'},
  {file: 'km-deliberate-thought.mp3', mood: 'tram tu', bpm: 69, secs: 177, desc: 'Tram, deu — nen ke chuyen'},
  {file: 'km-thief-in-the-night.mp3', mood: 'tram, toi', bpm: 65, secs: 185, desc: 'Tram toi, bass nang — can than lan giong'},
  {file: 'km-investigations.mp3', mood: 'hoi hop, dong', bpm: 95, secs: 94, desc: 'Hoi hop, bien dong manh — ngan, chi hop doan ngan'},
];

function scoreBgm(intent) {
  const t = (intent || '').toLowerCase();
  const fast = /nang dong|nhanh|manh|soi dong|quang cao|corporate/.test(t);
  const calm = /nhe|diu|ambient|nhe nhang|tinh lang|ke chuyen/.test(t);
  const dark = /tram|toi|buon|sau/.test(t);
  const happy = /vui|tuoi|lac quan|tich cuc/.test(t);
  return BGM_LIB.map((b) => {
    let s = 0;
    if (fast && b.bpm >= 90) s += 3;
    if (calm && b.bpm < 70 && /ambient|nen|diu|nhe/.test(b.mood)) s += 3;
    if (dark && /tram|toi/.test(b.mood)) s += 3;
    if (happy && /lac quan|nang dong/.test(b.mood)) s += 2;
    if (!fast && !calm && !dark && !happy && b.bpm >= 90) s += 1;
    return {...b, score: s};
  }).sort((a, b2) => b2.score - a.score);
}

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

function runProc(cmd, args, opts, timeoutMs = 120000) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, opts);
    let out = '', err = '';
    const t = setTimeout(() => { try { p.kill(); } catch {} }, timeoutMs);
    p.stdout.on('data', (c) => (out += c));
    p.stderr.on('data', (c) => (err += c));
    p.on('error', (e) => { clearTimeout(t); resolve({code: -1, out, err: e.message}); });
    p.on('exit', (code) => { clearTimeout(t); resolve({code, out, err}); });
  });
}

function scenes() {
  const v = voJson(), d = voDur();
  const keys = Object.keys(v.segments);
  let t = 0;
  return keys.map((k) => {
    const frames = LEAD + Math.round((d[k] || 0) * FPS) + TAIL;
    const s = {key: k, text: v.segments[k], dur: d[k] || 0, start: +(t / FPS).toFixed(2), frames};
    t += frames;
    return s;
  });
}

function oggDurationSec(buf, rate = 24000) {
  let p = 0, last = 0;
  while (p + 27 <= buf.length) {
    if (buf.toString('ascii', p, p + 4) !== 'OggS') break;
    const g = Number(buf.readBigUInt64LE(p + 6));
    const n = buf[p + 26];
    let sz = 27 + n;
    for (let i = 0; i < n; i++) sz += buf[p + 27 + i];
    if (g > last) last = g;
    p += sz;
  }
  return Math.round((last / rate) * 100) / 100;
}

async function regenVoice(key, text) {
  const v = voJson();
  const body = JSON.stringify({text, voice: v.voice_id, speed: 1.0, lang: 'vi'});
  let lastErr = null;
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(ttsUrl() + '/tts', {method: 'POST', headers: {'Content-Type': 'application/json'}, body});
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || !ct.includes('audio')) throw new Error('TTS HTTP ' + r.status);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1000) throw new Error('audio too small');
      fs.writeFileSync(path.join(ROOT, 'public', 'vo', key + '.ogg'), buf);
      const dur = oggDurationSec(buf);
      const d = voDur(); d[key] = dur;
      fs.writeFileSync(path.join(ROOT, 'src', 'vo-durations.json'), JSON.stringify(d, null, 2) + '\n');
      const segs = v.segments; segs[key] = text;
      fs.writeFileSync(path.join(ROOT, 'src', 'vo.json'), JSON.stringify({...v, segments: segs}, null, 2) + '\n');
      return {ok: true, dur};
    } catch (e) { lastErr = e; await new Promise((r) => setTimeout(r, 1500 * (a + 1))); }
  }
  return {ok: false, error: String(lastErr && lastErr.message || lastErr)};
}

let voicesCache = null, voicesAt = 0;
async function listVoices() {
  const now = Date.now();
  if (voicesCache && now - voicesAt < 60000) return voicesCache;
  const r = await fetch(ttsUrl() + '/voices');
  const j = await r.json();
  voicesCache = (j.voices || []).map((v) => ({id: v.id, gender: v.gender, lang: v.lang}));
  voicesAt = now;
  return voicesCache;
}

let renderProc = null;
function startRender() {
  if (renderProc) return {ok: false, error: 'dang render'};
  fs.mkdirSync(path.join(ROOT, 'renders'), {recursive: true});
  const log = fs.openSync(path.join(ROOT, 'renders', 'render.log'), 'w');
  const env = {...process.env, TEMP: 'D:\\cache\\tmp', TMP: 'D:\\cache\\tmp', npm_config_cache: 'D:\\cache\\npm'};
  const NPX = 'C:\\Program Files\\nodejs\\npx.cmd';
  renderProc = spawn('cmd', ['/c', NPX, 'remotion', 'render', 'NeoTinHoc', 'out/draft.mp4'], {cwd: ROOT, env, stdio: ['ignore', log, log]});
  renderProc.on('error', (e) => {
    try { fs.appendFileSync(path.join(ROOT, 'renders', 'render.log'), '\nSPAWN ERROR: ' + e.message + '\n'); } catch {}
    renderProc = null;
  });
  renderProc.on('exit', (code) => {
    try {
      const st = fs.statSync(path.join(ROOT, 'out', 'draft.mp4'));
      const hist = path.join(ROOT, 'renders', 'history.json');
      const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
      const sc = scenes();
      const total = sc.reduce((a, s) => a + s.frames, 0) / FPS;
      h.push({name: 'draft.mp4', kind: 'full', scene: null, time: new Date().toISOString(), size: st.size, duration: +total.toFixed(2), path: 'out/draft.mp4', exitCode: code});
      fs.writeFileSync(hist, JSON.stringify(h, null, 2) + '\n');
    } catch {}
    renderProc = null;
  });
  return {ok: true};
}

const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.mp4': 'video/mp4', '.ogg': 'audio/ogg', '.png': 'image/png'};
function send(res, code, type, data) { res.writeHead(code, {'Content-Type': type}); res.end(data); }
function serveFile(res, file) {
  if (!fs.existsSync(file)) return send(res, 404, 'text/plain', 'not found');
  send(res, 200, MIME[path.extname(file)] || 'application/octet-stream', fs.readFileSync(file));
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname === '/') return serveFile(res, path.join(ROOT, 'sua-video.html'));
    if (u.pathname === '/api/state') {
      const sc = scenes();
      const total = sc.reduce((a, s) => a + s.frames, 0);
      return send(res, 200, 'application/json', JSON.stringify({scenes: sc, totalFrames: total, fps: FPS, voice: voJson().voice_id}));
    }
    if (u.pathname === '/api/history') {
      const hist = path.join(ROOT, 'renders', 'history.json');
      // Doc lai moi request (khong cache RAM) — ban xuat moi hien ngay.
      return send(res, 200, 'application/json', fs.existsSync(hist) ? fs.readFileSync(hist, 'utf8') : '[]');
    }
    if (u.pathname === '/api/words') {
      const key = path.basename(u.searchParams.get('key') || '');
      const wf = path.join(ROOT, 'src', 'words', key + '.json');
      if (!/^[a-z0-9_]+$/.test(key) || !fs.existsSync(wf))
        return send(res, 400, 'application/json', JSON.stringify({ok: false, error: 'key khong hop le'}));
      if (req.method === 'POST') {
        try {
          const b = JSON.parse((await readBody(req, 1 << 20)).toString('utf8'));
          if (!Array.isArray(b.words)) throw new Error('thieu words');
          const cur = JSON.parse(fs.readFileSync(wf, 'utf8'));
          if (b.words.length !== cur.words.length) throw new Error('so tu khac (hientai ' + cur.words.length + ') — tai lai trang');
          const out = cur.words.map((w, i) => {
            const t = String(b.words[i] && b.words[i].text !== undefined ? b.words[i].text : w.text);
            const s = Number(w.start), e = Number(w.end);
            if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) throw new Error('timestamp loi');
            return {text: t, start: s, end: e};
          });
          fs.writeFileSync(wf, JSON.stringify({words: out}, null, 2) + '\n');
          return send(res, 200, 'application/json', JSON.stringify({ok: true}));
        } catch (e) { return send(res, 400, 'application/json', JSON.stringify({ok: false, error: String(e.message || e)})); }
      }
      return send(res, 200, 'application/json', fs.readFileSync(wf, 'utf8'));
    }
    if (u.pathname === '/api/mix') {
      const mf = path.join(ROOT, 'src', 'mix.json');
      if (req.method === 'POST') {
        try {
          const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
          const cur = JSON.parse(fs.readFileSync(mf, 'utf8'));
          if (b.voice) for (const k of Object.keys(cur.voice)) {
            const v = Number(b.voice[k]);
            if (Number.isFinite(v)) cur.voice[k] = Math.min(2, Math.max(0, Math.round(v * 100) / 100));
          }
          if (b.bgm !== undefined && Number.isFinite(Number(b.bgm)))
            cur.bgm = Math.min(2, Math.max(0, Math.round(Number(b.bgm) * 100) / 100));
          fs.writeFileSync(mf, JSON.stringify(cur, null, 2) + '\n');
          return send(res, 200, 'application/json', JSON.stringify({ok: true, mix: cur}));
        } catch (e) { return send(res, 400, 'application/json', JSON.stringify({ok: false, error: String(e.message || e)})); }
      }
      return send(res, 200, 'application/json', fs.readFileSync(mf, 'utf8'));
    }
    if (u.pathname === '/api/render-status') {
      let tail = '';
      try { const l = fs.readFileSync(path.join(ROOT, 'renders', 'render.log'), 'utf8'); tail = l.slice(-1500); } catch {}
      return send(res, 200, 'application/json', JSON.stringify({running: !!renderProc, log: tail}));
    }
    if (u.pathname === '/api/render' && req.method === 'POST') {
      return send(res, 200, 'application/json', JSON.stringify(startRender()));
    }
    if (u.pathname === '/api/regen' && req.method === 'POST') {
      const b = JSON.parse(await new Promise((r) => { let s = ''; req.on('data', (c) => (s += c)); req.on('end', () => r(s)); }));
      if (!b.key || !b.text) return send(res, 400, 'application/json', '{"ok":false}');
      return send(res, 200, 'application/json', JSON.stringify(await regenVoice(b.key, b.text)));
    }
    if (u.pathname === '/api/voices') {
      try {
        const vs = await listVoices();
        return send(res, 200, 'application/json', JSON.stringify({ok: true, voices: vs, current: voJson().voice_id}));
      } catch (e) {
        return send(res, 200, 'application/json', JSON.stringify({ok: false, voices: [], current: voJson().voice_id, error: 'tunnel Colab khong tra loi (chet/mang) — xin link moi roi thu lai'}));
      }
    }
    if (u.pathname === '/api/voice' && req.method === 'POST') {
      const b = JSON.parse(await new Promise((r) => { let s = ''; req.on('data', (c) => (s += c)); req.on('end', () => r(s)); }));
      const vs = await listVoices();
      // CHI cho doi khi ID ton tai chinh xac — chong bay fallback giong dau tien.
      if (!b.voice_id || !vs.some((v) => v.id === b.voice_id))
        return send(res, 400, 'application/json', JSON.stringify({ok: false, error: 'voice_id khong ton tai tren server'}));
      const v = voJson(); v.voice_id = b.voice_id;
      fs.writeFileSync(path.join(ROOT, 'src', 'vo.json'), JSON.stringify(v, null, 2) + '\n');
      return send(res, 200, 'application/json', JSON.stringify({ok: true}));
    }
    if (u.pathname === '/api/regen-all' && req.method === 'POST') {
      const out = [];
      for (const k of Object.keys(voJson().segments)) {
        const r = await regenVoice(k, voJson().segments[k]);
        out.push({key: k, ...r});
        if (!r.ok) break;
      }
      return send(res, 200, 'application/json', JSON.stringify({results: out}));
    }
    if (u.pathname === '/api/bgm') {
      const bj = path.join(ROOT, 'public', 'bgm', 'bgm.json');
      const info = fs.existsSync(bj) ? JSON.parse(fs.readFileSync(bj, 'utf8'))
        : {file: 'nen.wav', source: "'Carefree' - Kevin MacLeod (CC-BY 4.0, incompetech.com)"};
      const up = path.join(ROOT, 'public', 'bgm', 'uploads');
      const uploads = fs.existsSync(up) ? fs.readdirSync(up) : [];
      return send(res, 200, 'application/json', JSON.stringify({...info, uploads}));
    }
    if (u.pathname === '/api/bgm-upload' && req.method === 'POST') {
      try {
        const name = (u.searchParams.get('name') || 'upload.mp3').split(/[\\/]/).pop().replace(/[^a-zA-Z0-9._-]/g, '_');
        const buf = await readBody(req);
        const up = path.join(ROOT, 'public', 'bgm', 'uploads');
        fs.mkdirSync(up, {recursive: true});
        fs.writeFileSync(path.join(up, name), buf);
        return send(res, 200, 'application/json', JSON.stringify({ok: true, name, size: buf.length}));
      } catch (e) { return send(res, 400, 'application/json', JSON.stringify({ok: false, error: String(e.message || e)})); }
    }
    if (u.pathname === '/api/bgm-find' && req.method === 'POST') {
      try {
        const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
        const ranked = scoreBgm(b.intent).map((x) => ({...x, preview: '/lib/' + x.file}));
        return send(res, 200, 'application/json', JSON.stringify({ok: true, results: ranked}));
      } catch (e) { return send(res, 500, 'application/json', JSON.stringify({ok: false, error: String(e.message || e)})); }
    }
    if (u.pathname === '/api/bgm-lock' && req.method === 'POST') {
      try {
        const b = JSON.parse((await readBody(req, 1 << 16)).toString('utf8'));
        const dir = b.dir === 'library' ? 'library' : 'uploads';
        const srcPath = path.join(ROOT, 'public', 'bgm', dir, path.basename(b.file || ''));
        if (!fs.existsSync(srcPath)) return send(res, 400, 'application/json', JSON.stringify({ok: false, error: 'file khong ton tai trong uploads'}));
        const bgmDir = path.join(ROOT, 'public', 'bgm');
        const nen = path.join(bgmDir, 'nen.wav');
        if (!fs.existsSync(path.join(bgmDir, 'nen-orig.wav'))) fs.copyFileSync(nen, path.join(bgmDir, 'nen-orig.wav'));
        fs.copyFileSync(nen, path.join(bgmDir, 'nen-prev.wav'));
        const r = await runProc(FFMPEG, ['-y', '-i', srcPath, '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', nen], {cwd: ROOT});
        if (r.code !== 0) {
          fs.copyFileSync(path.join(bgmDir, 'nen-prev.wav'), nen);
          return send(res, 500, 'application/json', JSON.stringify({ok: false, error: 'ffmpeg loi: ' + r.err.slice(-500)}));
        }
        fs.writeFileSync(path.join(bgmDir, 'bgm.json'), JSON.stringify({file: dir + '/' + path.basename(srcPath), source: b.source || (dir === 'library' ? 'thu vien local (Kevin MacLeod CC-BY 4.0)' : 'user upload'), lockedAt: new Date().toISOString()}, null, 2) + '\n');
        const hist = path.join(ROOT, 'renders', 'history.json');
        const h = fs.existsSync(hist) ? JSON.parse(fs.readFileSync(hist, 'utf8')) : [];
        h.push({name: 'nen.wav', kind: 'bgm-lock', scene: null, time: new Date().toISOString(), size: fs.statSync(nen).size, duration: null, path: 'public/bgm/nen.wav', note: 'chot nhac: ' + path.basename(srcPath)});
        fs.writeFileSync(hist, JSON.stringify(h, null, 2) + '\n');
        return send(res, 200, 'application/json', JSON.stringify({ok: true}));
      } catch (e) { return send(res, 500, 'application/json', JSON.stringify({ok: false, error: String(e.message || e)})); }
    }
    if (u.pathname.startsWith('/lib/')) return serveFile(res, path.join(ROOT, 'public', 'bgm', 'library', path.basename(u.pathname.slice(5))));
    if (u.pathname.startsWith('/out/')) return serveFile(res, path.join(ROOT, u.pathname.slice(1)));
    if (u.pathname.startsWith('/vo/')) return serveFile(res, path.join(ROOT, 'public', u.pathname.slice(1)));
    return send(res, 404, 'text/plain', 'not found');
  } catch (e) { send(res, 500, 'application/json', JSON.stringify({ok: false, error: String(e)})); }
});

server.listen(PORT, '127.0.0.1', () => console.log('sua-video: http://127.0.0.1:' + PORT));
