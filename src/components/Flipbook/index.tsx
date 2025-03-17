// components/Flipbook/index.ts

// Ekspor komponen utama
export { default } from './Flipbook';

// Ekspor komponen-komponen lainnya jika diperlukan
export { default as Cover } from './Cover';
export { default as Page } from './Page';
export { default as NavigationButtons } from './NavigationButtons';
export { default as ControlBar } from './ControlBar';
export { default as PanoramaSlider } from './PanoramaSlider';
export { PanoramaLeftPage, PanoramaRightPage } from './PanoramaPages';
export { panoramaState } from './PanoramaState';