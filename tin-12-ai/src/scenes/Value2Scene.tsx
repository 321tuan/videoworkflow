import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s04_value2.json';

export const Value2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s04_value2;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pha 1: AI Hep (ANI) - frame 105+ (~3.5s)
  const aniActive = frame >= 105;
  const aniOp = interpolate(frame, [105, 117], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const aniY = interpolate(frame, [105, 119], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pha 2: AI Tong quat (AGI) - frame 355+ (~11.8s)
  const agiActive = frame >= 355;
  const agiOp = interpolate(frame, [355, 367], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const agiY = interpolate(frame, [355, 369], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s04_value2.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s04_value2', f, dur)}
      />

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
        {/* BADGE & TIEU DE VALUE 2 */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <Tag label="PHÂN LOẠI CỐT LÕI ĐỀ THI" sub="ANI VS AGI" color="#38BDF8" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            ĐỪNG ĐỂ BỊ LỪA: <span style={{ color: C.cyberCyan }}>ANI</span> HAY <span style={{ color: C.neonViolet }}>AGI</span>?
          </h1>
        </div>

        {/* 2 THE LON XEP CHONG BE THE PHU KIN KHONG GIAN (WIDTH 980, TOTAL HEIGHT ~1040) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 980 }}>
          {/* THE 1: AI HEP (ANI) — FULL WIDTH, FONT TO RO */}
          <div
            style={{
              opacity: aniActive ? aniOp : 0.35,
              transform: aniActive ? `translateY(${aniY}px)` : 'none',
              background: aniActive
                ? 'linear-gradient(135deg, rgba(8, 24, 48, 0.96) 0%, rgba(4, 12, 28, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: aniActive ? '2.5px solid #38BDF8' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 28,
              padding: '30px 34px',
              boxShadow: aniActive ? '0 16px 40px rgba(56, 189, 248, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🔹</span>
                <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                  AI Hẹp (ANI — Artificial Narrow Intelligence)
                </span>
              </div>
              <span
                style={{
                  background: aniActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                  color: aniActive ? '#38BDF8' : C.textDim,
                  fontSize: 22,
                  fontWeight: 900,
                  padding: '6px 16px',
                  borderRadius: 12,
                  border: aniActive ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                ✓ 100% AI HIỆN NAY
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 30, color: '#E2E8F0', fontWeight: 700, lineHeight: 1.45, marginBottom: 18 }}>
              Chỉ thực hiện được <span style={{ color: aniActive ? '#38BDF8' : '#93C5FD', textDecoration: 'underline' }}>ĐÚNG 1 NHIỆM VỤ CỤ THỂ</span> trong phạm vi lập trình xác định!
            </div>

            {/* 3 VI DU THUC CHIEN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>♟ Cờ Vua / AlphaGo</div>
                <div style={{ fontFamily: FONT, fontSize: 22, color: C.textDim, marginTop: 4 }}>Chỉ biết chơi cờ, không thể lái xe</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>🚗 Xe Tự Lái</div>
                <div style={{ fontFamily: FONT, fontSize: 22, color: C.textDim, marginTop: 4 }}>Nhận biết đường, không thể làm thơ</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>🤖 ChatGPT / LLM</div>
                <div style={{ fontFamily: FONT, fontSize: 22, color: C.textDim, marginTop: 4 }}>Xử lý ngôn ngữ, KHÔNG CÓ Ý THỨC</div>
              </div>
            </div>
          </div>

          {/* THE 2: AI TONG QUAT (AGI) — FULL WIDTH, FONT TO RO */}
          <div
            style={{
              opacity: agiActive ? agiOp : 0.35,
              transform: agiActive ? `translateY(${agiY}px)` : 'none',
              background: agiActive
                ? 'linear-gradient(135deg, rgba(32, 14, 56, 0.96) 0%, rgba(16, 6, 28, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: agiActive ? '2.5px solid #A855F7' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 28,
              padding: '30px 34px',
              boxShadow: agiActive ? '0 16px 40px rgba(168, 85, 247, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🔮</span>
                <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 900, color: '#FFFFFF' }}>
                  AI Tổng Quát (AGI — General Intelligence)
                </span>
              </div>
              <span
                style={{
                  background: agiActive ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                  color: agiActive ? '#D8B4FE' : C.textDim,
                  fontSize: 22,
                  fontWeight: 900,
                  padding: '6px 16px',
                  borderRadius: 12,
                  border: agiActive ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                ⚠️ CHƯA TỪNG TỒN TẠI
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 30, color: '#E2E8F0', fontWeight: 700, lineHeight: 1.45, marginBottom: 18 }}>
              Sở hữu <span style={{ color: agiActive ? '#C084FC' : '#D8B4FE', textDecoration: 'underline' }}>Ý THỨC ĐỘC LẬP</span>, tư duy phổ quát và vượt qua Phép thử Turing!
            </div>

            <div
              style={{
                background: agiActive ? 'rgba(244, 63, 94, 0.16)' : 'rgba(255,255,255,0.04)',
                border: agiActive ? '1.5px solid #F43F5E' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 34 }}>⚠️</span>
              <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: agiActive ? '#FDA4AF' : C.textDim, lineHeight: 1.4 }}>
                BẪY ĐỀ THI: Nếu đề bài nói hiện nay đã có hệ thống AI đạt tới AGI thì khẳng định đó <b>HOÀN TOÀN SAI</b>!
              </span>
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
