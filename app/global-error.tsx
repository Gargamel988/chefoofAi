"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="flex flex-col items-center justify-center min-h-screen px-4 text-center dark bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Kritik Bir Hata Oluştu</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Sistem genelinde bir sorun yaşandı. Lütfen sayfayı yenilemeyi deneyin.
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
        >
          Sistemi Yeniden Başlat
        </button>
      </body>
    </html>
  );
}
