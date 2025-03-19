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
  const lastActiveRef = useRef(isActive);

  // Main effect to handle page activity changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    console.log("Video frame isActive changed:", isActive);

    // When page becomes inactive, pause and reset the video
    if (!isActive && lastActiveRef.current) {
      console.log("Page inactive - pausing video");
      const pausePromise = videoElement.pause();
      videoElement.currentTime = 0;
      
      if (pausePromise !== undefined && typeof pausePromise.catch === 'function') {
        pausePromise.catch(error => {
          console.error('Failed to pause video:', error);
        });
      }
    }

    // Update the last active state
    lastActiveRef.current = isActive;

    // Create a function to force pause the video
    const forcePauseVideo = () => {
      if (videoElement) {
        console.log("Force pausing video");
        try {
          videoElement.pause();
          videoElement.currentTime = 0;
        } catch (error) {
          console.error('Error pausing video:', error);
        }
      }
    };

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        console.log("Document hidden - pausing video");
        forcePauseVideo();
      }
    };
    
    // Add beforeunload listener to pause video before page unloads
    const handleBeforeUnload = () => {
      forcePauseVideo();
    };
    
    // Add route change listeners for SPAs (if using Next.js router)
    // This custom event will be dispatched in the Flipbook component
    const handleRouteChange = () => {
      console.log("Route changed - pausing video");
      forcePauseVideo();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageChange', handleRouteChange);
    
    // Create a MutationObserver to watch for DOM changes that might indicate navigation
    const observer = new MutationObserver((mutations) => {
      // If we detect significant DOM changes, check if our video should pause
      if (!isActive && videoElement && !videoElement.paused) {
        console.log("DOM changed - checking video state");
        forcePauseVideo();
      }
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    return () => {
      // Clean up all listeners and observer
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageChange', handleRouteChange);
      observer.disconnect();
      
      // Make sure to clean up by pausing the video when component unmounts
      forcePauseVideo();
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