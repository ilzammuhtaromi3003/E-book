// components/Flipbook/BottomIndicator.tsx
import React from 'react';
import { BottomIndicatorProps } from './types';

const BottomIndicator: React.FC<BottomIndicatorProps> = ({ currentIndex, onChange }) => {
  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]"
      style={{
        width: '400px',
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Indikator timeline */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e2e8f0',
          borderRadius: '3px',
          position: 'relative'
        }}
      >
        {/* Indikator progress */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            height: '100%',
            width: `${(currentIndex / 6) * 100}%`,
            backgroundColor: '#3b82f6',
            borderRadius: '3px'
          }}
        />
        
        {/* Titik-titik untuk navigasi */}
        {Array.from({ length: 7 }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onChange(idx);
            }}
            style={{
              position: 'absolute',
              left: `${(idx / 6) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: idx <= currentIndex ? '#3b82f6' : '#e2e8f0',
              border: '2px solid white',
              cursor: 'pointer'
            }}
            aria-label={`Halaman ${31 + idx}`}
          />
        ))}
      </div>
      
      {/* Text indikator */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1e3a8a'
        }}
      >
        Halaman {31 + currentIndex} dari 162
      </div>
    </div>
  );
};

export default BottomIndicator;