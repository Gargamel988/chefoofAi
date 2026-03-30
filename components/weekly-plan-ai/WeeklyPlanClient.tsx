"use client";

import { useState, useMemo } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnimatePresence } from "@/components/motion";
import { MEAL_ORDER, getTodayIndex } from "@/components/weekly-plan-ai/constants";
import { AIPlanMeal, DisplayMeal } from "@/components/weekly-plan-ai/types";
import { PromptSection } from "@/components/weekly-plan-ai/PromptSection";
import { WeeklySummary } from "@/components/weekly-plan-ai/WeeklySummary";
import { DayTabs } from "@/components/weekly-plan-ai/DayTabs";
import { MealCard } from "@/components/weekly-plan-ai/MealCard";
import { DailySummary } from "@/components/weekly-plan-ai/DailySummary";
import { ShoppingModal } from "@/components/weekly-plan-ai/ShoppingModal";
import { SaveActionBar } from "@/components/weekly-plan-ai/SaveActionBar";
import { LoadingState } from "@/components/weekly-plan-ai/LoadingState";
import { weeklyPlanSummarySchema } from "@/schema/weekly-plan-scheme";
import {
    useWeeklyPlanQuery,
    useSaveWeeklyPlan,
    useDeleteWeeklyPlan,
    useToggleMealConsumed,
} from "@/hooks/useWeeklyPlan";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";

export function WeeklyPlanClient() {
    // ── UI State ────────────────────────────────────────────────────────────────
    const [selectedDay, setSelectedDay] = useState<number>(getTodayIndex());
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const { tier, isActive, loading, lastAutoPlanAt } = useSubscription();
    const [showShoppingModal, setShowShoppingModal] = useState(false);

    const [targetCal, setTargetCal] = useState(1800);
    const [mealCount, setMealCount] = useState(3);
    const [prepPref, setPrepPref] = useState("Pratik (15-30 dk)");

    // Stream bittikten sonra kaydedilmeyi bekleyen plan
    const [tempPlan, setTempPlan] = useState<AIPlanMeal[] | null>(null);

    // ── Query & Mutations ───────────────────────────────────────────────────────
    const { data: savedItems = [] } = useWeeklyPlanQuery();
    const saveMutation = useSaveWeeklyPlan(() => {
        console.log("💾 Plan başarıyla kaydedildi.");
        setTempPlan(null);
    });
    const deleteMutation = useDeleteWeeklyPlan(() => {
        console.log("🗑️ Plan silindi.");
        setTempPlan(null);
    });
    const toggleConsumed = useToggleMealConsumed();

    // stream veya tempPlan'dan DisplayMeal listesi üret
    function streamToMeals(days: any): DisplayMeal[] {
        const meals: DisplayMeal[] = [];
        days?.forEach((day: any) => {
            day?.meals?.forEach((meal: any) => {
                if (!meal) return;
                meals.push({
                    day_of_week: (day.day_of_week ?? 1) - 1,
                    meal_type: meal.meal_type ?? "",
                    title: meal.title ?? "Yükleniyor...",
                    recipe_slug: meal.recipe_slug,
                    calories: meal.nutrition?.calories,
                    protein: meal.nutrition?.protein,
                    carbs: meal.nutrition?.carbs,
                    fat: meal.nutrition?.fat,
                    description: meal.description,
                });
            });
        });
        return meals;
    }

    // ── AI Stream (Hızlı Özet Üretimi) ───────────────────────────────────────────
    const { submit, isLoading: isGenerating, object: streamObject, error: streamError } = useObject({
        api: "/api/weekly-plan",
        schema: weeklyPlanSummarySchema,
        onFinish: ({ object }) => {
            console.log("✨ AI Üretimi Tamamlandı:", object);
            if (!object?.days) {
                console.warn("⚠️ AI yanıtında 'days' bulunamadı.");
                return;
            }
            setTempPlan(streamToMeals(object.days) as AIPlanMeal[]);
        },
        onError: (err) => {
            console.error("❌ AI Stream Hatası:", err);
        }
    });

    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleGenerate = () => {
        if (loading) return;

        if (tier === "Free") {
            toast.error("Otomatik planlama özelliği Pro veya Premium paket gerektirir.", {
                description: "Hemen yükseltme yaparak haftalık menülerini saniyeler içinde oluşturabilirsin!",
                action: {
                    label: "Planları Gör",
                    onClick: () => window.location.href = "/pricing"
                }
            });
            return;
        }

        if (tier === "Pro" && lastAutoPlanAt) {
            const lastDate = new Date(lastAutoPlanAt);
            const now = new Date();
            const diffDays = Math.ceil((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays < 7) {
                toast.error(`Haftalık limitine ulaştın.`, {
                    description: `Pro paket ile haftada 1 kez plan oluşturabilirsin. Bir sonraki hakkın için ${7 - diffDays} gün kaldı.`,
                    action: {
                        label: "Premium'a Geç (Sınırsız)",
                        onClick: () => window.location.href = "/pricing"
                    }
                });
                return;
            }
        }

        console.log("🚀 Üretim başlatılıyor...", { customPrompt, mealCount, targetCal, prepPref });
        setShowPromptInput(false);
        setTempPlan(null);
        submit({
            userPrompt: customPrompt,
            mealCount,
            dailyCalorieTarget: targetCal,
            prepPreference: prepPref,
        });
    };

    const handleSavePlan = () => {
        if (!tempPlan) return;
        console.log("💾 Plan DB'ye kaydediliyor...");
        saveMutation.mutate(tempPlan);
    };

    const handleDelete = () => {
        if (!confirm("Bu haftanın planı silinecek. Emin misin?")) return;
        deleteMutation.mutate();
    };

    const handleToggleConsumed = (id: string, currentStatus: boolean) => {
        toggleConsumed.mutate({ id, is_consumed: !currentStatus });
    };

    // ── Display Data ─────────────────────────────────────────────────────────────
    const displayItems = useMemo<DisplayMeal[]>(() => {
        if (isGenerating && streamObject?.days) {
            return streamToMeals(streamObject.days);
        }
        if (tempPlan) return tempPlan;

        return savedItems.map((item) => ({
            id: item.id,
            day_of_week: item.day_of_week,
            meal_type: item.meal_type,
            is_consumed: item.is_consumed,
            title: item.recipes?.title ?? "",
            recipe_slug: item.recipes?.slug,
            calories: item.recipes?.calories,
            protein: item.recipes?.protein,
            carbs: item.recipes?.carbs,
            fat: item.recipes?.fat,
            description: item.recipes?.description,
            recipe_content: item.recipes?.recipe_content,
        }));
    }, [isGenerating, streamObject, tempPlan, savedItems]);

    // ── Derived ──────────────────────────────────────────────────────────────────
    const hasPlan = displayItems.length > 0;
    const isUnsaved = !!tempPlan;

    const byDay = useMemo(() => {
        const map: Record<number, DisplayMeal[]> = {};
        displayItems.forEach((item) => {
            if (!map[item.day_of_week]) map[item.day_of_week] = [];
            map[item.day_of_week].push(item);
        });
        return map;
    }, [displayItems]);

    const selectedMeals = byDay[selectedDay] ?? [];

    const selectedTotals = selectedMeals.reduce(
        (acc, m) => ({
            cal: acc.cal + (m.calories ?? 0),
            protein: acc.protein + (m.protein ?? 0),
            carbs: acc.carbs + (m.carbs ?? 0),
            fat: acc.fat + (m.fat ?? 0),
        }),
        { cal: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const totalWeeklyMeals = displayItems.length;
    const completedMealsCount = savedItems.filter((m) => m.is_consumed).length;
    const totalWeeklyCal = displayItems.reduce((acc, m) => acc + (m.calories ?? 0), 0);

    const completedMealsMap = useMemo(
        () =>
            Object.fromEntries(
                savedItems.filter((m) => m.is_consumed).map((m) => [m.id, true]),
            ),
        [savedItems],
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32 font-sans">
            <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
                {/* Debug Error Display (Sadece hata varsa görünür) */}
                {streamError && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-400 text-sm">
                        ⚠️ Üretim sırasında bir hata oluştu: {streamError.message}
                    </div>
                )}

                {(!hasPlan || showPromptInput) && !isGenerating && (
                    <PromptSection
                        hasPlan={hasPlan}
                        setShowPromptInput={setShowPromptInput}
                        customPrompt={customPrompt}
                        setCustomPrompt={setCustomPrompt}
                        targetCal={targetCal}
                        setTargetCal={setTargetCal}
                        mealCount={mealCount}
                        setMealCount={setMealCount}
                        prepPref={prepPref}
                        setPrepPref={setPrepPref}
                        handleGenerate={handleGenerate}
                    />
                )}

                <LoadingState
                    isGenerating={isGenerating}
                    hasPlan={hasPlan}
                    showPromptInput={showPromptInput}
                    loadingStepIdx={0}
                    loadingSteps={[
                        "Profiline göre menü planlanıyor...",
                        "Besin değerleri hesaplanıyor...",
                        "Michelin yıldızlı tarifler seçiliyor...",
                        "Size özel haftalık plan hazırlanıyor...",
                    ]}
                />

                {hasPlan && !showPromptInput && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <WeeklySummary
                            totalWeeklyCal={totalWeeklyCal}
                            completedMealsCount={completedMealsCount}
                            totalWeeklyMeals={totalWeeklyMeals}
                            setShowShoppingModal={setShowShoppingModal}
                            handleDelete={handleDelete}
                            isUnsaved={isUnsaved}
                        />

                        <div className="space-y-6 md:space-y-8">
                            <DayTabs
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                byDay={byDay}
                                completedMeals={completedMealsMap}
                            />

                            <AnimatePresence mode="wait">
                                <div
                                    key={selectedDay}
                                    className="grid lg:grid-cols-[1fr_320px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
                                >
                                    <div className="space-y-4">
                                        {selectedMeals.length === 0 && (
                                            <div className="p-8 rounded-3xl border border-zinc-800 text-center bg-zinc-900/50">
                                                <p className="text-zinc-400">Bu güne öğün planlanmamış.</p>
                                            </div>
                                        )}

                                        {MEAL_ORDER.map((mealType) => {
                                            const meal = selectedMeals.find((m) => m.meal_type === mealType);
                                            if (!meal) return null;
                                            const isCompleted = meal.is_consumed ?? false;

                                            return (
                                                <MealCard
                                                    key={mealType}
                                                    meal={meal}
                                                    mealType={mealType}
                                                    isCompleted={isCompleted}
                                                    isUnsaved={isUnsaved}
                                                    isGenerating={isGenerating}
                                                    prepPref={prepPref}
                                                    toggleMealCompletion={(id) =>
                                                        handleToggleConsumed(id, isCompleted)
                                                    }
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="mt-2 lg:mt-0">
                                        <DailySummary
                                            selectedTotals={selectedTotals}
                                            targetCal={targetCal}
                                        />
                                    </div>
                                </div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <ShoppingModal
                showShoppingModal={showShoppingModal}
                setShowShoppingModal={setShowShoppingModal}
            />

            <SaveActionBar
                isUnsaved={isUnsaved}
                isGenerationDone={!isGenerating && !!tempPlan}
                isGenerating={isGenerating}
                saving={saveMutation.isPending}
                onCancel={() => setTempPlan(null)}
                handleSavePlan={handleSavePlan}
            />
        </div>
    );
}