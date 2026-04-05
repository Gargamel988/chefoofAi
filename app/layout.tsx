import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Queryclientprovider from "./queryClient";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Header } from "@/components/header-2";
import { NavWrapper } from "@/provider/nav-wrapper";
import HoverFooter from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/services/profiles";
import JsonLd from "@/components/JsonLd";
import AdSenseScript from "@/components/adsense-script";
import { rootMetadata } from "@/lib/seo";
import CookieConsent from "@/components/CookieConsent";

// Font optimizasyonu - sadece gerekli ağırlıklar
const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"], // Sadece kullandığın ağırlıklar
  variable: "--font-inter",
});

export const metadata = rootMetadata;



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
    url: "https://chefoodai.com",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    creator: {
      "@type": "Organization",
      name: "Hatay yazılım",
    },
    inLanguage: "tr-TR",
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CheFood AI",
    url: "https://chefoodai.com",
    logo: "https://chefoodai.com/fotochef.webp",
    sameAs: ["https://x.com/omerAIdev"],
  };

  return (
    <html lang="tr" className={interFont.variable}>
      <head>
        <JsonLd data={jsonLdApp} />
        <JsonLd data={jsonLdOrg} />

        {/* AdSense Verification Script - Using standard script for crawler visibility */}
        <AdSenseScript />
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
          <CookieConsent />
        </Queryclientprovider>
      </body>
    </html>
  );
}