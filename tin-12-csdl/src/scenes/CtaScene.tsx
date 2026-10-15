import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s08_cta.json';

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s08_cta;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chuyen tu Pha 1 (Tu tin hieu ban chat) sang Pha 2 (CTA luyen de) dung luc voice noi:
  // "Muon quet sach moi dang bai..." tai ~6.36s (frame 195)
  const SWITCH_FRAME = 195;

  const p1Enter = spring({ frame, fps, from: 0.94, to: 1, config: { damping: 14 } });
  const p1Exit = interpolate(frame, [SWITCH_FRAME - 10, SWITCH_FRAME], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p2Enter = spring({ frame: frame - SWITCH_FRAME, fps, from: 0.94, to: 1, config: { damping: 14 } });
  const p2Op = interpolate(frame, [SWITCH_FRAME, SWITCH_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse animation cho nut CTA o Pha 2
  const pulse = Math.sin((frame * Math.PI * 2) / 45) * 0.02 + 1;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s08_cta.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s08_cta', f, dur)}
      />

      {/* =============================================================== */}
      {/* PHA 1: TỰ TIN ĂN TRỌN ĐIỂM 10 CHO 2K9 (0s - 6.4s)                */}
      {/* Voice: "Tóm lại, khi em đã hiểu sâu bản chất... đề thi có...     */}
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
            paddingTop: 270,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          <Tag accent={C.primaryKey}>BỨT PHÁ ĐIỂM SỐ 2K9</Tag>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 26,
              marginBottom: 10,
              textAlign: 'center',
              lineHeight: 1.2,
              textShadow: '0 8px 36px rgba(245, 158, 11, 0.45)',
            }}
          >
            HIỂU SÂU BẢN CHẤT
          </h1>

          <div
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 900,
              color: C.primaryKey,
              marginBottom: 36,
              textAlign: 'center',
              letterSpacing: '0.02em',
              textShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
            }}
          >
            TỰ TIN ĂN TRỌN ĐIỂM 10!
          </div>

          {/* CARD TỔNG KẾT 4 TRỌNG TÂM RÕ RÀNG */}
          <div
            style={{
              width: 960,
              background: 'rgba(15, 23, 42, 0.96)',
              border: `3px solid ${C.primaryKey}`,
              borderRadius: 32,
              padding: '38px 40px',
              boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 50px rgba(245,158,11,0.25)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {[
              { num: '01', title: 'Khóa Chính & Khóa Ngoài', note: 'Duy nhất · Không rỗng · Cầu nối bảng' },
              { num: '02', title: 'Bẫy Khóa Chính Gộp', note: 'Gộp nhiều cột để định danh duy nhất' },
              { num: '03', title: 'Toàn Vẹn Tham Chiếu', note: 'Xóa bản ghi bảng tham chiếu bị chặn' },
              { num: '04', title: 'Thần Chú SQL', note: 'SELECT (chọn cột) · FROM (bảng) · WHERE (lọc)' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1.5px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 18,
                  padding: '16px 24px',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 28,
                    fontWeight: 900,
                    color: C.primaryKey,
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '6px 14px',
                    borderRadius: 10,
                  }}
                >
                  {item.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.textDim, marginTop: 4 }}>
                    {item.note}
                  </div>
                </div>
                <span style={{ fontSize: 28, color: C.foreignKey }}>✓</span>
              </div>
            ))}

            <div
              style={{
                marginTop: 8,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 800,
                color: C.foreignKey,
                letterSpacing: '0.01em',
              }}
            >
              ⚡ Đề thi có biến hóa hay gài bẫy thế nào cũng ăn trọn điểm!
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* PHA 2: CTA HÀNH ĐỘNG VÀO LUYỆN ĐỀ CHO 2K9 (6.4s - 13.8s)        */}
      {/* Voice: "Muốn quét sạch mọi dạng bài... vào ngay neoeducation... "*/}
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
            paddingTop: 270,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          <Tag accent={C.sqlBlue}>LUYỆN ĐỀ THI 2K9</Tag>

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 70,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 24,
              marginBottom: 12,
              textAlign: 'center',
              letterSpacing: '-0.01em',
              textShadow: '0 8px 36px rgba(56, 189, 248, 0.45)',
            }}
          >
            QUÉT SẠCH MỌI DẠNG BÀI
          </h2>

          <div
            style={{
              fontFamily: FONT,
              fontSize: 34,
              color: C.textDim,
              fontWeight: 700,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            Tự tin bước vào phòng thi với bộ đề chuẩn cấu trúc mới 2K9
          </div>

          {/* CARD CTA CHÍNH — NỔI BẬT, RỰC SÁNG, DỄ NHÌN */}
          <div
            style={{
              width: 960,
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
              border: '3.5px solid #38bdf8',
              borderRadius: 36,
              padding: '48px 44px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 60px rgba(56,189,248,0.35)',
              marginBottom: 36,
              transform: `scale(${pulse})`,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              HỆ THỐNG LUYỆN ĐỀ THI TRỰC TUYẾN 2K9
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '2px solid #7dd3fc',
                borderRadius: 24,
                padding: '20px 48px',
                fontFamily: FONT,
                fontSize: 48,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                boxShadow: '0 12px 30px rgba(2, 132, 199, 0.5)',
                marginBottom: 20,
              }}
            >
              VÀO LUYỆN ĐỀ NGAY ➜
            </div>

            <div
              style={{
                fontFamily: MONO,
                fontSize: 54,
                fontWeight: 900,
                color: '#fef08a',
                letterSpacing: '0.04em',
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}
            >
              neoeducation.vn
            </div>
          </div>

          {/* 2 THẺ TÍNH NĂNG RỘNG RÃI CÂN ĐỐI — KHÔNG BỊ TRÀN VIỀN */}
          <div
            style={{
              width: 960,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            {[
              {
                icon: '🎯',
                title: 'Chuẩn Ma Trận 2K9',
                desc: 'Bám sát cấu trúc thi mới nhất',
                col: C.sqlBlue,
              },
              {
                icon: '⚡',
                title: 'Mẹo Bắt Bẫy 3 Giây',
                desc: 'Tối ưu tốc độ & độ chính xác',
                col: C.primaryKey,
              },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: `2.5px solid ${b.col}`,
                  borderRadius: 24,
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 20px ${b.col}22`,
                }}
              >
                <span style={{ fontSize: 44 }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 32,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: 4,
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 24,
                      fontWeight: 600,
                      color: C.textDim,
                    }}
                  >
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};
