import RecipePage from "@/components/recıpepage";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Ne Pişirsem? | CheFood AI",
    description: "İçindekilerle tarif bul, yemek önerileri al ve mutfakta ilham keşfet.",
    path: "/whatever-cook",
    keywords: [
        "ne pişirsem",
        "içindekilerle tarif bul",
        "yemek önerileri",
        "tarif bulucu",
        "mutfak ilhamı",
        "kolay yemek tarifleri",
        "ai yemek asistanı",
        "yemek tarifleri",
        "pratik tarifler",
        "chefood ai tarif bul",
    ],
});

export default async function WhateverCookPage() {

    return (
        <Suspense fallback={<Loading />}>
            <RecipePage mode="standard" />
        </Suspense>
    );
}
