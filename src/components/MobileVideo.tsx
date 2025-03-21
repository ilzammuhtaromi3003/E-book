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
  usePoster?: boolean;
}

const MobileVideo: React.FC<MobileVideoProps> = ({
  videoSrc,
  posterSrc,
  autoplay = false,
  position = { top: '20%', left: '25%' },
  dimensions = { width: '50%', height: 'auto' },
  usePoster = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMuted, setIsMuted] = useState(autoplay);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastVisibleRef = useRef(false);
  
  // Pastikan video dihentikan saat keluar viewport atau halaman berubah
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Fungsi untuk menghentikan dan reset video
    const forcePauseVideo = () => {
      if (!videoElement) return;
      
      console.log("Force pausing video");
      try {
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    };
    
    // Handler untuk perubahan visibilitas halaman
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        console.log("Document hidden - pausing video");
        forcePauseVideo();
      }
    };
    
    // Handler untuk sebelum meninggalkan halaman
    const handleBeforeUnload = () => {
      forcePauseVideo();
    };
    
    // Handler untuk perubahan halaman dalam SPA
    const handleRouteChange = () => {
      console.log("Route changed - pausing video");
      forcePauseVideo();
    };
    
    // Tambahkan semua event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageChange', handleRouteChange);
    
    return () => {
      // Bersihkan semua listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageChange', handleRouteChange);
      
      // Pastikan video berhenti saat komponen di-unmount
      forcePauseVideo();
    };
  }, []);
  
  // Event handlers untuk video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Set video status handlers
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    
    // Pastikan video autoplay di-mute untuk kebijakan browser
    if (autoplay) {
      videoElement.muted = true;
      setIsMuted(true);
    }
    
    // Set preload auto untuk memastikan frame pertama muncul
    videoElement.preload = "auto";
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [autoplay]);
  
  // Intersection observer untuk mendeteksi video dalam viewport
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isVisible = entry.isIntersecting;
      
      console.log(`Video visibility changed: ${isVisible ? 'visible' : 'hidden'}`);
      
      // Update terakhir kali visible
      const wasVisible = lastVisibleRef.current;
      lastVisibleRef.current = isVisible;
      
      if (isVisible) {
        // Video masuk viewport
        if (autoplay && videoElement.paused) {
          // Autoplay jika perlu
          videoElement.muted = true;
          videoElement.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error('Autoplay failed:', err));
        }
      } else if (wasVisible) {
        // Video keluar viewport setelah terlihat
        console.log("Video scrolled out of view, pausing");
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsPlaying(false);
      }
    };
    
    // Buat observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0.1, 0.5] // Trigger saat 10% dan 50% terlihat
    });
    
    // Mulai observasi
    observerRef.current.observe(videoElement);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [autoplay]);
  
  // Handler untuk klik pada overlay (main untuk play/pause)
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (videoElement.paused) {
      // Video sedang paused, putar
      if (videoElement.muted && autoplay) {
        // Jika autoplay dan masih muted, tetap muted untuk memenuhi kebijakan browser
        console.log("Playing muted video (autoplay policy)");
      } else {
        // Untuk video non-autoplay, play normal
        videoElement.muted = false;
        setIsMuted(false);
      }
      
      videoElement.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Failed to play on click:', err));
    } else {
      // Video sedang playing
      if (autoplay && videoElement.muted) {
        // Jika autoplay dan masih muted, unmute
        videoElement.muted = false;
        setIsMuted(false);
      } else {
        // Jika bukan autoplay atau sudah unmuted, pause
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };
  
  // Handle unmute khusus untuk autoplay
  const handleUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.muted = false;
    setIsMuted(false);
  };
  
  return (
    <div
      ref={containerRef}
      className="mobile-video-container"
      style={{
        position: 'absolute',
        ...position,
        zIndex: 10,
        overflow: 'hidden',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Video dengan tampilan seperti desktop */}
      <video
        ref={videoRef}
        src={videoSrc}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
          display: 'block',
          background: 'transparent'
        }}
        playsInline
        loop
        controls
        preload="auto"
        muted={isMuted}
        onClick={handleVideoClick}
        onMouseDown={(e) => e.stopPropagation()}
      />
      
      {/* Overlay untuk klik di mana saja (tanpa background gelap) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          cursor: 'pointer',
          background: 'transparent'
        }}
        onClick={handleVideoClick}
      />
      
      {/* Tombol unmute untuk autoplay video - DIUBAH SESUAI GAMBAR */}
      {autoplay && isMuted && isPlaying && (
        <div
          onClick={handleUnmute}
          style={{
            position: 'absolute',
            bottom: '80%',
            left: '30%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'auto',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Sound icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" />
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Klik untuk Suara
        </div>
      )}
    </div>
  );
};

export default MobileVideo;