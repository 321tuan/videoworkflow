import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';

export type Word = {text: string; start: number; end: number};

// Unwrap file JSON {words:[...]} do faster-whisper sinh (resolveJsonModule).
export const W = (j: unknown): Word[] => (j as {words: Word[]}).words;

// Chia words thanh cum on dinh: toi da 6 tu, ngat o dau cau / khe im >= 0.45s.
// Moi cum hien NGUYEN VEN trong suot span cua no (toi thieu 1s) — khong bam tung tu (~0.3s)
// gay giat va lat nhanh khong kip doc (bai hoc 01/10/2026). Khe im giu nguyen cum hien tai.
function chunkCues(words: Word[]): Word[][] {
  const cues: Word[][] = [];
  let cur: Word[] = [];
  const push = () => {
    if (cur.length) cues.push(cur);
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : 99;
    if (cur.length >= 6 || /[.,!?…:;]$/.test(w.text) || gap >= 0.45) push();
  }
  push();
  // Tach cum dai qua (>38 ky tu) thanh phan deu — tranh mat chu (overflow hidden).
  // Gop manh vo <0.5s vao cum truoc.
  const out: Word[][] = [];
  const lenOf = (c: Word[]) => c.map((w) => w.text).join(' ').length;
  for (const c of cues) {
    let part: Word[] = [];
    const flushPart = () => {
      if (part.length) out.push(part);
      part = [];
    };
    for (const w of c) {
      const trial = [...part, w];
      if (part.length > 0 && (part.length >= 5 || lenOf(trial) > 38)) flushPart();
      part.push(w);
    }
    flushPart();
  }
  const merged: Word[][] = [];
  for (const c of out) {
    const dur = c[c.length - 1].end - c[0].start;
    if (merged.length > 0 && (dur < 0.5 || dur < 0)) {
      merged[merged.length - 1].push(...c);
    } else {
      merged.push(c);
    }
  }
  return merged;
}

// Karaoke lyrics vung an toan. from = frame bat dau giong (VO_LEAD=8).
// bottom/top: tuy tung scene — dat vao vung trong nhat, khong che chu the.
export const Lyrics: React.FC<{words: Word[]; from?: number; bottom?: number; top?: number}> = ({
  words,
  from = 8,
  bottom = 300,
  top,
}) => {
  const frame = useCurrentFrame();
  const t = (frame - from) / 30;
  const cues = React.useMemo(() => chunkCues(words), [words]);
  if (!cues.length || t < -0.5) return null;
  // Cum dang active: cum cuoi cung da bat dau; giu qua khe im, an sau khi het 0.4s.
  let active = -1;
  for (let i = 0; i < cues.length; i++) {
    if (t >= cues[i][0].start) active = i;
  }
  if (active < 0) active = 0;
  const cue = cues[active];
  const cueEnd = Math.max(cue[cue.length - 1].end, cue[0].start + 1.0);
  if (t > cueEnd + 0.4) return null;
  const vis = cue;
  const op = interpolate(frame, [from, from + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        ...(top != null ? {top} : {bottom}),
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        opacity: op,
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(2,6,16,0.55)',
          borderRadius: 20,
          padding: '14px 34px',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
      {vis.map((w, i) => {
        return (
          <span
            key={`${active}-${i}`}
            style={{
              display: 'inline-block',
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 10px',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {w.text}
          </span>
        );
      })}
      </div>
    </div>
  );
};
