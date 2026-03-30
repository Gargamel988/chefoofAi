import ProfilePublicClient from "@/components/profile/ProfilePublicClient";
import { GetProfileById } from "@/services/profiles";
import { GetRecipesByUserId } from "@/services/recipes";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ sluıg: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { sluıg } = await params;
    const queryClient = new QueryClient();

    // Prefetch profile data
    await queryClient.prefetchQuery({
        queryKey: ["profile", sluıg],
        queryFn: async () => {
            const { data, error } = await GetProfileById(sluıg);
            if (error || !data) throw new Error("Profile not found");
            return data;
        },
    });

    // Prefetch user recipes
    await queryClient.prefetchQuery({
        queryKey: ["recipes", "user", sluıg],
        queryFn: async () => {
            const { data, error } = await GetRecipesByUserId(sluıg);
            if (error) throw error;
            return data || [];
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <ProfilePublicClient userId={sluıg} />
            </Suspense>
        </HydrationBoundary>
    );
}
