// components/Flipbook/Flipbook.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import Cover from './Cover';
import Page from './Page';
import PanoramaView from './PanoramaView';
import NavigationButtons from './NavigationButtons';
import ControlBar from './ControlBar';
import './styles.css';

const Flipbook: React.FC = () => {
  const totalPages = 162; // Total halaman yang sebenarnya
  const book = useRef<any>(null);
  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPanorama, setIsPanorama] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextPage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (book.current) {
      book.current.pageFlip().flipNext();
    }
  };

  const prevPage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (book.current) {
      book.current.pageFlip().flipPrev();
    }
  };

  const onPageChange = (e: any) => {
    setCurrentPage(e.data);
    // Cek apakah kita berada di halaman panorama (halaman 30-31)
    setIsPanorama(e.data === 30);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(prev => Math.min(prev + 0.1, 2));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  // Download handler
  const handleDownload = () => {
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
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
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
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !isPanorama) {
        prevPage();
      } else if (e.key === 'ArrowRight' && !isPanorama) {
        nextPage();
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
  }, [isPanorama]);

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
    
    // Halaman 32 dengan panorama dan tombol video (halaman 31 dalam penomoran)
    pages.push(
      <div key="panorama-left" className="page panorama-active" style={{ position: 'relative', overflow: 'visible' }}>
        {isPanorama ? (
          <PanoramaView />
        ) : (
          <Page pageNumber={32} showVideoButton={true} />
        )}
      </div>
    );
    
    // Halaman 33 (kanan dari panorama)
    pages.push(
      <div key="panorama-right" className="page panorama-active">
        <div style={{ 
          visibility: isPanorama ? 'hidden' : 'visible',
          width: '100%',
          height: '100%'
        }}>
          <Page pageNumber={33} />
        </div>
      </div>
    );
    
    // Halaman 39-40, 41-42, dst (38-39, 40-41, dst dalam penomoran)
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
    
    // Untuk spread halaman panorama khusus
    if (currentPage === 30) {
      return "31-37";
    } else if (currentPage === 31) {
      return "31-37";
    }
    
    // Untuk halaman setelah panorama (mereka sekarang 1 kurang dari file image)
    if (currentPage >= 32) {
      return (currentPage - 1) + 6; // Kompensasi untuk 7 halaman digabung, dikurangi 1 untuk cover
    }
    
    // Halaman normal sebelum panorama (dikurangi 1 karena cover tidak dihitung)
    return currentPage;
  };

  return (
    <div 
      ref={flipbookContainerRef}
      className={`flipbook-container ${isFullscreen ? 'flipbook-fullscreen' : 'flex flex-col items-center justify-center w-full h-screen'} overflow-hidden bg-gray-100`}
    >
      <div 
        className="relative flex justify-center items-center w-full max-w-7xl"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        <NavigationButtons 
          currentPage={currentPage}
          totalPages={renderPages().length}
          isPanorama={isPanorama}
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
            className=""
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
            disableFlipByClick={true}
            
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