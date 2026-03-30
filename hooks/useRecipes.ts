import {
  GetPublicRecipes,
  GetMyAllRecipes,
  DeleteRecipe,
  PublishRecipe,
  UpdateRecipe,
} from "@/services/recipes";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

export function useRecipes(limit: number = 20) {
  return useQuery({
    queryKey: ["recipes", "public", limit],
    queryFn: async () => {
      const { data, error } = await GetPublicRecipes(limit);
      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ["recipes", "me"],
    queryFn: async () => {
      const { data, error } = await GetMyAllRecipes();
      if (error) throw typeof error === "string" ? new Error(error) : error;
      return data || [];
    },
  });
}

export function useRecipeMutations() {
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: PublishRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      UpdateRecipe(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Tarif başarıyla silindi.");
    },
    onError: (err: any) => {
      toast.error(translateSupabaseError(err.message));
    },
  });

  return {
    publishRecipe: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    updateRecipe: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRecipe: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
