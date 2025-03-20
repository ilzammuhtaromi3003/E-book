"use client";

// components/Flipbook/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getTranslation } from '@/utils/translations';

interface NavbarProps {
  pageDisplay: string;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ pageDisplay, totalPages, onGoToPage }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, [pathname]);
  
  // Language switching function
  const switchLanguage = (lang: string) => {
    // Get the path after the language prefix
    let remainingPath = pathname;
    const langs = ['/en', '/id', '/jp'];
    
    for (const l of langs) {
      if (pathname.startsWith(l)) {
        remainingPath = pathname.substring(l.length) || '/';
        break;
      }
    }
    
    // Navigate to the new language path
    router.push(`/${lang}${remainingPath === '/' ? '' : remainingPath}`);
  };
  
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

  // Language button style
  const langButtonStyle = (lang: string) => ({
    padding: '0.35rem 0.6rem',
    borderRadius: '0.25rem',
    fontSize: '0.85rem',
    fontWeight: currentLanguage === lang ? '600' : '400',
    backgroundColor: currentLanguage === lang ? '#4A90E2' : 'transparent',
    color: currentLanguage === lang ? 'white' : '#4A90E2',
    border: currentLanguage === lang ? 'none' : '1px solid #4A90E2',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });
  
  return (
    <div className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center">
      {/* Logo di kiri */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-18 w-auto mr-2" />
      </div>
      
      {/* Informasi di tengah */}
      <div className="flex items-center">
        <div className="text-gray-800 font-medium mr-4">
          {bookTitleText}
        </div>
        
        <div className="flex items-center border rounded px-2 py-1">
          <span className="mr-2">{pageText}</span>
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-24 px-2 py-1 text-center border-none focus:outline-none"
              autoFocus
            />
          ) : (
            <span 
              onClick={handleDisplayClick} 
              className="w-24 px-2 py-1 text-center cursor-text"
            >
              {inputValue}
            </span>
          )}
          <span className="ml-2">/ {totalPages}</span>
        </div>
      </div>
      
      {/* Language buttons at right side */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => switchLanguage('en')}
          style={langButtonStyle('en')}
        >
          EN
        </button>
        <button 
          onClick={() => switchLanguage('id')}
          style={langButtonStyle('id')}
        >
          ID
        </button>
        <button 
          onClick={() => switchLanguage('jp')}
          style={langButtonStyle('jp')}
        >
          JP
        </button>
      </div>
    </div>
  );
};

export default Navbar;