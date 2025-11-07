import { Metadata } from "next";
import "./globals.css";
import Queryclientprovider from "./queryClient";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Font optimizasyonu - sadece gerekli ağırlıklar
const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"], // Sadece kullandığın ağırlıklar
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CheFood AI",
    template: "%s | CheFood AI",
  },
  metadataBase: new URL("https://chefoodai.vercel.app"),
  description:
    "Yapay zeka destekli tarif platformunda hızlı ve lezzetli yemek tarifleri keşfedin. Malzemelerinizi girin, size özel tarifler oluşturalım. Ücretsiz AI yemek asistanı.",
  keywords: [
    "yapay zeka yemek tarifi",
    "ai tarif asistanı",
    "online yemek tarifleri",
    "kolay yemek tarifleri",
    "hızlı tarifler",
    "malzeme bazlı tarif",
    "yemek nasıl yapılır",
    "türk mutfağı tarifleri",
    "dünya mutfağı",
    "pratik tarifler",
  ],
  authors: [{ name: "Ömer Aydın" }],
  creator: "Ömer Aydın",
  publisher: "CheFood AI",
  alternates: {
    canonical: "https://chefoodai.vercel.app",
  },
  verification: {
    google: "ZthQntL_bdSYhNe74uXr_tQKIEr4K-gQwem01txYEPs",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://chefoodai.vercel.app",
    title: "CheFood AI - Yapay Zeka Destekli Yemek Tarifleri",
    description:
      "Yapay zeka ile özel yemek tarifleri oluşturun. Malzemelerinizi girin, adım adım tarifler alın. Ücretsiz ve kolay kullanım.",
    siteName: "CheFood AI",
    images: [
      {
        url: "https://chefoodai.vercel.app/fotochef.webp", // Mutlak URL
        width: 1200,
        height: 630,
        alt: "CheFood AI - Yapay Zeka Yemek Tarifi Platformu",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CheFood AI - Yapay Zeka Destekli Yemek Tarifleri",
    description:
      "Yapay zeka ile özel yemek tarifleri oluşturun. Malzemelerinizi girin, adım adım tarifler alın.",
    images: ["https://chefoodai.vercel.app/fotochef.webp"], // Mutlak URL
    creator: "@omerAIdev",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CheFood AI",
    description: "Yapay zeka destekli yemek tarifi platformu",
    url: "https://chefoodai.vercel.app",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    creator: {
      "@type": "Person",
      name: "Ömer Aydın",
    },
    inLanguage: "tr-TR",
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CheFood AI",
    url: "https://chefoodai.vercel.app",
    logo: "https://chefoodai.vercel.app/fotochef.webp",
    sameAs: ["https://x.com/omerAIdev"],
  };

  return (
    <html lang="tr" className={interFont.variable}>
      <head>
        {/* Viewport - Mobil için kritik */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />        
        {/* Theme color */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        {/* Preconnect - Performans için */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>

      <body className={`${interFont.className} flex flex-col min-h-screen antialiased`}>
        <Queryclientprovider>
          {/* Analytics - Sadece production'da yükle */}
          {process.env.NODE_ENV === "production" && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
          
          <main className="flex-1">{children}</main>
          
          <footer className="text-center text-sm text-gray-500 mt-auto z-10">
            <div className="flex items-center justify-center p-1 backdrop-blur-md border-t-2 border-t-white/10">
              <p>© 2025 Ömer Aydın. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </Queryclientprovider>
      </body>
    </html>
  );
}