"use client";

// components/Flipbook/MultiPagePages.tsx
import React, { useEffect } from 'react';
import { multiPageState } from './MultiPageState';

interface MultiPageProps {
  scrollValue: number;
  lang?: string;
}

// Komponen untuk halaman kiri yang berisi halaman 38-43
export const MultiPageLeftPage: React.FC<MultiPageProps> = ({ 
  scrollValue,
  lang = 'en'
}) => {
  // Array gambar yang akan ditampilkan
  const images = [
    "/tinggi/page_Page_039.jpg",
    "/tinggi/page_Page_040.jpg", 
    "/tinggi/page_Page_041.jpg",
    "/tinggi/page_Page_042.jpg",
    "/tinggi/page_Page_043.jpg",
    "/tinggi/page_Page_044.jpg"
  ];

  // Event handler untuk mencegah event bubbling yang bisa menyebabkan flip
  const preventEventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Efek untuk mengatur event handler pada elemen parent untuk mencegah page flip
  useEffect(() => {
    const pageElement = document.querySelector('.page:nth-child(34)'); // Halaman multi-page left
    
    if (pageElement) {
      const preventFlip = (e: Event) => {
        e.stopPropagation();
      };
      
      pageElement.addEventListener('mousedown', preventFlip, true);
      pageElement.addEventListener('click', preventFlip, true);
      
      return () => {
        pageElement.removeEventListener('mousedown', preventFlip, true);
        pageElement.removeEventListener('click', preventFlip, true);
      };
    }
  }, []);

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-white relative"
      onClick={preventEventBubbling} 
      onMouseDown={preventEventBubbling}
    >
      <div className="w-full h-full overflow-hidden">
        <div 
          id="multi-page-img-left"
          className="h-full relative inline-flex"
          style={{ 
            transform: `translateX(-${scrollValue}px)`,
            transition: 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)'
          }}
          onClick={preventEventBubbling}
          onMouseDown={preventEventBubbling}
        >
          {/* Render semua gambar dalam baris horizontal */}
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Page ${39 + index}`}
              className="h-full w-auto max-w-none"
              style={{ objectFit: 'contain' }}
              onClick={preventEventBubbling}
              onMouseDown={preventEventBubbling}
              onDragStart={(e) => e.preventDefault()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Komponen untuk halaman kanan yang berisi halaman 44
export const MultiPageRightPage: React.FC<{ lang?: string }> = ({ 
  lang = 'en'
}) => {
  // Mencegah event propagation agar tidak memicu page flip
  const preventEventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-white relative"
      onClick={preventEventBubbling}
      onMouseDown={preventEventBubbling}
    >
      <img
        src="/tinggi/page_Page_045.jpg"
        alt="Page 44"
        className="w-full h-full object-cover"
        onClick={preventEventBubbling}
        onMouseDown={preventEventBubbling}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};