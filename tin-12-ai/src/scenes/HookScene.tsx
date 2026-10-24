import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s01_hook.json';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s01_hook;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stagger 4 Pha xuat hien dan (Opacity + translateY, KHONG DUNG SCALE TO DAN):
  // 1. Nhip 1 (frame 0+): Khung tong quan Nghich ly Moravec
  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 2. Nhip 2 (frame 98+, ~3.3s): Sieu may tinh 1 ty phep tinh/giay
  const p2Active = frame >= 98;
  const p2Op = interpolate(frame, [98, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p2Y = interpolate(frame, [98, 112], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 3. Nhip 3 (frame 194+, ~6.5s): Em be 3 tuoi nhan dien chu meo
  const p3Active = frame >= 194;
  const p3Op = interpolate(frame, [194, 206], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p3Y = interpolate(frame, [194, 208], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 4. Nhip 4 (frame 312+, ~10.4s): Ket luan Toc do co hoc khong phai AI
  const p4Active = frame >= 312;
  const p4Op = interpolate(frame, [312, 324], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p4Y = interpolate(frame, [312, 326], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Counter 1 ty phep tinh chay muot
  const opsCount = Math.floor(
    interpolate(frame, [98, 190], [1000000, 1000000000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Mascot Chim Neo chao mung (nguyen ban, khong vien)
  const penguinEnter = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const penguinBob = Math.sin((frame * Math.PI * 2) / 42) * 8;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s01_hook.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s01_hook', f, dur)}
      />

      {/* MASCOT CHIM NEO CHAO VUI TUOI — NGUYEN BAN, KHONG VIEN */}
      <div
        style={{
          position: 'absolute',
          right: 48,
          top: 110 + penguinBob,
          width: 175,
          opacity: penguinEnter,
          filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.65))',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      >
        <Img
          src={staticFile('img/canh-cut.png')}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 140,
          paddingLeft: 50,
          paddingRight: 50,
          height: '100%',
        }}
      >
        {/* BADGE & TIEU DE HOOK — FONT TO RO */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          <Tag label="CẢNH BÁO BẪY ĐIỂM 10" sub="TIN HỌC 12" color="#F43F5E" borderColor="rgba(244, 63, 94, 0.4)" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 8,
              lineHeight: 1.25,
              textShadow: '0 4px 24px rgba(0,0,0,0.8)',
            }}
          >
            ĐỪNG ĐỂ CÚ LỪA NÀY<br />
            <span style={{ color: C.accent, textShadow: '0 0 20px rgba(0,255,135,0.5)' }}>CƯỚP MẤT ĐIỂM 10</span> CỦA EM!
          </h1>
        </div>

        {/* KHUNG CUA SO NOI DUNG TO BE THE — PHU TRON KHONG GIAN (WIDTH 980, MIN-HEIGHT 1020) */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            minHeight: 1000,
            background: 'linear-gradient(135deg, rgba(10, 18, 38, 0.94) 0%, rgba(4, 8, 20, 0.98) 100%)',
            border: '2px solid rgba(0, 255, 135, 0.35)',
            borderRadius: 32,
            padding: '36px 36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          {/* HEADER CUA SO: NGHICH LY MORAVEC */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F43F5E' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontFamily: MONO, fontSize: 24, color: C.accent, fontWeight: 800, marginLeft: 12 }}>
                [NGHỊCH LÝ MORAVEC: TỐC ĐỘ VS TRÍ TUỆ]
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.textDim }}>THI TỐT NGHIỆP 2026</span>
          </div>

          {/* THE 1: SIEU MAY TINH (KICH HOAT FRAME 114+) */}
          <div
            style={{
              opacity: p2Active ? p2Op : 0.35,
              transform: p2Active ? `translateY(${p2Y}px)` : 'none',
              background: p2Active
                ? 'linear-gradient(135deg, rgba(14, 28, 56, 0.95) 0%, rgba(8, 16, 36, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: p2Active ? '2px solid rgba(56, 189, 248, 0.6)' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '28px 32px',
              boxShadow: p2Active ? '0 12px 36px rgba(56, 189, 248, 0.25)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  background: p2Active ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.05)',
                  border: p2Active ? '2px solid #38BDF8' : '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                  Siêu Máy Tính Điện Tử
                </div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: p2Active ? C.cyberCyan : '#94A3B8', marginTop: 6, fontWeight: 800 }}>
                  {p2Active ? `${opsCount.toLocaleString()} phép tính / giây` : '1.000.000.000 phép tính / giây'}
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 800,
                color: p2Active ? '#38BDF8' : C.textDim,
                background: p2Active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
                border: p2Active ? '1px solid #38BDF866' : '1px solid rgba(255,255,255,0.1)',
                padding: '12px 22px',
                borderRadius: 16,
              }}
            >
              Xử Lý Cơ Học
            </div>
          </div>

          {/* THE 2: EM BE 3 TUOI (KICH HOAT FRAME 246+) */}
          <div
            style={{
              opacity: p3Active ? p3Op : 0.35,
              transform: p3Active ? `translateY(${p3Y}px)` : 'none',
              background: p3Active
                ? 'linear-gradient(135deg, rgba(32, 16, 56, 0.95) 0%, rgba(16, 8, 32, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: p3Active ? '2px solid rgba(168, 85, 247, 0.65)' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '28px 32px',
              boxShadow: p3Active ? '0 12px 36px rgba(168, 85, 247, 0.25)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  background: p3Active ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255,255,255,0.05)',
                  border: p3Active ? '2px solid #A855F7' : '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                }}
              >
                🐱
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                  Em Bé 3 Tuổi
                </div>
                <div style={{ fontFamily: FONT, fontSize: 28, color: p3Active ? '#D8B4FE' : '#94A3B8', marginTop: 6, fontWeight: 700 }}>
                  Nhận diện đồ vật tức thì qua thị giác tự nhiên
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 800,
                color: p3Active ? '#A855F7' : C.textDim,
                background: p3Active ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)',
                border: p3Active ? '1px solid #A855F766' : '1px solid rgba(255,255,255,0.1)',
                padding: '12px 22px',
                borderRadius: 16,
              }}
            >
              Trí Tuệ Tự Nhiên
            </div>
          </div>

          {/* KET LUAN DANG CAP (KICH HOAT FRAME 360+) */}
          <div
            style={{
              opacity: p4Active ? p4Op : 0.35,
              transform: p4Active ? `translateY(${p4Y}px)` : 'none',
              background: p4Active
                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(14, 18, 38, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: p4Active ? '2.5px solid #F43F5E' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 26,
              padding: '30px 40px',
              textAlign: 'center',
              boxShadow: p4Active ? '0 0 40px rgba(244, 63, 94, 0.4)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 46, marginBottom: 8 }}>❌</div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 38,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: 0.5,
                lineHeight: 1.35,
              }}
            >
              TỐC ĐỘ TÍNH TOÁN CƠ HỌC<br />
              <span style={{ color: p4Active ? '#F43F5E' : '#FDA4AF' }}>HOÀN TOÀN KHÔNG PHẢI</span> LÀ TRÍ TUỆ NHÂN TẠO!
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
