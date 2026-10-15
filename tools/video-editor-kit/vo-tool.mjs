// vo-tool.mjs — CONG CU DUYET VIDEO TRUOC KHI RENDER (HyperFrames / media-use)
//
// 3 chuc nang bat buoc theo AGENTS.md dieu 13:
//   (a) LOI DOC + GIONG  — sinh TTS tung doan, sua text, nghe, sinh lai tung doan, duyet tung doan
//   (b) THU TU DOAN      — keo len / xuong, timeline audio tinh lai theo thu tu moi
//   (c) HINH ANH         — gan 1 anh cho tung canh, thay the, xoa, xem thumbnail ngay
//
// KHONG render video khi user chua duyet het. Day chi la cong cu kiem tra.
//
//   node vo-tool.mjs voices                       # liet ke giong tieng Viet
//   node vo-tool.mjs sample --voice <id> [--line s01_hook]
//   node vo-tool.mjs gen [--voice <id>] [--speed 1.0] [--only s01,s02]
//   node vo-tool.mjs status
//   node vo-tool.mjs review [--port 5178]           # trang duyet
//   node vo-tool.mjs export                        # viet audio_meta.json + storyboard.json
//
// Moi thu deu nam tren o D:.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const SKILL_TTS =
  "file:///C:/Users/hoang/.config/opencode/skills/media-use/audio/scripts/lib/tts.mjs";
const SKILL_HEYGEN =
  "file:///C:/Users/hoang/.config/opencode/skills/media-use/audio/scripts/lib/heygen.mjs";

const { synthesizeOne, ffprobeDuration } = await import(SKILL_TTS);
const { heygenAuthHeaders, heygenJSON } = await import(SKILL_HEYGEN);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = path.join(ROOT, "script", "lyrics.json");
const STATE = path.join(ROOT, "script", "state.json");
const IMAGES = path.join(ROOT, "script", "images.json");
const AUDIO = path.join(ROOT, "audio");
const SAMPLES = path.join(AUDIO, "samples");
const IMGDIR = path.join(ROOT, "assets", "img");
const MAX_IMG_BYTES = 12 * 1024 * 1024;

// ── helpers ───────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? d : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
};
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", "utf8");
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const loadScript = () => readJson(SCRIPT);
const loadState = () =>
  fs.existsSync(STATE) ? { voice: "", voiceName: "", speed: 1.0, ...readJson(STATE) }
                       : { voice: "", voiceName: "", speed: 1.0, lines: {} };
const saveState = (s) => writeJson(STATE, s);
const loadImages = () => (fs.existsSync(IMAGES) ? readJson(IMAGES) : {});
const saveImages = (o) => writeJson(IMAGES, o);
const wavOf = (id) => path.join(AUDIO, `${id}.wav`);

// ── danh sach giong ───────────────────────────────────────────────────────────
async function listVietnameseVoices() {
  const headers = heygenAuthHeaders();
  let token = "";
  const all = [];
  for (let i = 0; i < 10; i++) {
    const q = new URLSearchParams({ engine: "starfish", type: "public", language: "Vietnamese" });
    if (token) q.set("next_token", token);
    const p = await heygenJSON(`/voices?${q.toString()}`, { headers });
    all.push(...(p.data ?? []));
    if (p.has_more && p.next_token && p.next_token !== token) token = p.next_token;
    else break;
  }
  const byId = new Map();
  for (const v of all) byId.set(v.voice_id, v);
  return [...byId.values()];
}

// ── nhanh Colab OmniVoice TTS (Cloudflare tunnel) ────────────────────────────
// API (doc trong AGENTS.md):
//   GET  /health  -> {ok,status,total_voices,supported_langs}
//   GET  /voices  -> {ok,voices:[{id,name,label,gender,lang,durationSec}]}
//   POST /tts     -> body {text,voice,speed,lang}  (KEY LA "voice", KHONG phai "voice_id")
//                   tra audio/ogg 24kHz mono
// URL lay tu  file <project>/tts-url.txt  hoac  bien moi truong TTS_URL.
const TTS_URL_FILE = path.join(ROOT, "tts-url.txt");
const FFMPEG = process.env.FFMPEG_PATH
  || "C:\\Users\\hoang\\AppData\\Local\\ffmpeg\\bin\\ffmpeg.exe";

function colabUrl() {
  const fromFile = fs.existsSync(TTS_URL_FILE)
    ? fs.readFileSync(TTS_URL_FILE, "utf8").split(/\r?\n/).map((s) => s.trim()).find(Boolean)
    : "";
  const u = (process.env.TTS_URL || fromFile || "").replace(/\/+$/, "");
  return u && /^https?:\/\//.test(u) ? u : "";
}

async function colabCall(pathname, { method = "GET", json, raw = false } = {}) {
  const base = colabUrl();
  if (!base) throw new Error("chua co URL Colab TTS — tao file tts-url.txt hoac dat $TTS_URL");
  const res = await fetch(base + pathname, {
    method,
    headers: json ? { "content-type": "application/json" } : {},
    body: json ? JSON.stringify(json) : undefined,
  });
  if (!res.ok) throw new Error(`Colab ${method} ${pathname} → HTTP ${res.status}`);
  return raw ? Buffer.from(await res.arrayBuffer()) : await res.json();
}

async function colabHealth() {
  try { return { ok: true, url: colabUrl(), ...(await colabCall("/health")) }; }
  catch (e) { return { ok: false, url: colabUrl(), error: e.message }; }
}

async function colabVoices() {
  const p = await colabCall("/voices");
  return (p.voices ?? [])
    .filter((v) => (v.lang ?? "vi") === "vi")
    .map((v) => ({
      voice_id: v.id,
      name: v.name || v.label || v.id,
      gender: v.gender ?? "",
      language: "vi",
      provider: "colab",
    }));
}

// ogg (24kHz mono) → wav 44.1kHz mono de cac script do/phan tich doc duoc
function oggToWav(oggBuf, wavAbs) {
  return new Promise((res, rej) => {
    if (!fs.existsSync(FFMPEG)) return rej(new Error("khong tim thay ffmpeg: " + FFMPEG));
    const tmp = wavAbs + ".tmp.ogg";
    fs.mkdirSync(path.dirname(wavAbs), { recursive: true });
    fs.writeFileSync(tmp, oggBuf);
    const p = spawn(FFMPEG, ["-y", "-i", tmp, "-ac", "1", "-ar", "44100", wavAbs], {
      windowsHide: true,
    });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", rej);
    p.on("close", (code) => {
      fs.rmSync(tmp, { force: true });
      if (code !== 0 || !fs.existsSync(wavAbs)) rej(new Error("ffmpeg that bai: " + err.slice(-300)));
      else res();
    });
  });
}

async function colabSynth({ text, voice, speed, wavAbs }) {
  const ogg = await colabCall("/tts", {
    method: "POST",
    json: { text, voice, speed: Number(speed) || 1.0, lang: "vi" },
    raw: true,
  });
  if (!ogg.length || ogg.length < 512) throw new Error("Colab tra ve audio rong/rac");
  await oggToWav(ogg, wavAbs);
  return { ok: true, words: null, bytes: ogg.length };
}

// ── (a) sinh TTS tung doan ────────────────────────────────────────────────────
let busy = false;
const sseClients = new Set();
function broadcast(msg) {
  const data = `data: ${JSON.stringify(msg)}\n\n`;
  for (const r of sseClients) {
    try { r.write(data); } catch { sseClients.delete(r); }
  }
}
function pushState(extra = {}) {
  broadcast({ t: "state", state: summary(), ...extra });
}

async function genOne(id, log = console.log) {
  const line = loadScript().lines.find((l) => l.id === id);
  if (!line) return { ok: false, error: `khong co dong "${id}"` };
  const st = loadState();
  if (!st.voice) return { ok: false, error: "chua chon giong" };
  if (!line.text.trim()) return { ok: false, error: "dong rong" };

  const h = sha(line.text + "|" + st.voice + "|" + st.speed + "|" + (st.provider || ""));
  const prev = st.lines[id];
  if (prev && prev.hash === h && fs.existsSync(wavOf(id)))
    return { ok: true, skipped: true, duration_s: prev.duration_s };

  fs.mkdirSync(AUDIO, { recursive: true });
  broadcast({ t: "line", id, status: "busy" });
  const t0 = Date.now();
  const provider = st.provider || (colabUrl() ? "colab" : "heygen");
  let r;
  if (provider === "colab") {
    try {
      r = await colabSynth({ text: line.text, voice: st.voice, speed: st.speed, wavAbs: wavOf(id) });
    } catch (e) { r = { ok: false, error: e.message }; }
  } else {
    r = await synthesizeOne({
      provider: "heygen", text: line.text, voiceId: st.voice, lang: "vi",
      speed: st.speed, wavAbs: wavOf(id), hyperframesDir: ROOT,
    });
  }
  if (!r.ok) {
    log(`  ✗ ${id}: ${String(r.error).split("\n")[0]}`);
    broadcast({ t: "line", id, status: "fail", error: String(r.error).split("\n")[0] });
    return { ok: false, error: r.error };
  }
  const dur = ffprobeDuration(wavOf(id));
  const s2 = loadState();
  s2.provider = provider;
  s2.lines[id] = {
    hash: h, duration_s: dur, words: r.words ?? null, provider,
    approved: false, gen_at: new Date().toISOString(),
  };
  saveState(s2);
  log(`  ✓ ${id}  ${dur.toFixed(2)}s  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  broadcast({ t: "line", id, status: "done", duration_s: dur });
  return { ok: true, duration_s: dur };
}

// Sinh song song `conc` dong — trang web cap nhat ngay sau tung dong xong (SSE).
async function genMany(ids, log = console.log, conc = 3) {
  if (busy) return { ok: false, error: "may dang sinh, thu lai sau" };
  busy = true;
  const queue = [...ids];
  let done = 0;
  const total = queue.length;
  broadcast({ t: "gen-start", total });
  try {
    const worker = async () => {
      while (queue.length) {
        const id = queue.shift();
        const r = await genOne(id, log);
        if (r.ok) done++;
        pushState({ gen: { done, total } });
        await sleep(200);
      }
    };
    await Promise.all(Array.from({ length: Math.min(conc, total) }, worker));
    broadcast({ t: "gen-end", done, total });
    return { ok: true, done, total };
  } finally {
    busy = false;
    pushState();
  }
}

// ── tong hop: thu tu hien tai + timeline ──────────────────────────────────────
function summary() {
  const sc = loadScript();
  const st = loadState();
  const imgs = loadImages();
  let t = 0;
  const lines = sc.lines.map((l, i) => {
    const m = st.lines[l.id];
    const onDisk = fs.existsSync(wavOf(l.id));
    const dur = onDisk ? (m?.duration_s ?? 0) : 0;   // file bi xoa thi khong con tinh thoi luong
    const start = t;
    t += dur;
    const im = imgs[l.id];
    return {
      n: i + 1, id: l.id, scene: l.scene, text: l.text,
      dur: onDisk ? dur : null,
      start_s: +start.toFixed(3),
      fresh: m ? m.hash === sha(l.text + "|" + st.voice + "|" + st.speed + "|" + (st.provider || "")) : false,
      approved: !!m?.approved,
      onDisk,
      image: im?.file ?? null,
      imageNote: im?.note ?? "",
      noImageOk: !!im?.optional,
    };
  });
  return {
    voice: st.voice, voiceName: st.voiceName, speed: st.speed, provider: st.provider || "", lines,
    total_s: +t.toFixed(3),
    generated: lines.filter((r) => r.onDisk).length,
    approved: lines.filter((r) => r.approved).length,
    withImage: lines.filter((r) => r.image).length,
    stale: lines.filter((r) => r.onDisk && !r.fresh).map((r) => r.id),
  };
}

// ── (b) doi thu tu ────────────────────────────────────────────────────────────
function move(id, dir) {
  const s = loadScript();
  const i = s.lines.findIndex((l) => l.id === id);
  if (i < 0) throw new Error("id sai");
  const j = i + (dir === "up" ? -1 : 1);
  if (j < 0 || j >= s.lines.length) return { ok: true, moved: false };
  [s.lines[i], s.lines[j]] = [s.lines[j], s.lines[i]];
  writeJson(SCRIPT, s);
  return { ok: true, moved: true };
}

// ── (c) gan anh ───────────────────────────────────────────────────────────────
const EXT = { ".png": 1, ".jpg": 1, ".jpeg": 1, ".webp": 1, ".gif": 1, ".avif": 1 };
function setImage(id, { b64, filename, optional, clear }) {
  const s = loadScript();
  if (!s.lines.some((l) => l.id === id)) throw new Error("id sai");
  fs.mkdirSync(IMGDIR, { recursive: true });
  const cur = loadImages();
  if (clear) {
    if (cur[id]?.file) { try { fs.unlinkSync(path.join(IMGDIR, cur[id].file)); } catch {} }
    if (optional) cur[id] = { file: null, optional: true, note: cur[id]?.note ?? "" };
    else delete cur[id];
    saveImages(cur);
    return { ok: true };
  }
  const ext = (path.extname(filename || "") || ".png").toLowerCase();
  if (!EXT[ext]) throw new Error("khong ho tro dinh dang " + ext);
  const buf = Buffer.from(b64, "base64");
  if (buf.length > MAX_IMG_BYTES) throw new Error("anh qua lon (>12MB)");
  // xoa file cu cua dong nay truoc khi ghi de
  if (cur[id]?.file) { try { fs.unlinkSync(path.join(IMGDIR, cur[id].file)); } catch {} }
  const file = `${id}${ext}`;
  fs.writeFileSync(path.join(IMGDIR, file), buf);
  cur[id] = { file, note: filename || "", optional: !!optional, bytes: buf.length };
  saveImages(cur);
  return { ok: true, file };
}

// ── export ────────────────────────────────────────────────────────────────────
function exportMeta() {
  const sc = loadScript();
  const st = loadState();
  const imgs = loadImages();
  const voices = [];
  const storyboard = [];
  let t = 0;
  for (const l of sc.lines) {
    const m = st.lines[l.id];
    if (!m || !fs.existsSync(wavOf(l.id))) throw new Error(`chua sinh: ${l.id}`);
    voices.push({
      id: l.id, path: `audio/${l.id}.wav`, duration_s: m.duration_s,
      start_s: +t.toFixed(3), approved: !!m.approved, words: m.words ?? [],
    });
    storyboard.push({
      id: l.id, scene: l.scene, text: l.text,
      audio: `audio/${l.id}.wav`, duration_s: m.duration_s, start_s: +t.toFixed(3),
      image: imgs[l.id]?.file ? `assets/img/${imgs[l.id].file}` : null,
    });
    t += m.duration_s;
  }
  writeJson(path.join(ROOT, "audio_meta.json"), {
    _video: sc._video, voice: st.voice, voice_name: st.voiceName,
    lang: "vi", speed: st.speed, voices, total_duration_s: +t.toFixed(3),
  });
  writeJson(path.join(ROOT, "storyboard.json"), {
    _video: sc._video, total_duration_s: +t.toFixed(3), frames: storyboard,
  });
  return { voices: voices.length, total: t };
}

// ── trang duyet ───────────────────────────────────────────────────────────────
const PAGE = String.raw`<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyet video truoc khi render</title>
<style>
  :root{--bg:#0b1020;--card:#141b32;--line:#243055;--fg:#e8ecf8;--dim:#93a0c4;
        --acc:#5ad1a0;--warn:#ffcf5c;--bad:#ff7a7a;--img:#7ad7ff}
  *{box-sizing:border-box}
  body{margin:0;background:linear-gradient(160deg,#0b1020,#0d1a2e 60%,#0b1020);color:var(--fg);
       font:15px/1.55 "Segoe UI",system-ui,sans-serif;padding:18px 22px 90px}
  h1{font-size:20px;margin:0 0 3px} .sub{color:var(--dim);font-size:13px;margin-bottom:14px}
  .bar{display:flex;flex-wrap:wrap;gap:7px;align-items:center;background:var(--card);
       border:1px solid var(--line);border-radius:12px;padding:11px 13px;position:sticky;top:0;z-index:9}
  button,select{background:#1c2647;color:var(--fg);border:1px solid var(--line);border-radius:8px;
       padding:6px 11px;font:inherit;cursor:pointer}
  button:hover{border-color:var(--acc)} button:disabled{opacity:.45;cursor:not-allowed}
  button.go{background:var(--acc);color:#06231a;font-weight:600;border:0}
  button.sm{padding:3px 8px;font-size:13px}
  .stat{color:var(--dim);font-size:13px;margin-left:auto;text-align:right}
  .prog{height:6px;background:#0a0f1e;border-radius:4px;overflow:hidden;margin:6px 0 4px}
  .prog i{display:block;height:100%;background:linear-gradient(90deg,var(--acc),var(--img));width:0;transition:width .3s}
  .row{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--line);
       border-radius:10px;padding:11px 13px;margin-bottom:9px}
  .row.ok{border-left-color:var(--acc)} .row.stale{border-left-color:var(--warn)}
  .row.noimg{border-left-color:var(--bad)}
  .hd{display:flex;gap:9px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
  .n{color:var(--dim);font-variant-numeric:tabular-nums;min-width:22px}
  .sc{font-weight:600} .tag{color:var(--dim);font-size:12.5px}
  .dur{margin-left:auto;font-variant-numeric:tabular-nums;font-size:12.5px;color:var(--dim)}
  .badge{font-size:11px;padding:1px 8px;border-radius:99px;border:1px solid var(--line);color:var(--dim)}
  .badge.ok{background:#0f3327;border-color:var(--acc);color:var(--acc)}
  .badge.stale{background:#3a2f0d;border-color:var(--warn);color:var(--warn)}
  .badge.miss{background:#3a1414;border-color:var(--bad);color:var(--bad)}
  textarea{width:100%;background:#0a0f1e;color:var(--fg);border:1px solid var(--line);border-radius:8px;
       padding:8px 10px;font:14px/1.6 inherit;resize:vertical;min-height:58px}
  textarea:focus{outline:none;border-color:var(--acc)}
  audio{width:100%;height:30px;margin-top:7px}
  .acts{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap;align-items:center}
  .msg{font-size:12px;margin-left:auto}
  .imgbox{margin-top:8px;display:flex;gap:10px;align-items:flex-start}
  .drop{flex:1;min-height:70px;border:1.5px dashed var(--line);border-radius:8px;
       display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:12.5px;
       text-align:center;padding:8px;cursor:pointer}
  .drop.hot{border-color:var(--img);color:var(--img);background:#0c1b2a}
  .drop.has{border-style:solid;border-color:var(--img)}
  .thumb{max-width:150px;max-height:92px;border-radius:6px;border:1px solid var(--line);display:block}
  .lab{font-size:11.5px;color:var(--dim);display:flex;align-items:center;gap:5px}
  .foot{margin-top:20px;color:var(--dim);font-size:13px;line-height:1.85}
  code{background:#0a0f1e;padding:1px 6px;border-radius:5px;border:1px solid var(--line)}
  #playAll{position:fixed;right:18px;bottom:18px;z-index:10;display:none}
  .live{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--img)}
  .dot{width:8px;height:8px;border-radius:50%;background:var(--img);animation:pulse 1s infinite}
  .dot.off{background:#4a5578;animation:none}
  @keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}
  .badge.busy{background:#0c1b2a;border-color:var(--img);color:var(--img)}
  .badge.err{background:#3a1414;border-color:var(--bad);color:var(--bad)}
  .row.busy{opacity:.75}
  .spin{display:inline-block;width:11px;height:11px;border:2px solid var(--img);
        border-top-color:transparent;border-radius:50%;animation:sp .7s linear infinite;vertical-align:-1px}
  @keyframes sp{to{transform:rotate(360deg)}}
</style></head><body>
<h1>Duyet video truoc khi render</h1>
<div class="sub">Sua loi doc &amp; gan anh &amp; sap lai thu tu. Chi khi het dong nao chua duyet moi duoc render.</div>

<div class="bar">
  <label class="tag">Giong</label><select id="voice"></select>
  <label class="tag">Toc do</label><select id="speed">
    <option>0.9</option><option>0.95</option><option selected>1.0</option><option>1.05</option><option>1.1</option>
  </select>
  <button id="saveVoice">Luu giong</button>
  <button id="genMiss">Sinh dong thieu</button>
  <button class="go" id="genAll">Sinh / sinh lai TAT CA</button>
  <span class="live"><i class="dot" id="live"></i><span id="livetxt">thoi gian thuc</span></span>
  <div class="stat" id="stat"></div>
</div>
<div class="prog"><i id="bar"></i></div>
<div id="list"></div>
<button id="playAll">▶ Nghe ca bai</button>
<div class="foot">
 <b>Quy tac doc:</b> so viet bang chu — <code>26%</code> → <code>hai mươi sáu phần tram</code>;
 <code>3,5 km</code> → <code>ba phay nam ki lo met</code>; <code>150 kW</code> → <code>mot tram nam muoi ki lo oat</code>.
 Dau phay = ngat ngan, cham = ngat vua, ba cham = ngat lau.<br>
 <b>Khong viet trong loi doc:</b> kW, BMS, B2B, SOC, Wh, kWh, %, &amp;, dau gach.
</div>
<script>
let S=null, cur={lines:[],total:0}, ROW={}, draft={}, pending=new Set(), busyIds=new Set();
const $=(s)=>document.querySelector(s);
const mm=(s)=>Math.floor(s/60)+":"+String(Math.round(s%60)).padStart(2,"0");
const sig=(l)=>[l.n,l.dur,l.start_s,l.stale,l.approved,l.onDisk,l.image,l.noImageOk].join("|");

async function api(p,body){
  const r=await fetch(p,{method:"POST",headers:{"content-type":"application/json"},
                          body:JSON.stringify(body||{})});
  const j=await r.json();
  if(!r.ok||j.error) throw new Error(j.error||r.statusText);
  return j;
}

async function load(){
  S = await (await fetch("/api/state")).json();
  const vs=$("#voice");
  if(vs.options.length===0)
    for(const v of S.voices) vs.add(new Option(v.name+" · "+v.gender+" · "+v.language, v.voice_id));
  if(S.state.voice) vs.value=S.state.voice;
  $("#speed").value=String(S.state.speed||1);
  applyState(S.state);
  renderAll();
}

function setLive(on,txt){ $("#live").className="dot"+(on?"":" off"); $("#livetxt").textContent=txt; }

function applyState(st,gen){
  cur={lines:st.lines,total:st.lines.length};
  const n=st.lines.length||1;
  $("#stat").innerHTML="sinh <b>"+st.generated+"/"+n+"</b> · duyet <b>"+st.approved+"/"+n+
    " · anh <b>"+st.withImage+"/"+n+"</b> · tong "+mm(st.total_s)+
    (gen? ' · <span style="color:var(--img)">dang sinh '+gen.done+'/'+gen.total+'</span>':'');
  $("#bar").style.width=(st.approved/n*100)+"%";
  if(ROW.lists && sigList(ROW.lists)!==sigList(st.lines)) renderAll();
  else for(const l of st.lines){
    const el=ROW[l.id]; if(!el) continue;
    if(el._sig!==sig(l)) refreshRow(l);
  }
}
const sigList=(a)=>a.map(sig).join("#");

function renderAll(){
  const list=$("#list"); list.innerHTML=""; ROW={};
  cur.lines.forEach((l,i)=>{ const el=buildRow(l,i,cur.lines.length); ROW[l.id]=el; list.appendChild(el); });
}

function refreshRow(l){
  const old=ROW[l.id]; if(!old) return;
  if(old.contains(document.activeElement)){ pending.add(l.id); return; }   // dang sua -> de lai
  const i=cur.lines.findIndex(x=>x.id===l.id);
  const el=buildRow(l,i,cur.lines.length);
  old.replaceWith(el); ROW[l.id]=el;
}

function setBusy(id,on,txt){
  busyIds.add(id);
  const el=ROW[id]; if(!el) return;
  el.classList.toggle("busy",on);
  const h=el.querySelector(".hd");
  let b=h.querySelector(".badge.busy");
  if(on){
    if(!b){ b=document.createElement("span"); b.className="badge busy";
            h.insertBefore(b, h.querySelector(".mv")); }
    b.innerHTML='<i class="spin"></i> '+txt;
  } else if(b) b.remove();
}

function buildRow(l,i,rows){
  const cls = l.stale ? "stale" : (!l.image && !l.noImageOk ? "noimg" : (l.approved?"ok":""));
  const el=document.createElement("div");
  el.className="row "+cls+(busyIds.has(l.id)?" busy":"");
  el._sig=sig(l); el._id=l.id;
  el.addEventListener("focusout",()=>{ if(pending.has(l.id)){ pending.delete(l.id); refreshRow(l); } });
  const badge = l.stale ? '<span class="badge stale">can sinh lai</span>'
               : l.approved ? '<span class="badge ok">DA DUYET</span>'
               : l.onDisk ? '<span class="badge">cho duyet</span>'
               : '<span class="badge miss">chua sinh</span>';
  el.innerHTML=
    '<div class="hd"><span class="n">'+l.n+'</span><span class="sc"></span><span class="tag"></span>'+
    '<span class="dur">'+mm(l.start_s)+" → "+mm(l.start_s+(l.dur||0))+
    (l.dur?"  ("+l.dur.toFixed(1)+"s)":"  (—)")+'</span>'+badge+
    '<button class="sm mv" data-d="up"'+(i===0?" disabled":"")+'>↑</button>'+
    '<button class="sm mv" data-d="down"'+(i===rows-1?" disabled":"")+'>↓</button></div>'+
    '<textarea rows="2"></textarea>'+
    (l.onDisk?'<audio controls preload="none" src="/audio/'+l.id+'.wav?t='+Date.now()+'"></audio>':'')+
    '<div class="imgbox"><div class="drop'+(l.image?" has":"")+'"></div>'+
      '<div style="display:flex;flex-direction:column;gap:5px">'+
        (l.image?'<img class="thumb" src="/assets/img/'+l.image+'?t='+Date.now()+'">'+
                 '<button class="sm rmimg">Xoa anh</button>':'')+
      '</div></div>'+
    '<label class="lab"><input type="checkbox" class="opt"'+(l.noImageOk?" checked":"")+
      '> canh nay ve bang do hoa, khong can anh</label>'+
    '<div class="acts"><button class="gen">Sinh lai dong nay</button>'+
      '<button class="save">Luu text</button><button class="ok">'+(l.approved?"Bo duyet":"Duyet OK")+
      '</button><span class="msg"></span></div>';
  el.querySelector(".sc").textContent=l.id;
  el.querySelector(".tag").textContent=l.scene;
  const ta=el.querySelector("textarea");
  ta.value = (draft[l.id]!==undefined ? draft[l.id] : l.text);
  ta.addEventListener("input",()=>{ draft[l.id]=ta.value; });
  const msg=el.querySelector(".msg");
  const say=(t,bad)=>{msg.textContent=t;msg.style.color=bad?"var(--bad)":"var(--acc)";};
  el.querySelectorAll(".mv").forEach(b=>b.onclick=async()=>{ await api("/api/move",{id:l.id,dir:b.dataset.d}); });
  el.querySelector(".save").onclick=async()=>{
    try{ await api("/api/text",{id:l.id,text:ta.value}); delete draft[l.id]; say("da luu"); }
    catch(e){ say(e.message,true); } };
  el.querySelector(".gen").onclick=async()=>{
    try{
      if(ta.value!==l.text){ await api("/api/text",{id:l.id,text:ta.value}); delete draft[l.id]; }
      say("da gui, dang sinh…");
    }catch(e){ say(e.message,true); }
  };
  el.querySelector(".ok").onclick=async()=>{ await api("/api/approve",{id:l.id,ok:!l.approved}); };
  el.querySelector(".opt").onchange=async(e)=>{ await api("/api/image",{id:l.id,optional:e.target.checked}); };
  const rm=el.querySelector(".rmimg"); if(rm) rm.onclick=async()=>{ await api("/api/image",{id:l.id,clear:true}); };
  const drop=el.querySelector(".drop");
  drop.textContent = l.image ? "Anh: "+l.image : "Keo anh vao day\nhoac bam de chon file";
  drop.style.whiteSpace="pre-line";
  const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.style.display="none";
  drop.onclick=()=>inp.click();
  inp.onchange=()=>{ if(inp.files[0]) up(l.id, inp.files[0]); };
  drop.ondragover=e=>{e.preventDefault();drop.classList.add("hot");};
  drop.ondragleave=()=>drop.classList.remove("hot");
  drop.ondrop=e=>{e.preventDefault();drop.classList.remove("hot");
                  if(e.dataTransfer.files[0]) up(l.id,e.dataTransfer.files[0]);};
  el.appendChild(inp);
  return el;
}

async function up(id,file){
  const fr=new FileReader();
  fr.onload=async()=>{ const b64=String(fr.result).split(",")[1];
    try{ await api("/api/image",{id:id,b64:b64,filename:file.name}); }catch(e){ alert(e.message); } };
  fr.readAsDataURL(file);
}

$("#saveVoice").onclick=async()=>{ await api("/api/voice",{voice:$("#voice").value,speed:parseFloat($("#speed").value)}); };
$("#genAll").onclick=async()=>{
  await api("/api/voice",{voice:$("#voice").value,speed:parseFloat($("#speed").value)});
  await api("/api/gen",{ids:[]});
};
$("#genMiss").onclick=async()=>{ await api("/api/gen",{ids:[],onlyMissing:true}); };

// nghe ca bai theo dung thu tu hien tai
let seq=[],sqi=-1,aud=null;
$("#playAll").onclick=()=>{
  if(aud){ aud.pause(); aud=null; $("#playAll").textContent="▶ Nghe ca bai"; return; }
  seq=cur.lines.filter(l=>l.onDisk).map(l=>l.id);
  if(!seq.length) return; sqi=-1; next();
  $("#playAll").textContent="⏹ Dung";
};
function next(){
  sqi++;
  if(sqi>=seq.length){ aud=null; $("#playAll").textContent="▶ Nghe ca bai"; return; }
  aud=new Audio("/audio/"+seq[sqi]+".wav");
  aud.onended=next; aud.play();
}

// ── thoi gian thuc: Server-Sent Events (co fallback polling) ───────────────
function onMsg(m){
  if(m.t==="state"){ setLive(true,"cap nhat truc tiep"); applyState(m.state,m.gen); }
  else if(m.t==="gen-start"){ setLive(true,"dang sinh "+m.total+" dong"); }
  else if(m.t==="gen-end"){ busyIds.clear(); setLive(true,"xong");
    for(const id in ROW) ROW[id].classList.remove("busy"); }
  else if(m.t==="line"){
    if(m.status==="busy") setBusy(m.id,true,"dang sinh…");
    else { setBusy(m.id,false); if(m.status==="fail"){ const el=ROW[m.id];
             if(el){ const c=el.querySelector(".badge"); if(c) c.className="badge err",
                       c.textContent="loi: "+(m.error||"").slice(0,40); } } }
  }
}
function connect(){
  const es=new EventSource("/api/events");
  es.onmessage=(e)=>{ try{ onMsg(JSON.parse(e.data)); }catch{} };
  es.onerror=()=>{ es.close(); setLive(false,"mất kết nối — tự tải lại mỗi 2s");
    setInterval(()=>{ fetch("/api/state").then(r=>r.json()).then(j=>{ S=j; applyState(j.state); }).catch(()=>{}); },2000); };
}
load().then(connect);
</script></body></html>`;

// ── server ────────────────────────────────────────────────────────────────────
async function loadVoices() {
  // uu tien giong Colab (20 giong Viet, mien phi); khong thi lui ve HeyGen
  const h = await colabHealth();
  if (h.ok) {
    try {
      const v = await colabVoices();
      if (v.length) return { voices: v, provider: "colab", colab: h };
    } catch {}
  }
  try { return { voices: await listVietnameseVoices(), provider: "heygen", colab: h }; }
  catch (e) { return { voices: [], provider: "", colab: h }; }
}

async function serve(port) {
  let { voices, provider: defProvider, colab: colabInfo } = await loadVoices();
  let servedAt = Date.now();
  const s0 = summary();

  const body = async (req) => {
    const c = [];
    for await (const x of req) c.push(x);
    return c.length ? JSON.parse(Buffer.concat(c).toString("utf8")) : {};
  };

  const srv = http.createServer(async (req, res) => {
    const u = new URL(req.url, "http://x");
    const reply = (code, type, b) => {
      const t = type.startsWith("application/json") ? type + "; charset=utf-8" : type;
      res.writeHead(code, { "content-type": t, "cache-control": "no-store" });
      res.end(b);
    };
    try {
      if (u.pathname === "/" || u.pathname === "/index.html")
        return reply(200, "text/html; charset=utf-8", Buffer.from(PAGE, "utf8"));

      if (/^\/[a-z0-9._-]+\.html$/i.test(u.pathname)) {
        const f = path.join(ROOT, "review", path.basename(u.pathname));
        if (fs.existsSync(f)) return reply(200, "text/html; charset=utf-8", fs.readFileSync(f));
      }
      if (u.pathname.startsWith("/audio/")) {
        const f = path.join(AUDIO, path.basename(u.pathname));
        if (fs.existsSync(f)) return reply(200, "audio/wav", fs.readFileSync(f));
        return reply(404, "text/plain", "no audio");
      }
      if (u.pathname.startsWith("/samples/")) {
        const f = path.join(SAMPLES, path.basename(u.pathname));
        if (fs.existsSync(f)) return reply(200, "audio/wav", fs.readFileSync(f));
        return reply(404, "text/plain", "no sample");
      }
      if (u.pathname.startsWith("/assets/img/")) {
        const f = path.join(IMGDIR, path.basename(u.pathname));
        if (fs.existsSync(f)) {
          const ct = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                        ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif" }[
            path.extname(f).toLowerCase()] || "application/octet-stream";
          return reply(200, ct, fs.readFileSync(f));
        }
        return reply(404, "text/plain", "no image");
      }

      if (u.pathname === "/api/state") {
        // tu lam moi danh sach giong: user mo Colab xong / doi provider giua chung
        const age = (Date.now() - servedAt) / 1000;
        if (age > 20) { servedAt = Date.now(); ({ voices, provider: defProvider, colab: colabInfo } = await loadVoices()); }
        const s = summary();
        return reply(200, "application/json", JSON.stringify({
          state: s, voices, provider: s.provider || defProvider, colab: colabInfo, lines: s.lines }));
      }
      // --- SSE: trang web tu cap nhat khi co dong sinh xong (khong can F5)
      if (u.pathname === "/api/events") {
        res.writeHead(200, {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-store",
          connection: "keep-alive",
        });
        res.write(": connected\n\n");
        sseClients.add(res);
        res.write(`data: ${JSON.stringify({ t: "state", state: summary() })}\n\n`);
        const ka = setInterval(() => {
          try { res.write(": ka\n\n"); } catch {}
        }, 15000);
        req.on("close", () => { clearInterval(ka); sseClients.delete(res); });
        return;
      }
      if (u.pathname === "/api/voice") {
        const b = await body(req);
        const s = loadState();
        s.voice = b.voice;
        s.speed = Number(b.speed) || 1;
        s.voiceName = (voices.find((v) => v.voice_id === b.voice) || {}).name || "";
        s.provider = b.provider || defProvider || (colabUrl() ? "colab" : "heygen");
        saveState(s);
        console.log(`  [voice] ${s.voiceName}  ${s.provider}  speed=${s.speed}`);
        pushState();
        return reply(200, "application/json", JSON.stringify({ ok: true }));
      }
      if (u.pathname === "/api/text") {
        const b = await body(req);
        const s = loadScript();
        const l = s.lines.find((x) => x.id === b.id);
        if (!l) return reply(400, "application/json", JSON.stringify({ error: "id sai" }));
        l.text = b.text;
        writeJson(SCRIPT, s);
        pushState();
        return reply(200, "application/json", JSON.stringify({ ok: true }));
      }
      if (u.pathname === "/api/approve") {
        const b = await body(req);
        const s = loadState();
        if (!s.lines[b.id]) s.lines[b.id] = {};
        s.lines[b.id].approved = !!b.ok;
        saveState(s);
        pushState();
        return reply(200, "application/json", JSON.stringify({ ok: true }));
      }
      if (u.pathname === "/api/move") {
        const b = await body(req);
        const r = move(b.id, b.dir);
        pushState();
        return reply(200, "application/json", JSON.stringify(r));
      }
      if (u.pathname === "/api/image") {
        const b = await body(req);
        const r = setImage(b.id, b);
        pushState();
        return reply(200, "application/json", JSON.stringify(r));
      }
      if (u.pathname === "/api/gen") {
        const b = await body(req);
        if (!loadState().voice)
          return reply(400, "application/json", JSON.stringify({ error: "chua chon giong" }));
        const sc = loadScript();
        let ids = Array.isArray(b.ids) && b.ids.length ? b.ids : sc.lines.map((l) => l.id);
        if (b.onlyMissing) {
          const sm = summary();
          const need = new Set([...sm.lines.filter((r) => !r.onDisk).map((r) => r.id), ...sm.stale]);
          ids = ids.filter((i) => need.has(i));
        }
        reply(200, "application/json", JSON.stringify({ ok: true, queued: ids.length }));
        setTimeout(async () => {
          console.log(`  [gen] ${ids.length} dong…`);
          const r = await genMany(ids, (m) => console.log(m));
          console.log(`  [gen] xong ${r.done}/${r.total}`);
        }, 30);
        return;
      }
      reply(404, "text/plain", "404");
    } catch (e) {
      reply(500, "application/json", JSON.stringify({ error: String(e.message || e) }));
    }
  });

  srv.listen(port, "127.0.0.1", () => {
    console.log(`\n  TRANG DUYET:  http://127.0.0.1:${port}`);
    console.log(`  giong: ${s0.voiceName || "(chua chon)"} · sinh ${s0.generated}/${s0.lines.length}` +
                ` · duyet ${s0.approved}/${s0.lines.length} · anh ${s0.withImage}/${s0.lines.length}\n`);
    spawn("cmd", ["/c", "start", "", `http://127.0.0.1:${port}`], { detached: true, stdio: "ignore" }).unref();
  });
}

// ── CLI ───────────────────────────────────────────────────────────────────────
const cmd = argv[0] || "help";
try {
  if (cmd === "voices") {
    const h = await colabHealth();
    if (h.ok) {
      const v = await colabVoices();
      console.log(`\n  Colab: ${h.url}`);
      console.log(`  server: ${h.status} · ${h.total_voices ?? v.length} giong · langs: ${(h.supported_langs || []).join(",")}\n`);
      for (const x of v) console.log(`  ${x.voice_id.padEnd(28)} ${x.name.padEnd(30)} ${x.gender}`);
      console.log("");
    } else {
      console.log(`\n  [colab] ${h.ok ? "OK " : "CHUA MO"} — ${h.error || h.url || "chua co tts-url.txt / $TTS_URL"}\n`);
      const v = await listVietnameseVoices();
      console.log(`  ${v.length} giong tieng Viet (HeyGen Starfish)\n`);
      for (const x of v) console.log(`  ${x.voice_id}  ${x.name.padEnd(26)} ${x.gender}  ${x.language}`);
      console.log("");
    }
  } else if (cmd === "health") {
    const h = await colabHealth();
    console.log("\n  " + JSON.stringify(h, null, 2).replace(/\n/g, "\n  ") + "\n");
    if (!h.ok) process.exitCode = 2;
  } else if (cmd === "sample") {
    const st = loadState();
    const v = flag("voice", st.voice);
    if (!v) throw new Error("can --voice <id>");
    st.voice = v; st.voiceName = v;
    const provider = flag("provider", st.provider || (colabUrl() ? "colab" : "heygen"));
    st.provider = provider; saveState(st);
    fs.mkdirSync(SAMPLES, { recursive: true });
    const line = flag("line", "s01_hook");
    const l = loadScript().lines.find((x) => x.id === line);
    const out = path.join(SAMPLES, `${v.slice(0, 8)}-${line}.wav`);
    if (provider === "colab")
      await colabSynth({ text: l.text, voice: v, speed: st.speed, wavAbs: out });
    else {
      const r = await synthesizeOne({ provider: "heygen", text: l.text, voiceId: v, lang: "vi",
        speed: st.speed, wavAbs: out, hyperframesDir: ROOT });
      if (!r.ok) throw new Error(r.error);
    }
    console.log(`\n  ✓ ${out}\n  ${ffprobeDuration(out).toFixed(2)}s  ·  ${provider}\n`);
  } else if (cmd === "gen") {
    const st = loadState();
    if (flag("voice")) { st.voice = flag("voice"); st.voiceName = flag("voice"); }
    if (flag("speed")) st.speed = Number(flag("speed"));
    saveState(st);
    const sc = loadScript();
    const only = flag("only");
    const ids = only ? String(only).split(",").map((s) => s.trim()) : sc.lines.map((l) => l.id);
    console.log(`\n  Sinh ${ids.length} dong · giong ${st.voiceName || st.voice} · toc do ${st.speed}\n`);
    const r = await genMany(ids);
    const s = summary();
    console.log(`\n  Xong ${r.done}/${r.total} · tong ${s.total_s.toFixed(1)}s · duyet ${s.approved}/${s.lines.length}`);
    if (s.stale.length) console.log(`  CAN SINH LAI: ${s.stale.join(", ")}`);
    console.log("");
  } else if (cmd === "status") {
    const s = summary();
    console.log(`\n  giong: ${s.voiceName || s.voice || "(chua chon)"} · toc do: ${s.speed}\n`);
    for (const r of s.lines) {
      const st = r.stale ? "C" : r.approved ? "O" : r.onDisk ? "-" : " ";
      const im = r.image ? "IMG" : r.noImageOk ? "  -" : "!! ";
      console.log(
        `  [${st}]${im} ${String(r.n).padStart(2)}. ${r.id.padEnd(14)} ` +
        `${(r.dur ? r.dur.toFixed(2) + "s" : "  -  ").padStart(7)}  ${r.scene}`,
      );
    }
    console.log(`\n  sinh ${s.generated}/${s.lines.length} · duyet ${s.approved}/${s.lines.length}` +
                ` · anh ${s.withImage}/${s.lines.length} · tong ${s.total_s.toFixed(1)}s`);
    if (s.stale.length) console.log(`  CAN SINH LAI: ${s.stale.join(", ")}`);
    console.log("");
  } else if (cmd === "review") {
    await serve(Number(flag("port", 5178)));
  } else if (cmd === "export") {
    const m = exportMeta();
    console.log(`  ✓ audio_meta.json + storyboard.json · ${m.voices} dong · tong ${m.total.toFixed(2)}s`);
  } else {
    console.log(`
  vo-tool.mjs — duyet video truoc khi render

    voices                        liet ke giong tieng Viet
    sample --voice <id> [--line s01_hook]
    gen [--voice <id>] [--speed 1.0] [--only s01,s02]
    status                        bang trang thai (O=duyet, C=can sinh lai, IMG=co anh, !!=thieu anh)
    review [--port 5178]          mo trang duyet
    export                        viet audio_meta.json + storyboard.json
`);
  }
} catch (e) {
  console.error("  ✗ " + (e.message || e));
  process.exit(1);
}
