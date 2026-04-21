import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import GreetingHero from "@/components/home/GreetingHero";
import FridgeFeature from "@/components/home/FridgeFeature";
import WhateverCookFeature from "@/components/home/WhateverCookFeature";
import MealRecommendations from "@/components/home/MealRecommendations";
import WeeklyMealPlan from "@/components/home/WeeklyMealPlan";
import NutritionAnalytics from "@/components/home/NutritionAnalytics";
import HistoryFavorites from "@/components/home/HistoryFavorites";
import AdBanner from "@/components/AdBanner";

import { ORANGE } from "@/components/home/constants";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { getMyProfile } from "@/services/profiles";
import { GetDailyConsumedCalories } from "@/services/meals";
import { Skeleton } from "@/components/ui/skeleton";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Ana Sayfa | CheFood AI",
  description: "Yapay zeka destekli en lezzetli yemek tariflerini keşfedin. Kendi malzemelerinizle anında yeni tarifler oluşturun.",
  path: "/",
  keywords: [
    "yemek tarifleri",
    "yapay zeka yemek",
    "ai yemek asistanı",
    "kolay tarifler",
    "pratik yemekler",
    "mutfak asistanı",
    "yemek önerileri",
    "tarif bulucu",
    "yemek planı",
    "sağlıklı tarifler",
    "chefood ai",
  ],
});

export default async function HomePage() {
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["profile", "me"],
      queryFn: getMyProfile,
    }),
    queryClient.prefetchQuery({
      queryKey: ["daily_calories", new Date().toISOString().split("T")[0]],
      queryFn: GetDailyConsumedCalories,
    }),
  ]);

  return (
    <section className="min-h-screen bg-[#0A0A0A] text-white pb-32 md:pb-12">
      <h1 className="sr-only">CheFood AI - Yapay Zeka Destekli Yemek Tarifleri</h1>

      {/* 1. GREETING HERO */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <GreetingHero />
        </Suspense>
      </HydrationBoundary>

      {/* ADSENSE BANNER */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="8136351407" />
      </div>

      {/* 2. FRIDGE FEATURE (PRIMARY ACTION) */}
      <FridgeFeature />

      {/* 2.5 WHATEVER COOK FEATURE */}
      <WhateverCookFeature />

      {/* 3. AI MEAL RECOMMENDATIONS */}
      <MealRecommendations />

      {/* 4. WEEKLY MEAL PLAN */}
      <WeeklyMealPlan />

      {/* 5. NUTRITION ANALYTICS */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NutritionAnalytics />
      </div>

      {/* 6. HISTORY & FAVORITES */}
      <HistoryFavorites />

      {/* 7. SEO RICH CONTENT - Provides value to search engines and AdSense bots */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-24 border-t border-zinc-900 mt-12">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-orange-500 mb-6 underline decoration-orange-500/30 underline-offset-8">
            CheFood AI: Mutfaktaki Akıllı Asistanınız
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            CheFood AI, modern mutfakların en büyük yardımcısı olarak tasarlandı. Yapay zeka teknolojisini gastronomi dünyasıyla birleştirerek, evinizdeki malzemelerle neler pişirebileceğinizi saniyeler içinde size söyler. "Bugün ne pişirsem?" sorusuna son veren platformumuz, tamamen kişiselleştirilmiş bir yemek deneyimi sunar.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Neden CheFood AI Kullanmalısınız?</h3>
              <p className="text-zinc-500">
                Geleneksel tarif sitelerinin aksine, CheFood AI sizin elinizdeki malzemelere odaklanır. Buzdolabınızda kalan son üç malzemeyle bile gurme lezzetler yaratmanıza olanak tanır. Ayrıca besin analizi ve haftalık planlama özellikleri ile sağlıklı yaşam hedeflerinize ulaşmanızı kolaylaştırır.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Tasarruf ve Sürdürülebilirlik</h3>
              <p className="text-zinc-500">
                Gıda israfını önlemek bizim için bir misyondur. Elinizdeki malzemeleri en verimli şekilde kullanarak hem bütçenizi korur hem de çevreye katkıda bulunursunuz. Akıllı öneri sistemimiz, benzer malzemelerle yapılabilecek farklı tarifleri de sunarak mutfakta yaratıcılığınızı artırır.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* ══ MOBILE NAV ════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 md:hidden z-40">
        <div className="mx-3 mb-3 flex items-center justify-around bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)] px-2 py-2">
          {[{ icon: "🏠", label: "Ana Sayfa", href: "/", active: true }, { icon: "📖", label: "Keşfet", href: "/kesfet" }].map(t => (
            <Link key={t.label} href={t.href} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${t.active ? "text-orange-400" : "text-zinc-500"}`}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </Link>
          ))}
          <Link href="/ai" className="-mt-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95" style={{ background: ORANGE, boxShadow: "0 0 28px rgba(255,107,44,0.45)" }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          {[{ icon: "❤️", label: "Favoriler", href: "/" }, { icon: "👤", label: "Profil", href: "/profile" }].map(t => (
            <Link key={t.label} href={t.href} className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-zinc-500">
              <span className="text-xl">{t.icon}</span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
