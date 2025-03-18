"use client";

// components/Flipbook/PanoramaSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { panoramaState } from './PanoramaState';

interface PanoramaSliderProps {
  scrollValue: number;
  setScrollValue: (value: number) => void;
}

const PanoramaSlider: React.FC<PanoramaSliderProps> = ({ scrollValue, setScrollValue }) => {
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
  
  return (
    <div 
      className="panorama-slider-container" 
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
            background: '#4a89dc',
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
          PLEASE DRAG IT TO RIGHT
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: `${tooltipPosition.arrowLeft}px`,
              transform: 'rotate(45deg)',
              width: '10px',
              height: '10px',
              background: '#4a89dc',
            }}
          />
        </div>
      )}
      
      {/* Slider tanpa tombol panah */}
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
          outline: 'none'
        }}
        onMouseEnter={() => setShowTooltip(false)}
      />
    </div>
  );
};

export default PanoramaSlider;