// components/Flipbook/types.ts

export interface PageProps {
  pageNumber: number;
  showVideoButton?: boolean;
  isPanoramaLeft?: boolean;
  isPanoramaRight?: boolean;
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
  isFullscreen: boolean;
}

export interface NavbarProps {
  pageDisplay: string;
  totalPages: number;
  onGoToPage: (page: number) => void;
}
