"use client";

import { useSocial } from "@/hooks/useSocial";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { RecipeQuickStats } from "@/components/recipe/RecipeQuickStats";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeSteps } from "@/components/recipe/RecipeSteps";
import { RecipeNutrition } from "@/components/recipe/RecipeNutrition";
import { RecipeTips } from "@/components/recipe/RecipeTips";
import { useQuery } from "@tanstack/react-query";
import { GetRecipeById, getRecipeByIdWithAuth, GetRecipeBySlug } from "@/services/recipes";
import { createClient } from "@/lib/supabase/client";
import { useProfiles } from "@/hooks/useProfiles";

interface RecipeContent {
    difficulty?: string;
    servings?: number;
    ingredients?: Array<{ name: string; amount: string | number; unit: string; notes?: string }>;
    steps?: Array<{ description: string; durationMinutes?: number }>;
    tips?: string[];
    nutrition?: {
        calories?: number;
        proteinGrams?: number;
        carbsGrams?: number;
        fatGrams?: number;
    };
    times?: {
        prepMinutes?: number;
        cookMinutes?: number;
        totalMinutes?: number;
    };
}

interface Recipe {
    id?: string;
    title: string;
    description?: string;
    slug: string;
    user_id?: string;
    image_url?: string;
    image_keyword?: string;
    created_at: string;
    is_public?: boolean;
    likes_count?: number;
    saves_count?: number;
    content?: RecipeContent;
    is_saved?: boolean;
    profiles?: {
        id?: string;
        name?: string;
        avatar_url?: string;
    } | null;
}

export default function TarifDetailClient({
    recipe: initialRecipe,
}: {
    recipe: Recipe;
}) {
    const supabase = createClient();
    // Re-fetch or get from cache using suspense
    const { data: recipe } = useQuery({
        queryKey: ["recipe", initialRecipe.slug],
        queryFn: async () => {
            const res = await GetRecipeBySlug(initialRecipe.slug);
            const r = res.data;
            if (!r) throw new Error("Not found");
            return {
                ...r,
                content: r.recipe_content || r.content || {}
            };
        },
        initialData: initialRecipe
    });

    const { myProfile } = useProfiles();
    const userId = myProfile?.id;

    const { data: user } = useQuery({
        queryKey: ["user", recipe.id],
        queryFn: () => getRecipeByIdWithAuth(recipe.id),
        enabled: !!recipe.id,
    });
    const { handleSocialAction, isInteractionActive } = useSocial(recipe.id, userId);

    const isSaved = isInteractionActive("save");
    const isLiked = isInteractionActive("like");


    const content: RecipeContent = (recipe as any).content ?? {};
    const ingredients = content.ingredients ?? [];
    const steps = content.steps ?? [];
    const nutrition = content.nutrition ?? {};
    const times = content.times ?? {};
    const tips = content.tips ?? [];

    const handleSave = async () => {
        if (!recipe.id) return;
        await handleSocialAction(recipe.id, "save", userId);
    };

    const handleLike = async () => {
        if (!recipe.id) return;
        await handleSocialAction(recipe.id, "like", userId);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <RecipeHero
                id={recipe.id}
                title={recipe.title}
                slug={recipe.slug}
                description={recipe.description}
                imageUrl={recipe.cover_image || recipe.image_url}
                createdAt={recipe.created_at}
                profiles={recipe.profiles}
                difficulty={content.difficulty}
                totalMinutes={times.totalMinutes}
                calories={nutrition.calories}
                servings={content.servings}
                isLiked={isLiked}
                isSaved={isSaved}
                isSaving={false} // Transition state handled by mutation
                likesCount={recipe.likes_count || 0}
                currentUserId={userId}
                onSave={handleSave}
                onLike={handleLike}
                isOwner={user?.isOwner}
                isPublic={recipe.is_public}
            />

            <RecipeQuickStats times={times} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <RecipeIngredients ingredients={ingredients} servings={content.servings} />
                        <RecipeSteps steps={steps} />
                    </div>

                    <div className="space-y-6">
                        <RecipeNutrition nutrition={nutrition} />
                        <RecipeTips tips={tips} />
                    </div>
                </div>
            </div>
        </div>
    );
}
