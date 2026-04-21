import WeeklyPlanClient from "./WeeklyPlanClient"
import { fetchWeeklyPlan } from "@/services/weeklyPlan";
import {
    dehydrate,
    HydrationBoundary,
} from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Haftalık Yemek Programım | CheFood AI",
    description: "Kendi beslenme düzeninizi oluşturun, sevdiğiniz tarifleri haftalık plana ekleyin ve mutfak rutininizi kolayca yönetin.",
    path: "/weekly-plan",
    keywords: [
        "haftalık yemek planı oluşturma",
        "yemek programı",
        "tarif organizatörü",
        "kişisel yemek listesi",
        "sağlıklı beslenme planı",
        "mutfak ajandası",
        "haftalık menü hazırlama",
        "yemek tarifleri düzenleyici",
        "chefood ai yemek planı",
    ],
    noIndex: true,
});

export default async function Page() {
    const queryClient = createQueryClient();

    // Prefetch weekly plan data for the initial day (Pazartesi)
    await queryClient.prefetchQuery({
        queryKey: ["weekly_plan", "Pazartesi"],
        queryFn: fetchWeeklyPlan,
    });

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-orange-500/30">
            {/* Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 pt-16 pb-12 px-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-white/5 backdrop-blur-md shadow-2xl">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Premium Beslenme Deneyimi</span>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            Haftalık <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-500 to-orange-600">Planın</span>
                        </h1>
                        <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
                            Gastronomi ve bilimle harmanlanmış, size özel hazırlanmış profesyonel beslenme programı.
                        </p>
                    </div>
                </div>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className="flex items-center justify-center p-20">Yükleniyor...</div>}>
                    <WeeklyPlanClient />
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}
