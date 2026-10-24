import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT } from './theme';

export type Word = { text: string; start: number; end: number };

// Unwrap file JSON {words:[...]} do faster-whisper sinh (resolveJsonModule).
export const W = (j: unknown): Word[] => (j as { words: Word[] }).words;

// Nhan dien tu khoa quan trong trong video giao duc (so lieu, %, tu viet tat >= 2 chu hoa)
const isEducationalKeyword = (text: string): boolean => {
  const clean = text.replace(/[.,!?…:;"'()]/g, '');
  return /\d/.test(clean) || (clean.length >= 2 && clean === clean.toUpperCase() && /[A-ZÀ-Ỹ]/.test(clean));
};

// Chia words thanh cum on dinh: toi da 6 tu, ngat o dau cau / khe im >= 0.45s.
// Moi cum hien NGUYEN VEN trong suot span cua no (toi thieu 1s).
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
  from?: number;
  bottom?: number;
  top?: number;
  accentColor?: string; // Mau nhan cho tu dang doc
  keywordColor?: string; // Mau nhan cho so lieu / thuat ngu
}> = ({
  words,
  from = 8,
  bottom = 260,
  top,
  accentColor = (C as Record<string, string>)?.accent || '#00FF87', // Cyber Emerald
  keywordColor = '#FBBF24', // Vang Amber cho so lieu/tu khoa
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - from) / fps;

  const cues = React.useMemo(() => chunkCues(words), [words]);
  if (!cues.length || t < -0.5) return null;

  // Tim cum dang active
  let active = -1;
  for (let i = 0; i < cues.length; i++) {
    if (t >= cues[i][0].start) active = i;
  }
  if (active < 0) active = 0;

  const cue = cues[active];
  const cueStart = cue[0].start;
  const rawCueEnd = cue[cue.length - 1].end;
  const cueEnd = Math.max(rawCueEnd, cueStart + 1.0);

  if (t > cueEnd + 0.4) return null;

  // Frame bat dau cua cum hien tai de tinh hieu ung spring khi doi cum
  const cueStartFrame = from + Math.max(0, cueStart * fps);
  const cueAgeFrames = Math.max(0, frame - cueStartFrame);

  // Chuyen dong vao (Entrance) cua ca hop phu de khi doi sang cum moi
  const boxSpring = spring({
    frame: cueAgeFrames,
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.7 },
  });

  // Do mo tong the (fade-in dau tien & fade-out muot khi het cum)
  const fadeIn = interpolate(frame, [from, from + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(t, [cueEnd + 0.15, cueEnd + 0.4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tien trinh doc cua cum hien tai (0 -> 100) cho thanh progress bar phia duoi
  const cueProgress = interpolate(t, [cueStart, rawCueEnd], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tim tu dang duoc phat am trong cum
  let activeWordIdx = -1;
  for (let i = 0; i < cue.length; i++) {
    const w = cue[i];
    const nextW = cue[i + 1];
    const effectiveEnd = nextW ? Math.min(nextW.start, w.end + 0.25) : w.end + 0.15;
    if (t >= w.start - 0.04 && t <= effectiveEnd) {
      activeWordIdx = i;
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 50,
        ...(top != null ? { top } : { bottom }),
        textAlign: 'center',
        opacity: fadeIn * fadeOut,
        transform: `translateY(${interpolate(boxSpring, [0, 1], [14, 0])}px)`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px 14px',
          background: 'linear-gradient(135deg, rgba(8, 15, 32, 0.88) 0%, rgba(2, 6, 16, 0.94) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: '16px 36px 20px 36px',
          border: '1.5px solid rgba(0, 255, 135, 0.25)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
        }}
      >
        {cue.map((w, i) => {
          const isCurrent = i === activeWordIdx;
          const isPast = t > w.end && !isCurrent;
          const isKey = isEducationalKeyword(w.text);

          const wordEntrance = spring({
            frame: Math.max(0, cueAgeFrames - i * 1.2),
            fps,
            config: { damping: 15, stiffness: 220, mass: 0.5 },
          });

          const wordStartFrame = from + w.start * fps;
          const popSpring = isCurrent
            ? spring({
                frame: Math.max(0, frame - wordStartFrame),
                fps,
                config: { damping: 12, stiffness: 260, mass: 0.45 },
              })
            : 0;

          const scale = interpolate(popSpring, [0, 1], [1, 1.09]);
          const liftY = interpolate(popSpring, [0, 1], [0, -4]) + interpolate(wordEntrance, [0, 1], [8, 0]);

          let textColor = 'rgba(255, 255, 255, 0.65)';
          if (isCurrent) {
            textColor = '#040B16'; // Chu toi tren nen Pill sang
          } else if (isPast) {
            textColor = isKey ? keywordColor : '#FFFFFF';
          } else if (isKey) {
            textColor = 'rgba(251, 191, 36, 0.85)';
          }

          const pillBg = isKey ? keywordColor : accentColor;

          return (
            <span
              key={`${active}-${i}`}
              style={{
                position: 'relative',
                display: 'inline-block',
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: isCurrent || isKey ? 800 : 700,
                color: textColor,
                padding: '2px 10px',
                borderRadius: 12,
                transform: `translateY(${liftY}px) scale(${scale})`,
                opacity: interpolate(wordEntrance, [0, 1], [0.2, 1]),
                textShadow: isCurrent
                  ? 'none'
                  : isPast && isKey
                  ? `0 0 18px ${keywordColor}55, 0 2px 10px rgba(0,0,0,0.85)`
                  : '0 2px 10px rgba(0,0,0,0.85)',
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

              {isKey && isPast && !isCurrent && (
                <span
                  style={{
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 0,
                    height: 3,
                    borderRadius: 2,
                    background: keywordColor,
                    opacity: 0.85,
                  }}
                />
              )}

              {w.text}
            </span>
          );
        })}

        {/* Thanh Reading Progress manh duoi day hop thoai */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${cueProgress}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${keywordColor})`,
              borderRadius: '0 4px 4px 0',
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
