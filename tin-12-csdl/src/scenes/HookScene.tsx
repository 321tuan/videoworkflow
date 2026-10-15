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

  // Mốc chuyển đổi:
  // 0s - 6.4s (frame 0 - 192): Hook cảnh báo 80% mất điểm oan & Câu hỏi bẫy
  // 6.4s trở đi (frame 192+): Lộ trình 4 dạng bài quét sạch bẫy đề thi
  const SWITCH_FRAME = 192;

  // Animation Pha 1 chung
  const p1Exit = interpolate(frame, [SWITCH_FRAME - 12, SWITCH_FRAME], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // =========================================================================
  // PHA 1 — STAGGERED REVEAL THEO NHỊP GIỌNG ĐỌC (0s - 6.4s):
  // -------------------------------------------------------------------------
  // 1. Nhịp 1 (frame 0 - 55, 0s - 1.8s): "Tưởng dễ ăn điểm mười Tin học 12..."
  //    -> Chỉ hiện Tag và Tiêu đề Hook khơi gợi tò mò + Cánh cụt chào
  const step1Spring = spring({ frame, fps, from: 0.85, to: 1, config: { damping: 14 } });
  const step1Op = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Nhịp 2 (frame 55+, 1.8s - 3.8s): "...nhưng hơn 80% 2K9 lại mất điểm oan..."
  //    -> Bật thẻ số liệu đỏ rực cảnh báo mất điểm oan
  const step2Spring = spring({ frame: frame - 55, fps, from: 0, to: 1, config: { damping: 12 } });
  const step2Op = interpolate(frame, [55, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. Nhịp 3 (frame 115+, 3.8s - 5.0s): "...vì dính bẫy này."
  //    -> Hộp câu hỏi trắc nghiệm trượt vào
  const step3Spring = spring({ frame: frame - 115, fps, from: 0.88, to: 1, config: { damping: 14 } });
  const step3Op = interpolate(frame, [115, 125], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Nhịp 4 (frame 132+): Đáp án bẫy A nảy ra
  const optASpring = spring({ frame: frame - 132, fps, from: 0.85, to: 1, config: { damping: 13 } });
  const optAOp = interpolate(frame, [132, 142], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Nhịp 5 (frame 152+): Đáp án đúng B bừng sáng + Dòng thần chú
  const optBSpring = spring({ frame: frame - 152, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const optBOp = interpolate(frame, [152, 162], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Mascot Cánh Cụt chào mừng
  const penguinEnter = spring({ frame: frame - 5, fps, from: 0, to: 1, config: { damping: 12 } });
  const penguinBob = Math.sin((frame * Math.PI * 2) / 40) * 8;

  // =========================================================================
  // PHA 2 — LỘ TRÌNH 4 DẠNG BÀI STAGGERED REVEAL (frame 192 trở đi):
  // -------------------------------------------------------------------------
  const p2Enter = spring({ frame: frame - SWITCH_FRAME, fps, from: 0.92, to: 1, config: { damping: 14 } });
  const p2Op = interpolate(frame, [SWITCH_FRAME, SWITCH_FRAME + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stagger cho từng thẻ dạng bài (mỗi thẻ nảy cách nhau 18 frames):
  // Thẻ 1: f 215 | Thẻ 2: f 233 | Thẻ 3: f 251 | Thẻ 4: f 269 | Cam kết: f 287
  const card1Spring = spring({ frame: frame - (SWITCH_FRAME + 23), fps, from: 0, to: 1, config: { damping: 13 } });
  const card2Spring = spring({ frame: frame - (SWITCH_FRAME + 41), fps, from: 0, to: 1, config: { damping: 13 } });
  const card3Spring = spring({ frame: frame - (SWITCH_FRAME + 59), fps, from: 0, to: 1, config: { damping: 13 } });
  const card4Spring = spring({ frame: frame - (SWITCH_FRAME + 77), fps, from: 0, to: 1, config: { damping: 13 } });
  const footerSpring = spring({ frame: frame - (SWITCH_FRAME + 95), fps, from: 0, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s01_hook.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s01_hook', f, dur)}
      />

      {/* =============================================================== */}
      {/* PHA 1: HOOK DẪN DẮT TỪNG BƯỚC — ĐỌC TỚI ĐÂU HIỆN TỚI ĐÓ (0s - 6.4s)*/}
      {/* =============================================================== */}
      {frame < SWITCH_FRAME + 5 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: p1Exit,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 230,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          {/* 1. Tag đầu tiên */}
          <div style={{ opacity: step1Op, transform: `scale(${step1Spring})` }}>
            <Tag accent={frame >= 55 ? C.accentPink : C.sqlBlue}>
              {frame >= 55 ? '🚨 CẢNH BÁO BẪY ĐỀ THI 2K9' : 'BÍ KÍP ĐIỂM 10 TIN HỌC 12'}
            </Tag>
          </div>

          {/* 2. Headline chính chuyển biến sinh động theo giọng đọc */}
          {frame < 55 ? (
            <div
              style={{
                opacity: step1Op,
                transform: `scale(${step1Spring})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 30,
                marginBottom: 20,
              }}
            >
              <h1
                style={{
                  fontFamily: FONT,
                  fontSize: 74,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  textShadow: '0 8px 30px rgba(56, 189, 248, 0.45)',
                }}
              >
                TƯỞNG DỄ ĂN ĐIỂM 10?
              </h1>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 34,
                  fontWeight: 700,
                  color: C.sqlBlue,
                  marginTop: 14,
                  letterSpacing: '0.02em',
                }}
              >
                Môn Tin học 12 chuẩn format mới
              </div>
            </div>
          ) : (
            <div
              style={{
                opacity: step2Op,
                transform: `scale(${step2Spring})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 22,
                marginBottom: 16,
              }}
            >
              <h1
                style={{
                  fontFamily: FONT,
                  fontSize: 76,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  textShadow: '0 8px 36px rgba(244, 63, 94, 0.6)',
                }}
              >
                80% MẤT ĐIỂM OAN!
              </h1>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 36,
                  fontWeight: 800,
                  color: C.accentPink,
                  marginTop: 10,
                  letterSpacing: '0.02em',
                }}
              >
                PHẦN CƠ SỞ DỮ LIỆU & SQL
              </div>
            </div>
          )}

          {/* 3. HỘP BẪY TRẮC NGHIỆM — CHỈ NẢY RA TỪ FRAME 115 KHI ĐỌC "...VÌ DÍNH BẪY NÀY" */}
          {frame >= 115 && (
            <div
              style={{
                width: 960,
                background: 'rgba(15, 23, 42, 0.96)',
                border: `3px solid ${C.accentPink}`,
                borderRadius: 30,
                padding: '32px 36px',
                boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 50px rgba(244,63,94,0.35)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                opacity: step3Op,
                transform: `scale(${step3Spring})`,
                marginTop: 10,
              }}
            >
              {/* Câu hỏi */}
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 34,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.4,
                  textAlign: 'center',
                }}
              >
                ❓ "Cột nào đóng vai trò là{' '}
                <span
                  style={{
                    color: C.primaryKey,
                    background: 'rgba(245,158,11,0.2)',
                    padding: '4px 16px',
                    borderRadius: 12,
                    border: `2px solid ${C.primaryKey}`,
                    fontWeight: 900,
                  }}
                >
                  Khóa Ngoài
                </span>
                ?"
              </div>

              {/* Danh sách đáp án xuất hiện từng cái một */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Đáp án A (bẫy) — nảy ra ở frame 132 */}
                {frame >= 132 && (
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.85)',
                      border: '2px solid rgba(244, 63, 94, 0.65)',
                      padding: '18px 24px',
                      borderRadius: 18,
                      fontFamily: MONO,
                      fontSize: 30,
                      fontWeight: 700,
                      color: C.textDim,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: optAOp,
                      transform: `scale(${optASpring})`,
                    }}
                  >
                    <span>A. MaHS (Bảng Học Sinh)</span>
                    <span style={{ color: C.accentPink, fontSize: 28, fontWeight: 900 }}>
                      ❌ 80% chọn nhầm!
                    </span>
                  </div>
                )}

                {/* Đáp án B (đúng) — nảy ra ở frame 152 */}
                {frame >= 152 && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.25)',
                      border: `3px solid ${C.foreignKey}`,
                      padding: '18px 24px',
                      borderRadius: 18,
                      fontFamily: MONO,
                      fontSize: 30,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 0 35px rgba(16, 185, 129, 0.35)',
                      opacity: optBOp,
                      transform: `scale(${optBSpring})`,
                    }}
                  >
                    <span>B. MaHS (Bảng Điểm Thi)</span>
                    <span style={{ color: C.foreignKey, fontSize: 28, fontWeight: 900 }}>
                      ✓ ĐÁP ÁN ĐÚNG
                    </span>
                  </div>
                )}
              </div>

              {/* Dòng ghi nhớ mẹo thi — nảy ra cùng đáp án B */}
              {frame >= 165 && (
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.primaryKeySoft,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  ⚡ Bảng Gốc là Khóa Chính ➔ Bảng Con mới là Khóa Ngoài!
                </div>
              )}
            </div>
          )}

          {/* MASCOT CÁNH CỤT CHÀO VUI TƯƠI */}
          <div
            style={{
              position: 'absolute',
              right: 60,
              bottom: 340,
              width: 190,
              transform: `scale(${penguinEnter}) translateY(${penguinBob}px)`,
              opacity: penguinEnter,
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
              pointerEvents: 'none',
            }}
          >
            <Img
              src={staticFile('img/canh-cut.png')}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* PHA 2: LỘ TRÌNH 4 DẠNG BÀI — NẢY LẦN LƯỢT TỪNG Ô (STAGGERED)   */}
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
            paddingTop: 240,
            paddingLeft: 44,
            paddingRight: 44,
          }}
        >
          <Tag accent={C.foreignKey}>LỘ TRÌNH 2K9 ÔN THI</Tag>

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 66,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 20,
              marginBottom: 10,
              textAlign: 'center',
              lineHeight: 1.2,
              textShadow: '0 8px 36px rgba(16, 185, 129, 0.45)',
            }}
          >
            4 DẠNG BÀI CHẮC CHẮN CÓ TRONG ĐỀ
          </h2>

          <div
            style={{
              fontFamily: FONT,
              fontSize: 32,
              color: C.textDim,
              fontWeight: 700,
              marginBottom: 26,
              textAlign: 'center',
            }}
          >
            Chỉ cần dành đúng 1 phút để nắm trọn bí kíp ăn điểm 10!
          </div>

          {/* 4 Card Dạng Bài Nảy Lần Lượt (Staggered Pop-In) */}
          <div
            style={{
              width: 960,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              {
                num: '01',
                title: 'Bắt Khóa Chính & Khóa Ngoài',
                col: C.primaryKey,
                icon: '🔑',
                springVal: card1Spring,
                minFrame: SWITCH_FRAME + 23,
              },
              {
                num: '02',
                title: 'Bẫy Khóa Chính Gộp (Nhiều cột)',
                col: C.accentPink,
                icon: '🧩',
                springVal: card2Spring,
                minFrame: SWITCH_FRAME + 41,
              },
              {
                num: '03',
                title: 'Toàn Vẹn Tham Chiếu (Quy tắc xóa)',
                col: C.foreignKey,
                icon: '🛡️',
                springVal: card3Spring,
                minFrame: SWITCH_FRAME + 59,
              },
              {
                num: '04',
                title: 'Thần Chú Câu Lệnh SQL',
                col: C.sqlBlue,
                icon: '⚡',
                springVal: card4Spring,
                minFrame: SWITCH_FRAME + 77,
              },
            ].map((d, i) => {
              if (frame < d.minFrame) return null;
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: `2.5px solid ${d.col}`,
                    borderRadius: 20,
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 20px ${d.col}22`,
                    transform: `scale(${d.springVal}) translateX(${(1 - d.springVal) * 60}px)`,
                    opacity: d.springVal,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 26,
                      fontWeight: 900,
                      color: d.col,
                      background: `${d.col}20`,
                      padding: '6px 14px',
                      borderRadius: 10,
                    }}
                  >
                    {d.num}
                  </div>
                  <span style={{ fontSize: 32 }}>{d.icon}</span>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 32,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      flex: 1,
                    }}
                  >
                    {d.title}
                  </div>
                  <span style={{ color: d.col, fontSize: 26 }}>➔</span>
                </div>
              );
            })}
          </div>

          {/* Cam kết ăn trọn điểm — Nảy ra cuối cùng */}
          {frame >= SWITCH_FRAME + 95 && (
            <div
              style={{
                width: 960,
                background: 'linear-gradient(90deg, rgba(56,189,248,0.2), rgba(56,189,248,0.35), rgba(56,189,248,0.2))',
                border: `2px solid ${C.sqlBlue}`,
                borderRadius: 18,
                padding: '16px 28px',
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
                transform: `scale(${footerSpring})`,
                opacity: footerSpring,
              }}
            >
              🎯 Quét sạch mọi dạng bài ➔ Tự tin bước vào phòng thi!
            </div>
          )}
        </div>
      )}

      {/* BOTTOM: Lyrics */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={260} />
    </AbsoluteFill>
  );
};

