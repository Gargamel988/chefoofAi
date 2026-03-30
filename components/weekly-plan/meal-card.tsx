import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Flame, Clock } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface MealCardProps {
    mealConfig: { type: string; iconName: string; color: string; bg: string; border: string };
    mealData: any;
    onAddClick: () => void;
}

export function MealCard({ mealConfig, mealData, onAddClick }: MealCardProps) {
    const isPlanned = !!mealData;
    const Icon = (LucideIcons as any)[mealConfig.iconName] || LucideIcons.HelpCircle;

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden hover:border-orange-500/30 transition-all duration-500 group shadow-2xl">
            <CardContent className="p-0">
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mealConfig.bg} border ${mealConfig.border}`}>
                            <Icon className={`w-6 h-6 ${mealConfig.color}`} />
                        </div>
                        <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter transition-colors ${isPlanned ? "border-orange-500/50 text-orange-400" : "border-zinc-800 text-zinc-500 group-hover:text-orange-400 group-hover:border-orange-500/50"}`}>
                            {isPlanned ? "Hazır" : "Hazır Değil"}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${mealConfig.color}`}>{mealConfig.type}</h4>
                        <h3 className="text-xl font-bold text-zinc-200 group-hover:text-white leading-tight">
                            {isPlanned ? mealData.recipe_title : `Harika bir ${mealConfig.type.toLowerCase()} planla.`}
                        </h3>
                        {isPlanned && mealData.description && (
                            <p className="text-sm text-zinc-400 line-clamp-2">{mealData.description}</p>
                        )}
                    </div>

                    {!isPlanned ? (
                        <Button
                            onClick={onAddClick}
                            className="w-full h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-orange-500 hover:text-white text-zinc-400 transition-all duration-300 font-bold group/add"
                        >
                            <Plus className="w-4 h-4 mr-2 group-hover/add:rotate-90 transition-transform" />
                            Öğün Ekle
                        </Button>
                    ) : (
                        <div className="w-full h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                            Planlandı
                        </div>
                    )}
                </div>

                <div className="bg-black/40 border-t border-white/5 px-6 py-4 flex items-center justify-between text-zinc-500 text-[10px] font-black uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-zinc-700" /> {isPlanned ? mealData.nutrition?.cal || "--" : "--"} kkal</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-700" /> {isPlanned ? mealData.times?.total || "--" : "--"} dk</span>
                </div>
            </CardContent>
        </Card>
    )
}
