import React from 'react';

// Define supported languages
const languages = ['en', 'id', 'jp'];

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      {/* We don't need to add anything special here since the language 
          will be handled by the components using usePathname() */}
      {children}
    </>
  );
}