"use client";
import { FavoriteRecipe } from "@/type/recipetype";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStorage = () => {
  const queryClient = useQueryClient();
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("favorites");
        return saved ? (JSON.parse(saved) as FavoriteRecipe[]) : [];
      }
      return [];
    },
  });

  const saveFavorites = useMutation({
    mutationFn: (favorite: FavoriteRecipe): Promise<boolean> => {
      const getFavorites = favorites?.some(
        (fav) => fav.title === favorite.title
      );
      if (getFavorites) {
        return Promise.resolve(false);
      }
      const updatedFavorites = [...(favorites || []), favorite];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: (title: string): Promise<boolean> => {
      const updatedFavorites = favorites?.filter((fav) => fav.title !== title);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const clearFavorites = useMutation({
    mutationFn: (): Promise<boolean> => {
      localStorage.removeItem("favorites");
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites,
    saveFavorites,
    removeFavorite,
    clearFavorites,
  };
};
