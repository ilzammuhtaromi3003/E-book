// components/Flipbook/PanoramaState.ts

// Tipe untuk callback
type ScrollChangeCallback = (value: number) => void;

// Store untuk nilai scroll panorama global
export const panoramaState = {
  scrollValue: 0,
  sliderMax: 1000, // Nilai maksimum untuk slider UI tetap 1000
  scrollFactor: 2.85, // Faktor pengali default yang lebih besar
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
  
  // Fungsi untuk mengatur faktor scroll
  setScrollFactor: (factor: number) => {
    if (factor > 0) {
      panoramaState.scrollFactor = factor;
      console.log(`ScrollFactor disetel ke: ${factor}`);
    }
  },
  
  setScrollValue: (value: number) => {
    // Simpan nilai slider asli
    panoramaState.scrollValue = value;

    // Update semua elemen panorama dengan nilai scroll sebenarnya
    const leftPano = document.getElementById('panorama-img-left');
    const rightPano = document.getElementById('panorama-img-right');
    
    if (leftPano) {
      leftPano.style.transform = `translateX(-${value * panoramaState.scrollFactor}px)`;
      leftPano.style.transition = 'transform 0.8s ease';
    }
    
    if (rightPano) {
      rightPano.style.transform = `translateX(-${value * panoramaState.scrollFactor}px)`;
      rightPano.style.transition = 'transform 0.8s ease';
    }
    
    // Notify all callbacks about the change
    panoramaState.notifyCallbacks();
  },
  
  scrollLeft: () => {
    const newValue = Math.max(0, panoramaState.scrollValue - 100);
    panoramaState.setScrollValue(newValue);
  },
  
  scrollRight: () => {
    const newValue = Math.min(panoramaState.sliderMax, panoramaState.scrollValue + 100);
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
        leftPano.style.transition = 'transform 0.8s ease';
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
        rightPano.style.transition = 'transform 0.8s ease';
      }, 50);
    }
    
    // Notify all callbacks
    panoramaState.notifyCallbacks();
  }
};