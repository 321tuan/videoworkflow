import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, TIKTOK_SAFE } from './theme';

export type Word = { text: string; start: number; end: number };
export const W = (j: unknown): Word[] => (j as { words: Word[] }).words;

// Chia words thành từng cụm hiển thị (chunk cues)
function chunkWords(words: Word[]): Word[][] {
  const cues: Word[][] = [];
  let cur: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : 99;
    if (cur.length >= 5 || /[.,!?…:;]$/.test(w.text) || gap >= 0.4) {
      cues.push(cur);
      cur = [];
    }
  }
  if (cur.length) cues.push(cur);
  return cues;
}

export const Lyrics: React.FC<{
  words: Word[];
  from?: number; // frame bắt đầu phát VO trong scene (VO_LEAD)
  bottom?: number;
}> = ({ words, from = 8, bottom = TIKTOK_SAFE.LYRICS_BOTTOM }) => {
  const frame = useCurrentFrame();
  const sec = Math.max(0, (frame - from) / 30);

  const cues = chunkWords(words);
  const activeCue = cues.find((c) => {
    const start = c[0].start;
    const end = c[c.length - 1].end + 0.25;
    return sec >= start && sec <= end;
  });

  if (!activeCue || activeCue.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: TIKTOK_SAFE.BOX_LEFT,
        width: TIKTOK_SAFE.BOX_WIDTH,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: 'rgba(7, 10, 18, 0.92)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 9999,
          padding: '12px 30px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
          maxWidth: 780,
          whiteSpace: 'nowrap',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {activeCue.map((w, i) => {
          const isSpoken = sec >= w.start && sec <= w.end + 0.15;
          const isPast = sec > w.end + 0.15;

          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontSize: 36,
                fontWeight: 800,
                color: isSpoken ? '#FDE047' : isPast ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                textShadow: isSpoken ? '0 0 16px rgba(253,224,71,0.8)' : '0 2px 8px rgba(0,0,0,0.8)',
                transition: 'color 0.1s ease',
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
