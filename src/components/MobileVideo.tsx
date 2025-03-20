"use client";

// components/MobileVideo.tsx
import React, { useRef, useEffect, useState } from 'react';

interface MobileVideoProps {
  videoSrc: string;
  posterSrc?: string;
  autoplay?: boolean;
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
  usePoster?: boolean; // Tambah opsi untuk menggunakan poster atau tidak
}

const MobileVideo: React.FC<MobileVideoProps> = ({
  videoSrc,
  posterSrc,
  autoplay = false,
  position = { top: '20%', left: '25%' },
  dimensions = { width: '50%', height: 'auto' },
  usePoster = true // Default true untuk kompatibilitas
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Effect untuk mendeteksi ketika video sudah dimuat
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };
    
    videoElement.addEventListener('loadeddata', handleLoadedData);
    
    // Coba preload video untuk halaman 10 (yang bukan autoplay)
    if (!autoplay) {
      videoElement.preload = "auto";
    }
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [autoplay]);
  
  // Set up intersection observer to detect when video is visible
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Pastikan video autoplay selalu dalam kondisi muted
    if (autoplay) {
      videoElement.muted = true;
    }
    
    // Observer callback
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      
      if (entry.isIntersecting) {
        console.log('Video in viewport, visibility:', entry.intersectionRatio);
        
        // If it's set to autoplay, try to play when it becomes visible
        if (autoplay && videoElement.paused) {
          console.log('Attempting to autoplay (muted)');
          
          // Pastikan video dalam keadaan muted untuk autoplay
          videoElement.muted = true;
          
          const playPromise = videoElement.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Mobile video autoplay prevented:', error);
            });
          }
        }
      } else {
        // Pause video when scrolled out of view
        if (!videoElement.paused) {
          console.log('Video scrolled out of view, pausing');
          videoElement.pause();
        }
      }
    };
    
    // Create the observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0.1, 0.5, 0.9] // Trigger at different visibility thresholds
    });
    
    // Start observing the video element
    observerRef.current.observe(videoElement);
    
    // Clean up
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Make sure to pause video when component unmounts
      if (videoElement && !videoElement.paused) {
        videoElement.pause();
      }
    };
  }, [autoplay]);
  
  // Add event listener for page visibility changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden && !videoElement.paused) {
        console.log('Page hidden, pausing video');
        videoElement.pause();
      } else if (!document.hidden && autoplay && videoElement.paused) {
        // Only try to play again if it's set to autoplay and is visible
        if (observerRef.current) {
          const entry = observerRef.current.takeRecords()[0];
          if (entry && entry.isIntersecting) {
            console.log('Page visible again, attempting to resume autoplay');
            
            // Pastikan video dalam keadaan muted untuk autoplay
            videoElement.muted = true;
            
            videoElement.play().catch(err => console.error('Resume autoplay failed:', err));
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoplay]);
  
  // CSS untuk style video untuk memperbaiki tampilan
  const videoStyle = {
    width: dimensions.width,
    height: dimensions.height,
    objectFit: 'contain' as 'contain',
    display: 'block',
    backgroundColor: 'black', // Tambahkan background hitam
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Tambahkan shadow subtle
    borderRadius: '4px', // Bulatkan sudut sedikit
  };
  
  return (
    <div
      className="mobile-media-overlay"
      style={{
        position: 'absolute',
        ...position,
        zIndex: 20
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="mobile-video"
        poster={usePoster ? posterSrc : undefined}
        controls
        playsInline
        loop
        muted={autoplay} // Otomatis mematikan suara untuk video autoplay
        onClick={e => {
          const video = e.currentTarget;
          if (video.paused) {
            // Jika pengguna mengklik, berarti sudah ada interaksi
            // Kita bisa menghapus muted dan memutar video
            if (video.muted) video.muted = false;
            video.play().catch(err => console.error(err));
          } else {
            video.pause();
          }
        }}
        style={videoStyle}
      />
      
      {/* Tampilkan petunjuk untuk unmute jika video autoplay */}
      {autoplay && (
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            opacity: 0.8,
            transition: 'opacity 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          Klik untuk suara
        </div>
      )}
      
      {/* Tambahkan overlay dengan icon play saat video belum diputar dan bukan autoplay */}
      {!autoplay && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: videoRef.current?.paused ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Triangle play icon */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                borderLeft: '25px solid white',
                marginLeft: '5px' // Sedikit geser ke kanan agar terlihat lebih seimbang
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileVideo;