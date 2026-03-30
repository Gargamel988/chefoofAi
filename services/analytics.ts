"use server";
import { createClient } from "@/lib/supabase/server";

export interface NutritionStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  target_calories: number;
}

export async function GetNutritionAnalytics(): Promise<NutritionStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { calories: 0, protein: 0, carbs: 0, fat: 0, target_calories: 2000 };

  // Get start of the week (Monday)
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);

  // Fetch consumed items from both daily_recommendations and weekly_meal_plan_items
  // Actually, we should check which table is being used for "today's consumed" 
  // Based on previous work, daily_recommendations is used for the daily view.
  
  const { data: recommendations } = await supabase
    .from("daily_recommendations")
    .select(`
      is_consumed,
      recipes (
        calories,
        protein,
        carbs,
        fat
      )
    `)
    .eq("user_id", user.id)
    .eq("is_consumed", true)
    .gte("date", monday.toISOString().split("T")[0]);

  // Also check weekly plan items for the current week
  // (Assuming weekly plan items also have a date or we just use the current week's setup)
  // For simplicity, let's aggregate daily_recommendations first as it's the most common "history" source.

  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  recommendations?.forEach((item: any) => {
    const r = Array.isArray(item.recipes) ? item.recipes[0] : item.recipes;
    if (r) {
      totals.calories += r.calories || 0;
      totals.protein += r.protein || 0;
      totals.carbs += r.carbs || 0;
      totals.fat += r.fat || 0;
    }
  });

  // Get target from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("goal")
    .eq("id", user.id)
    .single();

  // Simple heuristic for target calories if not set
  let target = 2000;
  if (profile?.goal?.includes("kilo ver") || profile?.goal?.includes("zayıfla")) target = 1800;
  if (profile?.goal?.includes("kilo al") || profile?.goal?.includes("kas")) target = 2500;

  return {
    ...totals,
    target_calories: target * 7, // Weekly target
  };
}

export async function GetConsumedHistory(limit = 6) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("daily_recommendations")
    .select(`
      id,
      date,
      recipes (
        id,
        title,
        slug,
        cover_image,
        calories
      )
    `)
    .eq("user_id", user.id)
    .eq("is_consumed", true)
    .order("date", { ascending: false })
    .limit(limit);

  return data?.map((item: any) => {
    const r = Array.isArray(item.recipes) ? item.recipes[0] : item.recipes;
    return {
      id: item.id,
      name: r?.title || "Bilinmeyen Tarif",
      date: item.date,
      img: r?.cover_image || "/placeholder-recipe.jpg",
      cal: r?.calories || 0,
      slug: r?.slug
    };
  }) || [];
}

export async function GetMonthlyStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0 };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count } = await supabase
    .from("daily_recommendations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_consumed", true)
    .gte("date", startOfMonth.toISOString().split("T")[0]);

  return { count: count || 0 };
}
