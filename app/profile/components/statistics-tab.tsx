"use client";

import { useMyRecipes } from "@/hooks/useRecipes";
import { Star, Heart, Bookmark, Flame, Eye, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Profile = {
    id: string;
    recipes_count?: number;
};

type StatCard = {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    accent?: "red" | "blue" | "orange" | "default";
};

function StatCard({ icon, value, label, accent = "default" }: StatCard) {
    const colors = {
        default: "bg-zinc-800/80 text-white",
        red: "bg-red-500/10 text-red-400 border border-red-500/20",
        blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    };
    const textColors = { default: "text-white", red: "text-white", blue: "text-white", orange: "text-orange-400" };
    const labelColors = { default: "text-zinc-400", red: "text-zinc-400", blue: "text-zinc-400", orange: "text-orange-400/80" };

    return (
        <div className={`p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-center text-center shadow-sm ${accent === "orange" ? "border-orange-500/20 bg-orange-500/5" : ""}`}>
            <div className={`p-3 rounded-xl mb-4 ${colors[accent]}`}>{icon}</div>
            <p className={`text-4xl font-black ${textColors[accent]}`}>{value}</p>
            <p className={`text-xs font-bold mt-1 uppercase tracking-wider ${labelColors[accent]}`}>{label}</p>
        </div>
    );
}

export function StatisticsTab({ profile }: { profile: Profile | null }) {
    const { data: recipes, isLoading } = useMyRecipes();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-zinc-500">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="font-bold">Veriler hesaplanıyor...</p>
            </div>
        );
    }

    const totalRecipes = recipes?.length || 0;
    const totalLikes = recipes?.reduce((acc: number, r: any) => acc + (r.likes_count || 0), 0) || 0;
    const totalSaves = recipes?.reduce((acc: number, r: any) => acc + (r.saves_count || 0), 0) || 0;
    
    // Most popular by likes + saves
    const sortedByPopularity = [...(recipes || [])].sort((a: any, b: any) => 
        ((b.likes_count || 0) + (b.saves_count || 0)) - ((a.likes_count || 0) + (a.saves_count || 0))
    );
    const mostPopularRecipe = sortedByPopularity[0];

    const cards: StatCard[] = [
        { icon: <Star className="w-6 h-6" />, value: totalRecipes, label: "Toplam Tarif", accent: "default" },
        { icon: <Heart className="w-6 h-6" />, value: totalLikes, label: "Toplam Beğeni", accent: "red" },
        { icon: <Bookmark className="w-6 h-6" />, value: totalSaves, label: "Kaydedilme", accent: "blue" },
        { icon: <Sparkles className="w-6 h-6" />, value: 0, label: "AI Katkısı", accent: "orange" },
        { icon: <Eye className="w-6 h-6" />, value: "-", label: "Görüntülenme", accent: "default" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-base font-bold text-white">Profil İstatistikleri</h3>
                <p className="text-sm text-zinc-400 mt-0.5">Tariflerinizin topluluktaki performans özeti.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            {mostPopularRecipe && (totalLikes > 0 || totalSaves > 0) ? (
                <div className="p-6 md:p-8 rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 via-zinc-900/40 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 text-orange-500/5 w-64 h-64 rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">
                        <Flame className="w-full h-full" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-xl border border-orange-500/30">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-white">Gözde Tarifiniz</h4>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 ml-auto">🔥 Popüler</Badge>
                        </div>
                        <p className="text-2xl font-black text-white/90">"{mostPopularRecipe.title}"</p>
                        <p className="text-sm text-zinc-400 mt-2">Bu tarifiniz toplulukta büyük ilgi topladı!</p>
                        <Link 
                            href={`/recipe/${mostPopularRecipe.slug}`}
                            className="mt-5 inline-flex h-9 items-center rounded-xl bg-zinc-800 px-5 text-sm font-bold text-white hover:bg-zinc-700 border border-zinc-700 transition-colors"
                        >
                            Tarifi İncele
                        </Link>
                    </div>
                </div>
            ) : totalRecipes > 0 ? (
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center">
                    <Sparkles className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="font-semibold text-zinc-400">Etkileşimler hesaplanıyor</p>
                    <p className="text-sm text-zinc-600 mt-1">Tarifleriniz beğeni aldıkça burada detaylı analizleri göreceksiniz.</p>
                </div>
            ) : (
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center">
                    <AlertCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="font-semibold text-zinc-400">Henüz tarif paylaşılmamış</p>
                    <p className="text-sm text-zinc-600 mt-1">İlk tarifini paylaştıktan sonra istatistiklerin burada görünecek.</p>
                </div>
            )}
        </div>
    );
}
