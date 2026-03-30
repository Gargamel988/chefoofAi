import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchWeeklyPlan,
  saveWeeklyPlan,
  deleteWeeklyPlan,
  toggleMealConsumed,
} from "@/services/weeklyPlan";
import { AIPlanMeal, PlanItem } from "@/components/weekly-plan-ai/types";

export const WEEKLY_PLAN_KEY = ["weekly_meal_plan"] as const;

export function useWeeklyPlanQuery() {
  return useQuery({
    queryKey: WEEKLY_PLAN_KEY,
    queryFn: fetchWeeklyPlan,
  });
}

export function useSaveWeeklyPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meals: AIPlanMeal[]) => saveWeeklyPlan(meals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEEKLY_PLAN_KEY });
      onSuccess?.();
    },
  });
}

export function useDeleteWeeklyPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWeeklyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEEKLY_PLAN_KEY });
      onSuccess?.();
    },
  });
}

export function useToggleMealConsumed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_consumed }: { id: string; is_consumed: boolean }) =>
      toggleMealConsumed(id, is_consumed),
    onMutate: async ({ id, is_consumed }) => {
      await queryClient.cancelQueries({ queryKey: WEEKLY_PLAN_KEY });
      const previous = queryClient.getQueryData<PlanItem[]>(WEEKLY_PLAN_KEY); // any → PlanItem[]
      queryClient.setQueryData<PlanItem[]>(WEEKLY_PLAN_KEY, (old) =>
        (old ?? []).map((item) =>
          item.id === id ? { ...item, is_consumed } : item,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WEEKLY_PLAN_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WEEKLY_PLAN_KEY });
    },
  });
}
