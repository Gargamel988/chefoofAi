"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
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
      <DialogContent 
        className="
          fixed left-0 top-0
          w-full sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%]
          h-full 
          max-w-2xl
          border-r border-white/10 
          bg-black/95 backdrop-blur-md 
          overflow-y-auto 
          data-[state=open]:animate-in 
          data-[state=closed]:animate-out 
          data-[state=closed]:slide-out-to-left 
          data-[state=open]:slide-in-from-left 
          data-[state=closed]:fade-out-0 
          data-[state=open]:fade-in-0 
          duration-300 
          scrollbar-hide
          p-4 sm:p-6 lg:p-8
        "
      >
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex flex-row items-center gap-2 sm:gap-3">
            <Icon name="Star" className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400 fill-yellow-400" />
            Favori Tarifler
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base lg:text-lg text-slate-300 text-left">
            Kaydettiğiniz favori tariflerinizi burada görüntüleyebilir ve yönetebilirsiniz.
          </DialogDescription>
          <DialogClose className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <Icon name="X" className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-orange-400 transition-colors" />
          </DialogClose>
        </DialogHeader>

        {favorites?.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Icon name="Star" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3">
              Henüz favori tarif yok
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 px-4 max-w-md mx-auto">
              Beğendiğiniz tarifleri yıldız butonuna tıklayarak favorilere ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Header with clear all button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
              <p className="text-base sm:text-lg text-slate-300 font-medium">
                {favorites?.length} favori tarif
              </p>
              <Button
                onClick={() => clearFavorites.mutate()}
                variant="outline"
                size="sm"
                className="
                  w-full sm:w-auto
                  text-sm sm:text-base 
                  text-orange-400 
                  cursor-pointer 
                  bg-black/70 
                  border-orange-400/30 
                  hover:bg-orange-400/10 
                  hover:text-white
                  h-10 sm:h-11
                  transition-all
                "
              >
                <Icon name="Trash2" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Tümünü Temizle
              </Button>
            </div>

            {/* Favorites list with accordion */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {favorites?.map((recipe, index) => {
                const isExpanded = expandedRecipes.has(recipe.title);
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:border-orange-400/30"
                  >
                    {/* Recipe header - clickable */}
                    <div 
                      className="p-4 sm:p-5 lg:p-6 cursor-pointer active:scale-[0.99] transition-transform"
                      onClick={() => toggleRecipeExpansion(recipe.title)}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg lg:text-xl text-left font-bold text-white mb-3 break-words leading-tight">
                            {recipe.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm"> 
                            {recipe.servings && (
                              <span className="px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-400/30 text-orange-300 whitespace-nowrap">
                                <Icon name="Users" className="w-3.5 h-3.5 inline mr-1.5" />
                                {recipe.servings} kişilik
                              </span>
                            )}
                            {recipe.times?.totalMinutes && (
                              <span className="px-3 py-1.5 bg-pink-500/20 rounded-full border border-pink-400/30 text-pink-300 whitespace-nowrap">
                                <Icon name="Clock" className="w-3.5 h-3.5 inline mr-1.5" />
                                {recipe.times.totalMinutes} dk
                              </span>
                            )}
                            {recipe.difficulty && (
                              <span className="px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300 whitespace-nowrap">
                                {recipe.difficulty === "easy"
                                  ? "Kolay"
                                  : recipe.difficulty === "medium"
                                  ? "Orta"
                                  : "Zor"}
                              </span>
                            )}
                            {recipe.cuisine && (
                              <span className="px-3 py-1.5 bg-green-500/20 rounded-full border border-green-400/30 text-green-300 whitespace-nowrap">
                                {recipe.cuisine}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(recipe.title);
                            }}
                            variant="outline"
                            size="sm"
                            className="
                              text-orange-400 
                              cursor-pointer 
                              bg-black/70 
                              border-orange-400/30 
                              hover:bg-orange-400/10 
                              hover:text-white 
                              w-10 h-10 sm:w-11 sm:h-11
                              p-0
                              transition-all
                            "
                          >
                            <Icon name="Trash2" className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                          <div className="text-white/60 text-lg sm:text-xl font-bold">
                            {isExpanded ? "▲" : "▼"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6 border-t border-white/10 pt-4 sm:pt-5 animate-in slide-in-from-top-2 duration-300">
                        {/* Quick info */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
                          {recipe.times?.prepMinutes && (
                            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                              <div className="text-xl sm:text-2xl font-bold text-orange-400">
                                {recipe.times.prepMinutes}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                                Hazırlık (dk)
                              </div>
                            </div>
                          )}
                          {recipe.times?.cookMinutes && (
                            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                              <div className="text-xl sm:text-2xl font-bold text-pink-400">
                                {recipe.times.cookMinutes}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                                Pişirme (dk)
                              </div>
                            </div>
                          )}
                          {recipe.nutrition?.calories && (
                            <div className="text-center p-3 sm:p-4 bg-white/5 rounded-xl col-span-2 sm:col-span-1 hover:bg-white/10 transition-colors">
                              <div className="text-xl sm:text-2xl font-bold text-green-400">
                                {recipe.nutrition.calories}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-300 mt-1">Kalori</div>
                            </div>
                          )}
                        </div>

                        {/* Ingredients preview */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                          <div className="mb-4 sm:mb-5">
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                              <Icon name="Utensils" className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                              Malzemeler ({recipe.ingredients.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recipe.ingredients.map((ingredient, i) => (
                                <span
                                  key={i}
                                  className="text-xs sm:text-sm text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                              <Icon name="ChefHat" className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                              Yapım Aşamaları ({recipe.steps.length})
                            </h4>
                            <div className="space-y-2 sm:space-y-3 bg-white/5 p-3 sm:p-4 rounded-xl">
                              {recipe.steps.map((step, i) => (
                                <div key={i} className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                  <span className="font-semibold text-orange-400 inline-block min-w-[24px]">
                                    {step?.step}.
                                  </span>{" "}
                                  <span className="text-slate-200">{step?.description}</span>
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