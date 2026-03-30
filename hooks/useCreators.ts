import { GetPopularProfiles } from "@/services/profiles";
import { useQuery } from "@tanstack/react-query";

export function useCreators(limit: number = 10) {
  return useQuery({
    queryKey: ["profiles", "popular", limit],
    queryFn: async () => {
      const { data, error } = await GetPopularProfiles(limit);
      if (error) throw error;
      return data || [];
    },
  });
}
