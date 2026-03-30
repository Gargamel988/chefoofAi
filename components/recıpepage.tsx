"use client";

import { streamObjectSchema } from "@/schema/stream-object-schemes";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import DarkVeil from "./DarkVeil";
import Loading from "@/app/loading";
import { Star, Users, ChefHat, Utensils, Sparkles, Share2, Bookmark } from "lucide-react";
import { useFavorite } from '@/hooks/useFavorite'
import { useSocial } from "@/hooks/useSocial";
import { useRecipeMutations } from "@/hooks/useRecipes";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/use-subscription";
import Link from "next/link";

export default function RecipePage({ mode = "standard" }: { mode?: "standard" | "fridge" }) {
  const [dish, setDish] = useState("");
  const [publishedRecipeId, setPublishedRecipeId] = useState<string | null>(null);
  const [isSharingPost, setIsSharingPost] = useState(false);
  const router = useRouter();

  const { tier, loading: subLoading } = useSubscription();

  const { favorites, toggleFavorite, isToggling } = useFavorite();
  const { createPost } = useSocial();
  const { publishRecipe, isPublishing } = useRecipeMutations();


  const { submit, object, isLoading, error } = useObject({
    schema: streamObjectSchema,
    api: "/api/chat",
  });


  const submitDish = () => {
    if (subLoading) return;
    if (!dish.trim() || !submit) return;

    // Check for Whatever-Cook Access (Pro/Premium)
    if (mode === "fridge" && tier === "Free") {
      toast.error("Buzdolabında ne var modu Pro veya Premium paket gerektirir.", {
        description: "Hemen yükseltme yaparak malzemelerinden harika tarifler üretebilirsin!",
        action: {
          label: "Paketleri Gör",
          onClick: () => router.push("/pricing")
        }
      });
      return;
    }



    // Note: Daily limits are also enforced on the server-side API for security
    submit({ dish, type: mode });
    setPublishedRecipeId(null);
    setDish("");
  };

  const handleToggleFavorite = async () => {
    if (!object) return;

    let recipeId = publishedRecipeId;

    if (!recipeId) {
      const res = await publishRecipe({
        title: object.title || "Adsız Tarif",
        slug: object.slug || `recipe-${Math.random().toString(36).substring(2, 7)}`,
        description: (object as any).description || "",
        recipe_content: object,
        meal_type: (object as any).mealType || (object as any).cuisine || "Ana Yemek",
        calories: object.nutrition?.calories ? Math.round(object.nutrition.calories) : undefined,
        protein: object.nutrition?.proteinGrams ? Math.round(object.nutrition.proteinGrams) : undefined,
        carbs: object.nutrition?.carbsGrams ? Math.round(object.nutrition.carbsGrams) : undefined,
        fat: object.nutrition?.fatGrams ? Math.round(object.nutrition.fatGrams) : undefined,
        is_public: false
      });

      if (res.error || !res.data) return;

      recipeId = res.data.id;
      setPublishedRecipeId(recipeId);
    }

    try {
      if (recipeId) {
        await toggleFavorite(recipeId);
        const isNowFavorited = !favorites?.some((f: any) => f.recipe?.id === recipeId);
        toast.success(isNowFavorited ? "Tarif favorilerine eklendi!" : "Tarif favorilerinden çıkarıldı.");
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      toast.error("İşlem gerçekleştirilemedi.");
    }
  };


  const handleShareAsPost = async () => {
    if (!object || !object.title) return;

    let recipeId = publishedRecipeId;

    if (!recipeId) {
      const res = await publishRecipe({
        title: object.title,
        slug: object.slug || `recipe-${Math.random().toString(36).substring(2, 7)}`,
        description: (object as any).description || "",
        recipe_content: object,
        meal_type: (object as any).mealType || (object as any).cuisine || "Ana Yemek",
        calories: object.nutrition?.calories ? Math.round(object.nutrition.calories) : undefined,
        protein: object.nutrition?.proteinGrams ? Math.round(object.nutrition.proteinGrams) : undefined,
        carbs: object.nutrition?.carbsGrams ? Math.round(object.nutrition.carbsGrams) : undefined,
        fat: object.nutrition?.fatGrams ? Math.round(object.nutrition.fatGrams) : undefined,
        is_public: false
      });

      if (res.error || !res.data) return;
      recipeId = res.data.id;
      setPublishedRecipeId(recipeId);
    }

    router.push(`/publish/${recipeId}`);
  };

  const isFavorited = publishedRecipeId && favorites?.some((f: any) => f.recipe?.id === publishedRecipeId);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Suspense fallback={<Loading />}>
        <div className="fixed inset-0">
          <DarkVeil hueShift={210} speed={2} />
        </div>
      </Suspense>
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-linear-to-b from-orange-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10">
              <ChefHat className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-200 bg-clip-text text-transparent">
              CheFood <span className="text-orange-500">{mode === "fridge" ? "Buzdolabı Modu" : "AI"}</span>
            </h1>
          </div>
          <p className="text-lg text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
            {mode === "fridge"
              ? "Buzdolabındaki malzemelerini yaz, sana özel israfsız tarifler üretelim."
              : "Yapay zeka destekli tarif asistanınız. Hangi yemeği pişirmek istediğinizi söyleyin, size özel tarifler sunalım."}
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <CardContent className="flex flex-col md:flex-row gap-6 p-0">
            <div className="flex-1 p-0">
              <CardHeader className="p-0 flex-1">
                <CardTitle className=" text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  {mode === "fridge" ? "Eldeki malzemeleriniz?" : "Ne pişirmek istersiniz?"}
                </CardTitle>
              </CardHeader>
              <input
                id="dish"
                type="text"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitDish();
                  }
                }}
                placeholder={mode === "fridge" ? "Örn: 2 Yumurta, Domates, Biraz peynir..." : "Örn: Tavuklu makarna, sebzeli pilav..."}
                className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  submitDish();
                }}
                disabled={isLoading || !submit || subLoading}
                className="w-full cursor-pointer px-8 py-9 hover:shadow-2xl bg-linear-to-r from-black via-orange-900 to-orange-500 hover:from-zinc-900 hover:via-orange-800 hover:to-orange-400 border border-orange-400/30 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-orange-500/30 disabled:opacity-50"
              >
                <span className="relative flex items-center gap-2 text-lg">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Hazırlanıyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Tarif Oluştur
                    </>
                  )}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ad Placeholder for Free Tier */}
        {!subLoading && tier === "Free" && (
          <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center min-h-[100px] group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 to-transparent animate-pulse" />
            <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">REKLAM</span>
            <p className="text-zinc-400 text-sm text-center">
              Pro plana geçerek reklamları kaldırın ve <span className="text-orange-500 font-bold">15 tarif/gün</span> hakkı kazanın!
            </p>
            <div className="flex items-center justify-center  animate-pulse rounded-full p-2">
              <Link href="/pricing" className="relative z-10 mt-3 text-orange-500 text-xs font-black uppercase hover:scale-105 transition-transform flex items-center gap-1">
                Yükselt <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {object && (
          <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className=" mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className=" text-center md:text-left flex-1 ">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {object.title}
                  </h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-300">
                    {object.servings && (
                      <span className="px-3 py-1 bg-orange-500/20 rounded-full border border-orange-400/30">
                        {object.servings} kişilik
                      </span>
                    )}
                    {object.times?.totalMinutes && (
                      <span className="px-3 py-1 bg-pink-500/20 rounded-full border border-pink-400/30">
                        {object.times.totalMinutes} dakika
                      </span>
                    )}
                    {object.difficulty && (
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                        {object.difficulty === "easy" ? "Kolay" : object.difficulty === "medium" ? "Orta" : "Zor"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={isSharingPost || isLoading}
                    onClick={handleShareAsPost}
                    className="h-12 px-6 rounded-2xl shadow-xl bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 font-bold"
                  >
                    <span className="flex items-center gap-2"><Users className="w-5 h-5" /> Paylaş</span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (object?.slug) {
                        navigator.clipboard.writeText(`${window.location.origin}/recipe/${object.slug}`);
                        toast.success("Bağlantı kopyalandı!");
                      }
                    }}
                    className="bg-white/5 border border-white/10 rounded-2xl h-12 w-12 p-0 hover:bg-white/10"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </Button>

                  <Button
                    disabled={isLoading || isPublishing || isToggling}
                    onClick={handleToggleFavorite}
                    className="bg-white/5 border border-white/10 rounded-2xl h-12 w-12 p-0 shadow-xl hover:bg-white/10"
                  >
                    {isFavorited ? (
                      <Bookmark className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              {object.ingredients && (
                <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-orange-400" /> Malzemeler
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {object.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {ing?.amount} {ing?.unit} {ing?.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {object.steps && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-orange-400" /> Yapım Aşamaları
                  </h3>
                  {object.steps.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="shrink-0 w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center font-black text-orange-400">
                        {step?.step}
                      </div>
                      <p className="text-slate-300 leading-relaxed pt-2">{step?.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
