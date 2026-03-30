"use server";
import { createClient } from "@/lib/supabase/server";
import {
  AIMeal,
  DailyRecommendationInsert,
  RecipeInsert,
} from "../type/dailytype";

export const upsertRecipes = async (
  meals: AIMeal[],
  userId: string,
): Promise<Record<string, string>> => {
  const supabase = await createClient();

  const recipesToUpsert: RecipeInsert[] = meals.map((meal) => ({
    slug: meal.recipe_slug,
    user_id: userId,
    title: meal.title,
    description: meal.description,
    meal_type: meal.meal_type,
    source: "ai",
    recipe_content: meal.recipe_content,
    calories: meal.nutrition_data.calories,
    protein: meal.nutrition_data.protein,
    carbs: meal.nutrition_data.carbs,
    fat: meal.nutrition_data.fat,
    is_public: false,
  }));

  const { data: insertedRecipes, error: recipesError } = await supabase
    .from("recipes")
    .upsert(recipesToUpsert, { onConflict: "slug,user_id" })
    .select("id, slug");

  if (recipesError) throw recipesError;

  // slug → id map döndür
  return Object.fromEntries(
    (insertedRecipes ?? []).map((r: { id: string; slug: string }) => [
      r.slug,
      r.id,
    ]),
  );
};
export const deleteRecipeById = async (
  recipeId: string,
  userId: string,
): Promise<void> => {
  const supabase = await createClient();

  // Favorilerde olup olmadığını kontrol et
  const { data: favorite } = await supabase
    .from("recipe_favorites")
    .select("recipe_id")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .single();

  // Eğer favorilerdeyse silme
  if (favorite) return;

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const deleteAllRecipes = async (
  userId: string,
  today: string,
): Promise<void> => {
  const supabase = await createClient();

  // Favori tarifleri bul
  const { data: favorites } = await supabase
    .from("recipe_favorites")
    .select("recipe_id")
    .eq("user_id", userId);

  const favoriteIds = favorites?.map((f) => f.recipe_id) || [];

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  let query = supabase
    .from("recipes")
    .delete()
    .eq("user_id", userId)
    .eq("source", "ai")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  // Eğer favoriler varsa onları SİLME
  if (favoriteIds.length > 0) {
    query = query.not("id", "in", `(${favoriteIds.join(",")})`);
  }

  const { error } = await query;

  if (error) throw error;
};
/**
 * daily_recommendations tablosuna toplu kayıt ekler.
 */
export const insertDailyRecommendations = async (
  meals: AIMeal[],
  slugToId: Record<string, string>,
  userId: string,
  today: string,
): Promise<void> => {
  const supabase = await createClient();

  const recordsToInsert: DailyRecommendationInsert[] = meals.map((meal) => ({
    user_id: userId,
    date: today,
    meal_type: meal.meal_type,
    recipe_id: slugToId[meal.recipe_slug],
    is_consumed: false,
  }));

  const { error: dailyError } = await supabase
    .from("daily_recommendations")
    .insert(recordsToInsert);

  if (dailyError) throw dailyError;
};

/**
 * Belirli bir öneriyi ID ile siler (tekil "yeniden oluştur" işlemi için).
 */
export const deleteRecommendationById = async (
  oldMealId: string,
  userId: string,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("daily_recommendations")
    .delete()
    .eq("id", oldMealId)
    .eq("user_id", userId);

  if (error) throw error;
};

/**
 * Kullanıcının o güne ait tüm önerilerini siler (Tümünü Yenile işlemi için).
 */
export const deleteAllDailyRecommendations = async (
  userId: string,
  today: string,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("daily_recommendations")
    .delete()
    .eq("user_id", userId)
    .eq("date", today);

  if (error) throw error;
};
