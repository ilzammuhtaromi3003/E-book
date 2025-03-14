// components/Flipbook/types.ts

export interface PageProps {
    pageNumber: number;
    showVideoButton?: boolean;
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
    pageDisplay: string;
    totalPages: number;
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onDownload: () => void;
    onToggleFullscreen: () => void;
    isFullscreen: boolean;
  }