"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { MealData } from "./types";
import { MealCard } from "./MealCard";
import { useFavorite } from "@/hooks/useFavorite";
import { useRecommendations } from "@/hooks/useRecommendations";

const MEAL_ORDER: Record<string, number> = { "Kahvaltı": 1, "Öğle": 2, "Akşam": 3 };
const SKELETON_MEALS = ["Kahvaltı", "Öğle", "Akşam"] as const;

export default function MealRecommendations() {
    const { recommendations, generate, updateConsumption } = useRecommendations();
    const { favorites, toggleFavorite } = useFavorite();

    const [isGenerating, setIsGenerating] = useState(false);
    const [regenMealType, setRegenMealType] = useState<string | null>(null);

    const sortedMeals = useMemo(() => {
        return [...(recommendations || [])].sort(
            (a, b) => (MEAL_ORDER[a.meal_type] ?? 4) - (MEAL_ORDER[b.meal_type] ?? 4)
        );
    }, [recommendations]);

    useEffect(() => {
        const checkAndGenerate = async () => {
            // Sadece recommendations undefined/null ise veya boş diziyse ve şu an üretim yapılmıyorsa
            if ((!recommendations || recommendations.length === 0) && !isGenerating) {
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
    }, []); // Sadece ilk yükleme/bulunmama durumunda tetiklensin




    const handleRefreshAll = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            await generate.mutateAsync({ action: "generate_all" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateSingle = async (mealType: string, oldId?: string | number) => {
        if (isGenerating) return;
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
        if (isGenerating && !regenMealType) {
            return SKELETON_MEALS.map((type) => ({ meal_type: type, _skeleton: true }));
        }

        // Ensure we always show 3 cards if generating or if we have data
        if (sortedMeals.length === 0 && isGenerating) {
            return SKELETON_MEALS.map((type) => ({ meal_type: type, _skeleton: true }));
        }

        return sortedMeals;
    }, [sortedMeals, isGenerating, regenMealType]);

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
                    disabled={isGenerating}
                    className=" cursor-pointer text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-xs gap-1.5 px-3 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`w-3.5 h-3.5 ${isGenerating && !regenMealType ? "animate-spin" : ""}`}
                    />
                    Tümünü Yenile
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
