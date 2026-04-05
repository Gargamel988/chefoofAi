import FavoritesClient from "./FavoritesClient";
import { getFavorites } from "@/services/favorite";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import LoadingScreen from "../loading";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Favorilerim",
    description: "Kaydettiğiniz ve daha sonra pişirmek istediğiniz tüm tarifler.",
    path: "/favorites",
    noIndex: true,
});

export default async function FavoritesPage() {
    const queryClient = new QueryClient();

    // Prefetch favorites
    await queryClient.prefetchQuery({
        queryKey: ["favorites"],
        queryFn: () => getFavorites(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingScreen />}>
                <FavoritesClient />
            </Suspense>
        </HydrationBoundary>
    );
}
