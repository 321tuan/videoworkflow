import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, MONO, TIKTOK_SAFE } from './theme';
import { SC, TOTAL_FRAMES } from './data';
import { CodeMatrixGrid, SparkleStars } from './decor';
import { BgmPlayer } from './bgm';
import { HookScene } from './scenes/HookScene';
import { ValueScene } from './scenes/ValueScene';
import { OutroScene } from './scenes/OutroScene';

// THANH TIẾN TRÌNH & WATERMARK NEO NẰM TRỌN TRONG HỘP AN TOÀN IPHONE
const WatermarkAndProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const outroStart = SC.s01_hook + SC.s02_value;
  const isOutro = frame >= outroStart;

  const progress = Math.min(1, frame / TOTAL_FRAMES);
  const breathe = 0.55 + 0.15 * Math.sin((frame * Math.PI * 2) / 60);

  return (
    <>
      {/* 1. PROGRESS BAR AN TOÀN TẠI BOTTOM: 450PX (DƯỚI LYRICS, KHÔNG BAO GIỜ CẮT CHỮ) */}
      <div
        style={{
          position: 'absolute',
          bottom: TIKTOK_SAFE.PROGRESS_BOTTOM,
          left: TIKTOK_SAFE.BOX_LEFT,
          width: TIKTOK_SAFE.BOX_WIDTH,
          height: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          zIndex: 40,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #38BDF8, #818CF8, #10B981)',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)',
          }}
        />
      </div>

      {/* 2. WATERMARK NEOEDUCATION.VN TẠI BOTTOM: 540PX (ẨN KHI VÀO OUTRO LOGO) */}
      {!isOutro && (
        <div
          style={{
            position: 'absolute',
            bottom: TIKTOK_SAFE.WATERMARK_BOTTOM,
            left: TIKTOK_SAFE.BOX_LEFT,
            width: TIKTOK_SAFE.BOX_WIDTH,
            textAlign: 'center',
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 3,
            color: `rgba(226, 232, 240, ${breathe.toFixed(3)})`,
            textShadow: '0 2px 12px rgba(0,0,0,0.85)',
            zIndex: 45,
            pointerEvents: 'none',
          }}
        >
          neoeducation.vn
        </div>
      )}
    </>
  );
};

export const NeoVideo: React.FC = () => {
  const s2Start = SC.s01_hook;
  const s3Start = SC.s01_hook + SC.s02_value;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      {/* NỀN CÔNG NGHỆ & SAO LẤP LÁNH */}
      <CodeMatrixGrid />
      <SparkleStars />

      {/* NHẠC NỀN AUTO-DUCKING */}
      <BgmPlayer />

      {/* CHUỖI PHÂN ĐOẠN 20S */}
      {/* Scene 1: Hook (6.9s = 207f) */}
      <Sequence from={0} durationInFrames={SC.s01_hook}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Value (7.5s = 224f) */}
      <Sequence from={s2Start} durationInFrames={SC.s02_value}>
        <ValueScene />
      </Sequence>

      {/* Scene 3: Outro Logo Neo (6.2s = 187f) */}
      <Sequence from={s3Start} durationInFrames={SC.s03_cta}>
        <OutroScene />
      </Sequence>

      {/* WATERMARK & PROGRESS BAR AN TOÀN */}
      <WatermarkAndProgress />
    </AbsoluteFill>
  );
};
