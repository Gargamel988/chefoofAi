import { Activity, Apple, Beef, Check, CheckCircle2, Circle, Clock, Flame, RefreshCw } from "lucide-react";
import Link from "next/link";
import { DisplayMeal } from "./types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type MealCardProps = {
    meal: DisplayMeal;
    mealType: string;
    isCompleted: boolean;
    isUnsaved: boolean;
    isGenerating: boolean;
    prepPref: string;
    toggleMealCompletion: (id: string) => void;
};

export function MealCard({
    meal, mealType, isCompleted, isUnsaved, isGenerating, prepPref, toggleMealCompletion
}: MealCardProps) {
    const totalM = (meal.protein || 0) + (meal.carbs || 0) + (meal.fat || 0) || 1;

    return (
        <Card className={`group flex flex-col sm:flex-row gap-0 sm:gap-5 overflow-hidden transition-all border-zinc-800 ${isCompleted ? "border-green-500/30 bg-green-500/5" : "bg-zinc-900 border-zinc-800"}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-5 w-full">
                {/* Image Placeholder */}
                <div className="w-full sm:w-40 h-36 sm:h-auto rounded-2xl shrink-0 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-800/40">
                    {mealType === "Kahvaltı" ? <Activity className="w-10 h-10 text-orange-400 opacity-40" /> : mealType === "Öğle" ? <Apple className="w-10 h-10 text-green-400 opacity-40" /> : <Beef className="w-10 h-10 text-rose-400 opacity-40" />}
                    <div className="absolute top-2 left-2 shadow flex gap-1">
                        {isCompleted && (
                            <Badge className="text-[10px] font-bold bg-green-500 hover:bg-green-600 px-2 py-0 border-none shadow-sm">
                                <Check className="w-3 h-3 mr-1" />Yendi
                            </Badge>
                        )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-zinc-900/60 text-white backdrop-blur-md px-3 py-0.5 border-none rounded-lg">{mealType}</Badge>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            {meal.recipe_slug && !isUnsaved ? (
                                <Link href={`/recipe/${meal.recipe_slug}`} className="hover:underline hover:text-orange-500 transition-colors">
                                    <h3 className="text-xl font-black leading-tight sm:leading-snug mb-1">{meal.title}</h3>
                                </Link>
                            ) : (
                                <h3 className="text-xl font-black leading-tight sm:leading-snug mb-1">{meal.title}</h3>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge variant="secondary" className="flex items-center gap-1 text-xs font-black text-orange-500 bg-orange-500/10 hover:bg-orange-500/20">
                                    <Flame className="w-3.5 h-3.5" /> {meal.calories} kkal
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1 text-xs font-bold text-zinc-300 border-zinc-700 bg-zinc-800">
                                    <Clock className="w-3 h-3" /> {prepPref.includes("15") ? "15dk" : "30dk"}
                                </Badge>
                                <Badge variant="outline" className="flex text-xs font-bold text-zinc-300 border-zinc-700 bg-zinc-800">Kolay</Badge>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => alert("Tekil öğün değiştirme yakında eklenecek!")}
                            className={`rounded-full shrink-0 border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer ${isGenerating ? "animate-spin" : ""}`}
                            title="Bu öğünü otomatik değiştir"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="mt-4 border-t border-zinc-800/10 dark:border-zinc-800/60 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Macros */}
                        <div className="w-full sm:w-auto">
                            <div className="flex gap-3 text-[10px] font-bold mb-1.5 text-zinc-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> {meal.protein}g P</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> {meal.carbs}g K</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> {meal.fat}g Y</span>
                            </div>
                            <div className="flex gap-1 h-1.5 w-full sm:w-32 rounded-full overflow-hidden bg-zinc-800/80">
                                <div style={{ width: `${((meal.protein || 0) / totalM) * 100}%` }} className="bg-blue-500 rounded-full" title={`Protein: ${meal.protein}g`} />
                                <div style={{ width: `${((meal.carbs || 0) / totalM) * 100}%` }} className="bg-orange-500 rounded-full" title={`Karbonhidrat: ${meal.carbs}g`} />
                                <div style={{ width: `${((meal.fat || 0) / totalM) * 100}%` }} className="bg-red-400 rounded-full" title={`Yağ: ${meal.fat}g`} />
                            </div>
                        </div>

                        {meal.id && (
                            <Button
                                variant={isCompleted ? "default" : "outline"}
                                onClick={() => meal.id && toggleMealCompletion(meal.id)}
                                className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black transition-all cursor-pointer ${isCompleted ? "bg-green-500 hover:bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-800"}`}
                            >
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-50" />}
                                Yedim
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
