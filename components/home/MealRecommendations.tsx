"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { MealData } from "./types";
import { MealCard } from "./MealCard";
import { useFavorite } from "@/hooks/useFavorite";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useSubscription } from "@/hooks/use-subscription";
import { SUBSCRIPTION_CONFIG } from "@/config/subscriptions";
import { toast } from "sonner";

const MEAL_ORDER: Record<string, number> = { "Kahvaltı": 1, "Öğle": 2, "Akşam": 3 };
const SKELETON_MEALS = ["Kahvaltı", "Öğle", "Akşam"] as const;

export default function MealRecommendations() {
    const { recommendations, generate, streamingObject, updateConsumption } = useRecommendations();
    console.log("MealRecommendations State:", { 
      hasRecs: !!recommendations?.length, 
      isGenerating: generate.isLoading,
      hasStream: !!streamingObject?.meals?.length 
    });
    const { favorites, toggleFavorite } = useFavorite();
    const sub = useSubscription();

    const [isGenerating, setIsGenerating] = useState(false);
    const [regenMealType, setRegenMealType] = useState<string | null>(null);

    // Limit check logic
    const isDevelopment = process.env.NODE_ENV === "development";
    const today = new Date().toISOString().split("T")[0];
    const lastDate = sub.lastDailySuggestionAt ? new Date(sub.lastDailySuggestionAt).toISOString().split("T")[0] : null;
    const currentCount = (lastDate === today) ? sub.dailySuggestionCount : 0;
    const limit = SUBSCRIPTION_CONFIG[sub.tier]?.daily_suggestions?.limit || 0;
    const isAtLimit = !isDevelopment && currentCount >= limit;
    const limitMessage = SUBSCRIPTION_CONFIG[sub.tier]?.daily_suggestions?.message || "Günlük öneri limitine ulaştınız.";

    const sortedMeals = useMemo(() => {
        return [...(recommendations || [])].sort(
            (a, b) => (MEAL_ORDER[a.meal_type] ?? 4) - (MEAL_ORDER[b.meal_type] ?? 4)
        );
    }, [recommendations]);

    useEffect(() => {
        const checkAndGenerate = async () => {
            // Sadece recommendations undefined/null ise veya boş diziyse ve şu an üretim yapılmıyorsa ve limit dolmamışsa
            if ((!recommendations || recommendations.length === 0) && !isGenerating && !isAtLimit && !sub.loading) {
                setIsGenerating(true);
                try {
                    await generate.mutateAsync({ action: "generate_all" });
                } catch (err) {
                    console.error("Auto generation failed:", err);
                } finally {
                    setIsGenerating(false);
                }
            }
        };

        checkAndGenerate();
    }, [recommendations, isGenerating, isAtLimit, sub.loading]); // Bağımlılıklar güncellendi




    const handleRefreshAll = async () => {
        if (isGenerating) return;
        if (isAtLimit) {
            toast.error(limitMessage);
            return;
        }
        setIsGenerating(true);
        try {
            await generate.mutateAsync({ action: "generate_all" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateSingle = async (mealType: string, oldId?: string | number) => {
        if (isGenerating) return;
        if (isAtLimit) {
            toast.error(limitMessage);
            return;
        }
        setRegenMealType(mealType);
        setIsGenerating(true);
        try {
            await generate.mutateAsync({ action: "regenerate", meal_type: mealType, old_meal_id: oldId });
        } finally {
            setIsGenerating(false);
            setRegenMealType(null);
        }
    };

    const handleConsume = async (id: string | number, currentStatus: boolean) => {
        await updateConsumption.mutateAsync({ id, is_consumed: !currentStatus });
    };

    const filledMeals = useMemo(() => {
        const isGenerating = generate.isLoading;
        
        // If we are generating and have streaming data, use it for partial display
        if (isGenerating && streamingObject?.meals && streamingObject.meals.length > 0) {
            return streamingObject.meals.map((m: any) => ({
                ...m,
                recipes: m.nutrition_data ? {
                    title: m.title,
                    description: m.description,
                    calories: m.nutrition_data.calories,
                    protein: m.nutrition_data.protein,
                    carbs: m.nutrition_data.carbs,
                    fat: m.nutrition_data.fat,
                } : null,
                _is_streaming: true
            }));
        }

        if (isGenerating && !regenMealType) {
            return SKELETON_MEALS.map((type) => ({ meal_type: type, _skeleton: true }));
        }

        // Ensure we always show 3 cards if generating or if we have data
        if (sortedMeals.length === 0 && isGenerating) {
            return SKELETON_MEALS.map((type) => ({ meal_type: type, _skeleton: true }));
        }

        return sortedMeals;
    }, [sortedMeals, generate.isLoading, streamingObject, regenMealType]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-black text-white">Bugünün Öğünleri</h2>
                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <Sparkles
                            className={`w-3 h-3 text-orange-400 ${isGenerating && !regenMealType ? "animate-pulse" : ""}`}
                        />
                        {isGenerating && !regenMealType
                            ? "AI senin için hazırlıyor..."
                            : "AI senin için kişiselleştirdi"}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshAll}
                    disabled={isGenerating || (isAtLimit && !isGenerating)}
                    className={`cursor-pointer text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-xs gap-1.5 px-3 disabled:opacity-50 ${isAtLimit ? "grayscale opacity-50" : ""}`}
                >
                    <RefreshCw
                        className={`w-3.5 h-3.5 ${isGenerating && !regenMealType ? "animate-spin" : ""}`}
                    />
                    {isAtLimit ? "Limit Doldu" : "Tümünü Yenile"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filledMeals.map((m: any, i) => {
                    const isSkeleton = "_skeleton" in m;
                    const isCardBusy = isSkeleton || (isGenerating && regenMealType === m.meal_type);

                    return (
                        <MealCard
                            key={"id" in m ? m.id : m.meal_type + i}
                            meal={
                                isSkeleton
                                    ? { id: undefined, meal_type: m.meal_type, is_consumed: false, recipes: null }
                                    : (m as MealData)
                            }
                            i={i}
                            isGenerating={isCardBusy}
                            onConsume={handleConsume}
                            onRegenerateSingle={handleRegenerateSingle}
                            favorites={favorites || []}
                            toggleFavorite={toggleFavorite}
                        />
                    );
                })}
            </div>
        </section>
    );
}
