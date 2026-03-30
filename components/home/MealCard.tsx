import { FadeUpCard, TapButton, SpinAnimation } from "@/components/motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bookmark, BookmarkCheck, RefreshCw, Play, Loader2, CheckCircle2, Share2 } from "lucide-react";
import { MealData } from "./types";
import { MacroRow } from "./MacroRow";

const MEAL_VISUALS: Record<string, {
    emoji: string;
    label: string;
    bg: string;
    accent: string;
    iconBg: string;
    ring: string;
    shadow: string;
    labelColor: string;
}> = {
    "Kahvaltı": {
        emoji: "🌅",
        label: "Sabah Öğünü",
        bg: "linear-gradient(135deg, #1c1008 0%, #2d1a08 50%, #18181b 100%)",
        accent: "linear-gradient(90deg, #f97316, #fb923c, transparent)",
        iconBg: "linear-gradient(135deg, #431407, #7c2d12)",
        ring: "rgba(251,146,60,0.3)",
        shadow: "rgba(249,115,22,0.35)",
        labelColor: "#fb923c",
    },
    "Öğle": {
        emoji: "☀️",
        label: "Öğle Öğünü",
        bg: "linear-gradient(135deg, #1a1600 0%, #2a2000 50%, #18181b 100%)",
        accent: "linear-gradient(90deg, #eab308, #fde047, transparent)",
        iconBg: "linear-gradient(135deg, #422006, #713f12)",
        ring: "rgba(234,179,8,0.3)",
        shadow: "rgba(234,179,8,0.3)",
        labelColor: "#fbbf24",
    },
    "Akşam": {
        emoji: "🌙",
        label: "Akşam Öğünü",
        bg: "linear-gradient(135deg, #0d0a1a 0%, #150f2b 50%, #18181b 100%)",
        accent: "linear-gradient(90deg, #7c3aed, #a78bfa, transparent)",
        iconBg: "linear-gradient(135deg, #1e1b4b, #3730a3)",
        ring: "rgba(139,92,246,0.3)",
        shadow: "rgba(109,40,217,0.4)",
        labelColor: "#a78bfa",
    },
};

const DEFAULT_VISUAL = {
    emoji: "🍽️",
    label: "Öğün",
    bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    accent: "linear-gradient(90deg, #FF6B00, #f97316, transparent)",
    iconBg: "linear-gradient(135deg, #27272a, #3f3f46)",
    ring: "rgba(255,107,0,0.25)",
    shadow: "rgba(255,107,0,0.2)",
    labelColor: "#f97316",
};

type CardMeal = MealData | { id?: undefined; meal_type: string; is_consumed: boolean; recipes: null; recipe_id?: string; };

export function MealCard({
    meal,
    i,
    isGenerating,
    onConsume,
    onRegenerateSingle,
    toggleFavorite,
    favorites,
}: {
    meal: CardMeal;
    i: number;
    isGenerating?: boolean;
    onConsume: (id: string | number, currentStatus: boolean) => void;
    onRegenerateSingle: (mealType: string, id?: string | number) => void;
    toggleFavorite: (id: string) => void;
    favorites: any[];
}) {
    const router = useRouter();


    // DB'den gelen nested recipes objesinden verileri oku
    const recipe = meal.recipes;
    const title = recipe?.title || "Tarif Hazırlanıyor...";
    const description = recipe?.description || "";
    const cal = recipe?.calories || 0;
    const protein = recipe?.protein || 0;
    const carbs = recipe?.carbs || 0;
    const fat = recipe?.fat || 0;
    const slug = recipe?.slug || "#";

    const mealType = meal.meal_type || "Öğün";
    const isConsumed = meal.is_consumed || false;
    const hasId = meal.id !== undefined && meal.id !== null;

    const totalMacros = protein + carbs + fat;
    const visual = MEAL_VISUALS[mealType] ?? DEFAULT_VISUAL;


    return (
        <FadeUpCard index={i}>
            <Card className={`overflow-hidden border transition-all duration-300 shadow-none rounded-2xl ${isConsumed ? "border-green-500/30 bg-green-950/20" : "border-zinc-800/60 bg-zinc-900 hover:border-orange-500/20 hover:shadow-[0_4px_32px_rgba(255,107,44,0.08)]"}`}>

                {/* ── Meal Banner ── */}
                <div
                    className={`relative h-40 overflow-hidden flex items-center justify-between px-5 ${isConsumed ? "opacity-60 grayscale" : ""}`}
                    style={{ background: visual.bg }}
                >
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: visual.accent }} />

                    {/* Large faded watermark emoji */}
                    <span
                        className="absolute -right-3 -bottom-4 text-[9rem] leading-none select-none pointer-events-none"
                        style={{ opacity: 0.12, filter: "blur(1px)" }}
                    >
                        {visual.emoji}
                    </span>

                    {/* Icon + label */}
                    <div className="relative z-10 flex flex-col gap-3">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                            style={{
                                background: visual.iconBg,
                                boxShadow: `0 0 0 1px ${visual.ring}, 0 8px 24px ${visual.shadow}`,
                            }}
                        >
                            {visual.emoji}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: visual.labelColor }}>
                                {visual.label}
                            </p>
                            <p className="text-[10px] text-white/20 font-medium mt-0.5">{mealType}</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5 z-20">
                        <TapButton
                            title="Favorilere Ekle"
                            disabled={isGenerating}
                            onClick={() => toggleFavorite(recipe?.id?.toString() || "")}
                            className="w-8 h-8 cursor-pointer rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/50 transition-colors"
                        >
                            {favorites?.some((f) => f.recipe?.id === recipe?.id)
                                ? <BookmarkCheck className="w-3.5 h-3.5 text-orange-400" />
                                : <Bookmark className="w-3.5 h-3.5 text-white/50" />}
                        </TapButton>
                        <TapButton
                            onClick={() => onRegenerateSingle(mealType, meal.id)}
                            disabled={isGenerating}
                            title="Tarifi Yenile"
                            className="w-8 h-8 cursor-pointer rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center disabled:opacity-50 hover:bg-black/50 transition-colors"
                        >
                            <SpinAnimation isSpinning={!!isGenerating}>
                                <RefreshCw className="w-3.5 h-3.5 text-white/50" />
                            </SpinAnimation>
                        </TapButton>
                        <TapButton
                            onClick={() => {
                                if (recipe?.id) {
                                    router.push(`/publish/${recipe.id}`);
                                }
                            }}
                            className="w-8 h-8 cursor-pointer rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/50 transition-colors"
                            title="Toplulukla Paylaş"
                        >
                            <Share2 className="w-3.5 h-3.5 text-white/50" />
                        </TapButton>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-zinc-900 to-transparent" />
                </div>

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-bold text-sm leading-snug ${isGenerating && !recipe ? "animate-pulse text-zinc-500" : isConsumed ? "text-zinc-400" : "text-white"}`}>
                            {title}
                        </h3>
                        <div className="text-right shrink-0">
                            <p className="text-xl font-black leading-none" style={{ color: isConsumed ? "#52525b" : "#FF6B00" }}>{cal}</p>
                            <p className="text-[10px] text-zinc-600">kal</p>
                        </div>
                    </div>

                    <p className={`text-xs line-clamp-2 h-8 ${isConsumed || isGenerating ? "text-zinc-600" : "text-zinc-400"}`}>
                        {description || (isGenerating && <span className="animate-pulse">AI detayları oluşturuyor...</span>)}
                    </p>

                    <div className={`space-y-1.5 pt-0.5 ${isConsumed ? "opacity-50" : ""}`}>
                        <MacroRow label="Protein" value={protein} pct={totalMacros > 0 ? Math.round((protein / totalMacros) * 100) : 0} color="#3B82F6" />
                        <MacroRow label="Karb" value={carbs} pct={totalMacros > 0 ? Math.round((carbs / totalMacros) * 100) : 0} color="#F59E0B" />
                        <MacroRow label="Yağ" value={fat} pct={totalMacros > 0 ? Math.round((fat / totalMacros) * 100) : 0} color="#FF6B00" />
                    </div>

                    <Separator className="bg-zinc-800" />

                    <div className="flex gap-2">
                        <Link href={`/recipe/${slug}`} className="flex-1">
                            <Button
                                disabled={isGenerating || !recipe?.slug}
                                className={`w-full cursor-pointer text-sm font-bold text-white border-0 rounded-xl disabled:opacity-50 ${isConsumed ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : ""}`}
                                style={!isConsumed ? { background: "#FF6B00" } : undefined}
                            >
                                {isGenerating && !recipe?.slug
                                    ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                    : <Play className="w-3.5 h-3.5 mr-2 fill-white" />}
                                Tarifi Aç
                            </Button>
                        </Link>

                        {hasId && (
                            <Button
                                disabled={isGenerating}
                                onClick={() => meal.id && onConsume(meal.id, isConsumed)}
                                className={`w-auto px-4 cursor-pointer text-sm font-bold border-0 rounded-xl transition-all ${isConsumed ? "bg-green-600/20 text-green-500 hover:bg-green-600/30" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"}`}
                            >
                                <CheckCircle2 className={`w-4 h-4 ${isConsumed ? "mr-1.5" : ""}`} />
                                {isConsumed ? "Yedim ✓" : "Yedim"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </FadeUpCard>
    );
}
