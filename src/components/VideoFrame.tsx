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

    if (isActive) {
      // We don't auto-play when page becomes active,
      // but we need to set up a proper state when the page is active
      
      // If needed, you could add initialization logic here
    } else {
      // Jika halaman tidak aktif, hentikan video dan reset ke awal
      const pausePromise = videoElement.pause();
      videoElement.currentTime = 0;
      
      // Handle any potential promise rejection just to be safe
      if (pausePromise !== undefined && typeof pausePromise.catch === 'function') {
        pausePromise.catch(error => {
          console.error('Failed to pause video:', error);
        });
      }
    }
    
    // Add listener for page visibility change as a backup method
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        videoElement.pause();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Make sure to clean up by pausing the video when component unmounts
      if (videoElement) {
        videoElement.pause();
      }
    };
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

export default VideoFrame;