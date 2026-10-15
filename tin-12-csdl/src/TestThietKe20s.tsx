import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { C, FONT, MONO, VIDEO_H, VIDEO_W } from './theme';
import { TechBlueprintGrid, PenguinSwoop, Tag } from './decor';
import { SparkleStars } from './SparkleStars';
import { FloatingSymbols } from './FloatingSymbols';

// =========================================================================
// 1. TRANSITION TRƯỢT LƯỚT LIỀN MẠCH (Kinetic Slide Push)
// =========================================================================
const KineticSlideTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  isFirst?: boolean;
}> = ({ children, durationInFrames, isFirst = false }) => {
  const f = useCurrentFrame();
  const GLIDE = 26; // Tốc độ lướt vừa phải (~0.87s), không quá nhanh cũng không quá chậm

  // Vào (Incoming)
  const isEntering = !isFirst && f < GLIDE;
  const enterP = isFirst
    ? 1
    : interpolate(f, [0, GLIDE], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const smoothEnterP = 0.5 - 0.5 * Math.cos(enterP * Math.PI);
  const enterX = isFirst ? 0 : (1 - smoothEnterP) * VIDEO_W;

  // Ra (Outgoing)
  const exitStart = Math.max(0, durationInFrames - GLIDE);
  const isExiting = f >= exitStart;
  const exitP = interpolate(f, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const smoothExitP = 0.5 - 0.5 * Math.cos(exitP * Math.PI);
  const exitX = -smoothExitP * VIDEO_W;

  const currentX = isExiting ? exitX : enterX;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: isExiting ? 20 : 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${currentX}px)`,
          boxShadow: isExiting ? '24px 0 60px rgba(0, 0, 0, 0.9)' : 'none',
        }}
      >
        {children}
      </div>
      {isExiting && <PenguinSwoop progress={exitP} />}
    </div>
  );
};

// =========================================================================
// 2. KHUNG CỬA SỔ MACOS TỰ NHIÊN (Natural Framing Window - Không ép phóng to)
// =========================================================================
const NaturalWindow: React.FC<{
  title: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, badge, badgeColor = C.sqlBlue, children, style }) => {
  return (
    <div
      style={{
        width: 960,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(11, 20, 38, 0.98) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.28)',
        borderRadius: 24,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.12)',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        ...style,
      }}
    >
      {/* Thanh Header macOS */}
      <div
        style={{
          height: 64,
          padding: '0 24px',
          background: 'rgba(2, 6, 23, 0.75)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 3 nút chấm tròn macOS */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#10B981' }} />
        </div>

        {/* Tiêu đề cửa sổ */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: 2,
            color: '#94A3B8',
            fontWeight: 600,
          }}
        >
          {title}
        </div>

        {/* Badge góc phải */}
        {badge ? (
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: `${badgeColor}22`,
              border: `1px solid ${badgeColor}66`,
              color: badgeColor,
              fontFamily: MONO,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {badge}
          </div>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      {/* Nội dung bên trong cửa sổ */}
      <div style={{ padding: '32px 36px' }}>{children}</div>
    </div>
  );
};

// =========================================================================
// SCENE 1: HOOK & VISUAL BIỂU TƯỢNG (Frames 0 -> 210, ~7s)
// =========================================================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic Pop-in theo thứ tự
  const tagSpring = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 13 } });
  const titleSpring = spring({ frame: frame - 12, fps, from: 0.8, to: 1, config: { damping: 12 } });
  const alertSpring = spring({ frame: frame - 35, fps, from: 0.85, to: 1, config: { damping: 11 } });
  const terminalSpring = spring({ frame: frame - 65, fps, from: 0.9, to: 1, config: { damping: 13 } });

  // Mascot Cánh cụt
  const penguinSpring = spring({ frame: frame - 8, fps, from: 0, to: 1, config: { damping: 12 } });
  const penguinBob = Math.sin((frame * Math.PI * 2) / 45) * 10;

  // Nhịp thở phát sáng viền cảnh báo
  const alertPulse = 0.4 + 0.3 * Math.sin((frame * Math.PI * 2) / 30);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 190,
      }}
    >
      {/* 1. Tag Môn học */}
      <div style={{ transform: `scale(${tagSpring})`, marginBottom: 30 }}>
        <Tag accent={C.sqlBlue} bg="rgba(56, 189, 248, 0.14)">
          TIN HỌC 12 • KHOA HỌC DỮ LIỆU
        </Tag>
      </div>

      {/* 2. Tiêu đề Hook bùng nổ */}
      <div
        style={{
          transform: `scale(${titleSpring})`,
          textAlign: 'center',
          marginBottom: 36,
          padding: '0 40px',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: -1,
            background: 'linear-gradient(135deg, #FFFFFF 20%, #38BDF8 60%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 6px 20px rgba(56, 189, 248, 0.35))',
          }}
        >
          BẪY KHÓA NGOẠI SQL
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 700,
            color: '#94A3B8',
            marginTop: 10,
            letterSpacing: 1,
          }}
        >
          Ràng buộc toàn vẹn tham chiếu CSDL
        </div>
      </div>

      {/* 3. Thẻ Cảnh báo số liệu đỏ rực (80% mất điểm) */}
      <div
        style={{
          transform: `scale(${alertSpring})`,
          width: 960,
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(244, 63, 94, 0.12) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.65)',
          borderRadius: 20,
          padding: '22px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 44,
          boxShadow: `0 0 35px rgba(239, 68, 68, ${alertPulse})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
            }}
          >
            ⚠️
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: '#FEE2E2', letterSpacing: 0.5 }}>
              CẢNH BÁO BẪY THI TRẮC NGHIỆM
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: '#FCA5A5' }}>
              Hơn 80% học sinh mất điểm oan ở câu Đúng/Sai!
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '10px 20px',
            background: 'rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            fontFamily: MONO,
            fontSize: 26,
            fontWeight: 800,
            color: '#FEE2E2',
          }}
        >
          2K9 LƯU Ý
        </div>
      </div>

      {/* 4. Terminal Mở đầu công nghệ phát sáng (Natural Framing) */}
      <div style={{ transform: `scale(${terminalSpring})` }}>
        <NaturalWindow title="TERMINAL — RDBMS DIAGNOSTIC" badge="READY" badgeColor="#10B981">
          <div style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1.8, color: '#E2E8F0' }}>
            <div style={{ color: '#94A3B8' }}>
              <span style={{ color: '#10B981' }}>❯</span> neo.rdbms_test --target=TinHoc12
            </div>
            <div style={{ color: '#38BDF8', marginTop: 10 }}>
              ✔ Khung ma trận đề thi: <span style={{ color: '#FDE68A' }}>Chương trình GDPT 2018</span>
            </div>
            <div style={{ color: '#38BDF8' }}>
              ✔ Trọng tâm CSDL: <span style={{ color: '#F59E0B' }}>Khoá chính (PK) & Khoá ngoại (FK)</span>
            </div>
            <div
              style={{
                marginTop: 20,
                padding: '16px 24px',
                borderRadius: 14,
                background: 'rgba(56, 189, 248, 0.1)',
                borderLeft: '4px solid #38BDF8',
                color: '#BAE6FD',
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              👉 "Bảng con tham chiếu sang bảng cha như thế nào để không dính lỗi?"
            </div>
          </div>
        </NaturalWindow>
      </div>

      {/* Chú cánh cụt mascot nổi bật góc phải phía trên tiêu đề */}
      <div
        style={{
          position: 'absolute',
          right: 50,
          top: 190 + penguinBob,
          transform: `scale(${penguinSpring})`,
          width: 190,
          filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.75))',
          pointerEvents: 'none',
        }}
      >
        <Img src={staticFile('img/canh-cut.png')} style={{ width: '100%', height: 'auto' }} />
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 2: NATURAL FRAMING & KINETIC REVEAL (Frames 200 -> 420, ~7.3s)
// =========================================================================
const Scene2Relational: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic Staggered Pop-in
  const winSpring = spring({ frame: frame - 5, fps, from: 0.9, to: 1, config: { damping: 13 } });
  const tableParentSpring = spring({ frame: frame - 20, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const tableChildSpring = spring({ frame: frame - 50, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const arrowSpring = spring({ frame: frame - 85, fps, from: 0, to: 1, config: { damping: 14 } });
  const trapSpring = spring({ frame: frame - 115, fps, from: 0.8, to: 1, config: { damping: 11 } });
  const ruleBoxSpring = spring({ frame: frame - 145, fps, from: 0.85, to: 1, config: { damping: 12 } });

  // Nhịp chớp cảnh báo lỗi vi phạm dòng 12A3
  const isTrapVisible = frame >= 115;
  const trapBlink = isTrapVisible ? 0.6 + 0.4 * Math.sin((frame * Math.PI * 2) / 16) : 0;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
      }}
    >
      {/* Tiêu đề Phân cảnh */}
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <Tag accent={C.foreignKey} bg="rgba(16, 185, 129, 0.14)">
          BẢN CHẤT QUAN HỆ HAI BẢNG
        </Tag>
        <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginTop: 14 }}>
          Bảng Cha (PK) <span style={{ color: '#38BDF8' }}>➜</span> Bảng Con (FK)
        </div>
      </div>

      {/* Cửa sổ Khung Tự Nhiên macOS (Natural Framing 960px) */}
      <div style={{ transform: `scale(${winSpring})` }}>
        <NaturalWindow title="RELATIONAL SCHEMA — CSDL QUẢN LÝ LỚP HỌC" badge="RDBMS 1:N">
          {/* 1. BẢNG CHA (LOP) */}
          <div
            style={{
              transform: `scale(${tableParentSpring})`,
              background: 'rgba(245, 158, 11, 0.08)',
              border: '2px solid rgba(245, 158, 11, 0.45)',
              borderRadius: 18,
              padding: '20px 24px',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#F59E0B' }}>
                📂 BẢNG CHA: <span style={{ color: '#FDE68A' }}>LOP</span>
              </div>
              <div
                style={{
                  background: '#F59E0B',
                  color: '#000',
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: 6,
                }}
              >
                KHÓA CHÍNH (PK)
              </div>
            </div>
            {/* Hàng dữ liệu bảng cha */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: '1px solid #F59E0B',
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#FDE68A',
                }}
              >
                🔑 MaLop: <span style={{ color: '#FFF' }}>'12A1'</span> (Lớp 12A1)
              </div>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: '1px solid #F59E0B',
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#FDE68A',
                }}
              >
                🔑 MaLop: <span style={{ color: '#FFF' }}>'12A2'</span> (Lớp 12A2)
              </div>
            </div>
          </div>

          {/* Mũi tên tham chiếu phát sáng trỏ xuống */}
          <div
            style={{
              textAlign: 'center',
              transform: `scale(${arrowSpring})`,
              fontSize: 32,
              fontWeight: 900,
              color: '#38BDF8',
              margin: '-8px 0 16px 0',
              filter: 'drop-shadow(0 0 12px #38BDF8)',
            }}
          >
            ⬇ Tham chiếu khoá ngoại (FOREIGN KEY) ⬇
          </div>

          {/* 2. BẢNG CON (HOCSINH) */}
          <div
            style={{
              transform: `scale(${tableChildSpring})`,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '2px solid rgba(16, 185, 129, 0.45)',
              borderRadius: 18,
              padding: '20px 24px',
              marginBottom: 26,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#10B981' }}>
                📄 BẢNG CON: <span style={{ color: '#A7F3D0' }}>HOCSINH</span>
              </div>
              <div
                style={{
                  background: '#10B981',
                  color: '#000',
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: 6,
                }}
              >
                KHÓA NGOẠI (FK)
              </div>
            </div>
            {/* Các bản ghi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: '1px solid #10B98155',
                  fontFamily: MONO,
                  fontSize: 24,
                  color: '#E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Học sinh: Nguyễn Văn A</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>MaLop: '12A1' ✔ (HỢP LỆ)</span>
              </div>

              {/* Dòng bẫy vi phạm 12A3 */}
              <div
                style={{
                  background: isTrapVisible ? `rgba(239, 68, 68, ${0.15 + trapBlink * 0.2})` : 'rgba(0, 0, 0, 0.4)',
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: isTrapVisible ? `2px solid rgba(239, 68, 68, ${trapBlink})` : '1px solid #334155',
                  fontFamily: MONO,
                  fontSize: 24,
                  color: isTrapVisible ? '#FEE2E2' : '#94A3B8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  boxShadow: isTrapVisible ? `0 0 25px rgba(239, 68, 68, ${trapBlink * 0.7})` : 'none',
                }}
              >
                <span>Học sinh: Lê Thị B</span>
                <span style={{ color: isTrapVisible ? '#EF4444' : '#94A3B8', fontWeight: 800 }}>
                  MaLop: '12A3' {isTrapVisible && '❌ (LỖI TOÀN VẸN)'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Thẻ Đúc Kết Súc Tích (Punchy Callout) */}
          <div
            style={{
              transform: `scale(${ruleBoxSpring})`,
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(56, 189, 248, 0.12) 100%)',
              border: '2px solid #F59E0B',
              borderRadius: 16,
              padding: '18px 26px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#FDE68A' }}>
              ⚡ NGUYÊN TẮC VÀNG: Bảng con CHỈ ĐƯỢC lấy giá trị ĐÃ CÓ ở bảng cha!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: '#E2E8F0', marginTop: 6 }}>
              Không thể gán học sinh vào lớp '12A3' khi trường chưa có lớp này.
            </div>
          </div>
        </NaturalWindow>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// SCENE 3: CÚ PHÁP SQL & MẸO THI 2K9 (Frames 400 -> 600, ~6.7s)
// =========================================================================
const Scene3SqlAndTips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic Staggered Reveal
  const winSpring = spring({ frame: frame - 5, fps, from: 0.9, to: 1, config: { damping: 13 } });
  const tip1Spring = spring({ frame: frame - 40, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const tip2Spring = spring({ frame: frame - 80, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const badgeSpring = spring({ frame: frame - 120, fps, from: 0.8, to: 1, config: { damping: 11 } });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
      }}
    >
      {/* Tiêu đề */}
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <Tag accent={C.sqlBlue} bg="rgba(56, 189, 248, 0.14)">
          CÚ PHÁP CHUẨN ANSI SQL
        </Tag>
        <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginTop: 14 }}>
          Khai Báo Ràng Buộc Khóa Ngoại
        </div>
      </div>

      {/* Cửa sổ Code Editor macOS (Natural Framing) */}
      <div style={{ transform: `scale(${winSpring})`, marginBottom: 36 }}>
        <NaturalWindow title="schema.sql — CREATE TABLE" badge="SQL DDL" badgeColor="#38BDF8">
          <div
            style={{
              fontFamily: MONO,
              fontSize: 25,
              lineHeight: 1.8,
              color: '#F8FAFC',
              background: '#090D16',
              padding: '24px 28px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <span style={{ color: '#38BDF8', fontWeight: 800 }}>CREATE TABLE</span>{' '}
              <span style={{ color: '#FDE68A', fontWeight: 800 }}>HOCSINH</span> (
            </div>
            <div style={{ paddingLeft: 30 }}>
              MaHS <span style={{ color: '#10B981' }}>INT</span>{' '}
              <span style={{ color: '#F59E0B' }}>PRIMARY KEY</span>,
            </div>
            <div style={{ paddingLeft: 30 }}>
              HoTen <span style={{ color: '#10B981' }}>VARCHAR(50)</span>,
            </div>
            <div style={{ paddingLeft: 30 }}>
              MaLop <span style={{ color: '#10B981' }}>VARCHAR(10)</span>,
            </div>
            {/* Dòng Khóa ngoại nổi bật phát sáng */}
            <div
              style={{
                marginTop: 8,
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1.5px solid #38BDF8',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#38BDF8',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
              }}
            >
              <span style={{ color: '#F59E0B' }}>FOREIGN KEY</span> (MaLop){' '}
              <span style={{ color: '#F59E0B' }}>REFERENCES</span> LOP(MaLop)
            </div>
            <div>);</div>
          </div>
        </NaturalWindow>
      </div>

      {/* 2 Thẻ Mẹo Thi 2K9 Nảy So Le (Staggered Pop-in) */}
      <div style={{ width: 960, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Mẹo 1 */}
        <div
          style={{
            transform: `scale(${tip1Spring})`,
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '2px solid #10B981',
            borderRadius: 18,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#10B981',
              color: '#000',
              fontFamily: MONO,
              fontSize: 26,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            1
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#A7F3D0' }}>
              Quy tắc TẠO BẢNG: Tạo bảng CHA trước, Bảng CON sau!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, color: '#CBD5E1', marginTop: 4 }}>
              Vì bảng con cần có sẵn khóa chính ở bảng cha để tham chiếu.
            </div>
          </div>
        </div>

        {/* Mẹo 2 */}
        <div
          style={{
            transform: `scale(${tip2Spring})`,
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '2px solid #F59E0B',
            borderRadius: 18,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#F59E0B',
              color: '#000',
              fontFamily: MONO,
              fontSize: 26,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            2
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#FDE68A' }}>
              Quy tắc XÓA DỮ LIỆU: Xóa dòng Bảng CON trước, Bảng CHA sau!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, color: '#CBD5E1', marginTop: 4 }}>
              Không thể xóa lớp khi trong lớp đó vẫn còn học sinh đang theo học.
            </div>
          </div>
        </div>
      </div>

      {/* Huy hiệu tổng kết ăn trọn điểm */}
      <div
        style={{
          transform: `scale(${badgeSpring})`,
          marginTop: 26,
          background: 'linear-gradient(90deg, #F59E0B, #10B981)',
          padding: '14px 40px',
          borderRadius: 999,
          color: '#000',
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: 1,
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.45)',
        }}
      >
        🎯 CHẮC NẮM 10 ĐIỂM TRẮC NGHIỆM ĐÚNG/SAI TIN HỌC 12!
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// THANH WATERMARK & TIẾN TRÌNH VIDEO
// =========================================================================
const VideoProgressHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 600; // 20s * 30fps
  const p = Math.min(1, frame / total);

  const floatY = Math.sin((frame * Math.PI * 2) / 75) * 6;
  const breathe = 0.4 + 0.15 * (0.5 + 0.5 * Math.sin((frame * Math.PI * 2) / 90));

  return (
    <>
      {/* Watermark top */}
      <div
        style={{
          position: 'absolute',
          top: 100 + floatY,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 28,
          letterSpacing: 4,
          color: `rgba(148, 163, 184, ${breathe.toFixed(3)})`,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        neoeducation.vn
      </div>

      {/* Thanh tiến trình đáy */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 90,
          height: 8,
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 4,
          zIndex: 50,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: `${p * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #38BDF8, #10B981, #F59E0B)',
            borderRadius: 4,
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
          }}
        />
      </div>
    </>
  );
};

// =========================================================================
// MAIN COMPONENT: 20 GIÂY THỬ NGHIỆM THIẾT KẾ (NO AUDIO, NO VOICE)
// =========================================================================
export const TestThietKe20s: React.FC = () => {
  // 600 frames = 20s @ 30fps
  // Cánh cụt lướt 26 frames (~0.87s), tốc độ êm ái vừa vặn
  const XF = 26;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0, overflow: 'hidden' }}>
      {/* 1. Lớp Nền Lưới Kỹ Thuật (RDBMS Blueprint Grid + Scanline) */}
      <TechBlueprintGrid />

      {/* 2. Lớp Ánh Sao Lấp Lánh 4 Cánh (Sparkle Stars Background — Quy tắc 32) */}
      <SparkleStars />

      {/* 3. Lớp Ký Hiệu Môn Tin Lơ Lửng Rơi Nhẹ (Floating Symbols — Quy tắc 32) */}
      <FloatingSymbols />

      {/* 4. Phân cảnh 1: HOOK & TERMINAL VISUAL */}
      <Sequence from={0} durationInFrames={210}>
        <KineticSlideTransition durationInFrames={210} isFirst>
          <Scene1Hook />
        </KineticSlideTransition>
      </Sequence>

      {/* 5. Phân cảnh 2: QUAN HỆ BẢNG CHA - BẢNG CON (NATURAL FRAMING) */}
      <Sequence from={210 - XF} durationInFrames={210}>
        <KineticSlideTransition durationInFrames={210}>
          <Scene2Relational />
        </KineticSlideTransition>
      </Sequence>

      {/* 6. Phân cảnh 3: CÚ PHÁP SQL & MẸO PHÒNG THI 2K9 */}
      <Sequence from={420 - XF} durationInFrames={180 + XF}>
        <KineticSlideTransition durationInFrames={180 + XF}>
          <Scene3SqlAndTips />
        </KineticSlideTransition>
      </Sequence>

      {/* 7. Header Watermark & Thanh tiến trình */}
      <VideoProgressHeader />
    </AbsoluteFill>
  );
};
