"use client";

// components/Flipbook/PanoramaSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { panoramaState } from './PanoramaState';
import { getTranslation } from '@/utils/translations';

interface PanoramaSliderProps {
  scrollValue: number;
  setScrollValue: (value: number) => void;
  lang?: string; // Tambahkan prop lang
}

const PanoramaSlider: React.FC<PanoramaSliderProps> = ({ 
  scrollValue, 
  setScrollValue,
  lang = 'en' // Default ke bahasa Inggris jika tidak ada
}) => {
  // State untuk menampilkan tooltip
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 10, arrowLeft: 18 });
  const sliderRef = useRef<HTMLInputElement>(null);
  
  // Hitung posisi thumb
  useEffect(() => {
    if (sliderRef.current) {
      // Posisi buletan awal adalah di ujung kiri + offset 9px (setengah dari lebar thumb)
      setTooltipPosition({
        left: 9,
        arrowLeft: 9
      });
    }
  }, []);
  
  // Handler untuk slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    
    // Update panoramaState yang akan mengupdate gambar
    panoramaState.setScrollValue(newValue);
    
    // Update React state untuk menjaga sinkronisasi UI
    setScrollValue(newValue);
    
    // Sembunyikan tooltip saat user mulai menggeser
    setShowTooltip(false);
  };
  
  // Handler untuk hover pada tooltip
  const handleTooltipHover = () => {
    setShowTooltip(false);
  };
  
  // Listen untuk perubahan dari panoramaState
  useEffect(() => {
    const unregister = panoramaState.registerCallback((value) => {
      setScrollValue(value);
    });
    
    return unregister;
  }, [setScrollValue]);
  
  // Dapatkan teks tooltip sesuai bahasa
  const tooltipText = getTranslation('dragToRight', lang);
  
  // Tambahkan style untuk slider thumb color
  useEffect(() => {
    // Menambahkan custom CSS untuk mengatur warna buletan slider
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .panorama-range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #005fac;
        cursor: pointer;
      }
      
      .panorama-range-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #005fac;
        cursor: pointer;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Cleanup saat unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Setel posisi slider ke tengah halaman
  return (
    <div 
      className="panorama-slider-container" 
      style={{
        position: 'absolute',
        bottom: '-20px',
        left: '35%', // Posisi lebih ke kiri agar benar-benar di tengah halaman
        width: '40%', // Lebih pendek untuk memastikan benar-benar di tengah
        maxWidth: '350px',
        borderRadius: '30px',
        padding: '5px 15px',
        zIndex: 1000,
        margin: '0 auto',
        transform: 'translateX(-20%)' // Geser sedikit ke kiri untuk kompensasi
      }}
    >
      {/* Tooltip yang muncul di atas slider */}
      {showTooltip && (
        <div 
          className="blue-tooltip"
          onMouseEnter={handleTooltipHover}
          style={{
            position: 'absolute',
            bottom: '28px',
            left: `${tooltipPosition.left}px`,
            background: '#005fac',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            zIndex: 100,
            textAlign: 'center',
            transformOrigin: 'bottom left'
          }}
        >
          {tooltipText}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: `${tooltipPosition.arrowLeft}px`,
              transform: 'rotate(45deg)',
              width: '10px',
              height: '10px',
              background: '#005fac',
            }}
          />
        </div>
      )}
      
      {/* Slider */}
      <input
        id="panorama-slider"
        ref={sliderRef}
        type="range"
        min="0"
        max="1000"
        step="10"
        value={scrollValue}
        onChange={handleSliderChange}
        className="panorama-range-slider"
        style={{
          width: '100%',
          height: '6px',
          appearance: 'none',
          borderRadius: '3px',
          background: '#e2e8f0',
          outline: 'none',
          display: 'block',
          margin: '0 auto'
        }}
        onMouseEnter={() => setShowTooltip(false)}
      />
    </div>
  );
};

export default PanoramaSlider;