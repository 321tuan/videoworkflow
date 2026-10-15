import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s03_dang1_khoa.json';

export const KhoaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s03_dang1_khoa;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Toàn bộ cảnh thống nhất 1 layout duy nhất — Hiện tuần tự, không giật màn hình
  const enterSpr = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 14 } });

  // Nhịp sáng tuần tự theo lời đọc:
  // 0s - 4.5s (0 - 135f): Giọng đọc giải thích Khóa Chính (PK)
  // 4.5s trở đi (135f+): Giọng đọc giải thích Khóa Ngoài (FK)
  const pkGlow = frame < 135 ? 1 : 0.7;
  const fkGlow = frame >= 135 ? 1 : 0.6;
  const bannerPop = spring({ frame: frame - 180, fps, from: 0, to: 1, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s03_dang1_khoa.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s03_dang1_khoa', f, dur)}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${enterSpr})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 260,
          paddingLeft: 44,
          paddingRight: 44,
        }}
      >
        <Tag accent={C.primaryKey}>DẠNG 1: BẮT CẶP KHÓA THI THẬT</Tag>

        <h1
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 22,
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 8px 36px rgba(245, 158, 11, 0.45)',
          }}
        >
          QUY TẮC BẮT KHÓA 3 GIÂY
        </h1>

        <div
          style={{
            width: 960,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginBottom: 28,
          }}
        >
          {/* Khối 1: KHÓA CHÍNH (PK) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.96)',
              border: `3px solid ${C.primaryKey}`,
              borderRadius: 26,
              padding: '32px 36px',
              boxShadow: `0 18px 45px rgba(0,0,0,0.6), 0 0 35px rgba(245,158,11,${0.25 * pkGlow})`,
              opacity: pkGlow,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 40 }}>🔑</span>
                <span style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.primaryKey }}>
                  KHÓA CHÍNH (PK)
                </span>
              </div>
              <span
                style={{
                  background: `${C.primaryKey}25`,
                  color: C.primaryKey,
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 800,
                  padding: '8px 18px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.primaryKey}`,
                }}
              >
                BẢNG GỐC (CHA)
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 32, color: '#FFFFFF', lineHeight: 1.5, fontWeight: 700 }}>
              • Định danh duy nhất cho từng bản ghi (VD: Mã học sinh)<br />
              • <strong style={{ color: C.primaryKey }}>KHÔNG ĐƯỢC TRÙNG</strong> & <strong style={{ color: C.primaryKey }}>KHÔNG ĐỂ TRỐNG</strong>
            </div>
          </div>

          {/* Khối 2: KHÓA NGOÀI (FK) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.96)',
              border: `3px solid ${C.foreignKey}`,
              borderRadius: 26,
              padding: '32px 36px',
              boxShadow: `0 18px 45px rgba(0,0,0,0.6), 0 0 35px rgba(16,185,129,${0.25 * fkGlow})`,
              opacity: fkGlow,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 40 }}>🔗</span>
                <span style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.foreignKey }}>
                  KHÓA NGOÀI (FK)
                </span>
              </div>
              <span
                style={{
                  background: `${C.foreignKey}25`,
                  color: C.foreignKey,
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 800,
                  padding: '8px 18px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.foreignKey}`,
                }}
              >
                BẢNG CON (ĐIỂM)
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 32, color: '#FFFFFF', lineHeight: 1.5, fontWeight: 700 }}>
              • Cột mang sang bảng con để làm cầu nối liên kết<br />
              • <strong style={{ color: C.foreignKey }}>ĐƯỢC PHÉP TRÙNG LẶP</strong> giá trị
            </div>
          </div>
        </div>

        {/* Banner Thần Chú Đi Thi */}
        <div
          style={{
            width: 960,
            background: 'linear-gradient(90deg, rgba(245,158,11,0.25), rgba(245,158,11,0.4), rgba(245,158,11,0.25))',
            border: `2.5px solid ${C.primaryKey}`,
            borderRadius: 22,
            padding: '22px 30px',
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(245,158,11,0.3)',
            opacity: bannerPop,
            transform: `scale(${0.9 + bannerPop * 0.1})`,
          }}
        >
          🎯 THẦN CHÚ: Xuất hiện ở Bảng Con ➔ Khoanh ngay Khóa Ngoài!
        </div>
      </div>

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
