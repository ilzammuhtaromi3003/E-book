// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Alihkan langsung ke /en
  redirect('/en');
  
  // Komponen ini tidak akan pernah di-render karena redirect
  return null;
}