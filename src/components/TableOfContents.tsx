"use client";

import React, { useEffect, useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/utils/translations';
import '../styles/tableOfContents.css';

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (pageNumber: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  isOpen,
  onClose,
  onPageSelect
}) => {
  const [animation, setAnimation] = useState<string>("sidebar-closed");
  const pathname = usePathname();
  const prevOpenState = useRef(isOpen);
  
  // State untuk dropdown
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [forewordOpen, setForewordOpen] = useState(false);
  
  // Refs for animation containers
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const forewordContainerRef = useRef<HTMLDivElement>(null);
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const currentLanguage = getCurrentLanguage();
  
  // Handle animation on open/close with debouncing to prevent flashing
  useEffect(() => {
    // Prevent unnecessary state changes when language changes
    if (isOpen !== prevOpenState.current) {
      if (isOpen) {
        setAnimation("sidebar-opening");
        
        const timeout = setTimeout(() => {
          setAnimation("sidebar-open");
        }, 300);
        
        prevOpenState.current = isOpen;
        return () => clearTimeout(timeout);
      } else {
        setAnimation("sidebar-closing");
        
        const timeout = setTimeout(() => {
          setAnimation("sidebar-closed");
        }, 300);
        
        prevOpenState.current = isOpen;
        return () => clearTimeout(timeout);
      }
    }
  }, [isOpen]);

  // Effect for dropdown animations
  useEffect(() => {
    if (messagesContainerRef.current) {
      if (messagesOpen) {
        const height = messagesContainerRef.current.scrollHeight;
        messagesContainerRef.current.style.maxHeight = `${height}px`;
      } else {
        messagesContainerRef.current.style.maxHeight = '0';
      }
    }
  }, [messagesOpen]);

  useEffect(() => {
    if (forewordContainerRef.current) {
      if (forewordOpen) {
        const height = forewordContainerRef.current.scrollHeight;
        forewordContainerRef.current.style.maxHeight = `${height}px`;
      } else {
        forewordContainerRef.current.style.maxHeight = '0';
      }
    }
  }, [forewordOpen]);

  // Don't render anything if sidebar is completely closed
  if (animation === "sidebar-closed") return null;

  // Fungsi untuk navigasi halaman saat item diklik
  const handleItemClick = (pageNumber: number) => {
    onPageSelect(pageNumber);
    // Tidak menutup sidebar agar pengguna bisa menelusuri TOC
  };
  
  // Get translated text
  const tocTitle = getTranslation('tocTitle', currentLanguage);
  const coverText = getTranslation('cover', currentLanguage);
  const contentsText = getTranslation('contents', currentLanguage);
  const messagesText = getTranslation('messages', currentLanguage);
  const forewordText = getTranslation('foreword', currentLanguage);
  const ourStoryText = getTranslation('ourStory', currentLanguage);
  const aboutRentalEstatesText = getTranslation('aboutRentalEstates', currentLanguage);
  const aboutLiveableHomesText = getTranslation('aboutLiveableHomes', currentLanguage);
  const aboutInnovationsText = getTranslation('aboutInnovations', currentLanguage);
  const weavingOurFutureText = getTranslation('weavingOurFuture', currentLanguage);
  
  const messageItems = [
    { title: getTranslation('theChiefExecutive', currentLanguage), pageNumber: 5 },
    { title: getTranslation('theFinancialSecretary', currentLanguage), pageNumber: 7 },
    { title: getTranslation('deputyFinancialSecretary', currentLanguage), pageNumber: 9 },
    { title: getTranslation('secretaryForDevelopment', currentLanguage), pageNumber: 11 },
    { title: getTranslation('secretaryForHousing', currentLanguage), pageNumber: 13 },
    { title: getTranslation('secretaryForHomeAndYouthAffairs', currentLanguage), pageNumber: 15 },
    { title: getTranslation('pastChairmen', currentLanguage), pageNumber: 17 },
    { title: getTranslation('pastExecutiveDirector', currentLanguage), pageNumber: 21 },
  ];
  
  const forewordItems = [
    { title: getTranslation('chairman', currentLanguage), pageNumber: 27 },
    { title: getTranslation('chiefExecutiveOfficer', currentLanguage), pageNumber: 29 },
  ];
  
  return (
    <div 
      className={`fixed left-0 bottom-0 h-[calc(100vh-64px)] bg-white shadow-lg z-50 flex flex-col ${animation}`}
      style={{ 
        width: '320px',
        top: '64px',
      }}
    >
      {/* Header dengan style original */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h4 className="text-base font-medium text-gray-800">{tocTitle}</h4>
        <button 
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close table of contents"
        >
          <IoMdClose size={18} />
        </button>
      </div>
      
      {/* Table of Contents tanpa nomor halaman */}
      <div className="flex-1 overflow-y-auto">
        <ul className="py-2 no-padding-left">
          {/* Cover */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(0)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{coverText}</span>
            </div>
          </li>
          
          {/* Contents */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(3)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{contentsText}</span>
            </div>
          </li>
          
          {/* Messages - Dropdown */}
          <li className="border-t border-b border-gray-100 mb-1">
            <div 
              className="toc-item py-2.5 pl-5 pr-4 cursor-pointer flex justify-between items-center"
              onClick={() => setMessagesOpen(!messagesOpen)}
            >
              <span className="text-base font-medium text-gray-700">{messagesText}</span>
              <div className="chevron-icon">
                {messagesOpen ? 
                  <FiChevronDown size={18} className="text-blue-500" /> : 
                  <FiChevronRight size={18} className="text-blue-500" />
                }
              </div>
            </div>
            
            {/* Animated container for messages dropdown */}
            <div 
              ref={messagesContainerRef}
              className="dropdown-container bg-gray-50"
              style={{ maxHeight: 0 }}
            >
              <ul className="no-padding-left">
                {messageItems.map((item, index) => (
                  <li 
                    key={`message-${index}`}
                    className="toc-item pl-8 pr-4 py-2.5 cursor-pointer" 
                    onClick={() => handleItemClick(item.pageNumber)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{item.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          
          {/* Chairman and Executive Director */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(25)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">
                {getTranslation('chairmanAndExecutiveDirector', currentLanguage)}
              </span>
            </div>
          </li>
          
          {/* Foreword - Dropdown */}
          <li className="border-b border-gray-100 mb-1">
            <div 
              className="toc-item py-2.5 pl-5 pr-4 cursor-pointer flex justify-between items-center"
              onClick={() => setForewordOpen(!forewordOpen)}
            >
              <span className="text-base font-medium text-gray-700">{forewordText}</span>
              <div className="chevron-icon">
                {forewordOpen ? 
                  <FiChevronDown size={18} className="text-blue-500" /> : 
                  <FiChevronRight size={18} className="text-blue-500" />
                }
              </div>
            </div>
            
            {/* Animated container for foreword dropdown */}
            <div 
              ref={forewordContainerRef}
              className="dropdown-container bg-gray-50"
              style={{ maxHeight: 0 }}
            >
              <ul className="no-padding-left">
                {forewordItems.map((item, index) => (
                  <li 
                    key={`foreword-${index}`}
                    className="toc-item pl-8 pr-4 py-2.5 cursor-pointer" 
                    onClick={() => handleItemClick(item.pageNumber)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{item.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          
          {/* Our Story */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(31)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{ourStoryText}</span>
            </div>
          </li>
          
          {/* About Rental Estates */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(55)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{aboutRentalEstatesText}</span>
            </div>
          </li>
          
          {/* About Liveable Homes */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(95)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{aboutLiveableHomesText}</span>
            </div>
          </li>
          
          {/* About Innovations */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(135)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{aboutInnovationsText}</span>
            </div>
          </li>
          
          {/* Weaving Our Future */}
          <li 
            className="toc-item py-2.5 pl-5 pr-4 cursor-pointer" 
            onClick={() => handleItemClick(149)}
          >
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-700">{weavingOurFutureText}</span>
            </div>
          </li>
        </ul>
      </div>
      
      {/* Footer with branding */}
      <div className="py-3 px-5 border-t border-gray-200 bg-gray-50 text-center">
        <p className="text-xs text-gray-500">{getTranslation('bookTitle', currentLanguage)}</p>
      </div>
    </div>
  );
};

export default TableOfContents;