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
// 1. TRANSITION TRƯỢT LƯỚT LIỀN MẠCH VỚI TỐC ĐỘ CHUẨN 26 FRAMES
// =========================================================================
const KineticSlideTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  isFirst?: boolean;
}> = ({ children, durationInFrames, isFirst = false }) => {
  const f = useCurrentFrame();
  const GLIDE = 26; // Chuẩn 26 frames (~0.87s) theo Quy tắc 34

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
// 2. KHUNG CỬA SỔ TỰ NHIÊN MACOS (Natural Framing - Không ép phóng to)
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
      {/* Header macOS */}
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
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 15, height: 15, borderRadius: '50%', background: '#10B981' }} />
        </div>

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

      <div style={{ padding: '30px 34px' }}>{children}</div>
    </div>
  );
};

// =========================================================================
// PHẦN 1: HOOK & DYNAMIC DATA COUNTER (0s - 8s = frames 0 -> 240)
// Học hỏi từ Unicorns.edu: Chạy số counter sống động, hiệu ứng mỏ neo thị giác
// =========================================================================
const Scene1HookCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic Springs
  const tagSpring = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 13 } });
  const titleSpring = spring({ frame: frame - 10, fps, from: 0.8, to: 1, config: { damping: 12 } });
  const alertSpring = spring({ frame: frame - 28, fps, from: 0.85, to: 1, config: { damping: 11 } });
  const winSpring = spring({ frame: frame - 60, fps, from: 0.9, to: 1, config: { damping: 13 } });

  // Hiệu ứng chạy số phần trăm mất điểm oan: 0% -> 82% (frame 28 -> 75)
  const percentCount = Math.min(
    82,
    Math.round(
      interpolate(frame, [30, 75], [0, 82], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  // Mascot Cánh cụt vẫy tay
  const penguinSpring = spring({ frame: frame - 8, fps, from: 0, to: 1, config: { damping: 12 } });
  const penguinBob = Math.sin((frame * Math.PI * 2) / 45) * 8;

  // Nhịp thở phát sáng viền cảnh báo
  const alertPulse = 0.4 + 0.3 * Math.sin((frame * Math.PI * 2) / 28);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
      }}
    >
      {/* 1. Tag Môn học */}
      <div style={{ transform: `scale(${tagSpring})`, marginBottom: 26 }}>
        <Tag accent={C.sqlBlue} bg="rgba(56, 189, 248, 0.14)">
          TIN HỌC 12 • KHOA HỌC DỮ LIỆU
        </Tag>
      </div>

      {/* 2. Tiêu đề Hook bùng nổ */}
      <div
        style={{
          transform: `scale(${titleSpring})`,
          textAlign: 'center',
          marginBottom: 32,
          padding: '0 40px',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.25,
            background: 'linear-gradient(135deg, #FFFFFF 15%, #38BDF8 55%, #F59E0B 100%)',
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
            marginTop: 8,
          }}
        >
          Ràng buộc toàn vẹn tham chiếu CSDL
        </div>
      </div>

      {/* 3. Thẻ Cảnh báo số liệu với DYNAMIC NUMBER COUNTER */}
      <div
        style={{
          transform: `scale(${alertSpring})`,
          width: 960,
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.22) 0%, rgba(244, 63, 94, 0.12) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.65)',
          borderRadius: 20,
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 38,
          boxShadow: `0 0 35px rgba(239, 68, 68, ${alertPulse})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Con số phần trăm nhảy động */}
          <div
            style={{
              minWidth: 100,
              height: 64,
              borderRadius: 14,
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: MONO,
              fontSize: 32,
              fontWeight: 900,
              color: '#FFFFFF',
              boxShadow: '0 0 24px rgba(239, 68, 68, 0.8)',
            }}
          >
            {percentCount}%
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 900, color: '#FEE2E2', letterSpacing: 0.5 }}>
              THÍ SINH MẤT ĐIỂM OAN!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: '#FCA5A5' }}>
              Dính bẫy thứ tự thêm / xóa dữ liệu hai bảng
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '8px 18px',
            background: 'rgba(239, 68, 68, 0.3)',
            borderRadius: 10,
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 800,
            color: '#FEE2E2',
          }}
        >
          2K9 CẦN BIẾT
        </div>
      </div>

      {/* 4. Terminal Chẩn đoán CSDL (Natural Framing) */}
      <div style={{ transform: `scale(${winSpring})` }}>
        <NaturalWindow title="TERMINAL — RDBMS INTEGRITY CHECK" badge="READY" badgeColor="#10B981">
          <div style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1.8, color: '#E2E8F0' }}>
            <div style={{ color: '#94A3B8' }}>
              <span style={{ color: '#10B981' }}>❯</span> neo.check_foreign_key --exam=2025
            </div>
            <div style={{ color: '#38BDF8', marginTop: 10 }}>
              ✔ Khung đề thi: <span style={{ color: '#FDE68A' }}>Chương trình GDPT 2018</span>
            </div>
            <div style={{ color: '#38BDF8' }}>
              ✔ Bài toán thực tế: <span style={{ color: '#F59E0B' }}>Quản lý Khách sạn & Phòng (SGK trang 99)</span>
            </div>
            <div
              style={{
                marginTop: 18,
                padding: '14px 22px',
                borderRadius: 12,
                background: 'rgba(56, 189, 248, 0.1)',
                borderLeft: '4px solid #38BDF8',
                color: '#BAE6FD',
                fontSize: 25,
                fontWeight: 600,
              }}
            >
              👉 "Làm sao để không bao giờ mất điểm câu trắc nghiệm Đúng/Sai?"
            </div>
          </div>
        </NaturalWindow>
      </div>

      {/* Chú cánh cụt mascot đứng chào góc phải */}
      <div
        style={{
          position: 'absolute',
          right: 50,
          top: 180 + penguinBob,
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
// PHẦN 2: BẢN CHẤT QUAN HỆ & BẪY TOÀN VẸN (8s - 16s = frames 240 -> 480)
// Bài toán thực chiến Quản lý Khách sạn (trang 99 Sách Ôn thi Tin học 12)
// =========================================================================
const Scene2RelationalTrap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic Pop-in so le
  const winSpring = spring({ frame: frame - 5, fps, from: 0.9, to: 1, config: { damping: 13 } });
  const parentSpring = spring({ frame: frame - 22, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const childSpring = spring({ frame: frame - 52, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const arrowSpring = spring({ frame: frame - 85, fps, from: 0, to: 1, config: { damping: 14 } });
  const trapSpring = spring({ frame: frame - 118, fps, from: 0.8, to: 1, config: { damping: 11 } });
  const calloutSpring = spring({ frame: frame - 150, fps, from: 0.85, to: 1, config: { damping: 12 } });

  const isTrapVisible = frame >= 118;
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
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <Tag accent={C.foreignKey} bg="rgba(16, 185, 129, 0.14)">
          BÀI TOÁN THỰC CHIẾN • QUẢN LÝ KHÁCH SẠN
        </Tag>
        <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginTop: 12 }}>
          Bảng Cha (idKS) <span style={{ color: '#38BDF8' }}>➜</span> Bảng Con (idKS)
        </div>
      </div>

      {/* Cửa sổ Khung Tự Nhiên macOS 960px */}
      <div style={{ transform: `scale(${winSpring})` }}>
        <NaturalWindow title="DATABASE SCHEMA — QUAN HỆ 1:N" badge="KHACHSAN ➜ DATPHONG">
          {/* 1. BẢNG CHA KHACHSAN */}
          <div
            style={{
              transform: `scale(${parentSpring})`,
              background: 'rgba(245, 158, 11, 0.08)',
              border: '2px solid rgba(245, 158, 11, 0.45)',
              borderRadius: 18,
              padding: '18px 24px',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#F59E0B' }}>
                📂 BẢNG CHA: <span style={{ color: '#FDE68A' }}>KHACHSAN</span>
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
            <div style={{ display: 'flex', gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: '1px solid #F59E0B',
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#FDE68A',
                }}
              >
                🔑 idKS: <span style={{ color: '#FFF' }}>'KS01'</span> (KS Riverside)
              </div>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: '1px solid #F59E0B',
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#FDE68A',
                }}
              >
                🔑 idKS: <span style={{ color: '#FFF' }}>'KS02'</span> (KS Marina)
              </div>
            </div>
          </div>

          {/* Mũi tên liên kết phát sáng */}
          <div
            style={{
              textAlign: 'center',
              transform: `scale(${arrowSpring})`,
              fontSize: 30,
              fontWeight: 900,
              color: '#38BDF8',
              margin: '-6px 0 14px 0',
              filter: 'drop-shadow(0 0 12px #38BDF8)',
            }}
          >
            ⬇ Ràng buộc khóa ngoại (FOREIGN KEY) ⬇
          </div>

          {/* 2. BẢNG CON DATPHONG */}
          <div
            style={{
              transform: `scale(${childSpring})`,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '2px solid rgba(16, 185, 129, 0.45)',
              borderRadius: 18,
              padding: '18px 24px',
              marginBottom: 22,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#10B981' }}>
                📄 BẢNG CON: <span style={{ color: '#A7F3D0' }}>DATPHONG</span>
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
                <span>Mã ĐP: 101 • Khách: Nguyễn Nam</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>idKS: 'KS01' ✔ (HỢP LỆ)</span>
              </div>

              {/* Dòng bẫy vi phạm 'KS99' */}
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
                <span>Mã ĐP: 102 • Khách: Trần Mai</span>
                <span style={{ color: isTrapVisible ? '#EF4444' : '#94A3B8', fontWeight: 800 }}>
                  idKS: 'KS99' {isTrapVisible && '❌ (VI PHẠM TOÀN VẸN)'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Thẻ Đúc Kết Súc Tích */}
          <div
            style={{
              transform: `scale(${calloutSpring})`,
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(56, 189, 248, 0.12) 100%)',
              border: '2px solid #F59E0B',
              borderRadius: 16,
              padding: '16px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#FDE68A' }}>
              ⚡ NGUYÊN TẮC: Giá trị ở Bảng Con BẮT BUỘC phải tồn tại ở Bảng Cha!
            </div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: '#E2E8F0', marginTop: 4 }}>
              Không thể đặt phòng tại 'KS99' khi hệ thống chưa tạo khách sạn này.
            </div>
          </div>
        </NaturalWindow>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// PHẦN 3: CÚ PHÁP SQL CHUẨN ANSI & 3D PERSPECTIVE (16s - 24s = frames 480 -> 720)
// =========================================================================
const Scene3SqlPerspective: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winSpring = spring({ frame: frame - 5, fps, from: 0.9, to: 1, config: { damping: 13 } });
  const tip1Spring = spring({ frame: frame - 35, fps, from: 0.85, to: 1, config: { damping: 12 } });
  const tip2Spring = spring({ frame: frame - 70, fps, from: 0.85, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
      }}
    >
      <div style={{ marginBottom: 26, textAlign: 'center' }}>
        <Tag accent={C.sqlBlue} bg="rgba(56, 189, 248, 0.14)">
          CÚ PHÁP CHUẨN ANSI SQL • DDL
        </Tag>
        <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginTop: 12 }}>
          Khai Báo REFERENCES Khóa Ngoại
        </div>
      </div>

      {/* Cửa sổ Code Editor macOS (Natural Framing) */}
      <div style={{ transform: `scale(${winSpring})`, marginBottom: 30 }}>
        <NaturalWindow title="datphong_table.sql" badge="SQL DDL" badgeColor="#38BDF8">
          <div
            style={{
              fontFamily: MONO,
              fontSize: 25,
              lineHeight: 1.8,
              color: '#F8FAFC',
              background: '#090D16',
              padding: '22px 26px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <span style={{ color: '#38BDF8', fontWeight: 800 }}>CREATE TABLE</span>{' '}
              <span style={{ color: '#FDE68A', fontWeight: 800 }}>DATPHONG</span> (
            </div>
            <div style={{ paddingLeft: 28 }}>
              idDatPhong <span style={{ color: '#10B981' }}>INT</span>{' '}
              <span style={{ color: '#F59E0B' }}>PRIMARY KEY</span>,
            </div>
            <div style={{ paddingLeft: 28 }}>
              idKS <span style={{ color: '#10B981' }}>VARCHAR(10)</span>,
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
              <span style={{ color: '#F59E0B' }}>FOREIGN KEY</span> (idKS){' '}
              <span style={{ color: '#F59E0B' }}>REFERENCES</span> KHACHSAN(idKS)
            </div>
            <div>);</div>
          </div>
        </NaturalWindow>
      </div>

      {/* 2 Thẻ Mẹo Thi 2K9 Nảy So Le */}
      <div style={{ width: 960, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            transform: `scale(${tip1Spring})`,
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.16) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '2px solid #10B981',
            borderRadius: 18,
            padding: '18px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
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
              Bảng con cần có khóa chính ở bảng cha để tham chiếu.
            </div>
          </div>
        </div>

        <div
          style={{
            transform: `scale(${tip2Spring})`,
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.16) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '2px solid #F59E0B',
            borderRadius: 18,
            padding: '18px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
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
              Không thể xóa khách sạn khi vẫn còn đơn đặt phòng liên kết.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================================
// PHẦN 4: FLOATING CAPSULE MINDMAP & TỔNG KẾT (24s - 30s = frames 720 -> 900)
// Lấy cảm hứng từ hiệu ứng mindmap liên kết trong video Unicorns.edu
// =========================================================================
const Scene4MindmapOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, from: 0.85, to: 1, config: { damping: 13 } });
  const cap1Spring = spring({ frame: frame - 18, fps, from: 0, to: 1, config: { damping: 12 } });
  const cap2Spring = spring({ frame: frame - 38, fps, from: 0, to: 1, config: { damping: 12 } });
  const cap3Spring = spring({ frame: frame - 58, fps, from: 0, to: 1, config: { damping: 12 } });
  const badgeSpring = spring({ frame: frame - 85, fps, from: 0.8, to: 1, config: { damping: 11 } });

  // Floating bobbing nhẹ cho các capsules
  const bob1 = Math.sin((frame * Math.PI * 2) / 60) * 6;
  const bob2 = Math.sin((frame * Math.PI * 2) / 65 + 1) * 7;
  const bob3 = Math.sin((frame * Math.PI * 2) / 70 + 2) * 6;

  // Mascot Cánh cụt cầm bảng A+ nảy vào
  const penguinSpring = spring({ frame: frame - 90, fps, from: 0, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 180,
      }}
    >
      <div style={{ transform: `scale(${titleSpring})`, marginBottom: 36, textAlign: 'center' }}>
        <Tag accent="#F59E0B" bg="rgba(245, 158, 11, 0.14)">
          3 BƯỚC ĂN TRỌN ĐIỂM CƠ SỞ DỮ LIỆU
        </Tag>
        <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginTop: 12 }}>
          Lộ Trình Ôn Thi Tin Học 12
        </div>
      </div>

      {/* 3 Floating Capsule Mindmap nối nhau bằng tia sáng */}
      <div style={{ width: 960, display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
        {/* Capsule 1 */}
        <div
          style={{
            transform: `scale(${cap1Spring}) translateY(${bob1}px)`,
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.18) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '2px solid #38BDF8',
            borderRadius: 999,
            padding: '20px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              background: '#38BDF8',
              color: '#000',
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            BƯỚC 1
          </div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#F8FAFC' }}>
            Hiểu rõ bản chất: <span style={{ color: '#38BDF8' }}>Bảng Cha (PK) ➜ Bảng Con (FK)</span>
          </div>
        </div>

        {/* Capsule 2 */}
        <div
          style={{
            transform: `scale(${cap2Spring}) translateY(${bob2}px)`,
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '2px solid #F59E0B',
            borderRadius: 999,
            padding: '20px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              background: '#F59E0B',
              color: '#000',
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            BƯỚC 2
          </div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#F8FAFC' }}>
            Nắm chắc quy tắc: <span style={{ color: '#FDE68A' }}>Tạo Cha trước • Xóa Con trước</span>
          </div>
        </div>

        {/* Capsule 3 */}
        <div
          style={{
            transform: `scale(${cap3Spring}) translateY(${bob3}px)`,
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '2px solid #10B981',
            borderRadius: 999,
            padding: '20px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              background: '#10B981',
              color: '#000',
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            BƯỚC 3
          </div>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: '#F8FAFC' }}>
            Viết chuẩn cú pháp: <span style={{ color: '#A7F3D0' }}>FOREIGN KEY ... REFERENCES</span>
          </div>
        </div>
      </div>

      {/* Huy hiệu cam kết điểm 10 */}
      <div
        style={{
          transform: `scale(${badgeSpring})`,
          background: 'linear-gradient(90deg, #F59E0B, #10B981)',
          padding: '16px 44px',
          borderRadius: 999,
          color: '#000',
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 1,
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.5)',
        }}
      >
        🎯 CHẮC NẮM 10 ĐIỂM TRẮC NGHIỆM ĐÚNG/SAI TIN HỌC 12!
      </div>

      {/* Cánh cụt vỗ cánh chúc mừng */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: 150,
          transform: `scale(${penguinSpring})`,
          width: 210,
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
// HEADER WATERMARK & THANH TIẾN TRÌNH VIDEO 30S
// =========================================================================
const VideoProgressHeader30s: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 900; // 30s * 30fps
  const p = Math.min(1, frame / total);

  const floatY = Math.sin((frame * Math.PI * 2) / 80) * 6;
  const breathe = 0.4 + 0.15 * (0.5 + 0.5 * Math.sin((frame * Math.PI * 2) / 100));

  return (
    <>
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
// MAIN COMPOSITION: 30 GIÂY THỬ NGHIỆM THIẾT KẾ & TRANSITIONS
// 900 frames @ 30fps = đúng 30.00 giây (NO MUSIC, NO VOICE)
// =========================================================================
export const TestThietKe30s: React.FC = () => {
  // 4 Scenes, mỗi scene chuyển cảnh với GLIDE chuẩn 26 frames
  // Scene 1: 0 -> 240 (8.0s)
  // Scene 2: 240 - 26 = 214 -> 480 (~8.8s)
  // Scene 3: 480 - 26 = 454 -> 720 (~8.8s)
  // Scene 4: 720 - 26 = 694 -> 900 (~6.8s)
  const XF = 26;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0, overflow: 'hidden' }}>
      {/* 1. Lớp Nền Lưới Kỹ Thuật (RDBMS Blueprint Grid + Scanline) */}
      <TechBlueprintGrid />

      {/* 2. Lớp Ánh Sao Lấp Lánh 4 Cánh (Sparkle Stars Background — Quy tắc 32) */}
      <SparkleStars />

      {/* 3. Lớp Ký Hiệu Môn Tin Lơ Lửng Rơi Nhẹ (Floating Symbols — Quy tắc 32) */}
      <FloatingSymbols />

      {/* 4. Scene 1: HOOK & DYNAMIC NUMBER COUNTER */}
      <Sequence from={0} durationInFrames={240}>
        <KineticSlideTransition durationInFrames={240} isFirst>
          <Scene1HookCounter />
        </KineticSlideTransition>
      </Sequence>

      {/* 5. Scene 2: BÀI TOÁN THỰC CHIẾN KHÁCH SẠN (NATURAL FRAMING) */}
      <Sequence from={240 - XF} durationInFrames={240 + XF}>
        <KineticSlideTransition durationInFrames={240 + XF}>
          <Scene2RelationalTrap />
        </KineticSlideTransition>
      </Sequence>

      {/* 6. Scene 3: CÚ PHÁP SQL CHUẨN ANSI & 2 MẸO THI */}
      <Sequence from={480 - XF} durationInFrames={240 + XF}>
        <KineticSlideTransition durationInFrames={240 + XF}>
          <Scene3SqlPerspective />
        </KineticSlideTransition>
      </Sequence>

      {/* 7. Scene 4: FLOATING CAPSULE MINDMAP & TỔNG KẾT */}
      <Sequence from={720 - XF} durationInFrames={180 + XF}>
        <KineticSlideTransition durationInFrames={180 + XF}>
          <Scene4MindmapOutro />
        </KineticSlideTransition>
      </Sequence>

      {/* 8. Header Watermark & Thanh tiến trình */}
      <VideoProgressHeader30s />
    </AbsoluteFill>
  );
};
