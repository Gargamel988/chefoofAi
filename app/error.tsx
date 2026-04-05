"use client";

import { useEffect } from "react";
import { Metadata } from "next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Bir şeyler yanlış gitti!</h2>
      <p className="mb-8 text-muted-foreground">
        Uygulama yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Tekrar Dene
        </button>
        <a
          href="/"
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
}
