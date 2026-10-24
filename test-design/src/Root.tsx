import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. BẢN THIẾT KẾ THUẦN TÚY (CLEAN DESIGN - KHÔNG NHẠC, KHÔNG NỀN RÁC) */}
      <Composition
        id="SafeZoneDemo"
        component={MainVideo}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showOverlay: false,
        }}
      />

      {/* 2. BẢN ĐỐI CHIẾU TRỰC TIẾP VỚI GIAO DIỆN TIKTOK IPHONE */}
      <Composition
        id="SafeZoneDemoWithOverlay"
        component={MainVideo}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          showOverlay: true,
        }}
      />
    </>
  );
};
