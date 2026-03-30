import { useQuery } from "@tanstack/react-query";
import { GetNutritionAnalytics, GetConsumedHistory, GetMonthlyStats } from "@/services/analytics";
import { getFavorites } from "@/services/favorite";

export function useNutritionAnalytics() {
  return useQuery({
    queryKey: ["analytics", "nutrition"],
    queryFn: () => GetNutritionAnalytics(),
  });
}

export function useConsumedHistory(limit = 6) {
  return useQuery({
    queryKey: ["analytics", "history", limit],
    queryFn: () => GetConsumedHistory(limit),
  });
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ["analytics", "monthly"],
    queryFn: () => GetMonthlyStats(),
  });
}

export function useHomeFavorites() {
  return useQuery({
    queryKey: ["favorites", "home"],
    queryFn: () => getFavorites(),
    select: (data) => data.slice(0, 3), // Only need a few for home
  });
}
