"use client";

// components/Flipbook/Flipbook.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import Cover from './Cover';
import Page from './Page';
import NavigationButtons from './NavigationButtons';
import ControlBar from './ControlBar';
import Navbar from './Navbar';
import { PanoramaLeftPage, PanoramaRightPage } from './PanoramaPages';
import PanoramaSlider from './PanoramaSlider';
import { panoramaState } from './PanoramaState';
import Thumbnails from '../Thumbnails'; // Import the Thumbnails component
import './styles.css';

const Flipbook: React.FC = () => {
  const totalPages = 162; // Total halaman yang sebenarnya
  const book = useRef<any>(null);
  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false); // State for thumbnails
  
  // Deteksi apakah ini halaman panorama
  const isPanorama = currentPage === 31 || currentPage === 32;

  // Check if current page is page 7 (file: page_Page_008.jpg)
  const isPage7Active = currentPage === 7;
  
  // Check if current page is page 10 (file: page_Page_011.jpg)
  const isPage10Active = currentPage === 11;

  // Toggle thumbnails sidebar
  const toggleThumbnails = useCallback(() => {
    setShowThumbnails(prev => !prev);
  }, []);

  // Navigation handlers
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

  // Function to go to specific page with correctly fixed logic
  // Function to go to specific page with correctly fixed logic
const goToPage = useCallback((pageNumber: number) => {
  if (book.current) {
    console.log(`Trying to go to page: ${pageNumber}`);
    
    // Dispatch custom event for any videos to respond to
    const pageChangeEvent = new CustomEvent('pageChange', { 
      detail: { 
        previousPage: currentPage,
        targetPage: pageNumber 
      } 
    });
    window.dispatchEvent(pageChangeEvent);
    
    // FIXED MAPPING LOGIC:
    let targetIndex;
    
    // THUMBNAIL SPECIAL CASES
    
    // Cover (special case from thumbnail)
    if (pageNumber === 0) {
      targetIndex = 0; // Go to actual cover
    }
    // Special case for page 29 from thumbnail
    else if (pageNumber === 29) {
      targetIndex = 29; // Show pages 29-30
    }
    // Panorama pages (31-37)
    else if (pageNumber >= 31 && pageNumber <= 37) {
      targetIndex = 31;
      panoramaState.setScrollValue(0);
    }
    // Pages after panorama (38+)
    else if (pageNumber >= 38) {
      // For pages after panorama, we need to account for the 5 "missing" indices
      // (7 panorama pages represented by only 2 indices: 31-32)
      targetIndex = pageNumber - 5; // -5 to account for panorama compression
    }
    // Regular pages (1-30, except special cases)
    else {
      // Regular page mapping
      targetIndex = pageNumber;
    }
    
    console.log(`Page ${pageNumber} maps to book index ${targetIndex}`);
    
    // Go to the target page
    book.current.pageFlip().turnToPage(targetIndex);
  }
}, [currentPage]);

  // Function to go back to cover
  const goToHome = useCallback(() => {
    if (book.current) {
      book.current.pageFlip().turnToPage(0);
    }
  }, []);

  // Pada onPageChange, tambahkan reset untuk panorama dan dispatch custom event
  const onPageChange = (e: any) => {
    console.log('Halaman berubah ke:', e.data);
    setCurrentPage(e.data);
    
    // Dispatch custom event for videos to respond to
    const pageChangeEvent = new CustomEvent('pageChange', { 
      detail: { 
        previousPage: currentPage,
        currentPage: e.data 
      } 
    });
    window.dispatchEvent(pageChangeEvent);
    
    // Reset scroll position saat halaman berpindah dari atau ke panorama
    if (e.data !== 31 && e.data !== 32) {
      panoramaState.reset();
      setScrollValue(0);
    } else if (e.data === 31 || e.data === 32) {
      // Selalu mulai dari kiri saat masuk ke halaman panorama
      panoramaState.reset();
      setScrollValue(0);
    }
  };

  // Sync scroll value dengan state panorama saat masuk ke halaman panorama
  useEffect(() => {
    if (isPanorama) {
      setScrollValue(panoramaState.scrollValue);
    }
  }, [isPanorama]);

  // Ketika masuk ke halaman panorama, pastikan selalu mulai dari kiri
  useEffect(() => {
    if (isPanorama) {
      // Tunda sedikit untuk memastikan render selesai
      setTimeout(() => {
        panoramaState.reset();
        setScrollValue(0);
      }, 50);
    }
  }, [isPanorama]);

  // Handler untuk update scroll value
  const handleScrollValueChange = useCallback((value: number) => {
    setScrollValue(value);
  }, []);

  // Zoom handlers
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
          panoramaState.scrollLeft();
        } else {
          prevPage();
        }
      } else if (e.key === 'ArrowRight') {
        if (isPanorama) {
          panoramaState.scrollRight();
        } else {
          nextPage();
        }
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H') {
        goToHome();
      } else if (e.key === 't' || e.key === 'T') {
        toggleThumbnails();
      } else if (e.key === 'Escape') {
        if (showThumbnails) {
          setShowThumbnails(false);
        }
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
  }, [prevPage, nextPage, handleZoomIn, handleZoomOut, toggleFullscreen, isPanorama, goToHome, toggleThumbnails, showThumbnails]);

  // Function untuk render halaman
  const renderPages = () => {
    const pages = [];
    
    // Halaman 2-31 (sekarang menjadi halaman 1-30 dalam penomoran)
    for (let i = 2; i <= 31; i++) {
      // Calculate if this page is active for video playback
      // Page 7 is file page_Page_008.jpg (index 7 in our array, but actual page number is 7)
      const isPage7 = i === 8; 
      // Page 10 is file page_Page_011.jpg (index 10 in our array, but actual page number is 10) 
      const isPage10 = i === 11;
      
      pages.push(
        <div key={`regular-${i}`} className="page">
          <Page 
            pageNumber={i} 
            isActive={
              (isPage7 && currentPage === 7) || 
              (isPage10 && currentPage === 11)
            } 
          />
        </div>
      );
    }
    
    // Halaman panorama (32-33)
    pages.push(
      <div key="panorama-left" className="page">
        <PanoramaLeftPage scrollValue={scrollValue} />
      </div>
    );
    
    pages.push(
      <div key="panorama-right" className="page">
        <PanoramaRightPage scrollValue={scrollValue} />
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

  // Hitung nomor halaman yang ditampilkan di navbar
  const getDisplayPageNumber = () => {
    // Jika di halaman cover, tampilkan "Cover"
    if (currentPage === 0) {
      return "Cover";
    }
    
    // Untuk halaman panorama (hanya 31-37, indeks 31-32)
    if (currentPage === 31 || currentPage === 32) {
      return "31-37";
    }
    
    // Untuk halaman normal sebelum panorama (indeks 1-30 = halaman 1-30)
    if (currentPage >= 1 && currentPage <= 30) {
      // Untuk halaman genap, tunjukkan dengan halaman sebelumnya
      if (currentPage % 2 === 0) {
        return `${currentPage-1}-${currentPage}`;
      }
      // Untuk halaman ganjil, tunjukkan dengan halaman berikutnya jika ada
      else if (currentPage < 30) {
        return `${currentPage}-${currentPage+1}`;
      }
      // Untuk halaman 29, pasangkan dengan 30
      else {
        return `${currentPage}-${currentPage+1}`;
      }
    }
    
    // Untuk halaman setelah panorama (indeks 33+ = halaman 38+)
    if (currentPage >= 33) {
      // Hitung nomor halaman yang sebenarnya
      const actualPage = currentPage + 5; // Karena indeks 33 = halaman 38
      
      // Untuk indeks genap, pasangkan "sebelumnya-ini"
      if (currentPage % 2 === 0) {
        return `${actualPage-1}-${actualPage}`;
      }
      // Untuk indeks ganjil, pasangkan "ini-berikutnya" jika ada
      else if (actualPage < totalPages) {
        return `${actualPage}-${actualPage+1}`;
      }
      // Jika halaman terakhir dan ganjil, tampilkan sendiri
      else {
        return `${actualPage}`;
      }
    }
    
    // Fallback
    return `${currentPage}`;
  };

  return (
    <div 
      ref={flipbookContainerRef}
      className={`flipbook-container ${isFullscreen ? 'flipbook-fullscreen' : 'flex flex-col items-center justify-center w-full h-screen'} overflow-hidden bg-gray-100`}
    >
      {/* Navbar di bagian atas */}
      <Navbar 
        pageDisplay={getDisplayPageNumber()} 
        totalPages={totalPages}
        onGoToPage={goToPage}
      />
      
      <div 
        className="relative flex flex-col items-center justify-center w-full flex-grow"
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        <div className="relative">
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
              height={700}
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
            <PanoramaSlider 
              scrollValue={scrollValue} 
              setScrollValue={handleScrollValueChange} 
            />
          )}
        </div>
      </div>
      
      {/* Control Bar */}
      <ControlBar 
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onDownload={handleDownload}
        onToggleFullscreen={toggleFullscreen}
        onGoHome={goToHome}
        onToggleThumbnails={toggleThumbnails}
        isFullscreen={isFullscreen}
        showThumbnails={showThumbnails}
      />
      
      {/* Thumbnails Sidebar */}
      <Thumbnails 
        isOpen={showThumbnails}
        onClose={() => setShowThumbnails(false)}
        onPageSelect={goToPage}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Flipbook;