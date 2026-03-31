import { Metadata } from "next";
import "./globals.css";
import Queryclientprovider from "./queryClient";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Header } from "@/components/header-2";
import { NavWrapper } from "@/provider/nav-wrapper";
import HoverFooter from "@/components/footer";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/services/profiles";

// Font optimizasyonu - sadece gerekli ağırlıklar
const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"], // Sadece kullandığın ağırlıklar
  variable: "--font-inter",
});

import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "CheFood AI | Yapay Zeka Destekli Yemek Tarifleri",
    template: "%s | CheFood AI",
  },
  icons: {
    icon: "/icon1.png",
  },
  metadataBase: new URL("https://chefoodai.com"),
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
    canonical: "/",
    languages: {
      "tr-TR": "/tr",
      "en-US": "/en",
      "de-DE": "/de",
      "x-default": "/",
    },
  },
  verification: {
    google: "ZthQntL_bdSYhNe74uXr_tQKIEr4K-gQwem01txYEPs",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://chefoodai.com",
    title: "CheFood AI - Yapay Zeka Destekli Yemek Tarifleri",
    description:
      "Yapay zeka ile özel yemek tarifleri oluşturun. Malzemelerinizi girin, adım adım tarifler alın. Ücretsiz ve kolay kullanım.",
    siteName: "CheFood AI",
    images: [
      {
        url: "https://chefoodai.com/fotochef.webp", // Mutlak URL
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
    images: ["https://chefoodai.com/fotochef.webp"],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let profile = null;

  if (user) {
    try {
      profile = await getMyProfile();
    } catch (e) {
      console.error("Layout profile fetch error:", e);
    }
  }

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
        <JsonLd data={jsonLdApp} />
        <JsonLd data={jsonLdOrg} />
      </head>

      <body className={`${interFont.className} flex flex-col min-h-screen dark antialiased`}>

        <Queryclientprovider>
          <Analytics />
          <NavWrapper>
            <Header profile={profile} />
          </NavWrapper>

          <main className="flex-1">{children}</main>

          <NavWrapper hideOnCheckout={true}>
            <HoverFooter />
          </NavWrapper>
          <Toaster />
        </Queryclientprovider>
      </body>
    </html>
  );
}