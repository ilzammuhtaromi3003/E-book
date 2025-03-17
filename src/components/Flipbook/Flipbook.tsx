// components/Flipbook/Flipbook.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import Cover from './Cover';
import Page from './Page';
import NavigationButtons from './NavigationButtons';
import ControlBar from './ControlBar';
import VideoButton from '../VideoButton';
import './styles.css';

// Nilai scroll global
let panoramaScrollValue = 0;

const Flipbook: React.FC = () => {
  const totalPages = 162; // Total halaman yang sebenarnya
  const book = useRef<any>(null);
  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  
  // Deteksi apakah ini halaman panorama
  const isPanorama = currentPage === 31 || currentPage === 32;

  // Use useCallback to memoize these functions
  const nextPage = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (book.current) {
      book.current.pageFlip().flipNext();
    }
  }, []);

  const prevPage = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (book.current) {
      book.current.pageFlip().flipPrev();
    }
  }, []);

  const onPageChange = (e: any) => {
    setCurrentPage(e.data);
    // Reset scroll position saat halaman berpindah dari panorama
    if (e.data !== 31 && e.data !== 32) {
      setScrollValue(0);
      panoramaScrollValue = 0;
    }
  };

  // Handler untuk slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setScrollValue(newValue);
    panoramaScrollValue = newValue;

    // Update semua halaman panorama
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      leftPano.style.transform = `translateX(-${newValue}px)`;
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${newValue}px)`;
    }
  };

  // Fungsi untuk scroll kiri
  const scrollLeft = () => {
    const newValue = Math.max(0, scrollValue - 200);
    setScrollValue(newValue);
    panoramaScrollValue = newValue;
    
    // Update slider
    const slider = document.getElementById('panorama-slider') as HTMLInputElement;
    if (slider) {
      slider.value = newValue.toString();
    }
    
    // Update gambar
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      leftPano.style.transform = `translateX(-${newValue}px)`;
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${newValue}px)`;
    }
  };

  // Fungsi untuk scroll kanan
  const scrollRight = () => {
    const newValue = Math.min(1000, scrollValue + 200);
    setScrollValue(newValue);
    panoramaScrollValue = newValue;
    
    // Update slider
    const slider = document.getElementById('panorama-slider') as HTMLInputElement;
    if (slider) {
      slider.value = newValue.toString();
    }
    
    // Update gambar
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      leftPano.style.transform = `translateX(-${newValue}px)`;
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${newValue}px)`;
    }
  };

  // Sync scroll value saat masuk ke halaman panorama
  useEffect(() => {
    if (isPanorama) {
      setScrollValue(panoramaScrollValue);
      
      // Update slider
      const slider = document.getElementById('panorama-slider') as HTMLInputElement;
      if (slider) {
        slider.value = panoramaScrollValue.toString();
      }
      
      // Update gambar
      const leftPano = document.getElementById('panorama-img-left');
      const rightPano = document.getElementById('panorama-img-right');
      
      if (leftPano) {
        leftPano.style.transform = `translateX(-${panoramaScrollValue}px)`;
      }
      
      if (rightPano) {
        rightPano.style.transform = `translateX(-${panoramaScrollValue}px)`;
      }
    }
  }, [isPanorama]);

  // Zoom handlers with useCallback
  const handleZoomIn = useCallback(() => {
    if (zoom < 2) {
      setZoom(prev => Math.min(prev + 0.1, 2));
    }
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    if (zoom > 0.5) {
      setZoom(prev => Math.max(prev - 0.1, 0.5));
    }
  }, [zoom]);

  // Download handler
  const handleDownload = useCallback(() => {
    try {
      // Membuka jendela baru untuk unduhan
      const link = document.createElement('a');
      link.href = '/document.pdf';
      link.download = 'dokumen-ebook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mengunduh dokumen. Pastikan file PDF tersedia di server.');
    }
  }, []);

  // Fullscreen handler
  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        // Masuk ke mode fullscreen
        if (flipbookContainerRef.current?.requestFullscreen) {
          flipbookContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        // Keluar dari mode fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (isPanorama) {
          // Dalam mode panorama, tombol kiri geser panorama
          scrollLeft();
        } else {
          prevPage();
        }
      } else if (e.key === 'ArrowRight') {
        if (isPanorama) {
          // Dalam mode panorama, tombol kanan geser panorama
          scrollRight();
        } else {
          nextPage();
        }
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Mendeteksi perubahan status fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [prevPage, nextPage, handleZoomIn, handleZoomOut, toggleFullscreen, isPanorama, scrollLeft, scrollRight]);

  // Function untuk render halaman
  const renderPages = () => {
    const pages = [];
    
    // Halaman 2-31 (sekarang menjadi halaman 1-30 dalam penomoran)
    for (let i = 2; i <= 31; i++) {
      pages.push(
        <div key={`regular-${i}`} className="page">
          <Page pageNumber={i} />
        </div>
      );
    }
    
    // Halaman panorama (32-33)
    pages.push(
      <div key="panorama-left" className="page">
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
              <div style={{ position: 'absolute', top: '20%', left: '10%', zIndex: 10 }}>
                <VideoButton 
                  videoSrc="/video1.mp4" 
                  position={{ top: 0, left: 0 }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
    pages.push(
      <div key="panorama-right" className="page">
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
      </div>
    );
    
    // Halaman 39-163 (halaman 38-162 dalam penomoran)
    for (let i = 39; i <= 163; i++) {
      pages.push(
        <div key={`regular-${i}`} className="page">
          <Page pageNumber={i} />
        </div>
      );
    }
    
    return pages;
  };

  // Hitung nomor halaman yang ditampilkan
  const getDisplayPageNumber = () => {
    // Jika di halaman cover, tampilkan "Cover"
    if (currentPage === 0) {
      return "Cover";
    }
    
    // Untuk spread halaman panorama khusus (halaman 31-32)
    if (currentPage === 31 || currentPage === 32) {
      return "31-37";
    }
    
    // Untuk halaman setelah panorama
    if (currentPage >= 33) {
      return `${(currentPage - 1) + 6}`;
    }
    
    // Halaman normal sebelum panorama
    return `${currentPage}`;
  };

  return (
    <div 
      ref={flipbookContainerRef}
      className={`flipbook-container ${isFullscreen ? 'flipbook-fullscreen' : 'flex flex-col items-center justify-center w-full h-screen'} overflow-hidden bg-gray-100`}
    >
      <div 
        className="relative flex flex-col items-center justify-center w-full"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        <div className="relative" ref={bookContainerRef}>
          <NavigationButtons 
            currentPage={currentPage}
            totalPages={renderPages().length}
            isPanorama={false}
            onPrev={prevPage}
            onNext={nextPage}
          />
          
          {/* Kontainer buku */}
          <div className="relative book-container">
            <HTMLFlipBook
              width={600}
              height={733}
              size="fixed"
              minWidth={350}
              maxWidth={1000}
              minHeight={468}
              maxHeight={1333}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="panorama-flipbook"
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              
              // Pengaturan penting untuk kontrol halaman
              clickEventForward={false}
              useMouseEvents={true}
              swipeDistance={30}
              
              showPageCorners={true}
              disableFlipByClick={true} // Penting! Mencegah klik biasa membalik halaman
              
              ref={book}
              onFlip={onPageChange}
              style={{}}
            >
              {/* Halaman cover */}
              <div className="page page-cover">
                <Cover />
              </div>
              
              {/* Generate semua halaman */}
              {renderPages()}
            </HTMLFlipBook>
          </div>
          
          {/* Slider untuk panorama - hanya muncul di halaman panorama */}
          {isPanorama && (
            <div 
              className="panorama-slider-container" 
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '550px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '30px',
                padding: '2px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000
              }}
            >
              {/* Tombol kiri */}
              <button 
                onClick={scrollLeft}
                className="slider-btn-left"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0',
                  width: '28px',
                  height: '28px'
                }}
              >
                ◀
              </button>
              
              {/* Slider */}
              <input
                id="panorama-slider"
                type="range"
                min="0"
                max="1000"
                step="10"
                value={scrollValue}
                onChange={handleSliderChange}
                className="panorama-range-slider"
                style={{
                  flex: '1',
                  height: '6px',
                  appearance: 'none',
                  borderRadius: '3px',
                  background: '#e2e8f0',
                  outline: 'none'
                }}
              />
              
              {/* Tombol kanan */}
              <button 
                onClick={scrollRight}
                className="slider-btn-right"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0',
                  width: '28px',
                  height: '28px'
                }}
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Control Bar */}
      <ControlBar 
        pageDisplay={getDisplayPageNumber()}
        totalPages={totalPages}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onDownload={handleDownload}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
};

export default Flipbook;