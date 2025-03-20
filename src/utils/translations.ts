// src/utils/translations.ts

// Define the structure of our translations
export interface Translations {
    [key: string]: {
      [key: string]: string;
    };
  }
  
  // Define all translations
  export const translations: Translations = {
    // Navbar texts
    bookTitle: {
      en: "75 Stories of the Hong Kong Housing Society",
      id: "75 Cerita tentang Masyarakat Perumahan Hong Kong",
      jp: "香港住宅協会の75の物語"
    },
    pageLabel: {
      en: "Page:",
      id: "Halaman:",
      jp: "ページ:"
    },
    
    // Button texts
    home: {
      en: "Home",
      id: "Beranda",
      jp: "ホーム"
    },
    thumbnails: {
      en: "Thumbnails",
      id: "Thumbnail",
      jp: "サムネイル"
    },
    zoomIn: {
      en: "Zoom In",
      id: "Perbesar",
      jp: "ズームイン"
    },
    zoomOut: {
      en: "Zoom Out",
      id: "Perkecil",
      jp: "ズームアウト"
    },
    download: {
      en: "Download",
      id: "Unduh",
      jp: "ダウンロード"
    },
    fullscreen: {
      en: "Fullscreen",
      id: "Layar Penuh",
      jp: "全画面表示"
    },
    exitFullscreen: {
      en: "Exit Fullscreen",
      id: "Keluar Layar Penuh",
      jp: "全画面表示を終了"
    },
    
    // Panorama slider tooltip
    dragToRight: {
      en: "PLEASE DRAG IT TO RIGHT",
      id: "SILAKAN GESER KE KANAN",
      jp: "右にドラッグしてください"
    },
    
    // Thumbnails sidebar
    thumbnailsTitle: {
      en: "Thumbnails",
      id: "Thumbnail",
      jp: "サムネイル"
    },
    cover: {    
      en: "Cover",
      id: "Sampul",
      jp: "表紙"
    },
    panorama: {
      en: "Panorama",
      id: "Panorama",
      jp: "パノラマ"
    },
    close: {
      en: "Close",
      id: "Tutup",
      jp: "閉じる"
    },
    scrollMode: {
        en: "Scroll Mode",
        id: "Mode Gulir",
        jp: "スクロールモード"
      },
      scrollInstruction: {
        en: "Scroll down to read all pages",
        id: "Gulir ke bawah untuk membaca semua halaman",
        jp: "下にスクロールしてすべてのページを読む"
      },
      panoramaPages: {
        en: "31-37 (Panorama)",
        id: "31-37 (Panorama)",
        jp: "31-37 (パノラマ)"
      }
    
  };
  
  // Helper function to get a translation
  export function getTranslation(key: string, lang: string): string {
    // If the key doesn't exist or the language doesn't exist for that key, return the English version as fallback
    if (!translations[key] || !translations[key][lang]) {
      return translations[key]?.['en'] || key;
    }
    
    return translations[key][lang];
  }