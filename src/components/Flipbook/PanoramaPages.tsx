"use client";

// components/Flipbook/PanoramaPages.tsx
import React, { useEffect, useRef, useState } from 'react';
import VideoButton from '../VideoButton';
import { panoramaState } from './PanoramaState';

interface PanoramaPagesProps {
  scrollValue: number;
}

// Komponen untuk halaman panorama kiri
export const PanoramaLeftPage: React.FC<PanoramaPagesProps> = ({ scrollValue }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgWidth, setImgWidth] = useState(0);
  
  // Efek untuk mengukur gambar saat dimuat
  useEffect(() => {
    if (imgRef.current && containerRef.current) {
      const img = imgRef.current;
      const container = containerRef.current;
      
      const handleImageLoad = () => {
        // Menghitung lebar gambar dan container
        if (img && container) {
          const imageWidth = img.offsetWidth;
          const containerWidth = container.offsetWidth;
          setImgWidth(imageWidth);
          
          console.log('Lebar gambar:', imageWidth);
          console.log('Lebar container:', containerWidth);
          
          // Perbarui nilai scrollFactor di panoramaState
          const totalContainerWidth = containerWidth * 2;
          const scrollNeeded = imageWidth - totalContainerWidth;
          
          if (scrollNeeded > 0) {
            // Pastikan faktor cukup besar untuk menampilkan seluruh gambar
            // dengan sedikit buffer untuk keamanan
            const idealFactor = (scrollNeeded / panoramaState.sliderMax) * 1.05;
            panoramaState.setScrollFactor(idealFactor);
            console.log('Faktor scroll disetel ke:', idealFactor);
          }
        }
      };
      
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
      }
      
      return () => {
        img.removeEventListener('load', handleImageLoad);
      };
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative">
      <div 
        ref={containerRef}
        className="w-full h-full overflow-hidden"
      >
        <div 
          id="panorama-img-left"
          className="h-full relative inline-block"
          style={{ 
            transform: `translateX(-${scrollValue * panoramaState.scrollFactor}px)`,
            transition: 'transform 0.8s ease'
          }}
        >
          <img
            ref={imgRef}
            src="/tinggi/page_Page_032-038.jpg"
            alt="Panorama Page Left"
            className="h-full w-auto max-w-none"
            style={{ objectFit: 'contain' }}
          />
          
          {/* Tombol video */}
          <div style={{ position: 'absolute', top: '20%', left: '10%', zIndex: 10 }}>
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
            transform: `translateX(-${scrollValue * panoramaState.scrollFactor}px)`,
            transition: 'transform 0.8s ease',
            marginLeft: '-100%' // Penting: ini menghubungkan kedua gambar
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