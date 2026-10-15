import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s07_meo_thi.json';

export const MeoThiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s07_meo_thi;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterSpr = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 14 } });

  // Nhịp sáng tuần tự theo câu nói:
  // 0s - 4.5s: Nhìn bảng con trước, cột tham chiếu là khóa ngoài
  // 4.5s trở đi: Tuyệt đối không đoán mò theo cảm tính
  const tip3Pop = spring({ frame: frame - 150, fps, from: 0.9, to: 1, config: { damping: 14 } });
  const tip3Op = interpolate(frame, [150, 165], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s07_meo_thi.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s07_meo_thi', f, dur)}
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
        <Tag accent={C.foreignKey}>CHIẾN THUẬT PHÒNG THI 2K9</Tag>

        <h1
          style={{
            fontFamily: FONT,
            fontSize: 66,
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 22,
            marginBottom: 28,
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 8px 36px rgba(16, 185, 129, 0.45)',
          }}
        >
          MẸO BẮT KHÓA TRONG 3 GIÂY
        </h1>

        <div
          style={{
            width: 960,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Mẹo 1 */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.96)',
              border: `2.5px solid ${C.sqlBlue}`,
              borderRadius: 22,
              padding: '24px 32px',
              boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 25px rgba(56,189,248,0.2)`,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: C.sqlBlue, marginBottom: 8 }}>
              👀 BƯỚC 1: NHÌN VÀO BẢNG CON TRƯỚC!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.5 }}>
              Bảng con (như Bảng Điểm, Đăng Ký) luôn là nơi chứa các liên kết dữ liệu!
            </div>
          </div>

          {/* Mẹo 2 */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.96)',
              border: `3px solid ${C.primaryKey}`,
              borderRadius: 22,
              padding: '26px 32px',
              boxShadow: `0 18px 45px rgba(0,0,0,0.6), 0 0 35px rgba(245,158,11,0.25)`,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: C.primaryKey, marginBottom: 8 }}>
              🎯 BƯỚC 2: CỘT THAM CHIẾU ➔ KHOANH KHÓA NGOÀI!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.5 }}>
              Cột nào lấy từ bảng cha sang làm cầu nối ➔ Đó chính là <span style={{ color: C.foreignKey }}>KHÓA NGOÀI (FK)</span>!
            </div>
          </div>

          {/* Mẹo 3: Cảnh báo không đoán mò */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(244,63,94,0.2), rgba(244,63,94,0.35), rgba(244,63,94,0.2))',
              border: `2.5px solid ${C.accentPink}`,
              borderRadius: 22,
              padding: '22px 30px',
              boxShadow: '0 0 30px rgba(244,63,94,0.3)',
              opacity: tip3Op,
              transform: `scale(${tip3Pop})`,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 900, color: '#FFFFFF', textAlign: 'center' }}>
              ⛔ NGUYÊN TẮC VÀNG: Tuyệt đối không đoán mò theo cảm tính!
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
