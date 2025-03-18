"use client";

import React, { useRef, useEffect } from 'react';

interface AutoplayVideoProps {
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

const AutoplayVideo: React.FC<AutoplayVideoProps> = ({
  videoSrc,
  isActive,
  position = { top: '20%', left: '20%' },
  dimensions = { width: 300, height: 'auto' }
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control video playback based on isActive prop
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      // Try to play when page becomes active
      const playPromise = videoElement.play();
      
      // Handle potential play() promise rejection (e.g., if browser requires user interaction)
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Auto-play was prevented:', error);
        });
      }
    } else {
      // Pause and reset video when page is not active
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
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        borderRadius: '8px',
        overflow: 'hidden'
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
          display: 'block'
        }}
        playsInline
        loop
        controls
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default AutoplayVideo;

