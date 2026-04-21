"use client";

import { useSocial } from "@/hooks/useSocial";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { RecipeQuickStats } from "@/components/recipe/RecipeQuickStats";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeSteps } from "@/components/recipe/RecipeSteps";
import { RecipeNutrition } from "@/components/recipe/RecipeNutrition";
import { RecipeTips } from "@/components/recipe/RecipeTips";
import { useQuery } from "@tanstack/react-query";
import { getRecipeByIdWithAuth, GetRecipeBySlug } from "@/services/recipes";
import { createClient } from "@/lib/supabase/client";
import { useProfiles } from "@/hooks/useProfiles";
import AdBanner from "@/components/AdBanner";
import { ChefHat } from "lucide-react";

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
    userId,
}: {
    recipe: Recipe;
    userId: string | undefined;
}) {
    // Re-fetch or get from cache using suspense
    const { data: recipe } = useQuery({
        queryKey: ["recipe", initialRecipe.slug],
        queryFn: async () => {
            try {
                const { data: r, error } = await GetRecipeBySlug(initialRecipe.slug);
                if (error || !r) return initialRecipe;
                return {
                    ...r,
                    content: r.recipe_content || r.content || {}
                };
            } catch (err) {
                console.error("Recipe client fetch failed:", err);
                return initialRecipe;
            }
        },
        initialData: initialRecipe,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    console.log("TarifDetailClient mounted, recipe:", recipe);

    const { data: user } = useQuery({
        queryKey: ["user", recipe.id],
        queryFn: () => getRecipeByIdWithAuth(recipe.id),
        enabled: !!recipe.id,
    });
    const { handleSocialAction, isInteractionActive } = useSocial(recipe.id, userId);

    const isSaved = isInteractionActive("save");
    const isLiked = isInteractionActive("like");


    // Normalize content (Support both legacy 'content' and AI 'recipe_content' fields)
    const rawContent = (recipe as any).recipe_content || (recipe as any).content || {};

    // Safety check: parse if it's a string
    const content: RecipeContent = typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : rawContent;

    const ingredients = content.ingredients ?? [];

    // Handle 'instructions' as fallback for 'steps'
    const rawSteps = content.steps || (content as any).instructions || [];

    // Transform string array to object array if needed
    const steps = (Array.isArray(rawSteps) ? rawSteps : []).map(step =>
        typeof step === "string" ? { description: step } : step
    );

    const nutrition = {
        calories: content.nutrition?.calories || (recipe as any).calories || 0,
        proteinGrams: content.nutrition?.proteinGrams || (recipe as any).protein || 0,
        fatGrams: content.nutrition?.fatGrams || (recipe as any).fat || 0,
        carbsGrams: content.nutrition?.carbsGrams || (recipe as any).carbs || 0,
    };

    const times = {
        totalMinutes: content.times?.totalMinutes || (recipe as any).total_minutes || (recipe as any).totalMinutes || 0,
        prepMinutes: content.times?.prepMinutes || (recipe as any).prep_minutes || 0,
        cookMinutes: content.times?.cookMinutes || (recipe as any).cook_minutes || 0,
    };

    const difficulty = content.difficulty || (recipe as any).difficulty || "orta";
    const servings = content.servings || (recipe as any).servings || 4;
    const tips = content.tips ?? [];

    const handleSave = async () => {
        if (!recipe.id) return;
        await handleSocialAction(recipe.id, "save");
    };

    const handleLike = async () => {
        if (!recipe.id) return;
        await handleSocialAction(recipe.id, "like");
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
                difficulty={difficulty}
                totalMinutes={times.totalMinutes}
                calories={nutrition.calories}
                servings={servings}
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <AdBanner slot="8136351407" className="mt-4" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <RecipeIngredients ingredients={ingredients} servings={servings} />

                        {/* Recipe Steps with Intra-Ad */}
                        {steps.length > 0 && (
                            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-8 px-2">
                                <ChefHat className="w-5 h-5 text-orange-400" />
                                Hazırlanış Adımları
                                <span className="ml-auto text-xs font-semibold text-zinc-500">{steps.length} adım</span>
                            </h2>
                        )}

                        {steps.length > 2 ? (
                            <>
                                <RecipeSteps steps={steps.slice(0, 2)} showHeader={false} />
                                <div className="py-4 border-y border-zinc-800/50 my-4">
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 text-center">Reklam</p>
                                    <AdBanner slot="7629190141" format="fluid" />
                                </div>
                                <RecipeSteps steps={steps.slice(2)} startOffset={2} showHeader={false} />
                            </>
                        ) : (
                            <RecipeSteps steps={steps} showHeader={false} />
                        )}
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
