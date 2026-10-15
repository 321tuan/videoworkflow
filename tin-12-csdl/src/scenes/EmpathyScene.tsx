import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s02_empathy.json';

export const EmpathyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s02_empathy;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Mốc chuyển: 0s - 3.8s (frame 0 - 114) là Cảnh báo học vẹt, sau 3.8s là 3 khái niệm cốt lõi
  const SWITCH_FRAME = 114;

  const p1Enter = spring({ frame, fps, from: 0.94, to: 1, config: { damping: 14 } });
  const p1Exit = interpolate(frame, [SWITCH_FRAME - 8, SWITCH_FRAME], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p2Enter = spring({ frame: frame - SWITCH_FRAME, fps, from: 0.94, to: 1, config: { damping: 14 } });
  const p2Op = interpolate(frame, [SWITCH_FRAME, SWITCH_FRAME + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s02_empathy.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s02_empathy', f, dur)}
      />

      {/* =============================================================== */}
      {/* PHA 1: CHỮ TO ĐẬP VÀO MẮT — CẢNH BÁO ĐỪNG HỌC VẸT */}
      {/* =============================================================== */}
      {frame < SWITCH_FRAME + 5 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: p1Exit,
            transform: `scale(${p1Enter})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 340,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          <Tag accent={C.accentPink}>ĐỪNG HỌC VẸT</Tag>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 32,
              marginBottom: 20,
              textAlign: 'center',
              lineHeight: 1.2,
              textShadow: '0 8px 40px rgba(244, 63, 94, 0.45)',
            }}
          >
            HIỂU ĐÚNG BẢN CHẤT CSDL
          </h1>

          <div
            style={{
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 800,
              color: C.primaryKey,
              textAlign: 'center',
              marginBottom: 44,
            }}
          >
            Thay vì nhớ từ ngữ hàn lâm, hãy nhìn mô hình thực tế 👇
          </div>

          <div
            style={{
              width: 960,
              background: 'rgba(15, 23, 42, 0.96)',
              border: `3px solid ${C.accentPink}`,
              borderRadius: 32,
              padding: '48px 40px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 45px rgba(244,63,94,0.3)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.5 }}>
              ❌ Học vẹt định nghĩa SGK ➔ <span style={{ color: C.accentPink }}>Dễ quên, dễ bị lừa!</span><br />
              ✅ Hiểu bản chất trực quan ➔ <span style={{ color: C.foreignKey }}>Nhìn là khoanh ngay!</span>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* PHA 2: BẢNG - CỘT - HÀNG — CHỮ CỰC TO, THOÁNG MẮT */}
      {/* =============================================================== */}
      {frame >= SWITCH_FRAME - 5 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: p2Op,
            transform: `scale(${p2Enter})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 290,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          <Tag accent={C.sqlBlue}>3 KHÁI NIỆM CỐT LÕI</Tag>

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 66,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 24,
              marginBottom: 36,
              textAlign: 'center',
            }}
          >
            BẢN CHẤT TRỰC QUAN CSDL
          </h2>

          {/* 3 Khối Hero to rõ ràng */}
          <div
            style={{
              width: 960,
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
              marginBottom: 30,
            }}
          >
            {/* 1. BẢNG */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: `3px solid ${C.sqlBlue}`,
                borderRadius: 24,
                padding: '28px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px rgba(56,189,248,0.25)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 44 }}>📁</span>
                <span style={{ fontFamily: FONT, fontSize: 42, fontWeight: 900, color: C.sqlBlue }}>
                  BẢNG (Table)
                </span>
              </div>
              <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: '#FFFFFF' }}>
                Danh sách dữ liệu tổng thể
              </span>
            </div>

            {/* 2. CỘT */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: `3px solid ${C.primaryKey}`,
                borderRadius: 24,
                padding: '28px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px rgba(245,158,11,0.25)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 44 }}>🏷️</span>
                <span style={{ fontFamily: FONT, fontSize: 42, fontWeight: 900, color: C.primaryKey }}>
                  CỘT (Field)
                </span>
              </div>
              <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: '#FFFFFF' }}>
                Thuộc tính cần quản lý
              </span>
            </div>

            {/* 3. HÀNG */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: `3px solid ${C.foreignKey}`,
                borderRadius: 24,
                padding: '28px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.25)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 44 }}>👤</span>
                <span style={{ fontFamily: FONT, fontSize: 42, fontWeight: 900, color: C.foreignKey }}>
                  HÀNG (Record)
                </span>
              </div>
              <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: '#FFFFFF' }}>
                Một cá nhân / bản ghi cụ thể
              </span>
            </div>
          </div>

          {/* Minh họa trực quan 1 dòng to bản */}
          <div
            style={{
              width: 960,
              background: 'rgba(11, 20, 38, 0.96)',
              border: `2px solid rgba(255,255,255,0.2)`,
              borderRadius: 22,
              padding: '22px 32px',
              display: 'grid',
              gridTemplateColumns: '1.2fr 2fr 1fr',
              fontFamily: MONO,
              fontSize: 30,
              fontWeight: 800,
              textAlign: 'center',
            }}
          >
            <div style={{ color: C.primaryKey }}>MaHS: HS01</div>
            <div style={{ color: '#FFFFFF' }}>Nguyễn Văn An</div>
            <div style={{ color: C.foreignKey }}>Lớp 12A1</div>
          </div>
        </div>
      )}

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
