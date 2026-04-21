import { Metadata } from "next";
import Link from "next/link";
import AdDisableGuard from "@/components/AdDisableGuard";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | CheFood AI",
  description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <AdDisableGuard />
      <h1 className="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Üzgünüz, aradığınız sayfaya ulaşılamıyor. Aşağıdaki popüler kategorilere göz atmak ister misiniz?
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/discover" className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
          🍱 Keşfet
        </Link>
        <Link href="/recipe/fast" className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
          ⏱️ Hızlı Tarifler
        </Link>
        <Link href="/recipe/popular" className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
          ⭐ Popüler
        </Link>
        <Link href="/recipe/random" className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
          🎲 Rastgele
        </Link>
      </div>

      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
