import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s05_value3.json';

export const Value3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s05_value3;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Key 1: Du lieu huan luyen (frame 120+, ~4.0s)
  const key1Active = frame >= 120;
  const key1Op = interpolate(frame, [120, 132], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const key1Y = interpolate(frame, [120, 134], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Key 2: Deepfake (frame 253+, ~8.4s)
  const key2Active = frame >= 253;
  const key2Op = interpolate(frame, [253, 265], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const key2Y = interpolate(frame, [253, 267], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s05_value3.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s05_value3', f, dur)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 140,
          paddingLeft: 50,
          paddingRight: 50,
          height: '100%',
        }}
      >
        {/* BADGE & TIEU DE VALUE 3 */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <Tag label="CÂU HỎI THỰC TẾ & XÃ HỘI" sub="ĐẠO ĐỨC & AN NINH" color="#FBBF24" borderColor="rgba(251, 191, 36, 0.4)" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            2 CHÌA KHÓA VÀNG: <span style={{ color: C.goldAmber }}>ĐẠO ĐỨC & AN NINH</span>
          </h1>
        </div>

        {/* KHUNG CUA SO TO BE THE PHU KIN KHONG GIAN (WIDTH 980, MIN-HEIGHT 1040) */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            minHeight: 1040,
            background: 'linear-gradient(135deg, rgba(12, 18, 36, 0.95) 0%, rgba(6, 10, 24, 0.98) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.35)',
            borderRadius: 32,
            padding: '34px 36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          {/* HEADER CUA SO */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontFamily: MONO, fontSize: 24, color: '#FBBF24', fontWeight: 800, marginLeft: 10 }}>
                [NGUYÊN TẮC PHÁP LÝ & ĐẠO ĐỨC SỐ TRONG GDPT 2018]
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.textDim }}>SGK TIN HỌC 12</span>
          </div>

          {/* THE 1: DU LIEU HUAN LUYEN (TRAINING DATA) */}
          <div
            style={{
              opacity: key1Active ? key1Op : 0.35,
              transform: key1Active ? `translateY(${key1Y}px)` : 'none',
              background: key1Active
                ? 'linear-gradient(135deg, rgba(36, 26, 12, 0.96) 0%, rgba(18, 12, 4, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: key1Active ? '2.5px solid #FBBF24' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '28px 32px',
              boxShadow: key1Active ? '0 14px 36px rgba(251, 191, 36, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    background: key1Active ? '#FBBF2422' : 'rgba(255,255,255,0.05)',
                    border: key1Active ? '2px solid #FBBF24' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 38,
                  }}
                >
                  🔑
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: key1Active ? '#FBBF24' : '#94A3B8', fontWeight: 800 }}>
                    [CHÌA KHÓA 1: ĐIỀU KIỆN TIÊN QUYẾT]
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: '#FFFFFF' }}>
                    Dữ Liệu Huấn Luyện (Training Data)
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: key1Active ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)',
                  color: key1Active ? '#FBBF24' : C.textDim,
                  fontSize: 22,
                  fontWeight: 900,
                  padding: '6px 16px',
                  borderRadius: 12,
                  border: key1Active ? '1px solid #FBBF24' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                ✓ CHỐNG ĐỊNH KIẾN (BIAS)
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 28, color: '#E2E8F0', lineHeight: 1.5, marginTop: 10, fontWeight: 600 }}>
              Dữ liệu phải thật <span style={{ color: key1Active ? '#FBBF24' : '#FDE68A', fontWeight: 800 }}>chuẩn mực, khách quan và công bằng</span> thì mô hình AI mới không thiên lệch hoặc phân biệt đối xử với các nhóm thiểu số!
            </div>
          </div>

          {/* THE 2: HIEM HOA AN NINH DEEPFAKE */}
          <div
            style={{
              opacity: key2Active ? key2Op : 0.35,
              transform: key2Active ? `translateY(${key2Y}px)` : 'none',
              background: key2Active
                ? 'linear-gradient(135deg, rgba(42, 14, 22, 0.96) 0%, rgba(20, 6, 10, 0.98) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: key2Active ? '2.5px solid #F43F5E' : '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '28px 32px',
              boxShadow: key2Active ? '0 14px 36px rgba(244, 63, 94, 0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    background: key2Active ? '#F43F5E22' : 'rgba(255,255,255,0.05)',
                    border: key2Active ? '2px solid #F43F5E' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 38,
                  }}
                >
                  🚨
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: key2Active ? '#F43F5E' : '#94A3B8', fontWeight: 800 }}>
                    [CHÌA KHÓA 2: HIỂM HỌA AN NINH]
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: '#FFFFFF' }}>
                    Cảnh Báo Công Nghệ Deepfake
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: key2Active ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)',
                  color: key2Active ? '#F43F5E' : C.textDim,
                  fontSize: 22,
                  fontWeight: 900,
                  padding: '6px 16px',
                  borderRadius: 12,
                  border: key2Active ? '1px solid #F43F5E' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                ⚠️ NGUY CƠ LỪA ĐẢO
              </span>
            </div>

            <div style={{ fontFamily: FONT, fontSize: 28, color: '#E2E8F0', lineHeight: 1.5, marginTop: 10, fontWeight: 600 }}>
              Nguy cơ <span style={{ color: key2Active ? '#FDA4AF' : '#E2E8F0', fontWeight: 800 }}>giả mạo khuôn mặt và giọng nói</span> cực kỳ tinh vi để lừa đảo — luôn luôn kiểm chứng danh tính qua các kênh độc lập!
            </div>

            <div
              style={{
                marginTop: 16,
                background: key2Active ? 'rgba(244, 63, 94, 0.16)' : 'rgba(255,255,255,0.04)',
                border: key2Active ? '1.5px solid #F43F5E' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>⚠️</span>
              <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: key2Active ? '#FDA4AF' : C.textDim }}>
                Lưu ý phòng thi: Lan truyền hình ảnh Deepfake giả mạo là vi phạm nghiêm trọng Luật An ninh mạng!
              </span>
            </div>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
