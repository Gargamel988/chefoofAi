import { Metadata } from "next";
import "./globals.css";
import Queryclientprovider from "./queryClient";
import { Inter } from "next/font/google";

const interFont = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CheFood AI",
    template: "CheFood AI | %s",
  },
  description:"Yapay zeka destekli tarif platformunda, hızlı ve lezzetli yemek tarifleri keşfedin. En güncel ve pratik tarifler, tek sayfada size özel",
  keywords: [
    "yapay zeka",
    "tarif asistanı",
    "yemek pişirme",
    "yemek tarifi",
    "yemek tarifleri",
    "tarifler",
    "yemek nasıl yapılır",
    "yemek nasıl pişirilir",
    "yemek nasıl hazırlanır",
    "yemek nasıl pişirilir",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL as string),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "CheFood AI",
    description:
      "CheFood AI bir yapay zeka tarif asistanıdır. Hangi yemeği pişirmek istediğinizi söyleyin, size özel tarifler ve detaylı yapım aşamaları sunalım.",
    siteName: "CheFood AI",
    images: [
      {
        url: "/fotochef.jpg",
        width: 1200,
        height: 630,
        alt: "CheFood AI Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CheFood AI",
    description:
      "CheFood AI bir yapay zeka tarif asistanıdır. Hangi yemeği pişirmek istediğinizi söyleyin, size özel tarifler ve detaylı yapım aşamaları sunalım.",
    images: ["/fotochef.jpg"],
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
  return (
    <html lang="tr">
      <body className={`${interFont.className} flex flex-col min-h-screen`}>
        <Queryclientprovider>
          <main>{children}</main>
          <footer className="text-center text-sm text-gray-500 mt-auto z-10">
            <div className="flex items-center justify-center p-1 backdrop-blur-md  border-t-2 border-t-white/10">
              <p>© 2025 Ömer Aydın. Tüm hakları saklıdır. </p>
            </div>
          </footer>
        </Queryclientprovider>
      </body>
    </html>
  );
}
