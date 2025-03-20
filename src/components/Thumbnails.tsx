"use client";

import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ThumbnailsProps {
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (pageNumber: number) => void;
  totalPages: number;
  currentPage: number;
}

const Thumbnails: React.FC<ThumbnailsProps> = ({
  isOpen,
  onClose,
  onPageSelect,
  totalPages,
  currentPage
}) => {
  const [animation, setAnimation] = useState<string>("sidebar-closed");
  
  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setAnimation("sidebar-opening");
      
      const timeout = setTimeout(() => {
        setAnimation("sidebar-open");
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      setAnimation("sidebar-closing");
      
      const timeout = setTimeout(() => {
        setAnimation("sidebar-closed");
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  // PENTING: Fungsi untuk mendapatkan path file gambar yang benar
  const getImagePath = (pageNumber: number) => {
    // Cover - halaman 1
    if (pageNumber === 1) {
      return "/tinggi/page_Page_001.jpg";
    }
    
    // Halaman 2-30 menggunakan file page_Page_002.jpg sampai page_Page_031.jpg
    if (pageNumber >= 2 && pageNumber <= 30) {
      return `/tinggi/page_Page_${String(pageNumber).padStart(3, "0")}.jpg`;
    }
    
    // Panorama halaman 31-37 menggunakan file page_Page_032-038.jpg
    if (pageNumber >= 31 && pageNumber <= 37) {
      return "/tinggi/page_Page_032-038.jpg";
    }
    
    // Halaman setelah panorama (38+) 
    // File gambar: page_Page_039.jpg untuk halaman 38, 
    // page_Page_040.jpg untuk halaman 39, dst
    if (pageNumber >= 38) {
      const fileNumber = pageNumber + 1;
      return `/tinggi/page_Page_${String(fileNumber).padStart(3, "0")}.jpg`;
    }
    
    // Default fallback
    return `/tinggi/page_Page_${String(pageNumber).padStart(3, "0")}.jpg`;
  };
  
  // Fungsi untuk navigasi halaman saat thumbnail diklik
  const handleThumbnailClick = (pageNumber: number) => {
    console.log(`Thumbnail clicked: Page ${pageNumber}`);
    
    // Send the actual page number directly (no processing needed, handled by goToPage)
    onPageSelect(pageNumber);
  };

  // Don't render anything if sidebar is completely closed
  if (animation === "sidebar-closed") return null;

  // Render Cover
  const renderCover = () => (
    <div className="w-full mb-3 flex justify-center">
      <div className="w-[calc(50%-6px)] cursor-pointer thumbnail-item">
        <div 
          className="thumbnail-image-container"
          onClick={() => handleThumbnailClick(0)} // Pass 0 for Cover
        >
          <img
            src={getImagePath(1)}
            alt="Cover"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="text-center py-1 text-xs text-gray-600">Cover</div>
      </div>
    </div>
  );

  // Render Panorama
  const renderPanorama = () => (
    <div className="w-full mb-3 flex justify-center">
      <div className="w-[calc(50%-6px)] cursor-pointer thumbnail-item">
        <div 
          className="thumbnail-image-container"
          onClick={() => handleThumbnailClick(31)} // Klik pada panorama akan ke halaman 31
        >
          <img
            src={getImagePath(31)}
            alt="Panorama 31-37"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="text-center py-1 text-xs text-gray-600">Panorama 31-37</div>
      </div>
    </div>
  );
  
  // Render halaman berpasangan (sebelum panorama)
  const renderPagePairs = () => {
    const pairs = [];
    
    // Render halaman 2-29 (berpasangan)
    for (let i = 2; i <= 28; i += 2) {
      const leftPage = i;
      const rightPage = leftPage + 1;
      
      pairs.push(
        <div key={`pair-${leftPage}`} className="w-full mb-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Halaman kiri */}
            <div 
              className="cursor-pointer thumbnail-item"
              onClick={() => handleThumbnailClick(leftPage - 1)}
            >
              <div className="thumbnail-image-container">
                <img
                  src={getImagePath(leftPage)}
                  alt={`Page ${leftPage-1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Halaman kanan */}
            <div 
              className="cursor-pointer thumbnail-item"
              onClick={() => handleThumbnailClick(rightPage - 1)}
            >
              <div className="thumbnail-image-container">
                <img
                  src={getImagePath(rightPage)}
                  alt={`Page ${rightPage-1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Label untuk pasangan halaman */}
            <div className="col-span-2 text-center py-1 text-xs text-gray-600">
              {`${leftPage-1}-${rightPage-1}`}
            </div>
          </div>
        </div>
      );
    }
    
    // Khusus untuk halaman 29-30 (pasangan terakhir sebelum panorama)
    pairs.push(
      <div key="pair-29-30" className="w-full mb-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Halaman 29 */}
          <div 
            className="cursor-pointer thumbnail-item"
            onClick={() => handleThumbnailClick(29)} // FIXED: Use 29 directly
          >
            <div className="thumbnail-image-container">
              <img
                src={getImagePath(29)}
                alt="Page 28"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Halaman 30 */}
          <div 
            className="cursor-pointer thumbnail-item"
            onClick={() => handleThumbnailClick(30)}
          >
            <div className="thumbnail-image-container">
              <img
                src={getImagePath(30)}
                alt="Page 29"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Label */}
          <div className="col-span-2 text-center py-1 text-xs text-gray-600">
            29-30
          </div>
        </div>
      </div>
    );
    
    return pairs;
  };
  
  // Render halaman setelah panorama (38+)
  const renderAfterPanorama = () => {
    const pairs = [];
    
    // Mulai dari halaman 38, berpasangan setiap 2 halaman
    for (let i = 38; i <= totalPages; i += 2) {
      const leftPage = i;
      const rightPage = i + 1 <= totalPages ? i + 1 : null;
      
      pairs.push(
        <div key={`pair-${leftPage}`} className="w-full mb-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Halaman kiri */}
            <div 
              className="cursor-pointer thumbnail-item"
              onClick={() => handleThumbnailClick(leftPage)}
            >
              <div className="thumbnail-image-container">
                <img
                  src={getImagePath(leftPage)}
                  alt={`Page ${leftPage}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Halaman kanan - jika ada */}
            {rightPage !== null ? (
              <div 
                className="cursor-pointer thumbnail-item"
                onClick={() => handleThumbnailClick(rightPage)}
              >
                <div className="thumbnail-image-container">
                  <img
                    src={getImagePath(rightPage)}
                    alt={`Page ${rightPage}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div className="thumbnail-item-empty"></div>
            )}
            
            {/* PERBAIKAN: Label menampilkan nomor halaman yang benar */}
            <div className="col-span-2 text-center py-1 text-xs text-gray-600">
              {rightPage !== null ? `${leftPage}-${rightPage}` : `${leftPage}`}
            </div>
          </div>
        </div>
      );
    }
    
    return pairs;
  };
  
  return (
    <div 
      className={`fixed left-0 bottom-0 h-[calc(100vh-64px)] bg-white shadow-lg z-50 flex flex-col ${animation}`}
      style={{ 
        width: '320px',
        top: '64px',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5">
        <h2 className="text-base font-medium text-gray-800">Thumbnails</h2>
        <button 
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close thumbnails"
        >
          <IoMdClose size={18} />
        </button>
      </div>
      
      {/* Thumbnails container */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="flex flex-col">
          {/* Cover */}
          {renderCover()}
          
          {/* Halaman 2-30 */}
          {renderPagePairs()}
          
          {/* Panorama 31-37 */}
          {renderPanorama()}
          
          {/* Halaman 38+ */}
          {renderAfterPanorama()}
        </div>
      </div>
    </div>
  );
};

export default Thumbnails;