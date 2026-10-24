import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s02_empathy.json';

export const EmpathyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SC.s02_empathy;

  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const enterOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enterY = interpolate(frame, [0, 14], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Staggered reveal cho the canh bao (kich hoat theo nhip loi thoai)
  const step2Active = frame >= 80;
  const step2Op = interpolate(frame, [80, 94], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const step2Y = interpolate(frame, [80, 94], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s02_empathy.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s02_empathy', f, dur)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 235, // TOP SAFE ZONE: KHÔNG ĐẶT NỘI DUNG Ở Y < 220PX
          paddingLeft: 48,
          paddingRight: 48,
          height: '100%',
        }}
      >
        {/* HEADER & TIÊU ĐỀ */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            textAlign: 'center',
            marginBottom: 28,
            width: '100%',
          }}
        >
          <Tag label="CẢNH BÁO BẪY ĐỀ THI" sub="ĐỊNH DẠNG MỚI 2026" color="#F59E0B" borderColor="rgba(245, 158, 11, 0.45)" />

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 50,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            ĐỪNG NGHĨ HTML LÀ DỄ!<br />
            <span style={{ color: '#F59E0B' }}>ĐỀ ĐÁNH THẲNG</span> BẢN CHẤT TRÌNH DUYỆT
          </h2>
        </div>

        {/* KHUNG SO SÁNH 2 MẶT CỐT LÕI */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            width: '100%',
            maxWidth: 980,
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.96) 0%, rgba(7, 10, 18, 0.98) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 28,
            padding: '36px 36px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* THẺ 1: TƯ TƯỞNG CHỦ QUAN */}
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '2px solid rgba(244, 63, 94, 0.45)',
              borderRadius: 22,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1.5px solid #F43F5E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              }}
            >
              ❌
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: '#FFFFFF' }}>
                Sai lầm: Học vẹt tên thẻ
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, color: '#FDA4AF', marginTop: 4, fontWeight: 600 }}>
                Cứ nghĩ nhớ &lt;h1&gt;, &lt;p&gt;, &lt;title&gt; là xong, không hiểu cơ chế phần tử
              </div>
            </div>
          </div>

          {/* THẺ 2: ĐỀ THI MỚI 2026 (CHỈ XUẤT HIỆN KHI ĐỌC TỚI — QUY TẮC 42: CẤM CHỮ MỜ CĂM) */}
          {step2Active ? (
            <div
              style={{
                opacity: step2Op,
                transform: `translateY(${step2Y}px)`,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2.5px solid #10B981',
                borderRadius: 22,
                padding: '26px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                boxShadow: '0 12px 30px rgba(16, 185, 129, 0.25)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1.5px solid #10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                }}
              >
                🎯
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 900, color: '#FFFFFF' }}>
                  Thực tế: Đề thi Đúng/Sai 4 ý
                </div>
                <div style={{ fontFamily: FONT, fontSize: 28, color: '#6EE7B7', marginTop: 6, fontWeight: 700 }}>
                  Đánh sâu vào cách hiển thị của DOM & giới hạn chuẩn HTML5
                </div>
              </div>
            </div>
          ) : null}

          {/* DÒNG NHẮC NHỞ TƯ DUY */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.12)',
              paddingTop: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 24, color: '#94A3B8', fontWeight: 600 }}>
              Định dạng đề thi: Phần II (Trắc nghiệm Đúng / Sai)
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 800,
                color: '#F59E0B',
              }}
            >
              Phân hóa điểm 8-9-10
            </span>
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
