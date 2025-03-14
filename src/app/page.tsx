// app/page.tsx
import Flipbook from "@/components/Flipbook"; // Perhatikan: tidak perlu mengubah import ini berkat index.tsx

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gray-200">
      <h1 className="text-3xl font-bold mb-6">E-Book Interaktif</h1>
      <div className="w-full h-full max-h-[80vh] flex items-center justify-center">
        <Flipbook />
      </div>
    </main>
  );
}