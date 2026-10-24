// THEME CHUẨN NEO EDUCATION — VIDEO TEST 20S (MOBILE 9:16)
export const C = {
  bg0: '#070A12',
  bg1: '#0D1322',
  bg2: '#131B30',
  panel: 'rgba(13, 19, 34, 0.94)',
  panelBorder: 'rgba(56, 189, 248, 0.28)',

  // Accents môn Tin học & Nhận diện Neo
  accent: '#38BDF8',          // Cyber Cyan
  accentSoft: '#BAE6FD',
  accentGold: '#F59E0B',      // Amber Gold
  accentGreen: '#10B981',     // Emerald Green
  accentLime: '#A3E635',      // Lime Green - Diem so
  alertRed: '#FF3366',        // Rose Coral - Canh bao bay

  text: '#F8FAFC',            // Trang sang 100%
  textDim: '#94A3B8',         // Chu phu / chu thich
  borderDark: '#1E293B',
};

export const FONT = `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`;
export const MONO = `'Fira Code', 'Cascadia Code', 'Consolas', monospace`;

export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const FPS = 30;
export const DISSOLVE_FRAMES = 14;

// TOẠ ĐỘ VÙNG AN TOÀN TIKTOK IPHONE THỰC CHIẾN (THEO AGENTS.md)
// Hộp an toàn: X = 45px -> 875px (rộng 830px), Y = 350px -> 1440px (cao 1090px)
export const TIKTOK_SAFE = {
  BOX_LEFT: 45,           // Cách mép trái 45px
  BOX_TOP: 360,           // Y = 360px: Tránh Dynamic Island, Tab Đề xuất & Search kính lúp
  BOX_WIDTH: 830,         // Rộng 830px (1080 - 45 - 205): Tuyệt đối né cột 6 nút TikTok phải
  BOX_MAX_BOTTOM_Y: 1440, // Y = 1440px: Giới hạn dưới để không bị Caption TikTok đè
  LYRICS_BOTTOM: 470,     // Đặt tại Y ≈ 1450px (cách đáy 470px)
  WATERMARK_BOTTOM: 565,  // Đặt tại Y ≈ 1355px (cách mép trên Lyrics 27px, thoáng đãng rõ nét)
  PROGRESS_BOTTOM: 450,   // Thanh tiến trình đặt an toàn tại bottom 450px (DƯỚI Lyrics, CẤM ĐẶT Ở ĐỈNH)
};

