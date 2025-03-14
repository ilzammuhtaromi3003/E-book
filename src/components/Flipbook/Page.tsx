// components/Flipbook/Page.tsx
import React from 'react';
import { PageProps } from './types';
import VideoButton from '../VideoButton';

const Page: React.FC<PageProps> = ({ pageNumber, showVideoButton = false }) => {
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
            top: '16.8%', // Sesuaikan posisi sesuai kebutuhan
            left: '13.8%', // Sesuaikan posisi sesuai kebutuhan
            width: '100px', // Sesuaikan ukuran sesuai kebutuhan
            height: 'auto',
            zIndex: 10,
          }}
        />
      )}
      
      {showVideoButton && (
        <VideoButton 
          videoSrc="/video1.mp4" 
          position={{ top: '20%', left: '80%' }} 
        />
      )}
    </div>
  );
};

export default Page;