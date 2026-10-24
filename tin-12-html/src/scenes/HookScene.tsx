import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s01_hook.json';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SC.s01_hook;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pha xuat hien dứt khoát: Khung to tự nhiên ngay từ đầu (Quy tắc 37 & 28)
  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Typing/Glow effect cho dong code 20/10
  const codeGlow = 0.7 + 0.3 * Math.sin(frame * 0.1);

  // Mascot Chim Neo CHỈ ở HookScene (Quy tắc 35), TUYỆT ĐỐI tuân thủ Top Safe Zone (Y >= 235px) (Quy tắc 41 & 44)
  const penguinEnter = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const penguinBob = Math.sin((frame * Math.PI * 2) / 40) * 6;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s01_hook.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s01_hook', f, dur)}
      />

      {/* MASCOT CHIM NEO — ĐẶT AN TOÀN TẠI TOP: 235PX (TRÁNH THANH TÌM KIẾM TIKTOK) */}
      <div
        style={{
          position: 'absolute',
          right: 52,
          top: 235 + penguinBob,
          width: 155,
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
          paddingTop: 235, // TOP SAFE ZONE: KHÔNG ĐẶT NỘI DUNG Ở Y < 220PX
          paddingLeft: 48,
          paddingRight: 48,
          height: '100%',
        }}
      >
        {/* BADGE & TIÊU ĐỀ HOOK — CỠ CHỮ LỚN, RÕ RÀNG */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 24,
            width: '100%',
            paddingRight: 110, // Chừa không gian thở cho Mascot ở góc phải
          }}
        >
          <Tag label="CẢNH BÁO BẪY ĐIỂM 10" sub="TIN HỌC 12" color="#FF3366" borderColor="rgba(255, 51, 102, 0.45)" />

          <h1
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
              textShadow: '0 4px 24px rgba(0,0,0,0.85)',
            }}
          >
            ĐOẠN CODE 20/10 NÀY<br />
            <span style={{ color: '#FF3366', textShadow: '0 0 24px rgba(255,51,102,0.6)' }}>CƯỚP MẤT 1 ĐIỂM</span> CỦA 2K9!
          </h1>
        </div>

        {/* CỬA SỔ VS CODE BỀ THẾ — PHỦ TRỌN KHÔNG GIAN 60-70% */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
            border: '2px solid rgba(255, 51, 102, 0.35)',
            borderRadius: 28,
            padding: '30px 34px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* HEADER VS CODE */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F43F5E' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontFamily: MONO, fontSize: 24, color: '#38BDF8', fontWeight: 800, marginLeft: 12 }}>
                📄 index.html — Visual Studio Code
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.textDim, fontWeight: 700 }}>
              THI TỐT NGHIỆP 2026
            </span>
          </div>

          {/* CODE EDITOR CONTENT */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              borderRadius: 18,
              padding: '26px 30px',
              fontFamily: MONO,
              fontSize: 30,
              lineHeight: 1.6,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ color: '#94A3B8' }}>&lt;<span style={{ color: '#F97316' }}>!DOCTYPE html</span>&gt;</div>
            <div style={{ color: '#94A3B8' }}>&lt;<span style={{ color: '#38BDF8' }}>html</span>&gt;</div>
            <div style={{ paddingLeft: 30, color: '#94A3B8' }}>
              &lt;<span style={{ color: '#38BDF8' }}>head</span>&gt;
              &lt;<span style={{ color: '#38BDF8' }}>title</span>&gt;
              <span style={{ color: '#F59E0B' }}>Mừng ngày 20-10</span>
              &lt;/<span style={{ color: '#38BDF8' }}>title</span>&gt;
              &lt;/<span style={{ color: '#38BDF8' }}>head</span>&gt;
            </div>
            <div style={{ paddingLeft: 30, color: '#94A3B8' }}>
              &lt;<span style={{ color: '#38BDF8' }}>body</span>&gt;
            </div>
            <div
              style={{
                paddingLeft: 60,
                background: 'rgba(255, 51, 102, 0.12)',
                borderRadius: 10,
                paddingTop: 8,
                paddingBottom: 8,
                borderLeft: '4px solid #FF3366',
                boxShadow: `0 0 20px rgba(255, 51, 102, ${codeGlow * 0.3})`,
              }}
            >
              &lt;<span style={{ color: '#FF3366', fontWeight: 800 }}>h1</span>&gt;
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Chào mừng Ngày Phụ Nữ Việt Nam 20/10!</span>
              &lt;/<span style={{ color: '#FF3366', fontWeight: 800 }}>h1</span>&gt;
            </div>
            <div style={{ paddingLeft: 60, color: '#94A3B8', marginTop: 6 }}>
              &lt;<span style={{ color: '#38BDF8' }}>p</span>&gt;
              <span style={{ color: '#FDA4AF' }}>Chúc một nửa thế giới luôn rạng ngời hạnh phúc!</span>
              &lt;/<span style={{ color: '#38BDF8' }}>p</span>&gt;
            </div>
            <div style={{ paddingLeft: 30, color: '#94A3B8' }}>&lt;/<span style={{ color: '#38BDF8' }}>body</span>&gt;</div>
            <div style={{ color: '#94A3B8' }}>&lt;/<span style={{ color: '#38BDF8' }}>html</span>&gt;</div>
          </div>

          {/* DÒNG CẢNH BÁO BẪY */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 51, 102, 0.15)',
              border: '1.5px solid #FF3366',
              borderRadius: 18,
              padding: '16px 24px',
            }}
          >
            <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>
              ⚠️ BẪY THỰC CHIẾN: Trình duyệt sẽ hiển thị ra sao?
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 24,
                fontWeight: 800,
                color: '#FF3366',
                background: 'rgba(255, 51, 102, 0.2)',
                padding: '6px 16px',
                borderRadius: 12,
              }}
            >
              BÀI TOÁN 4 Ý
            </span>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
