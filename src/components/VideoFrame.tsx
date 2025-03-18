"use client";

import React, { useRef, useEffect } from 'react';

interface VideoFrameProps {
  videoSrc: string;
  isActive: boolean;
  position?: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
  dimensions?: {
    width?: string | number;
    height?: string | number;
  };
}

const VideoFrame: React.FC<VideoFrameProps> = ({
  videoSrc,
  isActive,
  position = { top: '20%', left: '20%' },
  dimensions = { width: 300, height: 'auto' }
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mengontrol pemutaran video ketika halaman berubah
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!isActive) {
      // Jika halaman tidak aktif, hentikan video dan reset ke awal
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        zIndex: 10,
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '5px solid white',
        transition: 'transform 0.3s ease',
        transform: 'scale(1)',
        maxWidth: '90%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
          display: 'block',
          backgroundColor: '#000'
        }}
        playsInline
        controls
        poster="/video-poster.jpg"
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default VideoFrame;
