import React from 'react';
import { SAFE_ZONE, FONT } from '../theme';

interface Props {
  showSafeBox?: boolean;
}

export const TikTokOverlay: React.FC<Props> = ({ showSafeBox = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
        fontFamily: FONT,
      }}
    >
      {/* 1. KHUNG HỘP AN TOÀN VÀNG (CHỈ BẬT KHI DEBUG) */}
      {showSafeBox && (
        <div
          style={{
            position: 'absolute',
            left: 45,
            top: 330,
            width: 890,
            height: 1130,
            border: '2px dashed rgba(245, 158, 11, 0.4)',
            borderRadius: 24,
          }}
        />
      )}

      {/* 2. TOP DEAD ZONE (Y = 0 -> 340px) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: SAFE_ZONE.TOP_DEAD_ZONE,
          background: 'rgba(239, 68, 68, 0.08)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          paddingTop: 30,
          paddingLeft: 40,
          paddingRight: 40,
          boxSizing: 'border-box',
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 280,
            height: 60,
            background: '#000000',
            borderRadius: 30,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />

        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <span>19:20</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>5G</span>
            <span>81% 🔋</span>
          </div>
        </div>

        {/* TikTok Top Nav Tabs */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 40,
            right: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            LIVE
          </div>

          <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 32, fontWeight: 700 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Bạn bè <span style={{ background: '#EF4444', color: '#fff', fontSize: 20, padding: '2px 8px', borderRadius: 12 }}>3</span></span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Đã follow</span>
            <div style={{ position: 'relative' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 900 }}>Đề xuất</span>
              <div style={{ position: 'absolute', bottom: -8, left: 10, right: 10, height: 4, background: '#FFFFFF', borderRadius: 2 }} />
            </div>
          </div>

          {/* Search Glass */}
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            🔍
          </div>
        </div>
      </div>

      {/* 3. RIGHT DEAD ZONE (X = 880px -> 1080px — CỘT 6 NÚT TIKTOK) */}
      <div
        style={{
          position: 'absolute',
          top: 600,
          right: 25,
          width: 140,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
          background: 'rgba(239, 68, 68, 0.08)',
          borderRadius: 20,
          padding: '20px 0',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: '#fff', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 22 }}>
          NEO
          <div style={{ position: 'absolute', bottom: -8, width: 28, height: 28, borderRadius: '50%', background: '#EF4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900 }}>+</div>
        </div>

        {/* Like */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 44 }}>❤️</div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>7</span>
        </div>

        {/* Comment */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 44 }}>💬</div>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>Bóc tem</span>
        </div>

        {/* Bookmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 44 }}>🔖</div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>2</span>
        </div>

        {/* Share */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 44 }}>↗️</div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>1</span>
        </div>

        {/* Music Disc */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1F2937', border: '6px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>
          🎵
        </div>
      </div>

      {/* 4. BOTTOM DEAD ZONE (Y = 1440px -> 1920px — CAPTION & NAV BOTTOM) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SAFE_ZONE.BOTTOM_DEAD_ZONE,
          background: 'rgba(239, 68, 68, 0.08)',
          borderTop: '1px solid rgba(239, 68, 68, 0.3)',
          paddingLeft: 45,
          paddingRight: 180,
          paddingTop: 30,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Caption */}
        <div>
          <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 900, marginBottom: 10 }}>
            NEO Education - Ôn thi Tin Học 12
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 26, lineHeight: 1.4 }}>
            Cùng nhau tìm hiểu về HTML nhé 🫶🥰😘 Mẹo tránh bẫy điểm 10 kỳ thi tốt nghiệp 2026 ... <span style={{ fontWeight: 800, color: '#fff' }}>thêm</span>
          </div>
        </div>

        {/* Scrubber & Tab bar */}
        <div style={{ paddingBottom: 25 }}>
          {/* Scrubber */}
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, position: 'relative', marginBottom: 25 }}>
            <div style={{ width: '35%', height: '100%', background: '#FFFFFF', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: '35%', top: -6, width: 16, height: 16, borderRadius: '50%', background: '#FFFFFF' }} />
          </div>

          {/* TikTok Bottom Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 700 }}>
            <span style={{ color: '#FFFFFF' }}>🏠 Trang chủ</span>
            <span>🛍️ Cửa hàng</span>
            <div style={{ width: 68, height: 44, background: '#FFFFFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 28, fontWeight: 900 }}>+</div>
            <span>💬 Hộp thư</span>
            <span>👤 Hồ sơ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
