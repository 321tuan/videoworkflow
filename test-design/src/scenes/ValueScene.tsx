import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SAFE_ZONE, C, FONT, MONO } from '../theme';
import { SafeWatermarkAndProgress } from '../components/SafeWatermarkAndProgress';
import { SafeLyrics } from '../components/SafeLyrics';

export const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();

  const card1Op = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const card1Y = interpolate(frame, [0, 12], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Staggered reveal: Card 2 an hoan toan truoc frame 20 (Quy tac Cam chu mo cam)
  const card2Op = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const card2Y = interpolate(frame, [20, 32], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <SafeWatermarkAndProgress />

      {/* CONTAINER CHÍNH KHÓA TRỌN TRONG HỘP AN TOÀN VÀNG */}
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.X_MIN,
          top: SAFE_ZONE.Y_MIN,
          width: SAFE_ZONE.WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          zIndex: 50,
        }}
      >
        {/* HEADER BÀI HỌC */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: 20,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              color: C.accentBlue,
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            ĐỐI CHIẾU KIẾN THỨC BẢN CHẤT
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            TẠI SAO CODE NÀY <span style={{ color: C.accentPink }}>GÂY LỖI?</span>
          </h2>
        </div>

        {/* CARD 1: LỖI SAI THƯỜNG GẶP (CẢNH BÁO ĐỎ) */}
        <div
          style={{
            width: '100%',
            opacity: card1Op,
            transform: `translateY(${card1Y}px)`,
            background: 'linear-gradient(135deg, rgba(30, 15, 20, 0.95) 0%, rgba(18, 10, 15, 0.98) 100%)',
            border: '2px solid rgba(244, 63, 94, 0.5)',
            borderRadius: 22,
            padding: '22px 26px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>❌</span>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#FDA4AF' }}>
              BẪY SAI: Quên đóng dấu ngoặc nhọn
            </span>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 26,
              background: 'rgba(0,0,0,0.5)',
              padding: '12px 18px',
              borderRadius: 12,
              color: '#F43F5E',
              lineHeight: 1.5,
              marginBottom: 10,
            }}
          >
            &lt;h1 Chào mừng 20/10&gt; <span style={{ color: '#FDE047', fontWeight: 800 }}>← THIẾU DẤU &gt;</span>
          </div>
          <p style={{ fontSize: 26, color: '#E2E8F0', margin: 0, lineHeight: 1.45 }}>
            Trình duyệt coi toàn bộ nội dung là tên thuộc tính và <strong>không hiển thị gì ra màn hình!</strong>
          </p>
        </div>

        {/* CARD 2: CÁCH VIẾT CHUẨN (XANH NGỌC - CHỈ HIỆN KHI ĐỌC TỚI) */}
        {frame >= 20 && (
          <div
            style={{
              width: '100%',
              opacity: card2Op,
              transform: `translateY(${card2Y}px)`,
              background: 'linear-gradient(135deg, rgba(10, 30, 25, 0.95) 0%, rgba(8, 20, 18, 0.98) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: 22,
              padding: '22px 26px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>✅</span>
              <span style={{ fontSize: 30, fontWeight: 900, color: '#6EE7B7' }}>
                CHUẨN GDPT 2018: Đóng thẻ mở đúng cú pháp
              </span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 26,
                background: 'rgba(0,0,0,0.5)',
                padding: '12px 18px',
                borderRadius: 12,
                color: '#34D399',
                lineHeight: 1.5,
                marginBottom: 10,
              }}
            >
              &lt;h1&gt;Chào mừng 20/10&lt;/h1&gt; <span style={{ color: '#6EE7B7', fontWeight: 800 }}>← ĐÚNG</span>
            </div>
            <p style={{ fontSize: 26, color: '#E2E8F0', margin: 0, lineHeight: 1.45 }}>
              Mỗi thẻ HTML mở đều phải kết thúc bằng dấu <strong>&gt;</strong> trước khi có phần thân!
            </p>
          </div>
        )}
      </div>

      <SafeLyrics text="Hiểu đúng bản chất để không bao giờ mất điểm oan!" />
    </AbsoluteFill>
  );
};
