import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s04_dang2_khoa_gop.json';

export const KhoaGopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s04_dang2_khoa_gop;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterSpr = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 14 } });

  // Nhịp hiện tuần tự theo lời nói:
  // 0s - 4.5s (0 - 135f): Phân tích bẫy lặp MaHS trong bảng điểm
  // 4.5s trở đi (135f+): Giải pháp gộp cột MaHS + MaMon
  const p2Pop = spring({ frame: frame - 110, fps, from: 0.9, to: 1, config: { damping: 14 } });
  const p2Op = interpolate(frame, [110, 125], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tipPop = spring({ frame: frame - 180, fps, from: 0, to: 1, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s04_dang2_khoa_gop.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s04_dang2_khoa_gop', f, dur)}
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
        <Tag accent={C.accentPink}>DẠNG 2: BẪY NGUY HIỂM</Tag>

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
            textShadow: '0 8px 36px rgba(244, 63, 94, 0.45)',
          }}
        >
          KHÓA CHÍNH GỒM NHIỀU CỘT
        </h1>

        {/* Khối 1: Cảnh báo bẫy lặp MaHS */}
        <div
          style={{
            width: 960,
            background: 'rgba(15, 23, 42, 0.96)',
            border: `2.5px solid ${C.accentPink}`,
            borderRadius: 22,
            padding: '24px 32px',
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 35px rgba(244,63,94,0.25)`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.5 }}>
            🚨 <span style={{ color: C.accentPink }}>BẪY TRONG BẢNG ĐIỂM:</span> 1 học sinh thi nhiều môn ➔{' '}
            <span style={{ color: C.primaryKey }}>MaHS bị lặp lại!</span><br />
            <span style={{ fontSize: 26, color: C.textDim }}>(Nếu để MaHS đứng 1 mình làm khóa chính sẽ vi phạm tính duy nhất)</span>
          </div>
        </div>

        {/* Khối 2: Giải pháp gộp cột */}
        <div
          style={{
            width: 960,
            background: 'rgba(15, 23, 42, 0.96)',
            border: `3px solid ${C.primaryKey}`,
            borderRadius: 26,
            padding: '32px 36px',
            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(245,158,11,0.25)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            marginBottom: 20,
            opacity: p2Op,
            transform: `scale(${p2Pop})`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>
            🔑 Khóa Chính Bắt Buộc Phải Gộp:
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              fontFamily: MONO,
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            <div
              style={{
                background: 'rgba(245,158,11,0.2)',
                color: C.primaryKey,
                padding: '12px 28px',
                borderRadius: 16,
                border: `2px solid ${C.primaryKey}`,
              }}
            >
              MaHS
            </div>
            <span style={{ color: '#FFFFFF', fontSize: 40 }}>+</span>
            <div
              style={{
                background: 'rgba(56,189,248,0.2)',
                color: C.sqlBlue,
                padding: '12px 28px',
                borderRadius: 16,
                border: `2px solid ${C.sqlBlue}`,
              }}
            >
              MaMon
            </div>
          </div>

          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 800,
              color: C.foreignKey,
              textAlign: 'center',
            }}
          >
            ➔ Tạo thành bộ đôi xác định DUY NHẤT 100%!
          </div>
        </div>

        {/* Khối 3: Bẫy lý thuyết thi trắc nghiệm */}
        <div
          style={{
            width: 960,
            background: 'linear-gradient(90deg, rgba(244,63,94,0.2), rgba(244,63,94,0.35), rgba(244,63,94,0.2))',
            border: `2.5px solid ${C.accentPink}`,
            borderRadius: 22,
            padding: '22px 30px',
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 0 35px rgba(244,63,94,0.3)',
            opacity: tipPop,
            transform: `scale(${0.9 + tipPop * 0.1})`,
          }}
        >
          🎯 ĐỀ HỎI: "Bảng này có mấy khóa chính?"<br />
          <span style={{ color: C.foreignKey }}>➔ KHOANH NGAY: CÓ 1 KHÓA CHÍNH (gồm 2 thuộc tính)!</span>
        </div>
      </div>

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
