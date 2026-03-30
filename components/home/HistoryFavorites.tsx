"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useConsumedHistory, useMonthlyStats, useHomeFavorites } from "@/hooks/useHome";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function HistoryFavorites() {
    const { data: history, isLoading: historyLoading } = useConsumedHistory(6);
    const { data: monthly, isLoading: monthlyLoading } = useMonthlyStats();
    const { data: favorites, isLoading: favoritesLoading } = useHomeFavorites();

    const isLoading = historyLoading || monthlyLoading || favoritesLoading;

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto px-4 pb-12 space-y-4">
                <Skeleton className="h-60 w-full rounded-2xl bg-zinc-900/50" />
            </section>
        );
    }

    const monthlyCount = monthly?.count || 0;
    const itemsToShow = history && history.length > 0 ? history : (favorites || []);

    return (
        <section className="max-w-7xl mx-auto px-4 pb-12 space-y-4">
            <h2 className="text-xl font-black text-white">Geçmiş & Favoriler</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Achievement */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="md:col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 border border-orange-500/15 bg-orange-500/6 h-full"
                >
                    <span className="text-5xl">{monthlyCount >= 10 ? "🏆" : "🎉"}</span>
                    <div>
                        <p className="text-lg font-black text-white">
                            Bu ay {monthlyCount} yeni tarif denedin!
                        </p>
                        <p className="text-sm text-zinc-400 mt-1">
                            {monthlyCount === 0 
                                ? "Yeni bir serüvene başlamaya ne dersin?" 
                                : "Serüven azalmıyor — harika gidiyorsun."}
                        </p>
                    </div>
                </motion.div>

                <div className="md:col-span-2 space-y-3">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {history && history.length > 0 ? "Son Pişirdiklerin" : "Favori Tariflerin"}
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {itemsToShow.slice(0, 6).map((h: any, i: number) => (
                            <motion.div
                                key={h.id}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <Link href={`/recipe/${h.recipe?.slug || h.slug || "#"}`}>
                                    <Card className="border border-zinc-800/50 bg-zinc-900 shadow-none rounded-2xl hover:border-zinc-700 transition-colors h-full group">
                                        <CardContent className="p-3 flex items-center gap-3 h-full">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                                <img src={h.img || h.recipe?.cover_image} alt={h.name || h.recipe?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{h.name || h.recipe?.title}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {h.cal || h.recipe?.calories} kal {h.date ? `· ${new Date(h.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}` : ''}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                        {itemsToShow.length === 0 && (
                            <div className="col-span-full py-8 text-center text-zinc-600 text-sm">
                                Henüz bir kayıt bulunmuyor.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

