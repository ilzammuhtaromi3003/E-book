"use client";

// components/Flipbook/Navbar.tsx
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  pageDisplay: string;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ pageDisplay, totalPages, onGoToPage }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Update input value when pageDisplay changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(pageDisplay);
    }
  }, [pageDisplay, isEditing]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle input blur (when user clicks outside)
  const handleInputBlur = () => {
    handlePageSubmit();
    setIsEditing(false);
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageSubmit();
      setIsEditing(false);
    }
  };
  
  // Handle page submission
  const handlePageSubmit = () => {
    // If input is a valid number, go to that page
    const pageNumber = parseInt(inputValue);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onGoToPage(pageNumber);
    } else {
      // Reset to current page if invalid input
      setInputValue(pageDisplay);
    }
  };
  
  // Handle clicking on page number display
  const handleDisplayClick = () => {
    setIsEditing(true);
  };
  
  return (
    <div className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center">
      {/* Logo di kiri */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-18 w-auto mr-2" />
      </div>
      
      {/* Informasi di kanan */}
      <div className="flex items-center">
        <div className="text-gray-800 font-medium mr-4">75 Stories of the Hong Kong Housing Society</div>
        
        <div className="flex items-center border rounded px-2 py-1">
          <span className="mr-2">Page:</span>
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-24 px-2 py-1 text-center border-none focus:outline-none"
              autoFocus
            />
          ) : (
            <span 
              onClick={handleDisplayClick} 
              className="w-24 px-2 py-1 text-center cursor-text"
            >
              {pageDisplay}
            </span>
          )}
          <span className="ml-2">/ {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;