import { useSuspenseQuery } from "@tanstack/react-query";
import { GetDailyConsumedCalories } from "@/services/meals";

export function useDailyCalories() {
  return useSuspenseQuery<number>({
    queryKey: ["daily_calories", new Date().toISOString().split("T")[0]],
    queryFn: GetDailyConsumedCalories,
  });
}
