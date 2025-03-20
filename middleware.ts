// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar bahasa yang didukung
const supportedLocales = ['en', 'id', 'jp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Cek apakah jalur sudah memiliki locale
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 2. Jika jalur adalah root, alihkan ke /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // 3. Tambahkan locale default ke jalur lain
  return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
}

// Konfigurasi matcher yang lebih sederhana
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};