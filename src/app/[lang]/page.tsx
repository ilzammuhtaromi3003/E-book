// src/app/[lang]/page.tsx
import ResponsiveFlipbookWrapper from "@/components/ResponsiveFlipbookWrapper";

// Versi async dari fungsi komponen
export default async function LangPage({
  params
}: {
  params: { lang: string }
}) {
  // Simulasi await pada params untuk menghindari warning
  const lang = (await Promise.resolve(params)).lang;
  
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gray-200 p-0 md:p-4">
      <div className="w-full h-full max-h-[100vh] flex items-center justify-center">
        <ResponsiveFlipbookWrapper lang={lang} />
      </div>
    </main>
  );
}