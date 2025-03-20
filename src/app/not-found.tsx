// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-xl mb-8">
        Maaf, halaman yang Anda cari tidak ditemukan.
      </p>
      <Link 
        href="/en" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}