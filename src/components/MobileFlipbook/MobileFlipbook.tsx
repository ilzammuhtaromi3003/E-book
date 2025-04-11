"use client";

// components/MobileFlipbook/MobileFlipbook.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from '../Flipbook/Navbar';
import Thumbnails from '../Thumbnails';
import TableOfContents from '../TableOfContents'; // Import komponen TableOfContents
import VideoButton from '../VideoButton';
import MobileVideo from '../MobileVideo'; // Import komponen MobileVideo yang sudah diperbaiki
import { FiZoomIn, FiZoomOut, FiMaximize2, FiMinimize2, FiArrowUp, FiGrid, FiDownload, FiBook } from 'react-icons/fi';
import { getTranslation } from '@/utils/translations';
import { usePathname } from 'next/navigation';
import './mobile-styles.css';

// Keys for localStorage
const THUMBNAILS_STATE_KEY = 'mobile_flipbook_thumbnails_state';
const TOC_STATE_KEY = 'mobile_flipbook_toc_state';

interface MobileFlipbookProps {
  lang?: string;
}

const MobileFlipbook: React.FC<MobileFlipbookProps> = ({ lang = 'en' }) => {
  const totalPages = 162;
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();
  
  // For preventing UI components from flashing during language changes
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const previousLang = useRef(lang);
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  
  // Initialize thumbnails state from localStorage
  const [showThumbnails, setShowThumbnails] = useState<boolean>(() => {
    // Only run in the client
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(THUMBNAILS_STATE_KEY);
      return savedState ? JSON.parse(savedState) === true : false;
    }
    return false;
  });
  
  // Initialize table of contents state from localStorage
  const [showTableOfContents, setShowTableOfContents] = useState<boolean>(() => {
    // Only run in the client
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(TOC_STATE_KEY);
      return savedState ? JSON.parse(savedState) === true : false;
    }
    return false;
  });
  
  const [currentPage, setCurrentPage] = useState(0); // Track active page for UI
  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Update language when pathname changes
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, [pathname]);
  
  // Effect to detect language changes
  useEffect(() => {
    if (previousLang.current !== currentLanguage) {
      setIsLanguageChanging(true);
      
      // Reset sidebars when language changes to prevent UI bugs
      setShowThumbnails(false);
      setShowTableOfContents(false);
      
      // Reset after a short delay
      const timer = setTimeout(() => {
        setIsLanguageChanging(false);
        previousLang.current = currentLanguage;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentLanguage]);
  
  // Save thumbnails state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THUMBNAILS_STATE_KEY, JSON.stringify(showThumbnails));
    }
  }, [showThumbnails]);
  
  // Save table of contents state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOC_STATE_KEY, JSON.stringify(showTableOfContents));
    }
  }, [showTableOfContents]);
  
  // Effect to handle UI synchronization after page refresh
  useEffect(() => {
    // Sinkronisasi state sidebar saat remount (refresh)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Jika sidebar localStorage true tetapi sidebar tidak terlihat
        // (yang mungkin terjadi karena refresh), reset state
        const thumbnailState = localStorage.getItem(THUMBNAILS_STATE_KEY);
        const tocState = localStorage.getItem(TOC_STATE_KEY);
        
        // Hanya update jika ada ketidaksesuaian
        if (thumbnailState === 'true' && !document.querySelector('.sidebar-open')) {
          setShowThumbnails(false);
          localStorage.setItem(THUMBNAILS_STATE_KEY, 'false');
        }
        
        if (tocState === 'true' && !document.querySelector('.sidebar-open')) {
          setShowTableOfContents(false);
          localStorage.setItem(TOC_STATE_KEY, 'false');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Jalankan sekali saat mounting untuk refresh case
    handleVisibilityChange();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
  
  // Fullscreen handler
  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        if (flipbookContainerRef.current?.requestFullscreen) {
          flipbookContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);
  
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
  
  // Toggle thumbnails
  const toggleThumbnails = useCallback(() => {
    // Close table of contents if opening thumbnails
    if (!showThumbnails && showTableOfContents) {
      setShowTableOfContents(false);
    }
    
    // Fix mismatch issue: if sidebar is visually closed but state is true,
    // set it to false first and then toggle on next click
    const sidebarElement = document.querySelector('.sidebar-open');
    if (showThumbnails && !sidebarElement) {
      setShowThumbnails(false);
      return;
    }
    
    // Only toggle if we're not in the middle of a language change
    if (!isLanguageChanging) {
      setShowThumbnails(prev => !prev);
    }
  }, [isLanguageChanging, showThumbnails, showTableOfContents]);
  
  // Toggle table of contents
  const toggleTableOfContents = useCallback(() => {
    // Close thumbnails if opening table of contents
    if (!showTableOfContents && showThumbnails) {
      setShowThumbnails(false);
    }
    
    // Fix mismatch issue: if sidebar is visually closed but state is true,
    // set it to false first and then toggle on next click
    const sidebarElement = document.querySelector('.sidebar-open');
    if (showTableOfContents && !sidebarElement) {
      setShowTableOfContents(false);
      return;
    }
    
    // Only toggle if we're not in the middle of a language change
    if (!isLanguageChanging) {
      setShowTableOfContents(prev => !prev);
    }
  }, [isLanguageChanging, showTableOfContents, showThumbnails]);
  
  // Scroll to top
  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setCurrentPage(0); // Set to cover page
  }, []);
  
  // Go to specific page through scrolling
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    
    // Find the page element by creating an ID reference
    const pageElement = document.getElementById(`page-${page}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (page === 0) { // Cover page
      scrollToTop();
    } else if (page >= 31 && page <= 37) { // Panorama
      const panoramaElement = document.getElementById('panorama-page');
      if (panoramaElement) {
        panoramaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Don't close sidebars after navigation - keep them open for better UX
  }, [scrollToTop]);
  
  // Handler untuk mendeteksi scroll dan menampilkan tombol back-to-top
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowBackToTop(contentRef.current.scrollTop > 300);
        
        // Update current page based on scroll position
        const scrollTop = contentRef.current.scrollTop;
        const viewportHeight = contentRef.current.clientHeight;
        const pages = document.querySelectorAll('.mobile-page-item, .mobile-panorama-item');
        
        // Find the page that is most visible in the viewport
        let mostVisiblePage = 0;
        let maxVisibleArea = 0;
        
        pages.forEach((page, index) => {
          const rect = page.getBoundingClientRect();
          const pageTop = rect.top;
          const pageBottom = rect.bottom;
          const viewportTop = contentRef.current!.getBoundingClientRect().top;
          const viewportBottom = viewportTop + viewportHeight;
          
          // Calculate visible area
          const visibleTop = Math.max(pageTop, viewportTop);
          const visibleBottom = Math.min(pageBottom, viewportBottom);
          const visibleArea = Math.max(0, visibleBottom - visibleTop);
          
          if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            mostVisiblePage = index;
          }
        });
        
        // Update current page if needed
        if (mostVisiblePage > 0) {
          setCurrentPage(mostVisiblePage - 1); // -1 because index 0 is cover
        } else {
          setCurrentPage(0);
        }
      }
    };
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Home') {
        scrollToTop();
      } else if (e.key === 't' || e.key === 'T') {
        toggleThumbnails();
      } else if (e.key === 'c' || e.key === 'C') {
        toggleTableOfContents();
      } else if (e.key === 'Escape') {
        if (showThumbnails) {
          setShowThumbnails(false);
        }
        if (showTableOfContents) {
          setShowTableOfContents(false);
        }
      }
    };
    
    // Mendeteksi perubahan status fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleZoomIn, handleZoomOut, toggleFullscreen, scrollToTop, toggleThumbnails, toggleTableOfContents, showThumbnails, showTableOfContents]);
  
  // Fungsi untuk mendapatkan path file gambar yang benar
  const getImagePath = (pageNumber: number) => {
    // Cover - halaman 1
    if (pageNumber === 1) {
      return "/tinggi/page_Page_001.jpg";
    }
    
    // Halaman 2-31 (termasuk halaman 30 = page_Page_031.jpg)
    if (pageNumber >= 2 && pageNumber <= 31) {
      return `/tinggi/page_Page_${String(pageNumber).padStart(3, "0")}.jpg`;
    }
    
    // Panorama halaman 31-37 menggunakan file page_Page_032-038.jpg
    if (pageNumber >= 32 && pageNumber <= 38) {
      return "/tinggi/page_Page_032-038.jpg";
    }
    
    // Halaman setelah panorama (38+) 
    if (pageNumber >= 39) {
      return `/tinggi/page_Page_${String(pageNumber).padStart(3, "0")}.jpg`;
    }
    
    // Default fallback
    return `/tinggi/page_Page_${String(pageNumber).padStart(3, "0")}.jpg`;
  };
  
  // Render semua halaman
  const renderAllPages = () => {
    const pages = [];
    
    // Get translated text for cover
    const coverText = getTranslation('cover', currentLanguage);
    
    // Cover page
    pages.push(
      <div key="cover" id="page-0" className="mobile-page-item">
        <img
          src="/tinggi/page_Page_001.jpg"
          alt={coverText}
          className="mobile-page-image"
        />
      </div>
    );
    
    // Regular pages 1-30
    for (let i = 1; i <= 30; i++) {
      // Menentukan nomor file gambar yang benar
      // Untuk halaman 30 (i=30), kita perlu ambil page_Page_031.jpg
      const fileNumber = i + 1; // Page 1 = file 002, Page 30 = file 031
      
      // Get page label translation
      const pageText = getTranslation('pageLabel', currentLanguage).replace(':', '');
      
      pages.push(
        <div key={`page-${i}`} id={`page-${i}`} className="mobile-page-item">
          <div className="mobile-page-number">{pageText} {i}</div>
          <img
            src={`/tinggi/page_Page_${String(fileNumber).padStart(3, "0")}.jpg`}
            alt={`${pageText} ${i}`}
            className="mobile-page-image"
            loading="lazy"
          />
          
          {/* GIF pada halaman 5 (page_Page_006.jpg) */}
          {i === 5 && (
            <div className="mobile-media-overlay">
              <img
                src="/orang-1.gif"
                alt="Orang GIF"
                className="mobile-gif"
                style={{
                  position: 'absolute',
                  top: '16.8%',
                  left: '10.5%',
                  width: '70px',
                  height: 'auto',
                  zIndex: 10,
                }}
              />
            </div>
          )}
          
          {/* Video pada halaman 7 - UPDATED menggunakan komponen yang disederhanakan */}
          {i === 7 && (
            <MobileVideo
              videoSrc="/video3.mp4"
              posterSrc="/video-thumbnails/video3.jpg"
              autoplay={true}
              position={{ top: '20%', left: '25%' }}
              dimensions={{ width: '50%', height: 'auto' }}
            />
          )}
          
          {/* Video pada halaman 10 - Menggunakan komponen video yang disederhanakan */}
          {i === 10 && (
            <MobileVideo
              videoSrc="/video2.mp4"
              posterSrc="/video-thumbnails/video2.jpg"
              autoplay={false}
              position={{ top: '20%', left: '25%' }}
              dimensions={{ width: '50%', height: 'auto' }}
            />
          )}
        </div>
      );
    }
    
    // Get panorama translation
    const panoramaText = getTranslation('panorama', currentLanguage);
    const panoramaLabelText = getTranslation('panoramaPages', currentLanguage);
    
    // Panorama page - bentuk lebar khusus dengan tinggi yang sama dengan halaman lain
    pages.push(
      <div key="panorama" id="panorama-page" className="mobile-panorama-item">
        <div className="mobile-page-number mobile-panorama-label">{panoramaLabelText}</div>
        <div className="mobile-panorama-container">
          <img
            src="/tinggi/page_Page_032-038.jpg"
            alt={`${panoramaText} 31-37`}
            className="mobile-panorama-image"
            loading="lazy"
          />
          
          {/* Video Button untuk panorama */}
          <div className="mobile-media-overlay panorama-video-button">
            <VideoButton 
              videoSrc="/video1.mp4" 
              position={{ top: '20%', left: '30%' }}
            />
          </div>
        </div>
      </div>
    );
    
    // Get page label translation
    const pageText = getTranslation('pageLabel', currentLanguage).replace(':', '');
    
    // Pages after panorama (38-162)
    for (let i = 38; i <= 162; i++) {
      pages.push(
        <div key={`page-${i}`} id={`page-${i}`} className="mobile-page-item">
          <div className="mobile-page-number">{pageText} {i}</div>
          <img
            src={`/tinggi/page_Page_${String(i + 1).padStart(3, "0")}.jpg`}
            alt={`${pageText} ${i}`}
            className="mobile-page-image"
            loading="lazy"
          />
        </div>
      );
    }
    
    return pages;
  };
  
  return (
    <div 
      ref={flipbookContainerRef}
      className={`mobile-flipbook-container scrollable ${isFullscreen ? 'mobile-fullscreen' : ''}`}
    >
      {/* Navbar - untuk display halaman dan navigasi */}
      <Navbar 
        pageDisplay={currentPage === 0 ? getTranslation('cover', currentLanguage) : currentPage.toString()} 
        totalPages={totalPages}
        onGoToPage={goToPage}
      />
      
      {/* Scrollable Content */}
      <div 
        ref={contentRef}
        className="mobile-scrollable-content"
        style={{ 
          transformOrigin: 'center top',
          transform: `scale(${zoom})` 
        }}
      >
        {/* Header info - translated */}
        <div className="mobile-content-header">
          <h2>{getTranslation('scrollMode', currentLanguage)}</h2>
          <p>{getTranslation('scrollInstruction', currentLanguage)}</p>
        </div>
        
        {/* All pages rendered vertically */}
        <div className="mobile-pages-container">
          {renderAllPages()}
        </div>
      </div>
      
      {/* Floating controls with translated tooltips */}
      <div className="mobile-floating-controls">
        <button 
          className="mobile-floating-button" 
          onClick={handleZoomOut} 
          title={getTranslation('zoomOut', currentLanguage)}
        >
          <FiZoomOut size={20} />
        </button>
        <div className="mobile-zoom-indicator">{Math.round(zoom * 100)}%</div>
        <button 
          className="mobile-floating-button" 
          onClick={handleZoomIn} 
          title={getTranslation('zoomIn', currentLanguage)}
        >
          <FiZoomIn size={20} />
        </button>
        {/* Download button */}
        <button 
          className="mobile-floating-button" 
          onClick={handleDownload} 
          title={getTranslation('download', currentLanguage)}
        >
          <FiDownload size={20} />
        </button>
        <button 
          className="mobile-floating-button" 
          onClick={toggleFullscreen} 
          title={isFullscreen ? getTranslation('exitFullscreen', currentLanguage) : getTranslation('fullscreen', currentLanguage)}
        >
          {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
        </button>
        {/* Table of Contents button - NEW */}
        <button 
          className={`mobile-floating-button ${showTableOfContents ? 'active' : ''}`} 
          onClick={toggleTableOfContents}
          title={getTranslation('tableOfContents', currentLanguage)}
        >
          <FiBook size={20} />
        </button>
        <button 
          className={`mobile-floating-button ${showThumbnails ? 'active' : ''}`} 
          onClick={toggleThumbnails}
          title={getTranslation('thumbnails', currentLanguage)}
        >
          <FiGrid size={20} />
        </button>
      </div>
      
      {/* Back to top button */}
      {showBackToTop && (
        <button 
          className="mobile-back-to-top"
          onClick={scrollToTop}
          title={getTranslation('home', currentLanguage)}
        >
          <FiArrowUp size={24} />
        </button>
      )}
      
      {/* Thumbnails - Only render if not in language transition */}
      {!isLanguageChanging && (
        <Thumbnails 
          isOpen={showThumbnails}
          onClose={() => setShowThumbnails(false)}
          onPageSelect={goToPage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
      
      {/* Table of Contents - NEW */}
      {!isLanguageChanging && (
        <TableOfContents
          isOpen={showTableOfContents}
          onClose={() => setShowTableOfContents(false)}
          onPageSelect={goToPage}
        />
      )}
    </div>
  );
};

export default MobileFlipbook;