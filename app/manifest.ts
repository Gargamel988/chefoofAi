import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "chefood-ai",
    name: "CheFood AI | Akıllı Yemek Asistanı",
    short_name: "CheFood AI",
    description:
      "Yapay zeka asistanınızla elinizdeki malzemelerden harika tarifler oluşturun ve mutfak rutininizi yönetin.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#ff8c00",
    categories: ["food", "lifestyle", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.webp",
        sizes: "512x512",
        type: "image/webp",
      },
      {
        src: "/logo.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
    ],
  };
}
