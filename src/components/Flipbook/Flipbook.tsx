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
// Import komponen baru untuk halaman multi-page
import { MultiPageLeftPage, MultiPageRightPage } from './MultiPagePages';
import { multiPageState } from './MultiPageState';
import MultiPageSlider from './MultiPageSlider'; // Import slider untuk multi-page
import Thumbnails from '../Thumbnails'; // Import the Thumbnails component
import './styles.css';

// Key for local storage
const THUMBNAILS_STATE_KEY = 'flipbook_thumbnails_state';

interface FlipbookProps {
  lang?: string; // Make the lang prop optional with a default value
}

const Flipbook: React.FC<FlipbookProps> = ({ lang = 'en' }) => {
  const totalPages = 162; // Total halaman yang sebenarnya
  const book = useRef<any>(null);
  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  // Tambahkan state untuk multi-page scroll value
  const [multiPageScrollValue, setMultiPageScrollValue] = useState(0);
  
  // For preventing thumbnails from flashing during language changes
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const previousLang = useRef(lang);
  
  // Initialize thumbnails state from localStorage or default to false
  const [showThumbnails, setShowThumbnails] = useState<boolean>(() => {
    // Only run in the client
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(THUMBNAILS_STATE_KEY);
      return savedState ? JSON.parse(savedState) === true : false;
    }
    return false;
  });
  
  // Untuk mengatasi error hydration, gunakan useState tanpa nilai awal
  const [viewportWidth, setViewportWidth] = useState<number>(0); 
  const [isClient, setIsClient] = useState(false);
  
  // Effect to detect language changes
  useEffect(() => {
    if (previousLang.current !== lang) {
      setIsLanguageChanging(true);
      
      // Reset after a short delay
      const timer = setTimeout(() => {
        setIsLanguageChanging(false);
        previousLang.current = lang;
      }, 500); // Delay to allow rendering to complete
      
      return () => clearTimeout(timer);
    }
  }, [lang]);
  
  // Save thumbnails state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THUMBNAILS_STATE_KEY, JSON.stringify(showThumbnails));
    }
  }, [showThumbnails]);
  
  // Effect untuk mendeteksi ukuran layar - hanya dijalankan di client
  useEffect(() => {
    // Set isClient ke true untuk menunjukkan kita sekarang di client-side
    setIsClient(true);
    
    // Set viewport width initial
    setViewportWidth(window.innerWidth);
    
    // Handler untuk resize
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Fungsi untuk menghitung dimensi flipbook berdasarkan viewport
  const getFlipbookDimensions = () => {
    // Default ukuran untuk desktop
    let width = 600;
    let height = 700;
    
    // Hanya berikan ukuran berbeda jika di client-side dan viewport sudah diketahui
    if (isClient && viewportWidth > 0) {
      // Untuk iPad Pro (1024px), ukuran sedikit berbeda dari tablet biasa
      if (viewportWidth === 1024) {
        width = 600 * 0.8; // Sedikit lebih kecil dari tablet biasa
        height = 700 * 0.8;
      }
      // Untuk tablet (768px - 1024px), ukuran 60% dari default
      else if (viewportWidth >= 768 && viewportWidth < 1024) {
        width = 600 * 0.6;
        height = 700 * 0.6;
      }
      // Untuk mobile (< 768px), ukuran lebih kecil lagi
      else if (viewportWidth < 768) {
        width = 600 * 0.45;
        height = 700 * 0.45;
      }
    }
    
    return { width, height };
  };
  
  // Dapatkan dimensi yang dihitung
  const { width: flipbookWidth, height: flipbookHeight } = getFlipbookDimensions();
  
  // Deteksi apakah ini halaman panorama atau multi-page
  const isPanorama = currentPage === 31 || currentPage === 32;
  const isMultiPage = currentPage === 33 || currentPage === 34; // Index 33-34 akan menjadi halaman 38-44

  // Check if current page is page 7 (file: page_Page_008.jpg)
  const isPage7Active = currentPage === 7;
  
  // Check if current page is page 10 (file: page_Page_011.jpg)
  const isPage10Active = currentPage === 11;

  // Toggle thumbnails sidebar
  const toggleThumbnails = useCallback(() => {
    // Only toggle thumbnails if we're not in the middle of a language change
    if (!isLanguageChanging) {
      setShowThumbnails(prev => !prev);
    }
  }, [isLanguageChanging]);

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
      // Multi-page pages (38-44)
      else if (pageNumber >= 38 && pageNumber <= 44) {
        targetIndex = 33;
        multiPageState.setScrollValue(0);
      }
      // Pages after multi-page (45+)
      else if (pageNumber >= 45) {
        // For pages after multi-page, we need to account for the 10 "missing" indices
        // (7 panorama pages + 6 multi-pages represented by only 4 indices total)
        targetIndex = pageNumber - 10;
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

  // Pada onPageChange, tambahkan reset untuk panorama dan multi-page, dan dispatch custom event
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
    
    // Reset multi-page state
    if (e.data !== 33 && e.data !== 34) {
      multiPageState.reset();
      setMultiPageScrollValue(0);
    } else if (e.data === 33 || e.data === 34) {
      // Selalu mulai dari kiri saat masuk ke halaman multi-page
      multiPageState.reset();
      setMultiPageScrollValue(0);
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

  // Sync scroll value dengan state multi-page
  useEffect(() => {
    if (isMultiPage) {
      setMultiPageScrollValue(multiPageState.scrollValue);
    }
  }, [isMultiPage]);
  
  // Ketika masuk ke halaman multi-page, pastikan selalu mulai dari kiri
  useEffect(() => {
    if (isMultiPage) {
      // Tunda sedikit untuk memastikan render selesai
      setTimeout(() => {
        multiPageState.reset();
        setMultiPageScrollValue(0);
      }, 50);
    }
  }, [isMultiPage]);
  
  // Register callback dari multiPageState
  useEffect(() => {
    const unregister = multiPageState.registerCallback((value) => {
      setMultiPageScrollValue(value);
    });
    
    return unregister;
  }, []);

  // Handler untuk update scroll value
  const handleScrollValueChange = useCallback((value: number) => {
    setScrollValue(value);
  }, []);

  // Handler untuk update multi-page scroll value
  const handleMultiPageScrollValueChange = useCallback((value: number) => {
    setMultiPageScrollValue(value);
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
        } else if (isMultiPage) {
          multiPageState.scrollLeft();
        } else {
          prevPage();
        }
      } else if (e.key === 'ArrowRight') {
        if (isPanorama) {
          panoramaState.scrollRight();
        } else if (isMultiPage) {
          multiPageState.scrollRight();
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
  }, [prevPage, nextPage, handleZoomIn, handleZoomOut, toggleFullscreen, isPanorama, isMultiPage, goToHome, toggleThumbnails, showThumbnails]);

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
            lang={lang}
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
    
    // Tambahkan halaman multi-page (halaman 38-44)
    pages.push(
      <div key="multi-page-left" className="page">
        <MultiPageLeftPage scrollValue={multiPageScrollValue} lang={lang} />
      </div>
    );
    
    pages.push(
      <div key="multi-page-right" className="page">
        <MultiPageRightPage lang={lang} />
      </div>
    );
    
    // Halaman 45-163 (halaman 45-162 dalam penomoran)
    // Perhatikan perubahan indeks: halaman setelah multi-page (44) harus dimulai dari 46
    for (let i = 46; i <= 163; i++) {
      pages.push(
        <div key={`regular-${i}`} className="page">
          <Page pageNumber={i} lang={lang} />
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
    
    // Untuk halaman multi-page (halaman 38-44, indeks 33-34)
    if (currentPage === 33 || currentPage === 34) {
      return "38-44";
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
    
    // Untuk halaman setelah multi-page (indeks 35+ = halaman 45+)
    if (currentPage >= 35) {
      // Hitung nomor halaman yang sebenarnya
      // Karena indeks 35 = halaman 45 (kita "menghilangkan" 10 indeks: 
      // 5 dari panorama + 5 dari multi-page)
      const actualPage = currentPage + 10; 
      
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

  // Gunakan CSS classes alih-alih style inline untuk responsive styling
  // Ini lebih aman untuk hydration
  const mainContentClasses = `relative flex flex-col items-center justify-center w-full flex-grow ${
    isClient && viewportWidth < 1024 ? 'pt-2 px-2 pb-2' : ''
  }`;

  // Gunakan className tambahan alih-alih style inline untuk tablet scaling
  const bookContainerClasses = `relative book-container ${
    isClient && viewportWidth >= 768 && viewportWidth < 1024 ? 'tablet-scale' : ''
  }`;

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
        className={mainContentClasses}
        style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
      >
        <div className="relative">
          <NavigationButtons 
            currentPage={currentPage}
            totalPages={renderPages().length}
            isPanorama={isPanorama || isMultiPage}
            onPrev={prevPage}
            onNext={nextPage}
          />
          
          {/* Kontainer buku */}
          <div className={bookContainerClasses}>
            <HTMLFlipBook
              width={flipbookWidth}
              height={flipbookHeight}
              size="fixed"
              minWidth={Math.max(350, flipbookWidth * 0.8)}
              maxWidth={Math.max(1000, flipbookWidth * 1.2)}
              minHeight={Math.max(468, flipbookHeight * 0.8)}
              maxHeight={Math.max(1333, flipbookHeight * 1.2)}
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
                <Cover lang={lang} />
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
              lang={lang}
            />
          )}
          
          {/* Slider untuk multi-page - hanya muncul di halaman multi-page */}
          {isMultiPage && (
            <MultiPageSlider
              scrollValue={multiPageScrollValue}
              setScrollValue={handleMultiPageScrollValueChange}
              lang={lang}
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
      
      {/* Thumbnails Sidebar - Only render if not in language transition */}
      {!isLanguageChanging && (
        <Thumbnails 
          isOpen={showThumbnails}
          onClose={() => setShowThumbnails(false)}
          onPageSelect={goToPage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default Flipbook;
