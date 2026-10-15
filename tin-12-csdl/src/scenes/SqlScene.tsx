import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s06_dang4_sql.json';

export const SqlScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s06_dang4_sql;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterSpr = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 14 } });

  // Nhịp sáng tuần tự theo câu nói:
  // 0s - 5s: Giọng đọc nói về SELECT, FROM, WHERE
  // 5s trở đi: Đề bài ví dụ lọc điểm >= 8
  const codePop = spring({ frame: frame - 130, fps, from: 0.9, to: 1, config: { damping: 14 } });
  const codeOp = interpolate(frame, [130, 145], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tipPop = spring({ frame: frame - 190, fps, from: 0, to: 1, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s06_dang4_sql.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s06_dang4_sql', f, dur)}
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
        <Tag accent={C.sqlBlue}>DẠNG 4: CÂU LỆNH SQL THỰC CHIẾN</Tag>

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
            textShadow: '0 8px 36px rgba(56, 189, 248, 0.45)',
          }}
        >
          THẦN CHÚ: SELECT - FROM - WHERE
        </h1>

        {/* 3 Mệnh đề cốt lõi */}
        <div
          style={{
            width: 960,
            display: 'flex',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[
            { kw: 'SELECT', mean: 'Chọn Cột', desc: 'Cột hiển thị', col: C.sqlBlue },
            { kw: 'FROM', mean: 'Chọn Bảng', desc: 'Nguồn dữ liệu', col: C.primaryKey },
            { kw: 'WHERE', mean: 'Lọc ĐK', desc: 'Điều kiện lấy', col: C.foreignKey },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.96)',
                border: `2.5px solid ${item.col}`,
                borderRadius: 20,
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: `0 14px 35px rgba(0,0,0,0.5), 0 0 20px ${item.col}22`,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 900, color: item.col, marginBottom: 8 }}>
                {item.kw}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                {item.mean}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 22, color: C.textDim, fontWeight: 600 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Khối Code Ví dụ thực tế thi cử */}
        <div
          style={{
            width: 960,
            background: 'rgba(15, 23, 42, 0.96)',
            border: `3px solid ${C.sqlBlue}`,
            borderRadius: 24,
            padding: '26px 36px',
            boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(56,189,248,0.25)`,
            marginBottom: 20,
            opacity: codeOp,
            transform: `scale(${codePop})`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.textDim, marginBottom: 12 }}>
            💻 Ví dụ lọc học sinh có điểm từ 8 trở lên:
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.6,
              color: '#FFFFFF',
              background: 'rgba(2, 6, 23, 0.75)',
              padding: '16px 24px',
              borderRadius: 16,
              border: '1.5px solid rgba(56, 189, 248, 0.2)',
            }}
          >
            <span style={{ color: C.sqlBlue }}>SELECT</span> HoTen, Diem<br />
            <span style={{ color: C.primaryKey }}>FROM</span> BangDiem<br />
            <span style={{ color: C.foreignKey }}>WHERE</span> <strong style={{ color: '#fef08a' }}>Diem &gt;= 8;</strong>
          </div>
        </div>

        {/* Thần chú bắt bẫy trắc nghiệm */}
        <div
          style={{
            width: 960,
            background: 'linear-gradient(90deg, rgba(56,189,248,0.25), rgba(56,189,248,0.4), rgba(56,189,248,0.25))',
            border: `2.5px solid ${C.sqlBlue}`,
            borderRadius: 22,
            padding: '20px 30px',
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 0 35px rgba(56,189,248,0.3)',
            opacity: tipPop,
            transform: `scale(${0.9 + tipPop * 0.1})`,
          }}
        >
          🎯 ĐỀ BẢO: "Điểm từ 8 trở lên" ➔ Tìm ngay mệnh đề: WHERE Diem &gt;= 8!
        </div>
      </div>

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
