import { Check } from "lucide-react";
import { DAY_LABELS, MEAL_ORDER, getTodayIndex } from "./constants";
import { DisplayMeal } from "./types";
import { Card, CardContent } from "../ui/card";

type GridViewProps = {
    displayItems: DisplayMeal[];
    completedMeals: Record<string, boolean>;
};

export function GridView({ displayItems, completedMeals }: GridViewProps) {
    const todayIdx = getTodayIndex();

    return (
        <Card className="border bg-zinc-900 border-zinc-800 overflow-hidden rounded-3xl">
            <CardContent className="p-0 overflow-x-auto hidden-scrollbar">
                <table className="w-full min-w-[700px] text-sm text-center">
                    <thead>
                        <tr>
                            <th className="p-4 font-black text-zinc-400">Öğün</th>
                            {DAY_LABELS.map((day, i) => (
                                <th key={day} className={`p-4 font-black ${i === todayIdx ? "text-orange-500" : "text-white"}`}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {MEAL_ORDER.map(mealType => (
                            <tr key={mealType}>
                                <td className="p-4 font-bold text-left text-zinc-400">{mealType}</td>
                                {DAY_LABELS.map((_, dayIdx) => {
                                    const meal = displayItems.find(m => m.day_of_week === dayIdx && m.meal_type === mealType);
                                    return (
                                        <td key={dayIdx} className="p-2">
                                            {meal ? (
                                                <div
                                                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center cursor-pointer transition-colors ${meal.id && completedMeals[meal.id] ? "bg-green-500/20 text-green-500" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                                                    title={meal.title}
                                                >
                                                    {meal.id && completedMeals[meal.id] ? <Check className="w-5 h-5" /> : (
                                                        mealType === "Kahvaltı" ? "🍳" : mealType === "Öğle" ? "🥗" : "🍲"
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600/30">-</span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
