"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, Zap, Trophy, TrendingUp } from "lucide-react";
import { ORANGE } from "./constants";
import { FadeUpCard, WidthExpand } from "@/components/motion";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useDailyCalories } from "@/hooks/useMeals";

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Günaydın";
    if (h < 18) return "Tünaydın";
    return "İyi akşamlar";
}

export default function GreetingHero() {
    const profile = useGetProfile();
    const { data: todayKal } = useDailyCalories();

    const targetKal = 1800;
    const rawPct = Math.round((todayKal / targetKal) * 100);
    const goalPct = rawPct > 100 ? 100 : rawPct;

    const goalMap: Record<string, string> = {
        lose_weight: "kilo verme",
        gain_muscle: "kas yapma",
        maintain_health: "form koruma",
        save_money: "tasarruf",
        save_time: "hızlı mutfak"
    };
    const goalLabel = profile?.goal ? goalMap[profile.goal] : null;

    const formatDiet = (d?: string) => {
        if (!d) return "Tümü";
        const map: Record<string, string> = { "omnivore": "Hepçil", "vegetarian": "Vejetaryen", "vegan": "Vegan", "pescatarian": "Pesko" };
        return map[d] || "Tümü";
    };

    const displayName = profile?.name || "Kullanıcı";

    return (
        <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
            <FadeUpCard index={0} className="w-full">
                <Card className="border border-zinc-800/60 rounded-2xl overflow-hidden shadow-none bg-zinc-900 relative">
                    {/* Subtle top glow */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-orange-500/[0.06] blur-3xl pointer-events-none" />

                    <CardContent className="p-5 relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        {/* User row */}
                        <div className="flex-1 flex items-center justify-between md:justify-start md:gap-6">
                            <div>
                                <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">{getGreeting()}</p>
                                <h1 className="text-2xl md:text-3xl font-black text-white mt-0.5 tracking-tight">
                                    {displayName} 👋
                                </h1>
                                {goalLabel && (
                                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                                        <TrendingUp className="w-3 h-3 text-orange-400" />
                                        <span className="text-orange-300 font-medium">{goalLabel}</span> hedefi aktif
                                    </p>
                                )}
                            </div>
                            <Avatar className="h-12 w-12 md:h-16 md:w-16 ring-2 ring-orange-500/40 ring-offset-2 ring-offset-zinc-900">
                                <AvatarImage src={profile?.avatar_url ?? undefined} />
                                <AvatarFallback className="bg-orange-500/10 text-orange-400 font-black text-lg md:text-xl">
                                    {displayName[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Stat strip & Weekly goal progress */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: <Flame className="w-4 h-4 text-orange-400" />, val: `${todayKal}`, sub: "bugün kal" },
                                    { icon: <Zap className="w-4 h-4 text-blue-400" />, val: formatDiet(profile?.diet_type), sub: "beslenme" },
                                    { icon: <Trophy className="w-4 h-4 text-amber-400" />, val: "12", sub: "bu ay tarif" },
                                ].map((s, i) => (
                                    <div key={i} className="rounded-xl p-2.5 text-center border border-zinc-800 bg-zinc-800/40">
                                        <div className="flex justify-center mb-1">{s.icon}</div>
                                        <p className="text-xs font-black text-white truncate">{s.val}</p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">{s.sub}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-400 font-medium">Günlük Beslenme Hedefin</span>
                                    <span className="font-bold text-orange-400">{goalPct}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                                    <WidthExpand
                                        pct={goalPct}
                                        delay={0.3}
                                        duration={1}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${ORANGE}, #FF9A5C)` }}
                                    />
                                </div>
                                <p className="text-[11px] text-zinc-500">
                                    Bugün <span className="text-orange-400 font-bold">{todayKal} kal</span> · Hedef {targetKal} kal
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </FadeUpCard>
        </section>
    );
}
