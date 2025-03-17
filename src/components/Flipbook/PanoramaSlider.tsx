"use client";

// components/Flipbook/PanoramaSlider.tsx
import React, { useState, useEffect } from 'react';
import { panoramaState } from './PanoramaState';

interface PanoramaSliderProps {
  scrollValue: number;
  setScrollValue: (value: number) => void;
}

const PanoramaSlider: React.FC<PanoramaSliderProps> = ({ scrollValue, setScrollValue }) => {
  // Handler untuk slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    // Update panoramaState yang akan mengupdate gambar
    panoramaState.setScrollValue(newValue);
    // Update React state untuk menjaga sinkronisasi UI
    setScrollValue(newValue);
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
        width: '90%',
        maxWidth: '550px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '30px',
        padding: '5px 15px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}
    >
      {/* Slider tanpa tombol panah */}
      <input
        id="panorama-slider"
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
      />
    </div>
  );
};

export default PanoramaSlider;