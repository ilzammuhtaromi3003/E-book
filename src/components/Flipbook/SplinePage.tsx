"use client";

// components/Flipbook/SplinePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

interface SplinePageProps {
  lang?: string;
}

const SplinePage: React.FC<SplinePageProps> = ({ lang = 'en' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cleanup previous instance
    if (appRef.current) {
      appRef.current.dispose();
      appRef.current = null;
    }

    const loadSpline = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const app = new Application(canvas);
        appRef.current = app;
        
        await app.load('https://prod.spline.design/H2hY31WkbHVKzDho/scene.splinecode');
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Spline scene:', err);
        setError('Failed to load 3D scene');
        setIsLoading(false);
      }
    };

    loadSpline();

    // Cleanup on unmount
    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, []);

  // Get text based on language
  const getLoadingText = () => {
    switch (lang) {
      case 'id':
        return 'Memuat konten 3D...';
      case 'jp':
        return '3Dコンテンツを読み込んでいます...';
      default:
        return 'Loading 3D content...';
    }
  };

  const getErrorText = () => {
    switch (lang) {
      case 'id':
        return 'Gagal memuat konten 3D';
      case 'jp':
        return '3Dコンテンツの読み込みに失敗しました';
      default:
        return 'Failed to load 3D content';
    }
  };

  const getInteractiveText = () => {
    switch (lang) {
      case 'id':
        return 'Interaktif 3D - Gerakkan mouse untuk menjelajahi';
      case 'jp':
        return 'インタラクティブ3D - マウスを動かして探索';
      default:
        return 'Interactive 3D - Move mouse to explore';
    }
  };

  // Handler untuk mencegah event bubbling ke flipbook
  const handleMouseEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEvent = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center bg-white relative"
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
      onMouseMove={handleMouseEvent}
      onClick={handleMouseEvent}
      onTouchStart={handleTouchEvent}
      onTouchMove={handleTouchEvent}
      onTouchEnd={handleTouchEvent}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600 text-lg">{getLoadingText()}</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <div className="text-red-600 text-lg">{getErrorText()}</div>
        </div>
      )}

      {/* Instructions overlay - only show when loaded */}
      {!isLoading && !error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
            {getInteractiveText()}
          </div>
        </div>
      )}

      {/* Invisible overlay to catch all mouse events */}
      {!isLoading && !error && (
        <div 
          className="absolute inset-0 z-30"
          onMouseDown={handleMouseEvent}
          onMouseUp={handleMouseEvent}
          onMouseMove={handleMouseEvent}
          onClick={handleMouseEvent}
          onTouchStart={handleTouchEvent}
          onTouchMove={handleTouchEvent}
          onTouchEnd={handleTouchEvent}
          style={{ 
            pointerEvents: 'auto',
            background: 'transparent'
          }}
        />
      )}

      {/* Spline Canvas */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseEvent}
        onMouseUp={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        onClick={handleMouseEvent}
        onTouchStart={handleTouchEvent}
        onTouchMove={handleTouchEvent}
        onTouchEnd={handleTouchEvent}
        style={{ 
          display: isLoading || error ? 'none' : 'block',
          touchAction: 'none', // Prevents scrolling issues on mobile
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 40
        }}
      />

      {/* Fallback background pattern when loading/error */}
      {(isLoading || error) && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #e3f2fd 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #f3e5f5 0%, transparent 50%)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      )}
    </div>
  );
};

export default SplinePage;