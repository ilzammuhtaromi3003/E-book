// components/VideoButton.tsx
import React, { useState } from 'react';

interface VideoButtonProps {
  videoSrc: string;
  position: {
    top: string | number;
    left: string | number;
  };
}

const VideoButton: React.FC<VideoButtonProps> = ({ videoSrc, position }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowVideo(!showVideo);
  };
  
  const closeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowVideo(false);
  };
  
  return (
    <>
      {/* Tombol video */}
      <button
        onClick={toggleVideo}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(37, 99, 235, 0.8)',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.2s, background-color 0.2s'
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* Play icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      
      {/* Modal video */}
      {showVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={closeVideo}
        >
          <div
            style={{
              position: 'relative',
              width: '80%',
              maxWidth: '800px',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video player */}
            <video
              src={videoSrc}
              controls
              autoPlay
              style={{
                width: '100%',
                maxHeight: '80vh'
              }}
            />
            
            {/* Tombol tutup */}
            <button
              onClick={closeVideo}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {/* Close icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoButton;