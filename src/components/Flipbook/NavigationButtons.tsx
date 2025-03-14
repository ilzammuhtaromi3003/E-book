// components/Flipbook/NavigationButtons.tsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavigationButtonsProps } from './types';

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
        className="absolute left-0 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-3 shadow-lg transition-all"
        disabled={currentPage === 0}
      >
        <FaChevronLeft className={currentPage === 0 ? "text-gray-400" : "text-gray-700"} size={24} />
      </button>
      
      {/* Tombol navigasi kanan */}
      <button
        onClick={onNext}
        className="absolute right-0 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-3 shadow-lg transition-all"
        disabled={currentPage === totalPages - 1}
      >
        <FaChevronRight className={currentPage === totalPages - 1 ? "text-gray-400" : "text-gray-700"} size={24} />
      </button>
      
      {/* Tombol sudut untuk navigasi halaman */}
      {/* Sudut kiri atas */}
      {currentPage > 0 && !isPanorama && (
        <button
          onClick={onPrev}
          onMouseDown={(e) => e.stopPropagation()}
          className="corner-button top-0 left-0"
          style={{ borderRadius: '0 0 12px 0' }}
          aria-label="Halaman sebelumnya"
        />
      )}
      
      {/* Sudut kanan atas */}
      {currentPage < totalPages - 1 && !isPanorama && (
        <button
          onClick={onNext}
          onMouseDown={(e) => e.stopPropagation()}
          className="corner-button top-0 right-0"
          style={{ borderRadius: '0 0 0 12px' }}
          aria-label="Halaman berikutnya"
        />
      )}
      
      {/* Sudut kiri bawah */}
      {currentPage > 0 && !isPanorama && (
        <button
          onClick={onPrev}
          onMouseDown={(e) => e.stopPropagation()}
          className="corner-button bottom-0 left-0"
          style={{ borderRadius: '0 12px 0 0' }}
          aria-label="Halaman sebelumnya"
        />
      )}
      
      {/* Sudut kanan bawah */}
      {currentPage < totalPages - 1 && !isPanorama && (
        <button
          onClick={onNext}
          onMouseDown={(e) => e.stopPropagation()}
          className="corner-button bottom-0 right-0"
          style={{ borderRadius: '12px 0 0 0' }}
          aria-label="Halaman berikutnya"
        />
      )}
    </>
  );
};

export default NavigationButtons;