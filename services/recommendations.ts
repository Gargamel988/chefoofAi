"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

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

export async function GenerateDailyRecommendations(body: any) {
  // We call the API route to trigger the AI generation and DB saving
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Recommendations generation failed:", errorText);
    throw new Error(
      `Generation failed: ${response.status} ${response.statusText}`,
    );
  }

  // We wait for the stream to complete to ensure data is saved by the API's onFinish
  const reader = response.body?.getReader();
  if (reader) {
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }
  }

  return { success: true };
}
