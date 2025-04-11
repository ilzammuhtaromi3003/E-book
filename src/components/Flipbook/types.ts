// components/Flipbook/types.ts

export interface PageProps {
  pageNumber: number;
  showVideoButton?: boolean;
  isPanoramaLeft?: boolean;
  isPanoramaRight?: boolean;
  isActive?: boolean; // Add this property to control video playback
  lang?: string;     // Add language prop
}

export interface BottomIndicatorProps {
  currentIndex: number;
  onChange: (index: number) => void;
}

export interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  isPanorama: boolean;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
}

export interface ControlBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  onToggleFullscreen: () => void;
  onGoHome: () => void;
  onToggleThumbnails: () => void;
  isFullscreen: boolean;
  showThumbnails: boolean;
}

export interface NavbarProps {
  pageDisplay: string;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

export interface ThumbnailsProps {
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (pageNumber: number) => void;
  totalPages: number;
  currentPage: number;
}

export interface FlipbookProps {
  lang?: string;
}

export interface CoverProps {
  lang?: string;
}

export interface ControlBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  onToggleFullscreen: () => void;
  onGoHome: () => void;
  onToggleThumbnails: () => void;
  onToggleTableOfContents: () => void;
  isFullscreen: boolean;
  showThumbnails: boolean;
  showTableOfContents: boolean;
}

export interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  isPanorama: boolean;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
}