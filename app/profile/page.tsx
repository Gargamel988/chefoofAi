import ProfileClient from "@/components/profile/ProfileClient";
import { getMyProfile } from "@/services/profiles";
import {
    dehydrate,
    HydrationBoundary,
} from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { Suspense } from "react";
import LoadingScreen from "@/app/loading";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Profilim | CheFood AI",
    description: "Kişisel profil bilgilerinizi, mutfak tercihlerinizi ve hesap ayarlarınızı buradan yönetin.",
    path: "/profile",
    noIndex: true,
});

export default async function ProfilePage() {
    const queryClient = createQueryClient();

    // Prefetch user profile
    await queryClient.prefetchQuery({
        queryKey: ["profile", "me"],
        queryFn: getMyProfile,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingScreen />}>
                <ProfileClient />
            </Suspense>
        </HydrationBoundary>
    );
}
