// Visual video Tri tue nhan tao (AI) - Tin hoc 12 SGK GDPT 2018
// Palette: Cyber Void (#040711) + Cyber Emerald (#00FF87) + Neon Violet (#A855F7) + Amber Gold (#FBBF24)
export const C = {
  bg0: '#040711',
  bg1: '#070D1F',
  bg2: '#0C1733',
  panel: 'rgba(9, 17, 37, 0.88)',
  panelBorder: 'rgba(0, 255, 135, 0.28)',

  // Accents dac trung AI & Neural Computing
  accent: '#00FF87',          // Cyber Emerald - Mau chu dao
  accentSoft: '#6EE7B7',
  neonViolet: '#A855F7',      // Tim Neon - AGI / Neural Net
  neonVioletSoft: '#D8B4FE',
  cyberCyan: '#38BDF8',       // Xanh Cyber - Khoa hoc du lieu
  goldAmber: '#FBBF24',       // Vang Amber - Tu khoa giao duc / Training Data
  alertRed: '#F43F5E',        // Do Neon - Canh bao bay thi / Deepfake
  
  text: '#F8FAFC',            // Chu trang sang
  textDim: '#94A3B8',         // Chu phu / chu mo
  borderDark: '#1E293B',
  gridLine: 'rgba(0, 255, 135, 0.08)',
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
export const CROSSFADE_FRAMES = 26; // Toc do luot mascot Canh Cut (~0.87s)
