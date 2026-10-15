import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, FONT } from './theme';

export type Word = { text: string; start: number; end: number };
export const W = (j: unknown): Word[] => (j as { words: Word[] }).words;

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
      if (part.length > 0 && (part.length >= 5 || lenOf(trial) > 36)) flushPart();
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

export const Lyrics: React.FC<{
  words: Word[];
  from?: number;
  bottom?: number;
  top?: number;
}> = ({ words, from = 8, bottom = 260, top }) => {
  const frame = useCurrentFrame();
  const t = (frame - from) / 30;
  const cues = React.useMemo(() => chunkCues(words), [words]);
  if (!cues.length || t < -0.2) return null;

  let active = -1;
  for (let i = 0; i < cues.length; i++) {
    if (t >= cues[i][0].start) active = i;
  }
  if (active < 0) active = 0;

  const cue = cues[active];
  const cueEnd = Math.max(cue[cue.length - 1].end, cue[0].start + 1.0);
  if (t > cueEnd + 0.4) return null;

  const text = cue.map((w) => w.text).join(' ');
  const op = interpolate(frame, [from, from + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        right: 48,
        ...(top != null ? { top } : { bottom }),
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        opacity: op,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(6, 11, 20, 0.90)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          borderRadius: 9999,
          padding: '16px 36px',
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.01em',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
        }}
      >
        {text}
      </div>
    </div>
  );
};
