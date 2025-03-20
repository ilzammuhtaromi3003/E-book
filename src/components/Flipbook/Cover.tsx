"use client";

// components/Flipbook/Cover.tsx
import React from 'react';

interface CoverProps {
  lang?: string;
}

const Cover: React.FC<CoverProps> = ({ lang = 'en' }) => {
  // In a real implementation, you might have different cover images for different languages
  // For now, we'll use the same image but we could add language-specific logic here
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <img
        src={`/tinggi/page_Page_001.jpg`}
        alt={lang === 'en' ? "Cover" : lang === 'id' ? "Sampul" : "表紙"}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Cover;