// components/Flipbook/PanoramaView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import VideoButton from '../VideoButton';

const PanoramaView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const totalImages = 7; // Total 7 gambar (32-38)
  
  // Fungsi untuk navigasi
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(prev => Math.min(totalImages - 1, prev + 1));
  };

  // Efek untuk scroll ke gambar yang dipilih saat currentIndex berubah
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const imageWidth = container.scrollWidth / totalImages;
      container.scrollTo({
        left: currentIndex * imageWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Handle scroll event untuk memperbarui currentIndex
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPos = container.scrollLeft;
      const imageWidth = container.scrollWidth / totalImages;
      const newIndex = Math.round(scrollPos / imageWidth);
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };
  
  // Efek untuk keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(totalImages - 1, prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <>
      {/* Container utama */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%', // Ambil ruang untuk dua halaman
          height: '100%',
          backgroundColor: 'white',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan judul */}
        <div
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: 'white',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Halaman {32 + currentIndex} dari 38
        </div>
        
        {/* Container untuk gambar-gambar yang bisa digeser */}
        <div 
          ref={scrollContainerRef}
          className="panorama-container"
          onScroll={handleScroll}
          style={{
            width: '100%',
            height: 'calc(100% - 80px)',
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Render gambar 32-38 dalam panorama */}
          {Array.from({ length: totalImages }).map((_, idx) => {
            const pageNumber = 32 + idx;
            const paddedNumber = String(pageNumber).padStart(3, "0");
            
            return (
              <div 
                key={`panorama-image-${pageNumber}`}
                style={{
                  flex: '0 0 100%',
                  height: '100%',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <img
                  src={`/tinggi/page_Page_${paddedNumber}.jpg`}
                  alt={`Page ${pageNumber}`}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
                
                {/* Hanya tampilkan tombol video di halaman pertama (32) */}
                {idx === 0 && (
                  <VideoButton 
                    videoSrc="/video1.mp4" 
                    position={{ top: '20%', left: '80%' }} 
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Indikator dot */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px'
          }}
        >
          {Array.from({ length: totalImages }).map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: idx === currentIndex ? '#2563eb' : '#e5e7eb',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              aria-label={`Halaman ${32 + idx}`}
            />
          ))}
        </div>
        
        {/* Tombol navigasi kiri */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 60
            }}
          >
            <FaArrowLeft />
          </button>
        )}
        
        {/* Tombol navigasi kanan */}
        {currentIndex < totalImages - 1 && (
          <button
            onClick={nextSlide}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 60
            }}
          >
            <FaArrowRight />
          </button>
        )}
      </div>
    </>
  );
};

export default PanoramaView;