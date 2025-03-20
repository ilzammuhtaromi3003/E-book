"use client";

// components/LanguageSwitcherDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiChevronDown, FiCheck, FiGlobe } from 'react-icons/fi';

interface LanguageSwitcherDropdownProps {
  className?: string;
}

const LanguageSwitcherDropdown: React.FC<LanguageSwitcherDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/id')) return 'id';
    if (pathname.startsWith('/jp')) return 'jp';
    return 'en'; // Default to English
  };
  
  const currentLanguage = getCurrentLanguage();
  
  // Language switching function
  const switchLanguage = (lang: string) => {
    if (lang === currentLanguage) return;
    
    // Get the path after the language prefix
    let remainingPath = pathname;
    const langs = ['/en', '/id', '/jp'];
    
    for (const l of langs) {
      if (pathname.startsWith(l)) {
        remainingPath = pathname.substring(l.length) || '/';
        break;
      }
    }
    
    // Navigate to the new language path
    router.push(`/${lang}${remainingPath === '/' ? '' : remainingPath}`);
    setIsOpen(false);
  };
  
  // Language display names
  const languageNames: Record<string, { native: string, english: string }> = {
    en: { native: 'English', english: 'English' },
    id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
    jp: { native: '日本語', english: 'Japanese' }
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
          id="language-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <FiGlobe className="h-5 w-5 text-gray-500" aria-hidden="true" />
          <span className="hidden sm:inline">{languageNames[currentLanguage].native}</span>
          <FiChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {/* Dropdown menu */}
      <div
        className={`${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        } absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out transform`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {Object.entries(languageNames).map(([langCode, names]) => (
            <button
              key={langCode}
              onClick={() => switchLanguage(langCode)}
              className={`${
                currentLanguage === langCode ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
              } flex items-center justify-between w-full px-4 py-2 text-left text-sm hover:bg-gray-50`}
              role="menuitem"
              tabIndex={-1}
            >
              <div className="flex items-center gap-x-2">
                <span className="font-medium">{names.native}</span>
                <span className="text-xs text-gray-500">({names.english})</span>
              </div>
              {currentLanguage === langCode && <FiCheck className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcherDropdown;