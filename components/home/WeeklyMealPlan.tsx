import { InteractiveCard } from "@/components/motion";
import { ChevronRight, Sparkles, PenLine } from "lucide-react";
import Link from "next/link";


export default function WeeklyMealPlan() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <div>
                <h2 className="text-xl font-black text-white">Haftalık Menü</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Bu hafta için henüz bir plan yok</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {/* AI ile oluştur */}
                <Link href="/weekly-plan-ai">
                    <InteractiveCard
                        withTap
                        className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 text-left hover:border-orange-500/50 hover:bg-orange-500/10 transition-all group"
                    >
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-white font-black text-base mb-1">
                            AI ile Oluştur
                        </h3>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Mistral AI 7 günlük menünü hazırlıyor, biraz bekle.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-orange-400 text-xs font-bold">
                            Planı Oluştur <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </InteractiveCard>
                </Link>

                {/* Kendim oluşturayım */}
                <Link href="/weekly-plan">
                    <InteractiveCard
                        withTap
                        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                            <PenLine className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                        </div>
                        <h3 className="text-white font-black text-base mb-1">Kendim Oluştururum</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                            Her güne istediğin yemekleri kendin ekle.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-zinc-400 text-xs font-bold">
                            Planı Oluştur <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </InteractiveCard>
                </Link>
            </div>
        </section>
    );
}
