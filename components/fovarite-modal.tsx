"use client";
import { useState } from "react";
import {
  Star,
  Trash2,
  ChefHat,
  Clock,
  Users,
  Utensils,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStorage } from "@/hooks/usestorage";
import Image from "next/image";

interface modalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FavoriteModal({ open, onOpenChange }: modalProps) {
  const { removeFavorite, clearFavorites, favorites } = useStorage();
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  
  const handleRemoveFavorite = (title: string) => {
    removeFavorite.mutate(title);
  };



  const toggleRecipeExpansion = (title: string) => {
    setExpandedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[30%] md:left-[25%] xl:left-[18%] 2xl:left-[10%]  w-60 md:w-1/2 h-full border-r border-white/10 bg-black backdrop-blur-sm overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex flex-row items-center gap-2">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" />
            Favori Tarifler
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm lg:text-base text-slate-300 text-left">
            Kaydettiğiniz favori tariflerinizi burada görüntüleyebilir ve
            yönetebilirsiniz.
          </DialogDescription>
          <DialogClose>
            <X className="w-4 h-4 text-white absolute top-4 right-4" />
          </DialogClose>
        </DialogHeader>

        {favorites?.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">
              Henüz favori tarif yok
            </h3>
            <p className="text-sm sm:text-base text-slate-400 px-4">
              Beğendiğiniz tarifleri yıldız butonuna tıklayarak favorilere
              ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Header with clear all button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <p className="text-sm sm:text-base text-slate-300">{favorites?.length} favori tarif</p>
              <Button
                onClick={() => clearFavorites.mutate()}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm lg:text-base text-orange-400 cursor-pointer bg-black/70 border-orange-400/30 hover:bg-orange-400/10 hover:text-white"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Tümünü Temizle
              </Button>
            </div>

            {/* Favorites list with accordion */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {favorites?.map((recipe, index) => {
                const isExpanded = expandedRecipes.has(recipe.title);
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                  >
                    {/* Recipe header - clickable */}
                    <div 
                      className="p-3 sm:p-4 lg:p-6 cursor-pointer"
                      onClick={() => toggleRecipeExpansion(recipe.title)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base lg:text-xl text-left font-bold text-white mb-2 break-all">
                            {recipe.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"> 
                            {recipe.servings && (
                              <span className="px-2 py-1 bg-orange-500/20 rounded-full border border-orange-400/30 text-orange-300 whitespace-nowrap">
                                <Users className="w-3 h-3 inline mr-1" />
                                {recipe.servings} kişilik
                              </span>
                            )}
                            {recipe.times?.totalMinutes && (
                              <span className="px-2 py-1 bg-pink-500/20 rounded-full border border-pink-400/30 text-pink-300 whitespace-nowrap">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {recipe.times.totalMinutes} dk
                              </span>
                            )}
                            {recipe.difficulty && (
                              <span className="px-2 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300 whitespace-nowrap">
                                {recipe.difficulty === "easy"
                                  ? "Kolay"
                                  : recipe.difficulty === "medium"
                                  ? "Orta"
                                  : "Zor"}
                              </span>
                            )}
                            {recipe.cuisine && (
                              <span className="px-2 py-1 bg-green-500/20 rounded-full border border-green-400/30 text-green-300 whitespace-nowrap">
                                {recipe.cuisine}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 ">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(recipe.title);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-orange-400 cursor-pointer bg-black/70 border-orange-400/30 hover:bg-orange-400/10 hover:text-white p-1.5 sm:p-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <div className="text-white/60 text-sm sm:text-base">
                            {isExpanded ? "▲" : "▼"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable content */}
                    {isExpanded && (
                      <div className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6 border-t border-white/10 pt-3 sm:pt-4 animate-in slide-in-from-top-2 duration-300">
                        {/* Quick info */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                          {recipe.times?.prepMinutes && (
                            <div className="text-center p-2 sm:p-3 bg-white/5 rounded-xl">
                              <div className="text-base sm:text-lg font-bold text-orange-400">
                                {recipe.times.prepMinutes}
                              </div>
                              <div className="text-xs text-slate-300">
                                Hazırlık (dk)
                              </div>
                            </div>
                          )}
                          {recipe.times?.cookMinutes && (
                            <div className="text-center p-2 sm:p-3 bg-white/5 rounded-xl">
                              <div className="text-base sm:text-lg font-bold text-pink-400">
                                {recipe.times.cookMinutes}
                              </div>
                              <div className="text-xs text-slate-300">
                                Pişirme (dk)
                              </div>
                            </div>
                          )}
                          {recipe.nutrition?.calories && (
                            <div className="text-center p-2 sm:p-3 bg-white/5 rounded-xl col-span-2 sm:col-span-1">
                              <div className="text-base sm:text-lg font-bold text-green-400">
                                {recipe.nutrition.calories}
                              </div>
                              <div className="text-xs text-slate-300">Kalori</div>
                            </div>
                          )}
                        </div>

                        {/* Ingredients preview */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 flex items-center gap-1">
                              <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                              Malzemeler ({recipe.ingredients.length})
                            </h4>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {recipe.ingredients.map((ingredient, i) => (
                                <span
                                  key={i}
                                  className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded"
                                >
                                  {ingredient?.amount && ingredient?.unit
                                    ? `${ingredient?.amount} ${ingredient?.unit} ${ingredient?.name}`
                                    : ingredient?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Steps preview */}
                        {recipe.steps && recipe.steps.length > 0 && (
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 flex items-center gap-1">
                              <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                              Yapım Aşamaları ({recipe.steps.length})
                            </h4>
                            <div className="space-y-1 flex flex-col gap-1 bg-white/5 p-2 sm:p-3 rounded-xl">
                              {recipe.steps.map((step, i) => (
                                <div key={i} className="text-xs sm:text-sm text-slate-300">
                                  <span className="font-semibold text-orange-400">
                                    {step?.step}.
                                  </span>{" "}
                                  {step?.description}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}