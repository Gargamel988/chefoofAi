import ProfileClient from "@/components/profile/ProfileClient";
import { getMyProfile } from "@/services/profiles";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import LoadingScreen from "@/app/loading";

export const metadata = {
    title: "Profilim",
    description: "Profil bilgilerinizi ve yemek tercihlerinizi yönetin.",
};

export default async function ProfilePage() {
    const queryClient = new QueryClient();

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
