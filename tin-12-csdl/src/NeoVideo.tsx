import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { OUTRO_HOLD, SC, SCENES, SCENES_FRAMES, TOTAL_FRAMES } from './data';
import { bgmVolumeAt } from './bgm';
import { MatrixGrid, PenguinSwoop } from './decor';
import { C, MONO, CROSSFADE_FRAMES } from './theme';

import { HookScene } from './scenes/HookScene';
import { EmpathyScene } from './scenes/EmpathyScene';
import { KhoaScene } from './scenes/KhoaScene';
import { KhoaGopScene } from './scenes/KhoaGopScene';
import { ToanVenScene } from './scenes/ToanVenScene';
import { SqlScene } from './scenes/SqlScene';
import { MeoThiScene } from './scenes/MeoThiScene';
import { CtaScene } from './scenes/CtaScene';
import { OutroScene } from './scenes/OutroScene';

import { spring } from 'remotion';

const XF = CROSSFADE_FRAMES;

// 1. Transition Cuộn Lướt Liền Mạch (Smooth Kinetic Push & Slide Transition):
// Hai cảnh trượt lướt liền mạch (seamless slide push), không vệt màu loè loẹt,
// sạch sẽ và chuyên nghiệp, kết hợp chú cánh cụt vút bay lướt qua.
const PageScrollGlideTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  isFirst?: boolean;
}> = ({ children, durationInFrames, isFirst = false }) => {
  const f = useCurrentFrame();
  const GLIDE_FRAMES = CROSSFADE_FRAMES; // 26 frames (~0.87s) tốc độ vừa phải, êm ái

  // Khi vào (Incoming Page - trang mới trượt êm vào từ bên phải):
  const isEntering = !isFirst && f < GLIDE_FRAMES;
  const enterP = isFirst
    ? 1
    : interpolate(f, [0, GLIDE_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const smoothEnterP = 0.5 - 0.5 * Math.cos(enterP * Math.PI);
  const enterX = isFirst ? 0 : (1 - smoothEnterP) * 1080;

  // Khi ra (Outgoing Page - trang cũ trượt êm sang bên trái):
  const exitStart = Math.max(0, durationInFrames - GLIDE_FRAMES);
  const isExiting = f >= exitStart;
  const exitP = interpolate(f, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const smoothExitP = 0.5 - 0.5 * Math.cos(exitP * Math.PI);
  const exitX = -smoothExitP * 1080;

  const currentX = isExiting ? exitX : enterX;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: isExiting ? 20 : 10,
      }}
    >
      {/* Trang nội dung cuộn lướt liền mạch, sạch sẽ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${currentX}px)`,
          boxShadow: isExiting ? '20px 0 50px rgba(0, 0, 0, 0.85)' : 'none',
        }}
      >
        {children}
      </div>

      {/* Chú cánh cụt mascot vút bay lướt theo nhịp */}
      {isExiting && <PenguinSwoop progress={exitP} />}
    </div>
  );
};


// 2. Transition Tĩnh cho Outro (Logo Neo Education):
// Đoạn cuối hiển thị logo neo: ĐỂ YÊN TẠI VỊ TRÍ, KHÔNG CUỘN, CHỈ MỜ DẦN ÊM ÁI!
const StaticOutroTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, 14, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
      }}
    >
      {children}
    </div>
  );
};



const MAP = {
  s01_hook: HookScene,
  s02_empathy: EmpathyScene,
  s03_dang1_khoa: KhoaScene,
  s04_dang2_khoa_gop: KhoaGopScene,
  s05_dang3_toan_ven: ToanVenScene,
  s06_dang4_sql: SqlScene,
  s07_meo_thi: MeoThiScene,
  s08_cta: CtaScene,
} as const;

// Watermark troi nhe + thanh tien trinh
const Head: React.FC = () => {
  const frame = useCurrentFrame();
  const p = frame / TOTAL_FRAMES;
  if (frame >= SCENES_FRAMES) return null; // An o 3s outro

  const floatY = Math.sin((frame * Math.PI * 2) / 90) * 8;
  const breathe = 0.35 + 0.12 * (0.5 + 0.5 * Math.sin((frame * Math.PI * 2) / 120));

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 110 + floatY,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: 4,
          color: `rgba(148, 163, 184, ${breathe.toFixed(3)})`,
          zIndex: 40,
        }}
      >
        neoeducation.vn
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 110,
          height: 8,
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 4,
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: `${p * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${C.sqlBlue}, ${C.foreignKey})`,
            borderRadius: 4,
          }}
        />
      </div>
    </>
  );
};

export const NeoVideo: React.FC = () => {
  let t = 0;
  const seqs = SCENES.map((k, idx) => {
    const from = t;
    t += SC[k];
    const Comp = MAP[k];
    const overlap = idx === 0 ? 0 : XF;
    const dur = SC[k] + overlap;
    return (
      <Sequence key={k} from={from - overlap} durationInFrames={dur}>
        <PageScrollGlideTransition durationInFrames={dur} isFirst={idx === 0}>
          <Comp />
        </PageScrollGlideTransition>
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      {/* Nhac nen: nen.wav (143s, CC-BY 4.0 Kevin MacLeod) tu dong ducking */}
      <Audio src={staticFile('bgm/nen.wav')} volume={(f) => bgmVolumeAt(f)} />
      <MatrixGrid />
      {seqs}
      {/* Đoạn Outro logo Neo Education: để yên tĩnh tại chỗ và chỉ mờ dần, không cuộn lướt lung tung */}
      <Sequence from={t - XF} durationInFrames={OUTRO_HOLD + XF}>
        <StaticOutroTransition durationInFrames={OUTRO_HOLD + XF}>
          <OutroScene />
        </StaticOutroTransition>
      </Sequence>
      <Head />
    </AbsoluteFill>
  );
};

