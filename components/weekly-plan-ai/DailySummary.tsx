import { Info } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type DailySummaryProps = {
    selectedTotals: { cal: number; protein: number; carbs: number; fat: number };
    targetCal: number;
};

export function DailySummary({
    selectedTotals, targetCal
}: DailySummaryProps) {
    return (
        <Card className="sticky top-24 border bg-zinc-900 shadow-lg shadow-zinc-900/5 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
                <div className="mb-6">
                    <h3 className="text-sm font-black uppercase tracking-tight mb-5 flex items-center justify-between">Günlük Özet <Info className="w-4 h-4 text-zinc-400" /></h3>
                    <div className="flex items-end justify-between mb-3">
                        <div className="text-4xl font-black tabular-nums">{selectedTotals.cal}</div>
                        <div className="text-sm font-medium pb-1.5 text-zinc-400">/ {targetCal} kkal</div>
                    </div>
                    <div className="h-3 w-full rounded-full overflow-hidden bg-zinc-800">
                        <div style={{ width: `${Math.min((selectedTotals.cal / targetCal) * 100, 100)}%` }} className={`h-full rounded-full transition-all duration-1000 ${selectedTotals.cal > targetCal ? "bg-red-500" : "bg-orange-500"}`} />
                    </div>
                    {selectedTotals.cal > targetCal && <p className="text-xs text-red-500 mt-2 font-bold bg-red-500/10 px-3 py-2 rounded-lg inline-block">Hedefi {selectedTotals.cal - targetCal} kkal aşıyorsun.</p>}
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800/30 dark:border-zinc-700/50">
                    <div className="flex items-center justify-between text-sm">
                        <span className={`font-bold flex items-center gap-2 text-zinc-300`}><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Protein</span>
                        <span className="font-black tabular-nums">{selectedTotals.protein}g</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className={`font-bold flex items-center gap-2 text-zinc-300`}><span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Karbonhidrat</span>
                        <span className="font-black tabular-nums">{selectedTotals.carbs}g</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className={`font-bold flex items-center gap-2 text-zinc-300`}><span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Yağ</span>
                        <span className="font-black tabular-nums">{selectedTotals.fat}g</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
