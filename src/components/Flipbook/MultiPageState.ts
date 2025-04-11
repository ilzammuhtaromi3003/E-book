// components/Flipbook/MultiPageState.ts

// Tipe untuk callback
type ScrollChangeCallback = (value: number) => void;

// Store untuk nilai scroll halaman multi-page
export const multiPageState = {
  scrollValue: 0, // Nilai slider saat ini
  // Track nilai transformasi terakhir untuk menghindari patah-patah
  lastTransformX: 0,
  lastDirection: 0, // -1: kiri, 0: diam, 1: kanan
  sliderMax: 1000, // Nilai maksimum slider
  scrollFactor: 2.73, // Faktor pengali default untuk scroll
  animating: false, // Mencegah update berulang selama animasi
  animationFrameId: 0, // ID dari animasi frame untuk membatalkan jika diperlukan
  targetValue: null as number | null, // Target nilai terakhir, untuk menghindari gerakan salah arah
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
    // Hanya panggil callbacks jika tidak sedang animasi
    if (!multiPageState.animating) {
      multiPageState.callbacks.forEach(callback => callback(multiPageState.scrollValue));
    }
  },
  
  // Set scroll factor berdasarkan ukuran gambar
  setScrollFactor: (factor: number) => {
    if (factor > 0) {
      multiPageState.scrollFactor = factor;
      console.log(`Faktor scroll multi-page diperbarui ke: ${factor}`);
    }
  },
  
  // Fungsi untuk mendapatkan transformasi X saat ini dari elemen DOM
  getCurrentTransformX: () => {
    const multiPageElement = document.getElementById('multi-page-img-left');
    if (!multiPageElement) return multiPageState.lastTransformX;
    
    const transform = multiPageElement.style.transform;
    const match = transform.match(/translateX\(-?(\d+(?:\.\d+)?)px\)/);
    return match ? parseFloat(match[1]) : multiPageState.lastTransformX;
  },
  
  // Fungsi bantuan - langsung update gambar tanpa animasi
  updateImagePositionDirectly: (transformX: number) => {
    const multiPageElement = document.getElementById('multi-page-img-left');
    
    if (multiPageElement) {
      // Hapus transisi dan langsung update posisi
      multiPageElement.style.transition = 'none';
      multiPageElement.style.transform = `translateX(-${transformX}px)`;
      
      // Force reflow untuk memastikan perubahan diterapkan
      void multiPageElement.offsetWidth;
      
      // Update last transform
      multiPageState.lastTransformX = transformX;
    }
  },

  // Fungsi untuk menganimasikan pergerakan gambar tanpa patah-patah
  animateImageMove: (newScrollValue: number) => {
    // Batalkan animasi sebelumnya jika masih berjalan
    if (multiPageState.animationFrameId) {
      cancelAnimationFrame(multiPageState.animationFrameId);
      multiPageState.animationFrameId = 0;
    }
    
    // Tentukan arah gerakan
    const oldScrollValue = multiPageState.scrollValue;
    const direction = newScrollValue > oldScrollValue ? 1 : (newScrollValue < oldScrollValue ? -1 : 0);
    
    // Perbarui nilai scroll untuk UI (tanpa animasi)
    multiPageState.scrollValue = newScrollValue;
    
    // Set target nilai baru
    multiPageState.targetValue = newScrollValue;
    
    // Hitung posisi target transform
    const targetTransformX = newScrollValue * multiPageState.scrollFactor;
    
    // Untuk keamanan, refresh lastTransformX dengan posisi aktual di DOM
    if (Math.abs(multiPageState.lastDirection) > 0 && direction !== multiPageState.lastDirection) {
      // Jika ada perubahan arah, pastikan posisi terkini akurat
      const currentTransformX = multiPageState.getCurrentTransformX();
      if (currentTransformX > 0) {
        multiPageState.lastTransformX = currentTransformX;
      }
    }
    
    // Gunakan nilai transformasi terakhir sebagai awal
    const startTransformX = multiPageState.lastTransformX;
    
    // Simpan arah saat ini untuk referensi berikutnya
    multiPageState.lastDirection = direction;
    
    // Untuk kasus drag dengan perubahan arah, langsung update posisi
    if (Math.abs(direction) > 0 && Math.abs(targetTransformX - startTransformX) < 150) {
      multiPageState.updateImagePositionDirectly(targetTransformX);
      
      // Reset state
      multiPageState.animating = false;
      multiPageState.targetValue = null;
      
      // Panggil callback untuk update UI
      multiPageState.notifyCallbacks();
      return;
    }
    
    // Tandai sedang dalam proses animasi
    multiPageState.animating = true;
    
    // Waktu mulai dan durasi animasi
    const startTime = performance.now();
    const duration = 400; // Durasi animasi dalam ms
    
    // Fungsi untuk animasi gambar dengan kecepatan konstan (linear)
    const animateImage = (currentTime: number) => {
      // Cek apakah target nilai telah berubah dari yang awal
      if (multiPageState.targetValue !== newScrollValue) {
        // Target telah berubah, hentikan animasi ini
        return;
      }
      
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        // Hitung progress dengan pergerakan linear
        const progress = elapsedTime / duration;
        
        // Hitung nilai transformasi saat ini
        const currentTransformX = startTransformX + (targetTransformX - startTransformX) * progress;
        multiPageState.lastTransformX = currentTransformX;
        
        // Update DOM element untuk gambar
        const multiPageElement = document.getElementById('multi-page-img-left');
        
        if (multiPageElement) {
          multiPageElement.style.transition = 'none'; // Hapus transisi CSS, gunakan animasi JS
          multiPageElement.style.transform = `translateX(-${currentTransformX}px)`;
        }
        
        // Lanjutkan animasi
        multiPageState.animationFrameId = requestAnimationFrame(animateImage);
      } else {
        // Animasi selesai, set ke nilai target tepat
        multiPageState.lastTransformX = targetTransformX;
        
        const multiPageElement = document.getElementById('multi-page-img-left');
        
        if (multiPageElement) {
          multiPageElement.style.transform = `translateX(-${targetTransformX}px)`;
        }
        
        // Tandai animasi selesai dan reset ID animasi
        multiPageState.animating = false;
        multiPageState.animationFrameId = 0;
        multiPageState.targetValue = null;
        
        // Panggil callback untuk update UI lainnya
        multiPageState.notifyCallbacks();
      }
    };
    
    // Mulai animasi atau pindahkan langsung berdasarkan jenis pergerakan
    if (Math.abs(targetTransformX - startTransformX) < 50) {
      // Untuk pergerakan kecil, langsung pindahkan gambar
      multiPageState.updateImagePositionDirectly(targetTransformX);
      
      // Reset state
      multiPageState.animating = false;
      multiPageState.targetValue = null;
      
      // Panggil callback untuk update UI
      multiPageState.notifyCallbacks();
    } else {
      // Untuk pergerakan besar, gunakan animasi
      multiPageState.animationFrameId = requestAnimationFrame(animateImage);
    }
    
    // Segera panggil callback untuk memperbarui UI slider
    multiPageState.notifyCallbacks();
  },
  
  setScrollValue: (value: number) => {
    console.log("MultiPageState setting scroll value to:", value);
    // Gunakan animasi untuk gambar saja
    multiPageState.animateImageMove(value);
  },
  
  scrollLeft: () => {
    const newValue = Math.max(0, multiPageState.scrollValue - 200);
    console.log("scrollLeft called, new value:", newValue);
    multiPageState.animateImageMove(newValue);
  },
  
  scrollRight: () => {
    const newValue = Math.min(1000, multiPageState.scrollValue + 200);
    console.log("scrollRight called, new value:", newValue);
    multiPageState.animateImageMove(newValue);
  },
    reset: () => {
    console.log("Resetting scroll value to 0");
    // Reset scroll ke 0 dengan animasi mulus
    multiPageState.animateImageMove(0);
  }
};