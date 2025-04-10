// components/Flipbook/MultiPageState.ts

// Tipe untuk callback
type ScrollChangeCallback = (value: number) => void;

// Store untuk nilai scroll halaman multi-page
export const multiPageState = {
  scrollValue: 0,
  callbacks: [] as ScrollChangeCallback[],
  
  // Register callback untuk notifikasi perubahan scroll
  registerCallback: (callback: ScrollChangeCallback) => {
    multiPageState.callbacks.push(callback);
    return () => {
      multiPageState.callbacks = multiPageState.callbacks.filter(cb => cb !== callback);
    };
  },
  
  // Notify all callbacks
  notifyCallbacks: () => {
    multiPageState.callbacks.forEach(callback => callback(multiPageState.scrollValue));
  },
  
  setScrollValue: (value: number) => {
    console.log("MultiPageState setting scroll value to:", value);
    multiPageState.scrollValue = value;
    
    // Update semua elemen multi-page
    const leftMultiPage = document.getElementById('multi-page-img-left');
    
    if (leftMultiPage) {
      leftMultiPage.style.transform = `translateX(-${value}px)`;
      // Transisi yang halus
      leftMultiPage.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
    } else {
      console.log("Element 'multi-page-img-left' not found");
    }
    
    // Notify all callbacks about the change
    multiPageState.notifyCallbacks();
  },
  
  scrollLeft: () => {
    const newValue = Math.max(0, multiPageState.scrollValue - 200);
    console.log("scrollLeft called, new value:", newValue);
    multiPageState.setScrollValue(newValue);
  },
  
  scrollRight: () => {
    const newValue = Math.min(1000, multiPageState.scrollValue + 200);
    console.log("scrollRight called, new value:", newValue);
    multiPageState.setScrollValue(newValue);
  },
  
  reset: () => {
    console.log("Resetting scroll value to 0");
    // Reset scroll ke 0
    multiPageState.scrollValue = 0;
    
    // Update multi-page element dengan hard reset
    const leftMultiPage = document.getElementById('multi-page-img-left');
    
    if (leftMultiPage) {
      // Hapus transisi untuk reset instan
      leftMultiPage.style.transition = 'none';
      leftMultiPage.style.transform = 'translateX(0px)';
      // Force reflow
      void leftMultiPage.offsetWidth;
      // Kembalikan transisi
      setTimeout(() => {
        leftMultiPage.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.4, 0.2, 1)';
      }, 50);
    }
    
    // Notify all callbacks
    multiPageState.notifyCallbacks();
  }
};