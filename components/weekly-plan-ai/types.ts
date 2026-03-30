// DB'den gelen haftalık plan öğesi (weekly_meal_plan_items JOIN recipes)
export type PlanItem = {
  id: string;
  day_of_week: number;
  meal_type: string;
  is_consumed: boolean;
  recipe_id: string;
  recipes: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipe_content?: any;
  } | null;
};

// AI stream'inden gelen ham öğün (kaydetmeden önce)
export type AIPlanMeal = {
  day_of_week: number;
  meal_type: string;
  title: string;
  recipe_slug: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  recipe_content?: any;
};

// UI'da gösterim için normalize edilmiş (PlanItem veya AIPlanMeal)
export type DisplayMeal = {
  id?: string;
  day_of_week: number;
  meal_type: string;
  is_consumed?: boolean;
  title: string;
  recipe_slug?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  description?: string;
  recipe_content?: any;
};

export type WeeklyPlanItem = {
  user_id: string;
  week_start: string;
  day_of_week: number;
  meal_type: string;
  is_consumed: boolean;
  recipe_id: string;
  recipes: {
    slug: string;
    user_id: string;
    title: string;
    description: string;
    meal_type: string;
    source: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipe_content?: any;
  } | null;
};
