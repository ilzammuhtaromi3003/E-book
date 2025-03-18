"use client";

// components/Flipbook/NavigationButtons.tsx
import React from 'react';
import { NavigationButtonsProps } from './types';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  currentPage, 
  totalPages, 
  isPanorama,
  onPrev, 
  onNext 
}) => {
  return (
    <>
      {/* Tombol navigasi kiri */}
      <button
        onClick={onPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 navigation-btn-left"
        disabled={currentPage === 0}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 0 ? 0.5 : 1,
          color: '#333',
          transition: 'all 0.2s ease',
          marginLeft: '-15px'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 0) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
        }}
      >
        <FaChevronLeft className={currentPage === 0 ? "text-gray-400" : "text-gray-700"} size={24} />
      </button>
      
      {/* Tombol navigasi kanan */}
      <button
        onClick={onNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 navigation-btn-right"
        disabled={currentPage === totalPages - 1}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
          cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages - 1 ? 0.5 : 1,
          color: '#333',
          transition: 'all 0.2s ease',
          marginRight: '-15px'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages - 1) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
        }}
      >
        <FaChevronRight className={currentPage === totalPages - 1 ? "text-gray-400" : "text-gray-700"} size={24} />
      </button>
      
      {/* Sudut kiri atas - kanan atas halaman untuk navigasi halaman */}
      <div className="corner-button-container absolute inset-0 pointer-events-none">
        {/* Klik corner akan memicu halaman sebelumnya/berikutnya */}
        <button
          onClick={onPrev}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden corner-button absolute top-0 left-0 w-16 h-16 cursor-pointer pointer-events-auto"
          style={{ 
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)'
          }}
          aria-label="Halaman sebelumnya"
        />
        
        <button
          onClick={onNext}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden corner-button absolute top-0 right-0 w-16 h-16 cursor-pointer pointer-events-auto"
          style={{ 
            opacity: 0,
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
          }}
          aria-label="Halaman berikutnya"
        />
        
        <button
          onClick={onPrev}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden corner-button absolute bottom-0 left-0 w-16 h-16 cursor-pointer pointer-events-auto"
          style={{ 
            opacity: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 0 0)'
          }}
          aria-label="Halaman sebelumnya"
        />
        
        <button
          onClick={onNext}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden corner-button absolute bottom-0 right-0 w-16 h-16 cursor-pointer pointer-events-auto"
          style={{ 
            opacity: 0,
            clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
          }}
          aria-label="Halaman berikutnya"
        />
      </div>
    </>
  );
};

export default NavigationButtons;
