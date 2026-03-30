import { CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DAY_LABELS, DAY_FULL, getTodayIndex } from "./constants";
import { DisplayMeal } from "./types";
import { Button } from "../ui/button";

type DayTabsProps = {
    selectedDay: number;
    setSelectedDay: Dispatch<SetStateAction<number>>;
    byDay: Record<number, DisplayMeal[]>;
    completedMeals: Record<string, boolean>;
};

export function DayTabs({
    selectedDay, setSelectedDay, byDay, completedMeals
}: DayTabsProps) {
    const todayIdx = getTodayIndex();
    const textPrimary = "text-white";
    const textSecondary = "text-zinc-400";

    return (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 hidden-scrollbar relative z-10">
            {DAY_LABELS.map((label, idx) => {
                const isToday = idx === todayIdx;
                const isSelected = idx === selectedDay;
                const dayMeals = byDay[idx] || [];
                const isAllCompleted = dayMeals.length > 0 && dayMeals.every(m => m.id && completedMeals[m.id]);

                return (
                    <Button
                        key={idx}
                        onClick={() => setSelectedDay(idx)}
                        variant="outline"
                        className={`h-auto flex-col items-center gap-1 shrink-0 px-4 sm:px-5 py-3 rounded-2xl transition-all relative min-w-[70px] ${isSelected
                            ? "border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 shadow-lg shadow-orange-500/10 text-orange-500"
                            : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400"
                            }`}
                    >
                        {isToday && <div className="absolute top-0 inset-x-4 h-1 rounded-b w-6 sm:w-8 mx-auto bg-orange-500" />}
                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isSelected ? "text-orange-500" : textSecondary}`}>
                            {label}
                        </span>
                        <span className={`text-sm sm:text-base font-black flex items-center gap-1 ${isSelected ? textPrimary : textSecondary}`}>
                            {DAY_FULL[idx].slice(0, 3)}
                            {isAllCompleted && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
}
