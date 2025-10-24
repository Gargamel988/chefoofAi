
"use client";
import { useState, useEffect } from "react";
import { Star, Trash2, ChefHat, Clock, Users, Utensils, XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FavoriteRecipe } from "@/type/recipetype";


interface modalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function FovariteModal({ open, onOpenChange }: modalProps) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const favoritesArray = Array.isArray(favorites) ? favorites : [favorites];

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites) as FavoriteRecipe[];
      setTimeout(() => {
        setFavorites(parsedFavorites);
      }, 0);
    }
  }, [open]); 

  const handleRemoveFavorite = (title: string) => {
	try {
	  const existingFavorites = localStorage.getItem("favorites");
	  const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
	  
	  const updatedFavorites = favorites.filter((fav: FavoriteRecipe) => fav.title !== title);
	  
	  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
	  setFavorites(updatedFavorites);
	  
	} catch (error) {
	  console.error("Error removing favorite:", error);
	}
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.clear();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="!max-w-[100vw] mt-10 max-h-[90vh] overflow-y-auto bg-black backdrop-blur-sm border-white/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 scrollbar-hide">
        <DialogHeader>
          <DialogTitle  className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Favori Tarifler
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Kaydettiğiniz favori tariflerinizi burada görüntüleyebilir ve yönetebilirsiniz.
          </DialogDescription>
		  <DialogClose asChild>
				<XIcon className="w-4 h-4 text-white absolute top-4 right-4" />
		  </DialogClose>
        </DialogHeader>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Henüz favori tarif yok</h3>
            <p className="text-slate-400">Beğendiğiniz tarifleri yıldız butonuna tıklayarak favorilere ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with clear all button */}
            <div className="flex justify-between items-center">
              <p className="text-slate-300">
                {favorites.length} favori tarif
              </p>
              <Button
                onClick={clearAllFavorites}
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400/30 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Tümünü Temizle
              </Button>
            </div>

            {/* Favorites list */}
            <div className="space-y-4">
              {favoritesArray.map((recipe, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  {/* Recipe header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{recipe.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {recipe.servings && (
                          <span className="px-2 py-1 bg-orange-500/20 rounded-full border border-orange-400/30 text-orange-300">
                            <Users className="w-3 h-3 inline mr-1" />
                            {recipe.servings} kişilik
                          </span>
                        )}
                        {recipe.times?.totalMinutes && (
                          <span className="px-2 py-1 bg-pink-500/20 rounded-full border border-pink-400/30 text-pink-300">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {recipe.times.totalMinutes} dk
                          </span>
                        )}
                        {recipe.difficulty && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-full border border-blue-400/30 text-blue-300">
                            {recipe.difficulty === 'easy' ? 'Kolay' : recipe.difficulty === 'medium' ? 'Orta' : 'Zor'}
                          </span>
                        )}
                        {recipe.cuisine && (
                          <span className="px-2 py-1 bg-green-500/20 rounded-full border border-green-400/30 text-green-300">
                            {recipe.cuisine}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveFavorite(recipe.title)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {recipe.times?.prepMinutes && (
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-lg font-bold text-orange-400">{recipe.times.prepMinutes}</div>
                        <div className="text-xs text-slate-300">Hazırlık (dk)</div>
                      </div>
                    )}
                    {recipe.times?.cookMinutes && (
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-lg font-bold text-pink-400">{recipe.times.cookMinutes}</div>
                        <div className="text-xs text-slate-300">Pişirme (dk)</div>
                      </div>
                    )}
                    {recipe.nutrition?.calories && (
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-lg font-bold text-green-400">{recipe.nutrition.calories}</div>
                        <div className="text-xs text-slate-300">Kalori</div>
                      </div>
                    )}
                  </div>

                  {/* Ingredients preview */}
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                        <Utensils className="w-4 h-4 text-orange-400" />
                        Malzemeler ({recipe.ingredients.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <span key={i} className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded">
                            {ingredient?.amount && ingredient?.unit 
                              ? `${ingredient?.amount} ${ingredient?.unit} ${ingredient?.name}`
                              : ingredient?.name
                            }
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Steps preview */}
                  {recipe.steps && recipe.steps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
                        <ChefHat className="w-4 h-4 text-orange-400" />
                        Yapım Aşamaları ({recipe.steps.length})
                      </h4>
                      <div className="space-y-1">
                        {recipe.steps.map((step, i) => (
                          <div key={i} className="text-xs text-slate-300 bg-white/5 p-2 rounded">
                            <span className="font-semibold text-orange-400">{step?.step}.</span> {step?.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
