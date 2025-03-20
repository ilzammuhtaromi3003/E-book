"use client";

// components/ResponsiveFlipbookWrapper.tsx
import React, { useState, useEffect } from 'react';
import Flipbook from './Flipbook/Flipbook';
import MobileFlipbook from './MobileFlipbook/MobileFlipbook';

interface ResponsiveFlipbookWrapperProps {
  lang?: string;
}

const ResponsiveFlipbookWrapper: React.FC<ResponsiveFlipbookWrapperProps> = ({ lang = 'en' }) => {
  // State untuk menyimpan apakah ini mobile view
  const [isMobileView, setIsMobileView] = useState(false);
  // State untuk mendeteksi apakah ini browser (client-side)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient ke true untuk menunjukkan kita sekarang di client-side
    setIsClient(true);
    
    // Fungsi untuk mendeteksi apakah tampilan mobile
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Check awal
    checkIfMobile();
    
    // Tambahkan event listener untuk resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Jika belum di client-side, tampilkan placeholder kosong untuk menghindari error hydration
  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Tampilkan Flipbook yang sesuai berdasarkan ukuran layar
  return isMobileView ? (
    <MobileFlipbook lang={lang} />
  ) : (
    <Flipbook lang={lang} />
  );
};

export default ResponsiveFlipbookWrapper;