import { Sparkles, ShoppingCart, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type WeeklySummaryProps = {
    totalWeeklyCal: number;
    completedMealsCount: number;
    totalWeeklyMeals: number;
    setShowShoppingModal: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
    isUnsaved: boolean;
};

export function WeeklySummary({
    totalWeeklyCal,
    completedMealsCount,
    totalWeeklyMeals,
    setShowShoppingModal,
    handleDelete,
    isUnsaved
}: WeeklySummaryProps) {
    return (
        <Card className="rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-4 md:gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 justify-around md:justify-start scrollbar-none hidden-scrollbar">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Haftalık Kalori</p>
                        <p className="text-xl font-black mt-1">{totalWeeklyCal.toLocaleString()} <span className="text-xs font-medium text-orange-500">kkal</span></p>
                    </div>
                    <Separator orientation="vertical" className="h-10 shrink-0 bg-zinc-800/80" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Tamamlanan</p>
                        <p className="text-xl font-black mt-1 text-green-500">{completedMealsCount}<span className="text-sm font-medium text-zinc-400">/{totalWeeklyMeals}</span></p>
                    </div>
                    <Separator orientation="vertical" className="h-10 shrink-0 bg-zinc-800/80" />
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">AI Modeli</p>
                        <p className="text-sm font-bold mt-2">Mistral AI <Sparkles className="inline-block w-3 h-3 text-orange-500" /></p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        onClick={() => setShowShoppingModal(true)}
                        className="flex-1 md:flex-none px-5 py-6 md:py-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold bg-zinc-800 border-zinc-700 hover:border-orange-500/50 hover:bg-orange-500/10 text-white"
                    >
                        <ShoppingCart className="w-4 h-4 text-orange-500" /> Alışveriş Listesi
                    </Button>
                    {!isUnsaved && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDelete}
                            className="shrink-0 h-[50px] md:h-[42px] w-[50px] md:w-[42px] px-0 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold bg-zinc-800 border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 transition-colors"
                            title="Planı Sil"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
