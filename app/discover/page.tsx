import KesfetClient from "./KesfetClient";
import { GetPublicRecipes } from "@/services/recipes";
import { GetPopularProfiles, getMyProfile } from "@/services/profiles";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { DiscoverSkeleton } from "@/components/discover/DiscoverSkeleton";

export const metadata = {
    title: "En Popüler Tarifler ve Şefler | CheFood AI",
    description: "Topluluğun en sevilen tariflerini, şefleri ve koleksiyonları keşfet. Kendi tariflerini paylaş ve yeni lezzetler bul.",
    alternates: {
        canonical: "/discover",
    },
    openGraph: {
        title: "En Popüler Tarifler ve Şefler | CheFood AI",
        description: "Topluluğun en sevilen tariflerini, şefleri ve koleksiyonları keşfet. Kendi tariflerini paylaş ve yeni lezzetler bul.",
        url: "https://chefoodai.com/discover",
        siteName: "CheFood AI",
        images: [
            {
                url: "https://chefoodai.com/fotochef.webp",
                width: 1200,
                height: 630,
                alt: "CheFood AI - Yapay Zeka Yemek Tarifi Platformu",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "En Popüler Tarifler ve Şefler | CheFood AI",
        description: "Topluluğun en sevilen tariflerini, şefleri ve koleksiyonları keşfet. Kendi tariflerini paylaş ve yeni lezzetler bul.",
        images: ["https://chefoodai.com/fotochef.webp"],
        creator: "@omerAIdev",
    },
};

type User = {
    id: string;
    displayName: string;
    avatarUrl: string | null;
};

export default async function KesfetPage() {
    const queryClient = new QueryClient();
    const profile = await getMyProfile();

    const userInfo: User | null = profile ? {
        id: profile.id || "",
        displayName: profile.name || "Kullanıcı",
        avatarUrl: profile.avatar_url ?? null
    } : null;

    // Use standardized services for prefetching
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["recipes", 20],
            queryFn: async () => {
                const { data } = await GetPublicRecipes(20);
                return data || [];
            },
        }),
        queryClient.prefetchQuery({
            queryKey: ["profiles", "popular", 10],
            queryFn: async () => {
                const { data } = await GetPopularProfiles(10);
                return data || [];
            },
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<DiscoverSkeleton />}>
                <KesfetClient user={userInfo} />
            </Suspense>
        </HydrationBoundary>
    );
}
