// components/Flipbook/PanoramaState.ts

// Tipe untuk callback
type ScrollChangeCallback = (value: number) => void;

// Store untuk nilai scroll panorama global
export const panoramaState = {
  scrollValue: 0, // Nilai slider saat ini
  // Track nilai transformasi terakhir untuk menghindari patah-patah
  lastTransformX: 0, 
  sliderMax: 1000, // Nilai maksimum untuk slider UI tetap 1000
  scrollFactor: 2.71, // Faktor pengali default
  animating: false, // Mencegah update berulang selama animasi
  animationFrameId: 0, // ID dari animasi frame untuk membatalkan jika diperlukan
  targetValue: null as number | null, // Target nilai terakhir, untuk menghindari gerakan salah arah
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
    // Hanya panggil callbacks jika tidak sedang animasi
    if (!panoramaState.animating) {
      panoramaState.callbacks.forEach(callback => callback(panoramaState.scrollValue));
    }
  },
  
  // Fungsi untuk mengatur faktor scroll
  setScrollFactor: (factor: number) => {
    if (factor > 0) {
      panoramaState.scrollFactor = factor;
      console.log(`ScrollFactor disetel ke: ${factor}`);
    }
  },
  
  // Fungsi untuk menganimasikan pergerakan gambar tanpa patah-patah
  animateImageMove: (newScrollValue: number) => {
    // Batalkan animasi sebelumnya jika masih berjalan
    if (panoramaState.animationFrameId) {
      cancelAnimationFrame(panoramaState.animationFrameId);
    }
    
    // Update nilai scroll langsung (untuk slider UI)
    const oldScrollValue = panoramaState.scrollValue;
    panoramaState.scrollValue = newScrollValue;
    
    // Set target nilai baru
    panoramaState.targetValue = newScrollValue;
    
    // Hitung posisi target transformasi
    const targetTransformX = newScrollValue * panoramaState.scrollFactor;
    
    // Gunakan nilai transformasi terakhir sebagai awal
    // Jika ini perubahan pertama, hitung berdasarkan nilai scroll
    const startTransformX = panoramaState.lastTransformX || (oldScrollValue * panoramaState.scrollFactor);
    
    // Tandai sedang dalam proses animasi
    panoramaState.animating = true;
    
    // Waktu mulai dan durasi animasi
    const startTime = performance.now();
    const duration = 400; // Durasi animasi dalam ms
    
    // Fungsi untuk animasi gambar dengan kecepatan konstan (linear)
    const animateImage = (currentTime: number) => {
      // Cek apakah target nilai telah berubah dari yang awal
      if (panoramaState.targetValue !== newScrollValue) {
        // Target telah berubah, hentikan animasi ini
        return;
      }
      
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        // Hitung progress dengan pergerakan linear
        const progress = elapsedTime / duration;
        
        // Hitung nilai transformasi saat ini
        const currentTransformX = startTransformX + (targetTransformX - startTransformX) * progress;
        panoramaState.lastTransformX = currentTransformX;
        
        // Update DOM elements untuk gambar
        const leftPano = document.getElementById('panorama-img-left');
        const rightPano = document.getElementById('panorama-img-right');
        
        if (leftPano) {
          leftPano.style.transition = 'none'; // Hapus transisi CSS, gunakan animasi JS
          leftPano.style.transform = `translateX(-${currentTransformX}px)`;
        }
        
        if (rightPano) {
          rightPano.style.transition = 'none';
          rightPano.style.transform = `translateX(-${currentTransformX}px)`;
        }
        
        // Lanjutkan animasi
        panoramaState.animationFrameId = requestAnimationFrame(animateImage);
      } else {
        // Animasi selesai, set ke nilai target tepat
        panoramaState.lastTransformX = targetTransformX;
        
        const leftPano = document.getElementById('panorama-img-left');
        const rightPano = document.getElementById('panorama-img-right');
        
        if (leftPano) {
          leftPano.style.transform = `translateX(-${targetTransformX}px)`;
        }
        
        if (rightPano) {
          rightPano.style.transform = `translateX(-${targetTransformX}px)`;
        }
        
        // Tandai animasi selesai dan reset ID animasi
        panoramaState.animating = false;
        panoramaState.animationFrameId = 0;
        panoramaState.targetValue = null;
        
        // Panggil callback untuk update UI lainnya
        panoramaState.notifyCallbacks();
      }
    };
    
    // Mulai animasi (namun pastikan nilai gambar diperbarui segera untuk slider UI)
    // Handle kasus khusus untuk drag - langsung pindahkan gambar jika perbedaannya kecil
    if (Math.abs(targetTransformX - startTransformX) < 50) {
      // Untuk pergerakan kecil (seperti drag), langsung pindahkan gambar
      panoramaState.lastTransformX = targetTransformX;
      
      const leftPano = document.getElementById('panorama-img-left');
      const rightPano = document.getElementById('panorama-img-right');
      
      if (leftPano) {
        leftPano.style.transition = 'none';
        leftPano.style.transform = `translateX(-${targetTransformX}px)`;
      }
      
      if (rightPano) {
        rightPano.style.transition = 'none';
        rightPano.style.transform = `translateX(-${targetTransformX}px)`;
      }
      
      // Reset state
      panoramaState.animating = false;
      panoramaState.targetValue = null;
      
      // Panggil callback untuk update UI
      panoramaState.notifyCallbacks();
    } else {
      // Untuk pergerakan besar, gunakan animasi
      panoramaState.animationFrameId = requestAnimationFrame(animateImage);
    }
    
    // Segera panggil callback untuk memperbarui UI slider
    panoramaState.notifyCallbacks();
  },
  
  setScrollValue: (value: number) => {
    // Gunakan animasi untuk gambar saja
    panoramaState.animateImageMove(value);
  },
  
  scrollLeft: () => {
    const newValue = Math.max(0, panoramaState.scrollValue - 100);
    panoramaState.animateImageMove(newValue);
  },
  
  scrollRight: () => {
    const newValue = Math.min(panoramaState.sliderMax, panoramaState.scrollValue + 100);
    panoramaState.animateImageMove(newValue);
  },
  
  reset: () => {
    // Reset scroll ke 0 dengan animasi mulus
    panoramaState.animateImageMove(0);
  }
};