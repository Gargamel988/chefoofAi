import { Metadata } from "next";
import "./globals.css";
import Queryclientprovider from "./queryClient";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
        url: "/fotochef.jpg",
        width: 1200,
        height: 630,
        alt: "CheFood AI - Yapay Zeka Yemek Tarifi Platformu",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CheFood AI - Yapay Zeka Destekli Yemek Tarifleri",
    description:
      "Yapay zeka ile özel yemek tarifleri oluşturun. Malzemelerinizi girin, adım adım tarifler alın.",
    images: ["/fotochef.jpg"],
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
  // --- JSON-LD Şemaları (Google için logo ve marka tanıma) ---
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
    logo: "https://chefoodai.vercel.app/fotochef.jpg",
    sameAs: ["https://x.com/omerAIdev"],
  };

  return (
    <html lang="tr">
      <head>
        {/* --- Favicon ve logo --- */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/fotochef.jpg" />
        <meta name="theme-color" content="#ffffff" />

        {/* --- JSON-LD verileri --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>

      <body className={`${interFont.className} flex flex-col min-h-screen`}>
        <Queryclientprovider>
          <Analytics />
          <SpeedInsights />
          <main>{children}</main>
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
