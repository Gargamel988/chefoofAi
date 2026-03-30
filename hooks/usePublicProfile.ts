import { useQuery } from "@tanstack/react-query";
import { GetProfileById } from "@/services/profiles";
import { GetRecipesByUserId } from "@/services/recipes";

export function usePublicProfile(userId: string) {
  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await GetProfileById(userId);
      if (error) throw error;
      return data;
    },
  });

  const recipesQuery = useQuery({
    queryKey: ["recipes", "user", userId],
    queryFn: async () => {
      const { data, error } = await GetRecipesByUserId(userId);
      if (error) throw error;
      return data || [];
    },
  });

  return {
    profile: profileQuery.data,
    recipes: recipesQuery.data,
    isLoading: profileQuery.isLoading || recipesQuery.isLoading,
    isError: profileQuery.isError || recipesQuery.isError,
  };
}
