"use client";

// components/Flipbook/MultiPagePages.tsx
import React, { useEffect, useRef } from 'react';
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

  // Ref untuk container dan element gambar pertama
  const containerRef = useRef<HTMLDivElement>(null);
  const firstImageRef = useRef<HTMLImageElement>(null);

  // Event handler untuk mencegah event bubbling yang bisa menyebabkan flip
  const preventEventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Efek untuk mengukur gambar dan mengatur scrollFactor yang tepat
  useEffect(() => {
    // Fungsi untuk mengukur lebar total gambar
    const measureTotalWidth = () => {
      // Element dengan semua gambar
      const multiPageElement = document.getElementById('multi-page-img-left');
      // Container
      const container = containerRef.current;
      
      if (multiPageElement && container) {
        // Hitung total lebar semua gambar
        const totalWidth = multiPageElement.scrollWidth;
        // Lebar container
        const containerWidth = container.offsetWidth;
        
        console.log('Total lebar gambar multi-page:', totalWidth, 'px');
        console.log('Lebar container multi-page:', containerWidth, 'px');
        
        // Hitung factor scroll yang dibutuhkan
        // Kita perlu menggeser total lebar - containerWidth
        const scrollNeeded = totalWidth - containerWidth;
        if (scrollNeeded > 0) {
          // Tambahkan margin 5% untuk memastikan semua terlihat
          const scrollFactor = (scrollNeeded / multiPageState.sliderMax) * 1.05;
          multiPageState.setScrollFactor(scrollFactor);
          console.log('Faktor scroll multi-page disetel ke:', scrollFactor);
        }
      }
    };
    
    // Tunggu sedikit untuk memastikan gambar sudah dimuat
    const timer = setTimeout(() => {
      measureTotalWidth();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
      <div 
        ref={containerRef}
        className="w-full h-full overflow-hidden"
      >
        <div 
          id="multi-page-img-left"
          className="h-full relative inline-flex"
          style={{ 
            transform: `translateX(-${scrollValue * multiPageState.scrollFactor}px)`,
            transition: 'transform 0.8s ease'
          }}
          onClick={preventEventBubbling}
          onMouseDown={preventEventBubbling}
        >
          {/* Render semua gambar dalam baris horizontal */}
          {images.map((src, index) => (
            <img
              key={index}
              ref={index === 0 ? firstImageRef : null}
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