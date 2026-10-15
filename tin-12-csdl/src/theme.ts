// Visual video CSDL & SQL SGK 12 — RDBMS Blueprint, luoi ma tran du lieu,
// Accent VANG KIM (Primary Key) + XANH NGOC EMERALD (Foreign Key) + ELECTRIC BLUE (SQL).
export const C = {
  bg0: '#060B14',
  bg1: '#0B1322',
  bg2: '#101C33',
  panel: 'rgba(11, 20, 38, 0.92)',
  panelBorder: 'rgba(56, 189, 248, 0.25)',
  
  // Accents dac trung CSDL
  primaryKey: '#F59E0B',     // Vang kim cho Khoa Chinh (Primary Key)
  primaryKeySoft: '#FDE68A',
  foreignKey: '#10B981',     // Xanh ngoc cho Khoa Ngoai (Foreign Key)
  foreignKeySoft: '#A7F3D0',
  sqlBlue: '#38BDF8',        // Xanh electric cho SQL keywords & link
  sqlBlueSoft: '#BAE6FD',
  
  accentPink: '#F43F5E',     // Canh bao / Bay thi
  text: '#F8FAFC',           // Chu trang sang
  textDim: '#94A3B8',        // Chu phu
  borderDark: '#1E293B',
  gridLine: 'rgba(56, 189, 248, 0.08)',
};

export const FONT = `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`;
export const MONO = `'Cascadia Code', 'Fira Code', 'Consolas', monospace`;

export const rnd = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const FPS = 30;
export const CROSSFADE_FRAMES = 26; // Tốc độ lướt vừa vặn (~0.87s) cho mascot Cánh cụt
