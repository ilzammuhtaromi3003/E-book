"use client";

// components/Flipbook/ControlBar.tsx
import React from 'react';
import { ControlBarProps } from './types';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/utils/translations';

const ControlBar: React.FC<ControlBarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onDownload,
  onToggleFullscreen,
  onGoHome,
  onToggleThumbnails,
  isFullscreen,
  showThumbnails
}) => {
  const pathname = usePathname();
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const currentLanguage = getCurrentLanguage();
  
  // Get translated labels
  const homeText = getTranslation('home', currentLanguage);
  const thumbnailsText = getTranslation('thumbnails', currentLanguage);
  const zoomInText = getTranslation('zoomIn', currentLanguage);
  const zoomOutText = getTranslation('zoomOut', currentLanguage);
  const downloadText = getTranslation('download', currentLanguage);
  const fullscreenText = getTranslation(
    isFullscreen ? 'exitFullscreen' : 'fullscreen', 
    currentLanguage
  );
  
  // Gaya untuk control bar
  const controlBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '8px',
    margin: '10px auto',
    width: '95%',
    maxWidth: '600px',
    zIndex: 1000,
  };
  
  // Gaya untuk grup tombol
  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };
  
  // Gaya untuk tombol
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    color: '#2563eb',
    cursor: 'pointer',
    padding: 0,
  };
  
  // Gaya untuk tombol aktif
  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e6f0ff',
    color: '#0d47a1',
    border: '1px solid #90caf9',
  };
  
  // Gaya untuk tombol yang dinonaktifkan
  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };
  
  // Gaya untuk zoom display
  const zoomDisplayStyle: React.CSSProperties = {
    minWidth: '60px',
    textAlign: 'center', 
    fontWeight: '600',
    color: '#4b5563',
    fontSize: '16px',
  };
  
  return (
    <div style={controlBarStyle}>
      {/* Control buttons */}
      <div style={buttonGroupStyle}>
        {/* Home button */}
        <button
          onClick={onGoHome}
          style={buttonStyle}
          aria-label={homeText}
          title={homeText}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Thumbnails button */}
        <button
          onClick={onToggleThumbnails}
          style={showThumbnails ? activeButtonStyle : buttonStyle}
          aria-label={thumbnailsText}
          title={thumbnailsText}
        >
          <BsGrid3X3Gap size={18} />
        </button>
        
        {/* Zoom out button */}
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          style={zoom <= 0.5 ? disabledButtonStyle : buttonStyle}
          aria-label={zoomOutText}
          title={zoomOutText}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Zoom level display */}
        <div style={zoomDisplayStyle}>
          {Math.round(zoom * 100)}%
        </div>
        
        {/* Zoom in button */}
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2}
          style={zoom >= 2 ? disabledButtonStyle : buttonStyle}
          aria-label={zoomInText}
          title={zoomInText}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Download button */}
        <button
          onClick={onDownload}
          style={buttonStyle}
          aria-label={downloadText}
          title={downloadText}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Fullscreen button */}
        <button
          onClick={onToggleFullscreen}
          style={buttonStyle}
          aria-label={fullscreenText}
          title={fullscreenText}
        >
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V6C8 6.55228 7.55228 7 7 7H4M4 17H7C7.55228 17 8 17.4477 8 18V21M16 3V6C16 6.55228 16.4477 7 17 7H20M20 17H17C16.4477 17 16 17.4477 16 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H6C4.89543 3 4 3.89543 4 5V7M4 17V19C4 20.1046 4.89543 21 6 21H8M16 3H18C19.1046 3 20 3.89543 20 5V7M20 17V19C20 20.1046 19.1046 21 18 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlBar;