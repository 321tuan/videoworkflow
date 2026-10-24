import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s06_greeting.json';

// Cánh hoa hồng rơi nhẹ nhàng (Floating Rose Petal SVG)
interface PetalProps {
  x: number;
  startY: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  rotSpeed: number;
  scale: number;
  color: string;
}

const PETALS: PetalProps[] = [
  { x: 120, startY: -60, speed: 2.8, swayAmp: 30, swayFreq: 0.04, rotSpeed: 1.2, scale: 0.9, color: '#FB7185' },
  { x: 260, startY: -140, speed: 3.2, swayAmp: 40, swayFreq: 0.035, rotSpeed: -1.5, scale: 1.1, color: '#F43F5E' },
  { x: 420, startY: -20, speed: 2.5, swayAmp: 25, swayFreq: 0.045, rotSpeed: 0.9, scale: 0.75, color: '#FDA4AF' },
  { x: 620, startY: -180, speed: 3.0, swayAmp: 35, swayFreq: 0.038, rotSpeed: -1.1, scale: 1.0, color: '#FB7185' },
  { x: 790, startY: -90, speed: 3.4, swayAmp: 45, swayFreq: 0.032, rotSpeed: 1.4, scale: 1.15, color: '#F43F5E' },
  { x: 940, startY: -130, speed: 2.7, swayAmp: 30, swayFreq: 0.042, rotSpeed: -1.0, scale: 0.85, color: '#FDA4AF' },
  { x: 180, startY: -260, speed: 3.1, swayAmp: 38, swayFreq: 0.036, rotSpeed: 1.3, scale: 1.05, color: '#F43F5E' },
  { x: 860, startY: -220, speed: 2.9, swayAmp: 32, swayFreq: 0.041, rotSpeed: -1.2, scale: 0.95, color: '#FB7185' },
];

export const GreetingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s06_greeting;

  // Fade out cuoi canh nhe nhang (Quy tac Dissolve chuyen sang Outro)
  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Xuat hien khung & header
  const enterOp = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enterY = interpolate(frame, [0, 16], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 1. GIAI ĐOẠN 1: MỞ NẮP PHONG BÌ 3D (frames 18 - 48)
  // Xoay 180 độ từ trên gập xuống -> lật bung hoàn toàn lên trên
  const flapOpen = interpolate(frame, [18, 48], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Con dấu hoa hồng vàng tan biến khi nắp mở ra
  const sealOp = interpolate(frame, [18, 28], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. GIAI ĐOẠN 2: CHO VỎ PHONG BÌ TRƯỢT HẠ XUỐNG DƯỚI ĐÁY MÀN HÌNH (frames 48 - 90)
  // Sau khi mở hết nắp thư, vỏ phong bì trượt xuống dưới để nhường trọn không gian cho bức thư
  const envDrop = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const envY = interpolate(envDrop, [0, 1], [0, 500]);
  const envOp = interpolate(envDrop, [0, 0.85], [1, 0.2]);

  // 3. GIAI ĐOẠN 3: BỨC THƯ BÊN TRONG TRƯỢT LÊN CHIẾM TRỌN TRUNG TÂM (frames 48 - 92)
  // ĐẶC BIỆT: Trước frame 48 (khi phong bì chưa mở), BỨC THƯ ẨN HOÀN TOÀN (opacity = 0)
  // Tuyệt đối không để lộ bất kỳ mẩu giấy nào thò ra dưới đáy phong bì!
  const letterEnter = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const letterY = interpolate(letterEnter, [0, 1], [160, -30]);
  const letterScale = interpolate(letterEnter, [0, 1], [0.9, 1]);
  const letterOp = interpolate(frame, [48, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Nội dung các dòng lời chúc bên trong bức thư hiện sáng bừng
  const textOp = interpolate(frame, [60, 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hiệu ứng ánh sáng lung linh
  const glow = 0.6 + 0.4 * Math.sin(frame * 0.08);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s06_greeting.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s06_greeting', f, dur)}
      />

      {/* CÁNH HOA HỒNG RƠI TRONG KHÔNG GIAN (FALLING PETALS) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
        {PETALS.map((p, i) => {
          const y = ((p.startY + frame * p.speed) % 2100) - 100;
          const x = p.x + Math.sin(frame * p.swayFreq + i) * p.swayAmp;
          const rot = frame * p.rotSpeed + i * 45;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `rotate(${rot}deg) scale(${p.scale})`,
                opacity: 0.85,
                filter: 'drop-shadow(0 4px 8px rgba(244,63,94,0.35))',
              }}
            >
              <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
                <path
                  d="M17 0 C28 6, 34 20, 30 32 C26 40, 10 44, 4 34 C-2 24, 6 6, 17 0 Z"
                  fill={p.color}
                />
              </svg>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 235, // TOP SAFE ZONE >= 230PX
          paddingLeft: 48,
          paddingRight: 48,
          height: '100%',
        }}
      >
        {/* HEADER & TIÊU ĐỀ THIỆP */}
        <div
          style={{
            opacity: enterOp,
            transform: `translateY(${enterY}px)`,
            textAlign: 'center',
            marginBottom: 20,
            width: '100%',
          }}
        >
          <Tag
            label="TRI ÂN & CHÚC MỪNG"
            sub="20 THÁNG 10"
            color="#FF3366"
            borderColor="rgba(255, 51, 102, 0.55)"
          />

          <h2
            style={{
              fontFamily: FONT,
              fontSize: 50,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 16,
              marginBottom: 4,
              lineHeight: 1.25,
            }}
          >
            NGÀY PHỤ NỮ VIỆT NAM<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #FDA4AF 0%, #FF3366 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              NEO XIN GỬI TRỌN YÊU THƯƠNG
            </span>
          </h2>
        </div>

        {/* CONTAINER BỨC THƯ & PHONG BÌ MỞ RA */}
        <div
          style={{
            position: 'relative',
            width: 940,
            height: 980,
            marginTop: 16,
            display: 'flex',
            justifyContent: 'center',
            perspective: 1200, // 3D Perspective cho nắp thư lật mở
          }}
        >
          {/* =====================================================
              1. BỨC THƯ LỜI CHÚC BÊN TRONG (LỘ TRỌN VẸN 100% NỘI DUNG)
              ===================================================== */}
          {letterOp > 0 ? (
            <div
              style={{
                position: 'absolute',
                top: 280,
                width: 900,
                minHeight: 680,
                transform: `translateY(${letterY}px) scale(${letterScale})`,
                opacity: letterOp,
                background: 'linear-gradient(145deg, #FFF5F7 0%, #FFE4E8 50%, #FED7E2 100%)',
                borderRadius: 28,
                padding: '36px 42px',
                border: '3px solid #FDA4AF',
                boxShadow: `0 30px 70px rgba(0,0,0,0.85), 0 0 50px rgba(255, 51, 102, ${glow * 0.4})`,
                zIndex: 30, // Nằm trên phong bì để lộ trọn vẹn 100% bức thư
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* HỌA TIẾT HOA VIỀN 4 GÓC THIỆP */}
              <div style={{ position: 'absolute', top: 16, left: 18, color: '#FB7185', fontSize: 28 }}>🌸</div>
              <div style={{ position: 'absolute', top: 16, right: 18, color: '#FB7185', fontSize: 28 }}>🌸</div>
              <div style={{ position: 'absolute', bottom: 16, left: 18, color: '#FB7185', fontSize: 28 }}>🌸</div>
              <div style={{ position: 'absolute', bottom: 16, right: 18, color: '#FB7185', fontSize: 28 }}>🌸</div>

              {/* TIÊU ĐỀ NỘI DUNG THIỆP */}
              <div style={{ textAlign: 'center', opacity: textOp }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#BE123C',
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  — THƯ CHÚC MỪNG 20/10 —
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 34,
                    fontWeight: 900,
                    color: '#881337',
                    marginTop: 6,
                  }}
                >
                  Kính Chúc Một Nửa Thế Giới Tuyệt Vời!
                </div>
                <div
                  style={{
                    width: 140,
                    height: 3,
                    background: 'linear-gradient(90deg, transparent, #E11D48, transparent)',
                    margin: '12px auto 0',
                  }}
                />
              </div>

              {/* NỘI DUNG 4 CÂU CHÚC Ý NGHĨA — THEO ĐÚNG LỜI USER */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  marginTop: 18,
                  opacity: textOp,
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid #FECDD3',
                    borderRadius: 18,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)',
                  }}
                >
                  <span style={{ fontSize: 32 }}>💐</span>
                  <span style={{ fontFamily: FONT, fontSize: 27, fontWeight: 800, color: '#881337', lineHeight: 1.35 }}>
                    Kính chúc các bạn nữ, các cô giáo và các bác luôn xinh đẹp & rạng ngời!
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid #FECDD3',
                    borderRadius: 18,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)',
                  }}
                >
                  <span style={{ fontSize: 32 }}>💖</span>
                  <span style={{ fontFamily: FONT, fontSize: 27, fontWeight: 800, color: '#881337', lineHeight: 1.35 }}>
                    Mỗi ngày đều có thật nhiều niềm vui, tràn đầy năng lượng tích cực!
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid #FECDD3',
                    borderRadius: 18,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)',
                  }}
                >
                  <span style={{ fontSize: 32 }}>🎓</span>
                  <span style={{ fontFamily: FONT, fontSize: 27, fontWeight: 800, color: '#881337', lineHeight: 1.35 }}>
                    Học tập và công việc luôn luôn thuận lợi, vạn sự hanh thông!
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid #FECDD3',
                    borderRadius: 18,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)',
                  }}
                >
                  <span style={{ fontSize: 32 }}>🍀</span>
                  <span style={{ fontFamily: FONT, fontSize: 27, fontWeight: 800, color: '#881337', lineHeight: 1.35 }}>
                    Những điều may mắn & hạnh phúc trọn vẹn sẽ luôn tìm đến nhé!
                  </span>
                </div>
              </div>

              {/* CHỮ KÝ THÂN THƯƠNG TỪ NEO */}
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1.5px dashed #FDA4AF',
                  opacity: textOp,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 23, fontWeight: 700, color: '#E11D48' }}>
                  ❤️ From NEO Education with Love
                </div>
                <div style={{ fontFamily: MONO, fontSize: 23, fontWeight: 800, color: '#9F1239' }}>
                  #20thang10 #ChucMung
                </div>
              </div>
            </div>
          ) : null}

          {/* =====================================================
              2. VỎ PHONG BÌ THƯ (MỞ NẮP 180° RỒI TRƯỢT HẠ XUỐNG DƯỚI)
              ===================================================== */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: 920,
              height: 480,
              transform: `translateY(${envY}px)`,
              opacity: envOp,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* THÂN PHONG BÌ (TÚI ĐỰNG) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #881337 0%, #4C0519 100%)',
                borderRadius: '0 0 28px 28px',
                border: '2.5px solid rgba(251, 113, 133, 0.4)',
                borderTop: 'none',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
                overflow: 'hidden',
              }}
            >
              {/* Họa tiết đường gấp phong bì 2 bên */}
              <svg width="920" height="480" style={{ position: 'absolute', inset: 0 }}>
                <polygon points="0,0 460,260 0,480" fill="rgba(76, 5, 25, 0.55)" stroke="#FB7185" strokeWidth="1.2" strokeOpacity="0.3" />
                <polygon points="920,0 460,260 920,480" fill="rgba(76, 5, 25, 0.55)" stroke="#FB7185" strokeWidth="1.2" strokeOpacity="0.3" />
                <polygon points="0,480 460,240 920,480" fill="#70092B" stroke="#FDA4AF" strokeWidth="1.5" strokeOpacity="0.4" />
              </svg>

              {/* Dòng chữ vàng mạ kim loại trên bìa phong bì */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 36,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontFamily: MONO,
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: '#FDE047',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                ★ NEO EDUCATION — CHÚC MỪNG 20/10 ★
              </div>
            </div>

            {/* NẮP PHONG BÌ (3D FLAP ROTATION) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 920,
                height: 280,
                transformOrigin: 'top center',
                transform: `rotateX(${flapOpen}deg)`,
                transformStyle: 'preserve-3d',
                zIndex: flapOpen > 90 ? 5 : 20,
              }}
            >
              <svg width="920" height="280">
                <polygon
                  points="0,0 460,280 920,0"
                  fill="url(#flapGrad)"
                  stroke="#FB7185"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                />
                <defs>
                  <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9F1239" />
                    <stop offset="100%" stopColor="#70092B" />
                  </linearGradient>
                </defs>
              </svg>

              {/* CON DẤU HOA HỒNG VÀNG NIÊM PHONG (WAX SEAL) */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 240,
                  transform: 'translate(-50%, -50%)',
                  opacity: sealOp,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #F59E0B 0%, #B45309 80%)',
                    border: '3px solid #FEF08A',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                  }}
                >
                  🌹
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LYRICS CHUẨN SAFE ZONE BOTTOM 290PX */}
      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={290} />
    </AbsoluteFill>
  );
};
