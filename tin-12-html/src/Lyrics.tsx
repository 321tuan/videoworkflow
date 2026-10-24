import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT } from './theme';

export type Word = { text: string; start: number; end: number };

// Unwrap file JSON {words:[...]} do faster-whisper sinh.
export const W = (j: unknown): Word[] => (j as { words: Word[] }).words;

// Nhan dien tu khoa quan trong trong video giao duc
const isEducationalKeyword = (text: string): boolean => {
  const clean = text.replace(/[.,!?…:;"'()<>]/g, '');
  return /\d/.test(clean) || (clean.length >= 2 && clean === clean.toUpperCase() && /[A-ZÀ-Ỹ]/.test(clean));
};

// Chia words thanh cum on dinh: toi da 6 tu, ngat o dau cau / khe im >= 0.45s.
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

  // Tach cum dai qua (>38 ky tu) thanh phan deu — tranh mat chu.
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

  // Gop manh vo <0.5s vao cum truoc.
  const merged: Word[][] = [];
  for (const c of out) {
    const dur = c[c.length - 1].end - c[0].start;
    if (merged.length > 0 && dur < 0.5) {
      merged[merged.length - 1].push(...c);
    } else {
      merged.push(c);
    }
  }

  return merged;
}

export const Lyrics: React.FC<{
  words: Word[];
  from?: number; // frame bat dau doc trong scene (mac dinh 8)
  bottom?: number; // Safe zone: 280px - 330px
  accentColor?: string;
  keywordColor?: string;
}> = ({
  words,
  from = 8,
  bottom = 290, // Vung an toan Safe Zone TikTok
  accentColor = C.accent,
  keywordColor = C.accentGold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!words || words.length === 0) return null;

  const t = Math.max(0, (frame - from) / fps);
  const cues = chunkCues(words);

  let active = -1;
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const s = c[0].start - 0.08;
    const e = c[c.length - 1].end + 0.15;
    if (t >= s && t <= e) {
      active = i;
      break;
    }
  }

  if (active === -1) {
    for (let i = 0; i < cues.length - 1; i++) {
      if (t > cues[i][cues[i].length - 1].end && t < cues[i + 1][0].start) {
        active = i;
        break;
      }
    }
  }

  if (active === -1) return null;

  const cue = cues[active];
  const cueStartSec = cue[0].start;
  const cueEndSec = cue[cue.length - 1].end;
  const cueDurSec = Math.max(0.1, cueEndSec - cueStartSec);
  const cueProgress = Math.min(100, Math.max(0, ((t - cueStartSec) / cueDurSec) * 100));

  const cueStartFrame = from + Math.round(cueStartSec * fps);
  const cueAge = frame - cueStartFrame;

  const enterPop = spring({
    frame: cueAge,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.7 },
  });

  const cueEndFrame = from + Math.round(cueEndSec * fps);
  const framesTillEnd = cueEndFrame - frame;
  const exitFade = interpolate(framesTillEnd, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: exitFade,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 32px',
          borderRadius: 24,
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1.5px solid rgba(255, 51, 102, 0.35)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          transform: `translateY(${interpolate(enterPop, [0, 1], [14, 0])}px) scale(${interpolate(enterPop, [0, 1], [0.94, 1])})`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {cue.map((w, i) => {
          const isPast = t > w.end;
          const isCurrent = t >= w.start && t <= w.end;
          const isKey = isEducationalKeyword(w.text);

          const wordStartFrame = from + Math.round(w.start * fps);
          const wordAge = frame - wordStartFrame;

          const popSpring = spring({
            frame: wordAge,
            fps,
            config: { damping: 12, stiffness: 280, mass: 0.5 },
          });

          const scale = isCurrent ? interpolate(popSpring, [0, 1], [1.02, 1.08]) : 1;
          const liftY = isCurrent ? interpolate(popSpring, [0, 1], [0, -3]) : 0;

          let textColor = '#F8FAFC';
          if (isCurrent) {
            textColor = '#0B0F19';
          } else if (isPast && isKey) {
            textColor = keywordColor;
          }

          const pillBg = isKey ? keywordColor : accentColor;

          return (
            <span
              key={`${active}-${i}`}
              style={{
                position: 'relative',
                display: 'inline-block',
                fontFamily: FONT,
                fontSize: 42,
                fontWeight: isCurrent || isKey ? 900 : 700,
                color: textColor,
                padding: '2px 10px',
                borderRadius: 12,
                transform: `translateY(${liftY}px) scale(${scale})`,
                zIndex: isCurrent ? 2 : 1,
              }}
            >
              {isCurrent && (
                <span
                  style={{
                    position: 'absolute',
                    inset: '0px -2px',
                    background: pillBg,
                    borderRadius: 12,
                    zIndex: -1,
                    transform: `scale(${interpolate(popSpring, [0, 1], [0.85, 1])})`,
                    boxShadow: `0 6px 20px ${pillBg}66`,
                  }}
                />
              )}

              {w.text}
            </span>
          );
        })}

        {/* Thanh Reading Progress manh duoi day */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${cueProgress}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${keywordColor})`,
              borderRadius: '0 3px 3px 0',
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
