"use server";
import { createClient } from "@/lib/supabase/server";

export async function GetRecommendations(date?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], error: "Unauthorized" };

  const today = date || new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_recommendations")
    .select(
      `
      id,
      date,
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
    .eq("date", today)
    .order("created_at", { ascending: true });

  return { data: data || [], error };
}

export async function UpdateRecommendationStatus(
  id: string | number,
  is_consumed: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("daily_recommendations")
    .update({ is_consumed })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  return { data, error };
}
