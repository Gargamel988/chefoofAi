"use server";
import { createClient } from "@/lib/supabase/server";
import { AIPlanMeal, PlanItem } from "@/components/weekly-plan-ai/types";

const TABLE = "weekly_meal_plan_items";

// ─── FETCH (SSR Safe) ────────────────────────────────────────────────────────

export async function fetchWeeklyPlan(): Promise<PlanItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      id,
      day_of_week,
      meal_type,
      is_consumed,
      recipe_id,
      recipes (
        id,
        slug,
        title,
        description,
        calories,
        protein,
        carbs,
        fat,
        recipe_content
      )
    `,
    )
    .eq("user_id", user.id)
    .order("day_of_week", { ascending: true });

  if (error) throw error;
  
  // Supabase may return recipes as an array depending on schema, normalize it
  const normalized = (data as any[])?.map(item => ({
    ...item,
    recipes: Array.isArray(item.recipes) ? item.recipes[0] : item.recipes
  }));

  return (normalized as PlanItem[]) ?? [];
}

// ─── SAVE (replace all) (Server Action) ───────────────────────────────────────

export async function saveWeeklyPlan(meals: AIPlanMeal[]): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const { data: oldItems } = await supabase
    .from(TABLE)
    .select("recipe_id")
    .eq("user_id", user.id);

  const oldRecipeIds = oldItems?.map((i) => i.recipe_id).filter(Boolean) ?? [];

  if (oldRecipeIds.length) {
    await supabase
      .from("recipes")
      .delete()
      .in("id", oldRecipeIds)
      .eq("user_id", user.id)
      .eq("source", "ai");
  }

  const { data: insertedRecipes, error: recipesError } = await supabase
    .from("recipes")
    .insert(
      meals.map((meal) => ({
        slug: meal.recipe_slug,
        user_id: user.id,
        title: meal.title,
        description: meal.description,
        meal_type: meal.meal_type,
        source: "ai",
        recipe_content: null,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        is_public: false,
      })),
    )
    .select("id, slug");

  if (recipesError) throw recipesError;

  const slugToId = Object.fromEntries(
    insertedRecipes.map((r) => [r.slug, r.id]),
  );

  const { error: insertError } = await supabase.from(TABLE).insert(
    meals.map((meal) => ({
      user_id: user.id,
      day_of_week: meal.day_of_week,
      meal_type: meal.meal_type,
      recipe_id: slugToId[meal.recipe_slug],
      is_consumed: false,
    })),
  );

  if (insertError) throw insertError;

  // Update profile with last_auto_plan_at
  await supabase
    .from("profiles")
    .update({ last_auto_plan_at: new Date().toISOString() })
    .eq("id", user.id);
}

// ─── DELETE ALL (Server Action) ───────────────────────────────────────────────

export async function deleteWeeklyPlan(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from(TABLE).delete().eq("user_id", user.id);
  if (error) throw error;
}

// ─── TOGGLE is_consumed (Server Action) ───────────────────────────────────────

export async function toggleMealConsumed(
  id: string,
  is_consumed: boolean,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ is_consumed })
    .eq("id", id);
  if (error) throw error;
}
