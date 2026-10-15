import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s05_dang3_toan_ven.json';

export const ToanVenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s05_dang3_toan_ven;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterSpr = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 14 } });

  // Nhịp sáng tuần tự theo câu nói:
  // 0s - 4.5s (0 - 135f): Câu hỏi đề thi & Cảnh báo bị chặn
  // 4.5s trở đi (135f+): Quy tắc muốn xóa đúng
  const p2Pop = spring({ frame: frame - 120, fps, from: 0.9, to: 1, config: { damping: 14 } });
  const p2Op = interpolate(frame, [120, 135], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bannerPop = spring({ frame: frame - 180, fps, from: 0, to: 1, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s05_dang3_toan_ven.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s05_dang3_toan_ven', f, dur)}
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
        <Tag accent={C.foreignKey}>DẠNG 3: RÀNG BUỘC TOÀN VẸN</Tag>

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
          QUY TẮC XÓA BẢN GHI DỮ LIỆU
        </h1>

        {/* Khối 1: Tình huống đề thi & Phán quyết chặn lại */}
        <div
          style={{
            width: 960,
            background: 'rgba(15, 23, 42, 0.96)',
            border: `3px solid ${C.accentPink}`,
            borderRadius: 24,
            padding: '28px 36px',
            boxShadow: `0 18px 45px rgba(0,0,0,0.6), 0 0 35px rgba(244,63,94,0.3)`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.sqlBlue, marginBottom: 10 }}>
            ❓ ĐỀ HỎI: "Có thể xóa học sinh ở bảng CHA khi đang có điểm ở bảng CON không?"
          </div>
          <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.accentPink, lineHeight: 1.35 }}>
            ⛔ TUYỆT ĐỐI KHÔNG! Khóa Ngoài (FK) sẽ CHẶN LẠI!
          </div>
        </div>

        {/* Khối 2: Quy trình muốn xóa chuẩn 2 bước */}
        <div
          style={{
            width: 960,
            background: 'rgba(15, 23, 42, 0.96)',
            border: `3px solid ${C.foreignKey}`,
            borderRadius: 24,
            padding: '28px 36px',
            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(16,185,129,0.25)`,
            marginBottom: 20,
            opacity: p2Op,
            transform: `scale(${p2Pop})`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: C.foreignKey, marginBottom: 12 }}>
            ✅ MUỐN XÓA THÌ PHẢI LÀM GÌ?
          </div>
          <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.55 }}>
            • <strong style={{ color: C.primaryKey }}>Bước 1:</strong> Xóa ĐIỂM ở Bảng Con trước ➔<br />
            • <strong style={{ color: C.foreignKey }}>Bước 2:</strong> Sau đó mới được Xóa HỌC SINH ở Bảng Cha!
          </div>
        </div>

        {/* Khối 3: Thần chú đi thi */}
        <div
          style={{
            width: 960,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.25), rgba(16,185,129,0.4), rgba(16,185,129,0.25))',
            border: `2.5px solid ${C.foreignKey}`,
            borderRadius: 22,
            padding: '22px 30px',
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 0 35px rgba(16,185,129,0.3)',
            opacity: bannerPop,
            transform: `scale(${0.9 + bannerPop * 0.1})`,
          }}
        >
          🎯 ĐI THI: Hỏi xóa được không? ➔ Bảng con còn dữ liệu là KHÔNG ĐƯỢC XÓA!
        </div>
      </div>

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
