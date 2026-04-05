import { useQuery } from "@tanstack/react-query";
import { GetNutritionAnalytics, GetConsumedHistory, GetMonthlyStats } from "@/services/analytics";
import { getFavorites } from "@/services/favorite";

export function useNutritionAnalytics() {
  return useQuery({
    queryKey: ["analytics", "nutrition"],
    queryFn: () => GetNutritionAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useConsumedHistory(limit = 6) {
  return useQuery({
    queryKey: ["analytics", "history", limit],
    queryFn: () => GetConsumedHistory(limit),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ["analytics", "monthly"],
    queryFn: () => GetMonthlyStats(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useHomeFavorites() {
  return useQuery({
    queryKey: ["favorites", "home"],
    queryFn: () => getFavorites(),
    select: (data) => data.slice(0, 3),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}
