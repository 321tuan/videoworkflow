import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO, TIKTOK_SAFE } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Tag } from '../decor';
import { Lyrics, W } from '../Lyrics';
import wordsJson from '../words/s01_hook.json';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SC.s01_hook;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tăng dần số điểm trung bình 0 -> 6.07
  const scoreAnim = interpolate(frame, [35, 95], [0, 6.07], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const penguinBob = Math.sin((frame * Math.PI * 2) / 40) * 5;

  return (
    <AbsoluteFill style={{ opacity: fadeOut, fontFamily: FONT }}>
      <Audio
        src={staticFile('vo/s01_hook.ogg')}
        startFrom={0}
        volume={voiceVolAt(frame, dur)}
      />

      {/* TOÀN BỘ KHUNG NỘI DUNG NẰM TRỌN TRONG HỘP AN TOÀN IPHONE (X: 45 -> 875, Y: 360 -> 1440) */}
      <div
        style={{
          position: 'absolute',
          left: TIKTOK_SAFE.BOX_LEFT,
          top: TIKTOK_SAFE.BOX_TOP,
          width: TIKTOK_SAFE.BOX_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* HEADER: BADGE, TIÊU ĐỀ & MASCOT CHIM NEO TRONG VÙNG AN TOÀN */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {/* MASCOT CHIM NEO — ĐẶT GÓC PHẢI HỘP AN TOÀN (X <= 875, Y >= 360), KHÔNG CHẠM TIÊU ĐỀ */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: penguinBob,
              width: 125,
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.65))',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            <Img
              src={staticFile('img/canh-cut.png')}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* BADGE TAG */}
          <div style={{ marginBottom: 14 }}>
            <Tag label="2K9 · BẬT MÍ KỲ THI" sub="TIN HỌC 2026" color="#38BDF8" borderColor="rgba(56, 189, 248, 0.45)" />
          </div>

          {/* TIÊU ĐỀ CHÍNH — KHÔNG BỊ BẤT CỨ GÌ CHE CẮT */}
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.25,
              textShadow: '0 4px 24px rgba(0,0,0,0.85)',
              paddingRight: 130, // Nhường chỗ thông thoáng cho Mascot bên phải
            }}
          >
            TIN HỌC DỄ ĂN ĐIỂM?<br />
            <span style={{ color: C.accentLime, textShadow: '0 0 24px rgba(163,230,53,0.5)' }}>
              ĐIỂM TB CHỈ 6.07!
            </span>
          </h1>
        </div>

        {/* CARD ĐỐI CHIẾU SỐ LIỆU — PHỦ TRỌN CHIỀU RỘNG HỘP AN TOÀN 830PX */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 30, 0.98) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 28,
            padding: '28px 32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Header Card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 16,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 24, color: C.accent, fontWeight: 800 }}>
              📊 THỐNG KÊ KỲ THI TỐT NGHIỆP
            </span>
            <span style={{ fontFamily: MONO, fontSize: 20, color: C.textDim, fontWeight: 700 }}>
              GDPT 2018
            </span>
          </div>

          {/* 2 Cột Thống Kê Đối Chiếu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Cột 1: Kỳ vọng */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 20,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, color: '#A7F3D0', fontWeight: 700, marginBottom: 8 }}>
                MÔN DỄ LẤY ĐIỂM
              </div>
              <div style={{ fontSize: 62, fontWeight: 900, color: '#10B981', lineHeight: 1 }}>
                10.0
              </div>
              <div style={{ fontSize: 18, color: '#D1FAE5', marginTop: 8 }}>
                Mục tiêu của 2K9
              </div>
            </div>

            {/* Cột 2: Thực tế */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.45)',
                borderRadius: 20,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, color: '#FECDD3', fontWeight: 700, marginBottom: 8 }}>
                ĐIỂM TB CẢ NƯỚC
              </div>
              <div style={{ fontSize: 62, fontWeight: 900, color: '#FF3366', lineHeight: 1 }}>
                {scoreAnim.toFixed(2)}
              </div>
              <div style={{ fontSize: 18, color: '#FFE4E6', marginTop: 8 }}>
                Thấp bất ngờ!
              </div>
            </div>
          </div>

          {/* Banner kết luận */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 28 }}>⚠️</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#FDE68A', lineHeight: 1.35 }}>
              Vì sao môn dễ nhưng điểm lại thấp? Xem ngay bí kíp!
            </span>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} />
    </AbsoluteFill>
  );
};
