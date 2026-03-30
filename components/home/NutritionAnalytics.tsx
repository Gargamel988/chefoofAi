"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, BarChart2, ChevronRight, Trophy } from "lucide-react";
import { ORANGE } from "./constants";

import { Skeleton } from "@/components/ui/skeleton";
import { useNutritionAnalytics } from "@/hooks/useHome";

export default function NutritionAnalytics() {
    const { data: stats, isLoading } = useNutritionAnalytics();

    if (isLoading) {
        return (
            <section className="py-6 space-y-4">
                <Skeleton className="h-40 w-full rounded-3xl bg-zinc-900/50" />
            </section>
        );
    }

    const currentCalories = stats?.calories || 0;
    const targetCalories = stats?.target_calories || 2000 * 7;
    const progressPct = Math.min(Math.round((currentCalories / targetCalories) * 100), 100);

    const totalMacros = (stats?.protein || 0) + (stats?.carbs || 0) + (stats?.fat || 0) || 1;

    const macros = [
        { label: "Protein", grams: `${Math.round(stats?.protein || 0)}g`, pct: Math.round(((stats?.protein || 0) / totalMacros) * 100), color: "#3B82F6" },
        { label: "Karbonhidrat", grams: `${Math.round(stats?.carbs || 0)}g`, pct: Math.round(((stats?.carbs || 0) / totalMacros) * 100), color: "#F59E0B" },
        { label: "Yağ", grams: `${Math.round(stats?.fat || 0)}g`, pct: Math.round(((stats?.fat || 0) / totalMacros) * 100), color: ORANGE },
    ];

    return (
        <section className="py-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-white">Beslenme Analizi</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Bu haftaki ilerleme durumun</p>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 text-xs px-3 rounded-full">
                    Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            <Card className="border border-zinc-800/60 bg-zinc-900/80 backdrop-blur-md shadow-none rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">

                        {/* Weekly cal */}
                        <div className="p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Flame className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="text-sm text-zinc-400 font-semibold tracking-wide">Haftalık Kalori</span>
                            </div>
                            <div className="flex items-end gap-3 mb-2">
                                <p className="text-4xl font-black text-white tracking-tight">{currentCalories.toLocaleString()}</p>
                                <p className="text-sm font-bold text-zinc-500 mb-1.5">/ {targetCalories.toLocaleString()} kcal</p>
                            </div>
                            <div className="h-2.5 rounded-full bg-zinc-950/80 overflow-hidden shadow-inner mt-4">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ delay: 0.2, duration: 0.8 }}
                                    className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FF9A5C)` }} />
                            </div>
                            <p className="text-xs text-zinc-500 mt-3 font-medium">Hedefinin <span className="text-orange-400 font-bold">%{progressPct}</span> ulaştın.</p>
                        </div>

                        {/* Macros */}
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <BarChart2 className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-sm text-zinc-400 font-semibold tracking-wide">Makro Dağılım</span>
                            </div>
                            <div className="space-y-4">
                                {macros.map((m, i) => (
                                    <div key={m.label}>
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-zinc-300 font-medium">{m.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500">{m.grams}</span>
                                                <span className="font-bold w-8 text-right" style={{ color: m.color }}>{totalMacros > 1 ? m.pct : 0}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-zinc-950/80 overflow-hidden shadow-inner">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${totalMacros > 1 ? m.pct : 0}%` }} transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}
                                                className="h-full rounded-full" style={{ background: m.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Insight */}
                    <div className="border-t border-zinc-800/60 bg-linear-to-r from-orange-500/5 to-transparent p-5 md:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-sm">
                                📊
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Trophy className="w-3.5 h-3.5 text-orange-400" />
                                    <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Günün Özeti</p>
                                </div>
                                <p className="text-base font-black text-white">
                                    {progressPct > 80 ? "Harika bir performans!" : "Hedefine yaklaşmak için iyi bir gün."}
                                </p>
                                <p className="text-xs text-zinc-400 mt-0.5">Bugün planına sadık kalarak harika ilerledin.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-white hover:bg-white/10">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

