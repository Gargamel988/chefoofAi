"use server";
import { createClient } from "@/lib/supabase/server";

export const GetDailyConsumedCalories = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Kullanıcı girişi yapılmamış");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("daily_recommendations")
    .select("is_consumed, recipes(calories)")
    .eq("user_id", user.id)
    .eq("is_consumed", true)
    .gte("created_at", today.toISOString());

  if (error) {
    console.error("Meals fetch error:", error);
    return 0;
  }

  const todayKal = data?.reduce((sum, meal) => {
    const kal = (meal.recipes as any)?.calories || 0;
    return sum + kal;
  }, 0) || 0;

  return todayKal;
};
