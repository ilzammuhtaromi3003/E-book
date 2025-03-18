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
      // Transisi yang lebih lambat dan lebih halus
      leftPano.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${value}px)`;
      // Transisi yang lebih lambat dan lebih halus
      rightPano.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
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
    // Reset scroll ke 0
    panoramaState.scrollValue = 0;
    
    // Update semua elemen panorama dengan hard reset
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      // Hapus transisi untuk reset instan
      leftPano.style.transition = 'none';
      leftPano.style.transform = 'translateX(0px)';
      // Force reflow
      void leftPano.offsetWidth;
      // Kembalikan transisi
      setTimeout(() => {
        leftPano.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
      }, 50);
    }
    
    if (rightPano) {
      // Hapus transisi untuk reset instan
      rightPano.style.transition = 'none';
      rightPano.style.transform = 'translateX(0px)';
      // Force reflow
      void rightPano.offsetWidth;
      // Kembalikan transisi
      setTimeout(() => {
        rightPano.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
      }, 50);
    }
    
    // Notify all callbacks
    panoramaState.notifyCallbacks();
  }
};