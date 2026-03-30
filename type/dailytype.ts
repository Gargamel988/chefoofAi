// AI'dan gelen ham öğün verisi (mealSchema çıktısıyla eşleşir)
export type AIMeal = {
  recipe_slug: string;
  title: string;
  description: string;
  meal_type: "Kahvaltı" | "Öğle" | "Akşam";
  recipe_content: any;
  nutrition_data: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

// AI'dan gelen tüm öneri (streamObject çıktısı)
export type AIRecommendationObject = {
  meals: AIMeal[];
};

// Recipes tablosuna yazılacak kayıt
export type RecipeInsert = {
  slug: string;
  user_id: string;
  title: string;
  description: string;
  meal_type: string;
  source: "ai";
  recipe_content: any;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  is_public: boolean;
};

// Daily recommendations tablosuna yazılacak kayıt
export type DailyRecommendationInsert = {
  user_id: string;
  date: string;
  meal_type: string;
  recipe_id: string;
  is_consumed: boolean;
};

// Supabase'den GET ile okunan öneri kaydı
export type DailyRecommendation = {
  id: string;
  date: string;
  meal_type: string;
  is_consumed: boolean;
  recipe_id: string;
  recipes: {
    id: string;
    slug: string;
    title: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipe_content: any;
  } | null;
};
