import { GetProfileById } from "@/services/profiles";
import { CheckIfFollowing } from "@/services/social";
import { GetRecipesByUserId } from "@/services/recipes";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const { data: profile } = await GetProfileById(slug);

    if (!profile) return {};

    return buildPageMetadata({
        title: `${profile.name} - Profil Sayfası`,
        description: `${profile.name}'in paylaştığı tarifler ve profil bilgileri.`,
        path: `/users/${slug}`,
        image: profile.avatar_url
            ? { url: profile.avatar_url, alt: profile.name }
            : undefined,
        keywords: [
            profile.name,
            "şef profili",
            "yemek tarifleri",
            "popüler tarifler",
            "chefood ai şef",
            "özel yemek koleksiyonu",
            "mutfak asistanı",
        ],
        noIndex: true,
    });
}

export default async function PublicProfilePage({
    params,
}: {
    params: { slug: string };
}) {
    const username = params.slug;

    // Fetch the profile being viewed
    const { data: profile, error: profileError } = await GetProfileById(username);

    if (profileError || !profile) {
        notFound();
    }

    // Determine current user context
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isOwnProfile = user?.id === profile.id;

    // Check if current user is following this profile
    let isFollowing = false;
    if (user && !isOwnProfile) {
        const { isFollowing: followingStatus } = await CheckIfFollowing(profile.id);
        isFollowing = followingStatus;
    }

    // Fetch recipes
    const { data: recipes } = await GetRecipesByUserId(profile.id);

    // Filter recipes based on privacy if it's not our own profile
    let visibleRecipes = recipes || [];
    if (!isOwnProfile && profile.privacy_ai_recipes_public === false) {
        visibleRecipes = visibleRecipes.filter(r => r.is_public);
    }

    return (
        <PublicProfileClient
            profile={profile}
            initialIsFollowing={isFollowing}
            recipes={visibleRecipes}
            isOwnProfile={isOwnProfile}
            isAuthenticated={!!user}
        />
    );
}
