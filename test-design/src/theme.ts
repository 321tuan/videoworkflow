// Visual Video Tin hoc 12: Thiet ke Web voi HTML - Chu de 20/10
export const C = {
  bg0: '#070A12',
  bg1: '#0D1322',
  bg2: '#131B30',
  panel: 'rgba(13, 19, 34, 0.94)',
  panelBorder: 'rgba(255, 51, 102, 0.32)',

  // Accents dac trung HTML & Khong khi ngay 20/10
  accent: '#FF3366',          // Rose Coral 20/10 - Mau chu dao
  accentSoft: '#FDA4AF',      // Rose Soft
  accentGold: '#F59E0B',      // Vang Amber am ap
  htmlOrange: '#F97316',      // Cam HTML5 tieu chuan
  cyberCyan: '#38BDF8',       // Xanh the Code / Syntax
  emeraldGreen: '#10B981',    // Xanh la - Phuong an DUNG
  alertRed: '#F43F5E',        // Do Neon - Phuong an SAI / Bay diem 10
  
  text: '#F8FAFC',            // Chu trang sang 100%
  textDim: '#94A3B8',         // Chu phu / chu chu thich
  borderDark: '#1E293B',
  gridLine: 'rgba(249, 115, 22, 0.08)',
};

export const FONT = `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`;
export const MONO = `'Fira Code', 'Cascadia Code', 'Consolas', monospace`;

export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const FPS = 30;
export const DISSOLVE_FRAMES = 14;

// TOA DO VÙNG AN TOÀN CHUẨN TIKTOK IPHONE (GIỮ NGUYÊN BỐ CỤC BAN ĐẦU, CHỈ LÙI TRÁNH TRÀN NÚT)
export const TIKTOK_ADJUST = {
  PADDING_TOP: 330,      // Ban dau la 235 -> lui xuong 330 de cach Dynamic Island va Tab De Xuat
  PENGUIN_TOP: 330,      // Ban dau la 235 -> lui xuong 330
  PENGUIN_RIGHT: 75,     // Ban dau la 52 -> lui vao 75 de tranh nut kinh lup TikTok
  CARD_MAX_WIDTH: 890,   // Ban dau la 980 -> thu nhe xuong 890 (can giua), khong cham nut TikTok ben phai
  LYRICS_BOTTOM: 460,    // Ban dau la 290 -> lui len 460 de o tren Caption TikTok
  WATERMARK_BOTTOM: 570, // Lui len 570 (o giua khung VS Code va Lyrics), khoang tho rong rai
};

export const SAFE_ZONE = {
  TOP_DEAD_ZONE: 340,
  RIGHT_DEAD_ZONE: 205,
  BOTTOM_DEAD_ZONE: 480,
  X_MIN: 45,
  X_MAX: 875,
  WIDTH: 830,
  Y_MIN: 330,
  Y_MAX: 1440,
  HEIGHT: 1110,
};
