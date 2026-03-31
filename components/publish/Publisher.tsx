"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChefHat, Save, Send, ArrowLeft,
  Sparkles, ListChecks, Settings2, BookOpen,
  Info
} from "lucide-react";
import DarkVeil from "@/components/DarkVeil";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import ImageSelector from "./ImageSelector";
import IngredientEditor from "./IngredientEditor";
import StepEditor from "./StepEditor";
import RecipeSettings from "./RecipeSettings";
import LivePreview from "./LivePreview";

import { PublishRecipe, UpdateRecipe } from "@/services/recipes";

interface PublisherProps {
  initialRecipe?: any;
  userId: string;
  user: any;
  mode: "create" | "edit";
}

export default function Publisher({ initialRecipe, userId, user, mode }: PublisherProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: initialRecipe?.title || "",
    description: initialRecipe?.description || "",
    coverImage: initialRecipe?.cover_image || "",
    ingredients: initialRecipe?.recipe_content?.ingredients || [],
    steps: initialRecipe?.recipe_content?.steps || [],
    prepTime: initialRecipe?.prep_time_minutes || initialRecipe?.recipe_content?.times?.prepTime || initialRecipe?.recipe_content?.times?.prepMinutes || "",
    cookTime: initialRecipe?.cook_time_minutes || initialRecipe?.recipe_content?.times?.cookTime || initialRecipe?.recipe_content?.times?.cookMinutes || "",
    servings: initialRecipe?.servings || initialRecipe?.recipe_content?.servings || "4",
    difficulty: initialRecipe?.difficulty || initialRecipe?.recipe_content?.difficulty || "medium",
    cuisine: initialRecipe?.cuisine || initialRecipe?.recipe_content?.cuisine || "",
    mealType: initialRecipe?.meal_type || initialRecipe?.recipe_content?.mealType || "Ana Yemek",
    isPublic: initialRecipe?.is_public ?? true,
    nutrition: initialRecipe?.recipe_content?.nutrition || {
      calories: 0,
      proteinGrams: 0,
      fatGrams: 0,
      carbsGrams: 0
    }
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) { toast.error("Tarif başlığı zorunludur."); return false; }
    if (formData.ingredients.length === 0) { toast.error("En ay bir malzeme eklemelisiniz."); return false; }
    if (formData.steps.length === 0) { toast.error("En az bir hazırlık adımı eklemelisiniz."); return false; }
    return true;
  };

  const handleSave = async (publish: boolean) => {
    if (!validate()) return;

    if (publish) setIsPublishing(true);
    else setIsSaving(true);

    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const recipeData = {
        title: formData.title,
        description: formData.description,
        slug,
        meal_type: formData.mealType,
        is_public: publish || formData.isPublic,
        calories: Math.round(Number(formData.nutrition.calories) || 0),
        protein: Math.round(Number(formData.nutrition.proteinGrams) || 0),
        carbs: Math.round(Number(formData.nutrition.carbsGrams) || 0),
        fat: Math.round(Number(formData.nutrition.fatGrams) || 0),
        cover_image: formData.coverImage,
        recipe_content: {
          ...formData,
          times: {
            prepTime: formData.prepTime,
            cookTime: formData.cookTime,
            totalMinutes: (Number(formData.prepTime) || 0) + (Number(formData.cookTime) || 0)
          }
        }
      };

      let result;
      if (mode === "create") {
        result = await PublishRecipe(recipeData);
      } else {
        result = await UpdateRecipe(initialRecipe.id, recipeData);
      }

      if (result.error) throw result.error;

      if (publish) {
        toast.success("Tarif başarıyla yayınlandı! 🎉");
        router.push(`/recipe/${result.data.slug}`);
      } else {
        toast.success("Taslak kaydedildi.");
        if (mode === "create") {
          router.push(`/publish/${result.data.id}`);
        }
      }
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 relative selection:bg-orange-500/30">
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <DarkVeil hueShift={200} speed={1.5} />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-2">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="group flex items-center justify-center rounded-2xl w-14 h-14 bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-xl"
            >
              <ArrowLeft className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
            </motion.button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/80">Stüdyo</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
                {mode === "edit" ? "Tarif Düzenle" : "Yeni Tarif Yaz"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">

            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving || isPublishing}
              className="flex-1 md:flex-none h-14 px-10 rounded-2xl bg-linear-to-br from-orange-500 via-orange-600 to-pink-600 text-white border-0 font-black shadow-2xl shadow-orange-500/20 transition-all hover:shadow-orange-500/40 active:scale-95 text-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? "Paylaşılıyor..." : "Yayınla"}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Form (The Creative Workspace) */}
          <div className="lg:col-span-7 space-y-16 pb-32">

            {/* Visual Identity Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Görsel & Hikaye</h2>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
                  <Info className="w-3 h-3" /> Zorunlu Alanlar (*)
                </div>
              </div>

              <div className="group/image relative">
                <ImageSelector
                  userId={userId}
                  currentImage={formData.coverImage}
                  onImageSelected={(url) => updateField("coverImage", url)}
                />
              </div>

              <div className="grid gap-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Tarif Adı *</Label>
                  <Input
                    id="title"
                    placeholder="Harika bir isim verin..."
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="h-16 bg-zinc-900/30 border-white/5 rounded-2xl text-2xl font-black placeholder:text-zinc-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all backdrop-blur-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Hikaye & Detay (Opsiyonel)</Label>
                  <textarea
                    id="description"
                    placeholder="Bu tarifi nasıl keşfettiniz, neden seviyorsunuz? Detayları buraya yazın..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full min-h-[160px] p-5 bg-zinc-900/30 border border-white/5 rounded-2xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all font-medium leading-relaxed backdrop-blur-md"
                  />
                </div>
              </div>
            </section>

            {/* Technical Detail Section */}
            <section className="space-y-8 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Settings2 className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Teknik Detaylar</h2>
              </div>
              <RecipeSettings
                settings={formData}
                onChange={(s: any) => setFormData(prev => ({ ...prev, ...s }))}
              />
            </section>

            {/* Architecture Section (Ingredients & Steps) */}
            <div className="grid gap-16 pt-4 border-t border-white/5">
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <ListChecks className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Malzemeler</h2>
                </div>
                <IngredientEditor
                  ingredients={formData.ingredients}
                  onChange={(ings) => updateField("ingredients", ings)}
                />
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Hazırlık Adımları</h2>
                </div>
                <StepEditor
                  steps={formData.steps}
                  onChange={(steps) => updateField("steps", steps)}
                />
              </section>
            </div>

            {/* Nutrition Science Section */}
            <section className="pt-4 border-t border-white/5">
              <Card className="bg-zinc-900/20 border-white/5 rounded-4xl overflow-hidden backdrop-blur-2xl">
                <CardHeader className="border-b border-white/5 bg-white/5 px-8 py-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-400">
                    <Sparkles className="w-4 h-4 text-orange-500" /> Besin Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: "Kalori", key: "calories", suffix: "kcal" },
                    { label: "Protein", key: "proteinGrams", suffix: "g" },
                    { label: "Yağ", key: "fatGrams", suffix: "g" },
                    { label: "Karbonhidrat", key: "carbsGrams", suffix: "g" }
                  ].map((item) => (
                    <div key={item.key} className="space-y-3">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">{item.label} ({item.suffix})</Label>
                      <Input
                        type="number"
                        value={formData.nutrition[item.key as keyof typeof formData.nutrition]}
                        onChange={(e) => updateField("nutrition", { ...formData.nutrition, [item.key]: e.target.value })}
                        className="h-12 bg-zinc-950 border-white/5 rounded-xl font-bold focus:border-orange-500/40 transition-colors"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Side: Live Mirror (Premium Preview) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 pb-20">
            <LivePreview recipe={formData as any} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
