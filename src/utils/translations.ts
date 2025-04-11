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
  },
  
  // Table of Contents
  tableOfContents: {
    en: "Table of Contents",
    id: "Daftar Isi",
    jp: "目次"
  },
  tocTitle: {
    en: "Table of Contents",
    id: "Daftar Isi",
    jp: "目次"
  },
  contents: {
    en: "Contents",
    id: "Konten",
    jp: "コンテンツ"
  },
  messages: {
    en: "Messages",
    id: "Pesan",
    jp: "メッセージ"
  },
  theChiefExecutive: {
    en: "The Chief Executive",
    id: "Kepala Eksekutif",
    jp: "行政長官"
  },
  theFinancialSecretary: {
    en: "The Financial Secretary",
    id: "Sekretaris Keuangan",
    jp: "財政長官"
  },
  deputyFinancialSecretary: {
    en: "Deputy Financial Secretary",
    id: "Wakil Sekretaris Keuangan",
    jp: "財政副長官"
  },
  secretaryForDevelopment: {
    en: "Secretary for Development",
    id: "Sekretaris Pembangunan",
    jp: "開発長官"
  },
  secretaryForHousing: {
    en: "Secretary for Housing",
    id: "Sekretaris Perumahan",
    jp: "住宅長官"
  },
  secretaryForHomeAndYouthAffairs: {
    en: "Secretary for Home and Youth Affairs",
    id: "Sekretaris Urusan Rumah dan Pemuda",
    jp: "内務青少年問題長官"
  },
  pastChairmen: {
    en: "Past Chairmen",
    id: "Ketua Terdahulu",
    jp: "歴代議長"
  },
  pastExecutiveDirector: {
    en: "Past Executive Director/Chief Executive Officer and Executive Director",
    id: "Direktur Eksekutif/CEO dan Direktur Eksekutif Terdahulu",
    jp: "歴代エグゼクティブディレクター/CEOおよびエグゼクティブディレクター"
  },
  chairmanAndExecutiveDirector: {
    en: "Chairman and Executive Director/Chief Executive Officer and Executive Director",
    id: "Ketua dan Direktur Eksekutif/CEO dan Direktur Eksekutif",
    jp: "議長およびエグゼクティブディレクター/CEOおよびエグゼクティブディレクター"
  },
  foreword: {
    en: "Foreword",
    id: "Kata Pengantar",
    jp: "序文"
  },
  chairman: {
    en: "Chairman",
    id: "Ketua",
    jp: "議長"
  },
  chiefExecutiveOfficer: {
    en: "Chief Executive Officer and Executive Director",
    id: "CEO dan Direktur Eksekutif",
    jp: "最高経営責任者およびエグゼクティブディレクター"
  },
  ourStory: {
    en: "Our Story",
    id: "Cerita Kami",
    jp: "私たちの物語"
  },
  aboutRentalEstates: {
    en: "About Rental Estates",
    id: "Tentang Perumahan Sewa",
    jp: "レンタル物件について"
  },
  aboutLiveableHomes: {
    en: "About Liveable Homes",
    id: "Tentang Rumah Layak Huni",
    jp: "住みやすい住宅について"
  },
  aboutInnovations: {
    en: "About Innovations",
    id: "Tentang Inovasi",
    jp: "イノベーションについて"
  },
  weavingOurFuture: {
    en: "Weaving Our Future",
    id: "Merajut Masa Depan Kami",
    jp: "私たちの未来を紡ぐ"
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