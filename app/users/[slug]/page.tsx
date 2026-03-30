import { GetProfileById } from "@/services/profiles";
import { CheckIfFollowing } from "@/services/social";
import { GetRecipesByUserId } from "@/services/recipes";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";

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
