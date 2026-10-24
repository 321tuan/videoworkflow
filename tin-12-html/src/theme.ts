// Visual Video Tin hoc 12: Thiet ke Web voi HTML - Chu de 20/10
// Palette: Dark Modern Slate (#0B0F19) + Rose Coral 20/10 (#FF3366) + HTML5 Orange (#F97316) + Amber Gold (#F59E0B) + Emerald (#10B981)
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

export const rnd = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const FPS = 30;
export const DISSOLVE_FRAMES = 14; // Chuyen canh Fade/Dissolve nhe nhang (Quy tac 29)
