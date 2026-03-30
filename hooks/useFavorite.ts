import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
} from "@/services/favorite";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

export function useFavorite(recipeId?: string) {
  const queryClient = useQueryClient();

  // Queries
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const { data: isFav } = useQuery({
    queryKey: ["is_favorite", recipeId],
    queryFn: () => (recipeId ? isFavorite(recipeId) : Promise.resolve(false)),
    enabled: !!recipeId,
  });

  // Mutations
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const alreadyFav = favorites?.some((f: any) => f.recipe?.id === id);
      if (alreadyFav) {
        return removeFavorite(id);
      } else {
        return addFavorite(id);
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData(["favorites"]);

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["is_favorite"] });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const removeFav = useMutation({
    mutationFn: (id: string) => removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["is_favorite"] });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  return {
    favorites,
    isFav,
    toggleFavorite: toggleMutation.mutateAsync,
    removeFavorite: removeFav,
    isToggling: toggleMutation.isPending,
  };
}
