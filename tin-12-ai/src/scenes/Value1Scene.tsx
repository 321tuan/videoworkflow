import React from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from '../theme';
import { SC, VO_LEAD } from '../data';
import { voiceVolAt } from '../mix';
import { Lyrics, W } from '../Lyrics';
import { Tag } from '../decor';
import wordsJson from '../words/s03_value1.json';

export const Value1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = SC.s03_value1;

  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const p1Op = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p1Y = interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 5 Nang luc vang xuat hien dan theo nhip Ninh Don doc:
  // 1: frame 215 (~7.1s)
  // 2: frame 280 (~9.3s)
  // 3: frame 345 (~11.5s)
  // 4: frame 435 (~14.5s)
  // 5: frame 515 (~17.1s)
  const SKILLS = [
    {
      num: '01',
      title: 'Học Hỏi Từ Dữ Liệu',
      desc: 'Tự động rút ra tri thức từ dữ liệu lớn (Machine Learning)',
      icon: '📚',
      color: '#38BDF8',
      frame: 302,
    },
    {
      num: '02',
      title: 'Suy Luận Logic',
      desc: 'Vận dụng quy tắc logic để rút ra kết luận chuẩn xác',
      icon: '🧠',
      color: '#00FF87',
      frame: 357,
    },
    {
      num: '03',
      title: 'Nhận Thức Môi Trường',
      desc: 'Thu thập và hiểu thông tin môi trường qua cảm biến / camera',
      icon: '👁️',
      color: '#FBBF24',
      frame: 400,
    },
    {
      num: '04',
      title: 'Hiểu Ngôn Ngữ Tự Nhiên',
      desc: 'Giao tiếp và phân tích ngôn ngữ người (NLP / LLM)',
      icon: '💬',
      color: '#A855F7',
      frame: 466,
    },
    {
      num: '05',
      title: 'Tối Ưu Hóa & Giải Quyết Vấn Đề',
      desc: 'Tìm phương án tối ưu nhất để đạt mục tiêu đề ra',
      icon: '🎯',
      color: '#F43F5E',
      frame: 526,
    },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Audio
        src={staticFile('vo/s03_value1.ogg')}
        startFrom={0}
        volume={(f) => voiceVolAt('s03_value1', f, dur)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 140,
          paddingLeft: 50,
          paddingRight: 50,
          height: '100%',
        }}
      >
        {/* BADGE & TIEU DE VALUE 1 */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <Tag label="ĐỊNH NGHĨA CHUẨN GDPT 2018" sub="JOHN MCCARTHY" color="#00FF87" />
          
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 18,
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            5 NĂNG LỰC CỐT LÕI CỦA <span style={{ color: C.accent }}>AI</span>
          </h1>
        </div>

        {/* KHUNG CUA SO 5 NANG LUC BE THE (WIDTH 980, MIN-HEIGHT 1040) */}
        <div
          style={{
            opacity: p1Op,
            transform: `translateY(${p1Y}px)`,
            width: '100%',
            maxWidth: 980,
            minHeight: 1040,
            background: 'linear-gradient(135deg, rgba(10, 18, 38, 0.95) 0%, rgba(4, 8, 22, 0.98) 100%)',
            border: '2px solid rgba(0, 255, 135, 0.35)',
            borderRadius: 32,
            padding: '32px 34px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* HEADER DINH NGHIA JOHN MCCARTHY */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 24, color: C.accent, fontWeight: 800 }}>
                [JOHN MCCARTHY — 1955: ĐỊNH NGHĨA KHOA HỌC]
              </span>
              <span style={{ fontFamily: MONO, fontSize: 22, color: C.textDim }}>SGK TIN HỌC 12</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 30, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.4 }}>
              "AI là ngành khoa học và kỹ thuật chế tạo các cỗ máy thông minh."
            </div>
          </div>

          {/* 5 HANG NANG LUC KHOI SAC VA PHU KIN KHONG GIAN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'space-between' }}>
            {SKILLS.map((s, idx) => {
              const active = frame >= s.frame;
              const op = interpolate(frame, [s.frame, s.frame + 12], [0.35, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const x = interpolate(frame, [s.frame, s.frame + 14], [-12, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              return (
                <div
                  key={idx}
                  style={{
                    opacity: active ? op : 0.35,
                    transform: active ? `translateX(${x}px)` : 'none',
                    background: active
                      ? 'linear-gradient(135deg, rgba(16, 26, 52, 0.95) 0%, rgba(8, 14, 30, 0.98) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: active ? `2px solid ${s.color}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 20,
                    padding: '16px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                    boxShadow: active ? `0 8px 28px ${s.color}33` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      background: active ? `${s.color}22` : 'rgba(255, 255, 255, 0.05)',
                      border: active ? `2px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 34,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 900, color: active ? s.color : '#94A3B8' }}>
                        [{s.num}]
                      </span>
                      <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: active ? '#FFFFFF' : '#CBD5E1' }}>
                        {s.title}
                      </span>
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 26, color: active ? '#E2E8F0' : C.textDim, marginTop: 4, fontWeight: 600 }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Lyrics words={W(wordsJson)} from={VO_LEAD} bottom={190} />
    </AbsoluteFill>
  );
};
