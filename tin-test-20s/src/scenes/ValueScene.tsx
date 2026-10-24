import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO, TIKTOK_SAFE } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Tag } from '../decor';
import { Lyrics, W } from '../Lyrics';
import wordsJson from '../words/s02_value.json';

export const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SC.s02_value;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Staggered Reveal: Mỗi bước bung ra dứt khoát khi giọng đọc nhắc tới (Quy tắc cấm chữ mờ căm)
  const b1Op = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const b2Op = interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const b3Op = interpolate(frame, [90, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bEndOp = interpolate(frame, [130, 142], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut, fontFamily: FONT }}>
      <Audio
        src={staticFile('vo/s02_value.ogg')}
        startFrom={0}
        volume={voiceVolAt(frame, dur)}
      />

      {/* KHUNG NỘI DUNG NẰM TRỌN TRONG HỘP AN TOÀN IPHONE (X: 45 -> 875, Y: 360 -> 1440) */}
      <div
        style={{
          position: 'absolute',
          left: TIKTOK_SAFE.BOX_LEFT,
          top: TIKTOK_SAFE.BOX_TOP,
          width: TIKTOK_SAFE.BOX_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* HEADER: BADGE & TIÊU ĐỀ */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 20,
            width: '100%',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <Tag label="BÍ KÍP ĐẠT ĐIỂM 10" sub="PHƯƠNG PHÁP MỚI" color="#10B981" borderColor="rgba(16, 185, 129, 0.45)" />
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.25,
              textShadow: '0 4px 24px rgba(0,0,0,0.85)',
            }}
          >
            HỌC THEO MẠCH 3 BƯỚC<br />
            <span style={{ color: C.accent, textShadow: '0 0 24px rgba(56,189,248,0.5)' }}>
              ĐỔI KIỂU NÀO CŨNG ĐÚNG!
            </span>
          </h1>
        </div>

        {/* CONTAINER 3 THẺ BÀI HỌC — PHỦ TRỌN 830PX */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* BƯỚC 1: KHÁI NIỆM */}
          {frame >= 15 && (
            <div
              style={{
                opacity: b1Op,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 20, 35, 0.98) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.45)',
                borderRadius: 20,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  fontSize: 26,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>
                  Một Khái Niệm Bản Chất
                </div>
                <div style={{ fontSize: 20, color: C.textDim, marginTop: 4 }}>
                  Nắm vững gốc rễ, định nghĩa chuẩn SGK mới
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: VÍ DỤ CHẠY THẬT */}
          {frame >= 50 && (
            <div
              style={{
                opacity: b2Op,
                background: 'linear-gradient(135deg, rgba(30, 25, 15, 0.95) 0%, rgba(20, 15, 10, 0.98) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.5)',
                borderRadius: 20,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #F59E0B',
                  color: '#F59E0B',
                  fontSize: 26,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>
                  Một Ví Dụ Chạy Thật
                </div>
                <div style={{ fontSize: 20, color: '#FDE68A', marginTop: 4 }}>
                  Thấy tận mắt kết quả, hiểu vì sao máy xử lý như vậy
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: CÂU ĐỀ TƯƠNG ỨNG */}
          {frame >= 90 && (
            <div
              style={{
                opacity: b3Op,
                background: 'linear-gradient(135deg, rgba(15, 30, 20, 0.95) 0%, rgba(10, 20, 15, 0.98) 100%)',
                border: '1.5px solid rgba(16, 185, 129, 0.5)',
                borderRadius: 20,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  fontSize: 26,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>
                  Một Câu Đề Tương Ứng
                </div>
                <div style={{ fontSize: 20, color: '#A7F3D0', marginTop: 4 }}>
                  Thực chiến trúng bẫy thi tốt nghiệp THPT
                </div>
              </div>
            </div>
          )}

          {/* BANNER KẾT LUẬN CUỐI */}
          {frame >= 130 && (
            <div
              style={{
                opacity: bEndOp,
                marginTop: 8,
                padding: '16px 22px',
                borderRadius: 16,
                background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.5)',
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 900,
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
              }}
            >
              🎯 ĐỀ ĐỔI KIỂU NÀO CŨNG LÀM ĐƯỢC!
            </div>
          )}
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} />
    </AbsoluteFill>
  );
};
