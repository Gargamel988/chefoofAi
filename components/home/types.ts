// DB'den gelen öneri kaydı (GET /api/recommendations)
export type MealData = {
  id: string | number;
  date?: string;
  meal_type: string;
  is_consumed: boolean;
  recipe_id?: string;
  recipes: {
    id: string;
    slug: string;
    title: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipe_content?: any;
  } | null;
};
