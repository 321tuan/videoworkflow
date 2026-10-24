import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SAFE_ZONE, FONT, MONO, C } from '../theme';

interface Props {
  currentSceneProgress?: number; // 0 -> 1
}

export const SafeWatermarkAndProgress: React.FC<Props> = ({ currentSceneProgress }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = currentSceneProgress ?? interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* 1. PROGRESS BAR ĐẶT TẠI TOP: 345PX (RANH GIỚI DƯỚI TAB TIKTOK CỰC SANG TRỌNG) */}
      <div
        style={{
          position: 'absolute',
          top: SAFE_ZONE.PROGRESS_TOP,
          left: SAFE_ZONE.X_MIN,
          width: SAFE_ZONE.WIDTH,
          height: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          zIndex: 80,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #38BDF8, #818CF8, #FF3366)',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)',
          }}
        />
      </div>

      {/* 2. WATERMARK NEOEDUCATION.VN ĐẶT TẠI BOTTOM: 525PX (NGAY TRÊN LYRICS, TUYỆT ĐỐI KHÔNG BỊ CAPTION ĐÈ) */}
      <div
        style={{
          position: 'absolute',
          bottom: SAFE_ZONE.WATERMARK_BOTTOM,
          left: SAFE_ZONE.X_MIN,
          width: SAFE_ZONE.WIDTH,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 75,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#38BDF8',
              boxShadow: '0 0 6px #38BDF8',
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: 0.5,
            }}
          >
            neoeducation.vn
          </span>
        </div>
      </div>
    </>
  );
};
