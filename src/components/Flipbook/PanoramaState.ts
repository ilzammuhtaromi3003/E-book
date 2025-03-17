// components/Flipbook/PanoramaState.ts

// Tipe untuk callback
type ScrollChangeCallback = (value: number) => void;

// Store untuk nilai scroll panorama global
export const panoramaState = {
  scrollValue: 0,
  callbacks: [] as ScrollChangeCallback[],
  
  // Register callback untuk notifikasi perubahan scroll
  registerCallback: (callback: ScrollChangeCallback) => {
    panoramaState.callbacks.push(callback);
    return () => {
      panoramaState.callbacks = panoramaState.callbacks.filter(cb => cb !== callback);
    };
  },
  
  // Notify all callbacks
  notifyCallbacks: () => {
    panoramaState.callbacks.forEach(callback => callback(panoramaState.scrollValue));
  },
  
  setScrollValue: (value: number) => {
    panoramaState.scrollValue = value;
    
    // Update semua elemen panorama
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      leftPano.style.transform = `translateX(-${value}px)`;
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${value}px)`;
    }
    
    // Notify all callbacks about the change
    panoramaState.notifyCallbacks();
  },
  
  scrollLeft: () => {
    const newValue = Math.max(0, panoramaState.scrollValue - 200);
    panoramaState.setScrollValue(newValue);
  },
  
  scrollRight: () => {
    const newValue = Math.min(1000, panoramaState.scrollValue + 200);
    panoramaState.setScrollValue(newValue);
  },
  
  reset: () => {
    panoramaState.scrollValue = 0;
    panoramaState.setScrollValue(0);
  }
};