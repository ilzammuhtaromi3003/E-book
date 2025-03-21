"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/utils/translations';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavbarProps {
  pageDisplay: string;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ pageDisplay, totalPages, onGoToPage }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const pathname = usePathname();
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  
  // Effect untuk mendeteksi lebar layar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    // Tambahkan event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, [pathname]);
  
  // Format halaman untuk menampilkan halaman berpasangan
  const formatPageDisplay = (pageDisplay: string): string => {
    // Jika pageDisplay adalah "Cover" atau berisi "Panorama", kembalikan tanpa perubahan
    if (pageDisplay === "Cover" || pageDisplay.includes("-")) {
      return pageDisplay;
    }
    
    // Konversi ke nomor
    const pageNum = parseInt(pageDisplay);
    
    // Jika bukan angka yang valid, kembalikan tanpa perubahan
    if (isNaN(pageNum)) {
      return pageDisplay;
    }
    
    // Halaman 1,3,5,... (ganjil) pasangannya dengan halaman berikutnya
    if (pageNum % 2 === 1) {
      // Pastikan halaman berikutnya tidak melebihi total halaman
      if (pageNum + 1 <= totalPages) {
        return `${pageNum}-${pageNum + 1}`;
      }
      return `${pageNum}`;
    }
    
    // Halaman 2,4,6,... (genap) pasangannya dengan halaman sebelumnya
    return `${pageNum - 1}-${pageNum}`;
  };
  
  // Update input value when pageDisplay changes
  useEffect(() => {
    if (!isEditing) {
      // Format ulang pageDisplay untuk menampilkan halaman berpasangan
      const formattedDisplay = formatPageDisplay(pageDisplay);
      setInputValue(formattedDisplay);
    }
  }, [pageDisplay, isEditing, totalPages]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle input blur (when user clicks outside)
  const handleInputBlur = () => {
    handlePageSubmit();
    setIsEditing(false);
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageSubmit();
      setIsEditing(false);
    }
  };
  
  // Handle page submission
  const handlePageSubmit = () => {
    // Periksa jika input adalah rentang halaman (misalnya "23-24")
    const rangeMatch = inputValue.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      // Jika range, gunakan halaman pertama dari range
      const firstPage = parseInt(rangeMatch[1]);
      if (!isNaN(firstPage) && firstPage >= 1 && firstPage <= totalPages) {
        onGoToPage(firstPage);
        return;
      }
    }
    
    // Jika bukan range atau range tidak valid, coba parsing sebagai angka tunggal
    const pageNumber = parseInt(inputValue);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onGoToPage(pageNumber);
    } else {
      // Reset to current page if invalid input
      setInputValue(formatPageDisplay(pageDisplay));
    }
  };
  
  // Handle clicking on page number display
  const handleDisplayClick = () => {
    setIsEditing(true);
  };

  // Gunakan fungsi getTranslation untuk teks berdasarkan bahasa
  const bookTitleText = getTranslation('bookTitle', currentLanguage);
  const pageText = getTranslation('pageLabel', currentLanguage);
  
  // Tentukan tampilan berdasarkan lebar layar
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  // Adjusted logo size based on screen size
  const logoHeight = isMobile ? 'h-16' : isTablet ? 'h-14' : 'h-20';
  
  // Adjust title font size for tablet
  const titleFontSize = isTablet ? 'text-sm' : 'text-base';
  
  // Adjust page navigator size for tablet
  const pageNavWidth = isTablet ? 'w-20' : 'w-24';
  
  return (
    <div className={`w-full bg-white shadow-md px-4 ${isTablet ? 'py-1' : 'py-2'} flex justify-between items-center`}>
      {/* Logo di kiri - ukuran disesuaikan untuk tablet */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className={`${logoHeight} w-auto mr-2`} />
      </div>
      
      {/* Informasi di tengah - tampilan berbeda untuk desktop, tablet, dan mobile */}
      {!isMobile && (
        <div className={`flex items-center ${isTablet ? 'flex-col space-y-1' : 'flex-row'} flex-grow justify-center`}>
          {/* Title - diperkecil untuk tablet */}
          <div className={`text-gray-800 font-medium ${isTablet ? 'mb-1 text-xs' : 'mr-4 text-base'} text-center max-w-sm truncate`}>
            {bookTitleText}
          </div>
          
          {/* Page navigation dengan ukuran yang disesuaikan */}
          <div className={`flex items-center border rounded ${isTablet ? 'px-1 py-0.5' : 'px-2 py-1'}`}>
            <span className={`${isTablet ? 'text-xs mr-1' : 'mr-2'}`}>{pageText}</span>
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className={`${pageNavWidth} ${isTablet ? 'px-1 py-0.5 text-sm' : 'px-2 py-1'} text-center border-none focus:outline-none`}
                autoFocus
              />
            ) : (
              <span 
                onClick={handleDisplayClick} 
                className={`${pageNavWidth} ${isTablet ? 'px-1 py-0.5 text-sm' : 'px-2 py-1'} text-center cursor-text`}
              >
                {inputValue}
              </span>
            )}
            <span className={`${isTablet ? 'text-xs ml-1' : 'ml-2'}`}>/ {totalPages}</span>
          </div>
        </div>
      )}
      
      {/* Untuk mobile, hanya tampilkan judul buku */}
      {isMobile && (
        <div className="flex-grow text-center">
          <div className="text-gray-800 font-medium text-sm">
            {bookTitleText}
          </div>
        </div>
      )}
      
      {/* Language switcher di kanan - ukuran disesuaikan untuk tablet */}
      <div className="flex-shrink-0">
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Navbar;