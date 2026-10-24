import React from 'react';
import { SAFE_ZONE, FONT } from '../theme';

interface Props {
  text: string;
  highlightWord?: string;
}

export const SafeLyrics: React.FC<Props> = ({ text, highlightWord }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: SAFE_ZONE.LYRICS_BOTTOM,
        left: SAFE_ZONE.X_MIN,
        width: SAFE_ZONE.WIDTH,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 85,
        fontFamily: FONT,
      }}
    >
        <div
          style={{
            background: 'rgba(10, 15, 29, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            borderRadius: 24,
            padding: '10px 24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65)',
            maxWidth: 780,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: 0.2,
              lineHeight: 1.3,
            }}
          >
            {text}
          </span>
        </div>
    </div>
  );
};
