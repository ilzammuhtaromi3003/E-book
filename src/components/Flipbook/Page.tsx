// components/Flipbook/Page.tsx
import React from 'react';
import { PageProps } from './types';
import VideoButton from '../VideoButton';

// Variabel global untuk menyimpan dan mengakses posisi scroll
export const panoramaState = {
  scrollPosition: 0,
  setScrollPosition: (position: number) => {
    panoramaState.scrollPosition = position;
    if (panoramaState.onScroll) {
      panoramaState.onScroll(position);
    }
  },
  onScroll: null as ((position: number) => void) | null,
  registerScrollHandler: (handler: (position: number) => void) => {
    panoramaState.onScroll = handler;
    return () => {
      panoramaState.onScroll = null;
    };
  }
};

const Page: React.FC<PageProps> = ({ 
  pageNumber, 
  showVideoButton = false, 
  isPanoramaLeft = false, 
  isPanoramaRight = false 
}) => {
  // Jika ini halaman panorama kiri atau kanan
  if (isPanoramaLeft || isPanoramaRight) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white relative">
        <div className="w-full h-full overflow-hidden">
          {/* Gambar panorama dengan posisi dikontrol oleh scrollPosition global */}
          <div 
            className="h-full relative" 
            style={{ 
              transform: `translateX(-${isPanoramaLeft ? 0 : 100}%) translateX(-${panoramaState.scrollPosition}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img
              src="/tinggi/page_Page_032-038.jpg"
              alt={`Panorama Page ${pageNumber}`}
              className="h-full w-auto max-w-none"
              style={{ 
                objectFit: 'contain'
              }}
            />
            
            {/* Tombol video hanya di halaman kiri */}
            {isPanoramaLeft && showVideoButton && (
              <div style={{ position: 'absolute', top: '20%', left: '30%', zIndex: 10 }}>
                <VideoButton 
                  videoSrc="/video1.mp4" 
                  position={{ top: 0, left: 0 }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Halaman normal
  const paddedNumber = String(pageNumber).padStart(3, "0");
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative">
      <img
        src={`/tinggi/page_Page_${paddedNumber}.jpg`}
        alt={`Page ${pageNumber}`}
        className="w-full h-full object-cover"
      />
      
      {/* Tambahkan GIF hanya pada halaman 5 (page_Page_006.jpg) */}
      {pageNumber === 6 && (
        <img
          src="/orang-1.gif"
          alt="Orang GIF"
          style={{
            position: 'absolute',
            top: '15.5%',
            left: '13.9%',
            width: '100px',
            height: 'auto',
            zIndex: 10,
          }}
        />
      )}
      
      {/* Tombol video pada halaman yang bukan panorama */}
      {showVideoButton && !isPanoramaLeft && !isPanoramaRight && (
        <VideoButton 
          videoSrc="/video1.mp4" 
          position={{ top: '20%', left: '80%' }} 
        />
      )}
    </div>
  );
};

export default Page;