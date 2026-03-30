"use client"

import { useState, useMemo } from "react"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import { DaySelector } from "@/components/weekly-plan/day-selector"
import { MealCard } from "@/components/weekly-plan/meal-card"
import { WeeklyPlanForm } from "@/components/weekly-plan/weekly-plan-form"
import { RecipeSearchModal } from "@/components/recipe-search-modal"
import { mealTypesData, WeeklyPlanFormData } from "@/components/weekly-plan/types"
import { useWeeklyPlan, useSaveMealPlan } from "@/components/weekly-plan/hooks"
import { motion, AnimatePresence, FadeUpCard } from "@/components/motion"

export default function WeeklyPlanClient() {
    const [selectedDay, setSelectedDay] = useState<string>("Pazartesi")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [showRecipeSearch, setShowRecipeSearch] = useState(false)
    const [selectedMealType, setSelectedMealType] = useState("Kahvaltı")

    const { data: dailyMeals } = useWeeklyPlan(selectedDay)
    const saveMealMutation = useSaveMealPlan()

    const handleSave = async (formData: WeeklyPlanFormData) => {
        try {
            const dayOfWeekMap: Record<string, number> = {
                "Pazartesi": 1, "Salı": 2, "Çarşamba": 3,
                "Perşembe": 4, "Cuma": 5, "Cumartesi": 6, "Pazar": 7
            };
            const dayOfWeek = dayOfWeekMap[selectedDay];

            const today = new Date();
            const currentDay = today.getDay() || 7; 
            const mondayOffset = today.getDate() - currentDay + 1;
            const monday = new Date(today.setDate(mondayOffset));
            const weekStart = monday.toISOString().split("T")[0];

            await saveMealMutation.mutateAsync({
                day: selectedDay,
                mealType: formData.selectedMealType,
                formData,
                weekStart,
                dayOfWeek,
            });

            toast.success("Öğün başarıyla kaydedildi!");
            setIsFormOpen(false);
        } catch (error: any) {
             // Error already toasted in hook
        }
    };

    const handleSelectRecipe = (recipe: any) => {
        toast.info(`${recipe.title} seçildi (Örnek)`)
        setShowRecipeSearch(false)
    }

    const totalCalories = useMemo(() => {
        return dailyMeals?.reduce((sum, m) => sum + (m.nutrition?.cal || 0), 0) || 0
    }, [dailyMeals]);

    return (
        <main className="max-w-5xl mx-auto px-6 pb-32 relative z-10 space-y-12">
            <DaySelector
                selectedDay={selectedDay}
                onSelectDay={(day) => {
                    setSelectedDay(day)
                    setIsFormOpen(false)
                }}
            />

            <AnimatePresence mode="wait">
                {!isFormOpen ? (
                    <motion.div
                        key="plan"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-end justify-between px-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" /> Bugünün Menüsü
                                </div>
                                <h2 className="text-3xl font-black">{selectedDay}</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1 leading-none">Toplam Kalori</div>
                                <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm px-3 py-1 font-black">
                                    {totalCalories} KKAL
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mealTypesData.map((mealConfig, idx) => {
                                const plannedMeal = dailyMeals?.find(m => m.meal_type === mealConfig.type)

                                return (
                                    <FadeUpCard key={idx} index={idx}>
                                        <MealCard
                                            mealConfig={mealConfig as any}
                                            mealData={plannedMeal}
                                            onAddClick={() => {
                                                setSelectedMealType(mealConfig.type)
                                                setIsFormOpen(true)
                                            }}
                                        />
                                    </FadeUpCard>
                                )
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <WeeklyPlanForm
                        selectedDay={selectedDay}
                        initialMealType={selectedMealType}
                        onCancel={() => setIsFormOpen(false)}
                        onSave={handleSave}
                        onOpenSearch={() => setShowRecipeSearch(true)}
                    />
                )}
            </AnimatePresence>

            {!isFormOpen && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden w-full max-w-xs px-6">
                    <Button
                        className="w-full rounded-2xl h-14 bg-zinc-900 border border-white/10 text-white shadow-2xl backdrop-blur-3xl font-black uppercase text-xs tracking-widest group"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        Yeni Öğün Planla
                    </Button>
                </div>
            )}

            <RecipeSearchModal
                isOpen={showRecipeSearch}
                onClose={() => setShowRecipeSearch(false)}
                onSelectRecipe={handleSelectRecipe}
            />
        </main>
    )
}
