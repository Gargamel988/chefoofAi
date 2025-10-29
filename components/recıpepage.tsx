"use client";
import { streamObjectSchema } from "@/app/scheme/stream-object-schemes";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Sparkles, ChefHat, Utensils, Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import FovariteModal from "./fovarite-modal";
import { FavoriteRecipe } from "@/type/recipetype";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useStorage } from "@/hooks/usestorage";
import DarkVeil from "./DarkVeil";
import Loading from "@/app/loading";

export default function RecipePage() {
  const [dish, setDish] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [open, setOpen] = useState(false);
  const { saveFavorites } = useStorage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const { submit, object, isLoading, error } = useObject({
    schema: streamObjectSchema,
    api: "/api/chat",
  });

  const submitDish = () => {
    if (!dish.trim() || !submit) return;
    submit({ dish });
    setIsStarred(false);
    setDish("");
  };

  const handlesubmit = () => {
    if (!object) return;
    saveFavorites.mutate(object as FavoriteRecipe);
    setIsStarred(true);
  };
  if (!mounted) return <Loading />;

  return  (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background overlay for better text readability */}
      <div className="fixed inset-0">
        <DarkVeil hueShift={210} speed={2} />
      </div>
      {/* Main content container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-b from-orange-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10">
              <ChefHat className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              CheFood AI
            </h1>
          </div>
          <p className="text-lg text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
            Yapay zeka destekli tarif asistanınız. Hangi yemeği pişirmek
            istediğinizi söyleyin, size özel tarifler ve detaylı yapım aşamaları
            sunalım.
          </p>
        </div>

        {/* Input section with glassmorphism */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <CardContent className="flex flex-col md:flex-row gap-6 p-0">
            <div className="flex-1 p-0">
              <CardHeader className="p-0 flex-1">
                <CardTitle className=" text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  Ne pişirmek istersiniz?
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
                placeholder="Örn: Tavuklu makarna, sebzeli pilav, karnıyarık..."
                className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  submitDish();
                }}
                disabled={isLoading || !submit}
                className="w-full cursor-pointer px-8 py-9 hover:shadow-2xl bg-gradient-to-r from-black via-orange-900 to-orange-500 hover:from-zinc-900 hover:via-orange-800 hover:to-orange-400 border border-orange-400/30 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-orange-500/30 disabled:opacity-50"
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

        {/* Recipe Results Section */}
        {object && (
          <div className="mt-16 space-y-8">
            {/* Recipe Header */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className=" mb-8 flex items-center justify-between">
                <div className=" text-center flex-1 ">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {object.title}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
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
                        {object.difficulty === "easy"
                          ? "Kolay"
                          : object.difficulty === "medium"
                          ? "Orta"
                          : "Zor"}
                      </span>
                    )}
                    {object.cuisine && (
                      <span className="px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                        {object.cuisine}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  disabled={isLoading}
                  onClick={handlesubmit}
                  className=" bg-white/5 cursor-pointer border border-white/10 rounded-3xl p-2 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarred ? (
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
              {/* Time Details */}
              {object.times && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {object.times.prepMinutes && (
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-2xl font-bold text-orange-400">
                        {object.times.prepMinutes}
                      </div>
                      <div className="text-sm text-slate-300">
                        Hazırlık (dk)
                      </div>
                    </div>
                  )}
                  {object.times.cookMinutes && (
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-2xl font-bold text-pink-400">
                        {object.times.cookMinutes}
                      </div>
                      <div className="text-sm text-slate-300">Pişirme (dk)</div>
                    </div>
                  )}
                  {object.times.totalMinutes && (
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-2xl font-bold text-blue-400">
                        {object.times.totalMinutes}
                      </div>
                      <div className="text-sm text-slate-300">Toplam (dk)</div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients */}
              {object.ingredients && object.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Utensils className="w-6 h-6 text-orange-400" />
                    Malzemeler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {object.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-white">
                          {ingredient?.amount && ingredient?.unit
                            ? `${ingredient?.amount} ${ingredient?.unit} ${ingredient?.name}`
                            : ingredient?.name}
                        </span>
                        {ingredient?.notes && (
                          <span className="text-slate-400 text-sm">
                            ({ingredient?.notes})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              {object.steps && object.steps.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-orange-400" />
                    Yapım Aşamaları
                  </h3>
                  <div className="space-y-4">
                    {object.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step?.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-white leading-relaxed">
                            {step?.description}
                          </p>
                          {step?.durationMinutes && (
                            <div className="mt-2 text-sm text-slate-400">
                              ⏱️ {step?.durationMinutes} dakika
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition Info */}
              {object.nutrition && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-orange-400" />
                    Besin Değerleri
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {object.nutrition.calories && (
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-2xl font-bold text-orange-400">
                          {object.nutrition.calories}
                        </div>
                        <div className="text-sm text-slate-300">Kalori</div>
                      </div>
                    )}
                    {object.nutrition.proteinGrams && (
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-2xl font-bold text-pink-400">
                          {object.nutrition.proteinGrams}g
                        </div>
                        <div className="text-sm text-slate-300">Protein</div>
                      </div>
                    )}
                    {object.nutrition.fatGrams && (
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-2xl font-bold text-blue-400">
                          {object.nutrition.fatGrams}g
                        </div>
                        <div className="text-sm text-slate-300">Yağ</div>
                      </div>
                    )}
                    {object.nutrition.carbsGrams && (
                      <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-2xl font-bold text-green-400">
                          {object.nutrition.carbsGrams}g
                        </div>
                        <div className="text-sm text-slate-300">
                          Karbonhidrat
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {object.equipment && object.equipment.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Gerekli Ekipmanlar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {object.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 rounded-full text-white text-sm border border-white/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {object.tips && object.tips.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    İpuçları & Öneriler
                  </h3>
                  <div className="space-y-3">
                    {object.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl border border-orange-400/20"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">💡</span>
                        </div>
                        <p className="text-white">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-16 backdrop-blur-xl bg-red-500/10 border border-red-400/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">
                Bir Hata Oluştu
              </h3>
              <p className="text-red-300">{error.message}</p>
            </div>
          </div>
        )}

        {/* Features section - only show when no recipe is displayed */}
        {!object && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Uzman Tarifler
              </h3>
              <p className="text-slate-400 text-sm">
                Profesyonel şef deneyimi ile hazırlanmış detaylı tarifler
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Adım Adım Rehber
              </h3>
              <p className="text-slate-400 text-sm">
                Her aşamada size rehberlik eden detaylı yapım talimatları
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Kişiselleştirilmiş
              </h3>
              <p className="text-slate-400 text-sm">
                Tercihlerinize göre özelleştirilmiş malzeme listesi ve porsiyon
              </p>
            </div>
          </div>
        )}
        
      </div>

      {/* Favori butonu - sol alt köşe */}
      <Button
        onClick={() => setOpen(true)}
        className=" fixed bottom-6 left-6 size-16 bg-gradient-to-b from-orange-500/20 to-black/20 cursor-pointer rounded-full backdrop-blur-sm border border-orange-400/30 hover:bg-orange-500/30 transition-all duration-300 group shadow-lg z-50"
        title="Favori Tarifler"
      >
        <Heart className=" size-6 text-orange-400 group-hover:text-orange-300 transition-colors" />
      </Button>

      <FovariteModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
