"use client";

// components/Flipbook/PanoramaPages.tsx
import React from 'react';
import VideoButton from '../VideoButton';
import { panoramaState } from './PanoramaState';

interface PanoramaPagesProps {
  scrollValue: number;
}

// Komponen untuk halaman panorama kiri
export const PanoramaLeftPage: React.FC<PanoramaPagesProps> = ({ scrollValue }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative">
      <div className="w-full h-full overflow-hidden">
        <div 
          id="panorama-img-left"
          className="h-full relative inline-block"
          style={{ transform: `translateX(-${scrollValue}px)` }}
        >
          <img
            src="/tinggi/page_Page_032-038.jpg"
            alt="Panorama Page Left"
            className="h-full w-auto max-w-none"
            style={{ objectFit: 'contain' }}
          />
          
          {/* Tombol video */}
          <div style={{ position: 'absolute', top: '20%', left: '30%', zIndex: 10 }}>
            <VideoButton 
              videoSrc="/video1.mp4" 
              position={{ top: 0, left: 0 }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk halaman panorama kanan
export const PanoramaRightPage: React.FC<PanoramaPagesProps> = ({ scrollValue }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative">
      <div className="w-full h-full overflow-hidden">
        <div 
          id="panorama-img-right"
          className="h-full relative inline-block"
          style={{ 
            transform: `translateX(-${scrollValue}px)`,
            marginLeft: '-100%'
          }}
        >
          <img
            src="/tinggi/page_Page_032-038.jpg"
            alt="Panorama Page Right"
            className="h-full w-auto max-w-none"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};