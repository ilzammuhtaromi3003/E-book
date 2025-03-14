// components/Flipbook/Cover.tsx
import React from 'react';

const Cover: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <img
        src={`/tinggi/page_Page_001.jpg`}
        alt="Cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Cover;