import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { WeeklyMeal, WeeklyPlanFormData } from "./types";
import { 
  fetchWeeklyPlan, 
  saveWeeklyPlan, 
  deleteWeeklyPlan, 
  toggleMealConsumed 
} from "@/services/weeklyPlan";
import { toast } from "sonner";
import { translateSupabaseError } from "@/lib/errorTranslator";

export function useWeeklyPlan(day: string) {
  return useSuspenseQuery({
    queryKey: ["weekly_plan", day],
    queryFn: async () => {
      const data = await fetchWeeklyPlan();
      
      const dayOfWeekMap: Record<string, number> = {
        "Pazartesi": 1, "Salı": 2, "Çarşamba": 3,
        "Perşembe": 4, "Cuma": 5, "Cumartesi": 6, "Pazar": 7
      };
      const dayOfWeek = dayOfWeekMap[day];

      const filtered = (data || []).filter((item: any) => item.day_of_week === dayOfWeek);

      return filtered.map((item: any) => {
        const recipe = item.recipes;
        const content = recipe?.recipe_content;
        const times = content?.times;
        
        return {
          id: item.id,
          day: day,
          meal_type: item.meal_type,
          recipe_title: recipe?.title,
          description: recipe?.description,
          difficulty: content?.difficulty,
          ingredients: content?.ingredients,
          steps: content?.steps,
          nutrition: content?.nutrition,
          is_consumed: item.is_consumed,
          times: times ? {
            ...times,
            total: (times.prep || 0) + (times.cook || 0)
          } : undefined,
        };
      }) as WeeklyMeal[];
    },
  });
}

export function useSaveMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      day,
      mealType,
      formData,
      weekStart,
      dayOfWeek,
    }: {
      day: string;
      mealType: string;
      formData: WeeklyPlanFormData;
      weekStart: string;
      dayOfWeek: number;
    }) => {
      const meals = [{
        day_of_week: dayOfWeek,
        meal_type: mealType,
        title: formData.recipeTitle,
        description: formData.description,
        recipe_slug: `${formData.recipeTitle.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        calories: formData.nutrition.cal,
        protein: formData.nutrition.protein,
        carbs: formData.nutrition.carbs,
        fat: formData.nutrition.fat,
      }];
      
      return saveWeeklyPlan(meals as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_plan"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (err: any) => {
        toast.error(translateSupabaseError(err.message));
    }
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteWeeklyPlan();
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_plan"] });
    },
    onError: (err: any) => {
        toast.error(translateSupabaseError(err.message));
    }
  });
}
