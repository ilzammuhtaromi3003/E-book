"use client";

// components/Flipbook/MultiPageSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { multiPageState } from './MultiPageState';
import { getTranslation } from '@/utils/translations';

interface MultiPageSliderProps {
  scrollValue: number;
  setScrollValue: (value: number) => void;
  lang?: string;
}

const MultiPageSlider: React.FC<MultiPageSliderProps> = ({ 
  scrollValue, 
  setScrollValue,
  lang = 'en'
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
    e.stopPropagation();
    const newValue = parseInt(e.target.value);
    console.log("Slider value changed to:", newValue);
    
    // Update multiPageState yang akan mengupdate gambar
    multiPageState.setScrollValue(newValue);
    
    // Update React state untuk menjaga sinkronisasi UI
    setScrollValue(newValue);
    
    // Sembunyikan tooltip saat user mulai menggeser
    setShowTooltip(false);
  };
  
  // Handler untuk mouse events
  const handleMouseEvents = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handler untuk hover pada tooltip
  const handleTooltipHover = () => {
    setShowTooltip(false);
  };
  
  // Listen untuk perubahan dari multiPageState
  useEffect(() => {
    const unregister = multiPageState.registerCallback((value) => {
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
      .multipage-range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #005fac;
        cursor: pointer;
      }
      
      .multipage-range-slider::-moz-range-thumb {
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
  
  return (
    <div 
      className="multipage-slider-container" 
      style={{
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '450px',
        borderRadius: '30px',
        padding: '5px 15px',
        zIndex: 1000
      }}
      onClick={handleMouseEvents}
      onMouseDown={handleMouseEvents}
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
          onClick={handleMouseEvents}
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
      
      {/* Slider tanpa tombol panah */}
      <input
        id="multipage-slider"
        ref={sliderRef}
        type="range"
        min="0"
        max="1000"
        step="10"
        value={scrollValue}
        onChange={handleSliderChange}
        className="multipage-range-slider"
        style={{
          width: '100%',
          height: '6px',
          appearance: 'none',
          borderRadius: '3px',
          background: '#BCBDC1',
          outline: 'none'
        }}
        onClick={handleMouseEvents}
        onMouseDown={handleMouseEvents}
        onMouseMove={handleMouseEvents}
        onMouseUp={handleMouseEvents}
        onMouseEnter={() => setShowTooltip(false)}
      />
    </div>
  );
};

export default MultiPageSlider;