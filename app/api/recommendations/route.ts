import { NextResponse } from "next/server";
import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { mealSchema } from "@/schema/meal-schema";
import { buildMealPrompt } from "@/lib/prompts/meal-prompt";
import {
  upsertRecipes,
  insertDailyRecommendations,
  deleteRecommendationById,
  deleteAllDailyRecommendations,
  deleteRecipeById,
  deleteAllRecipes,
} from "@/services/daily";
import { checkFeatureAccess } from "@/lib/subscription";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const today =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    const { data: existingMeals, error: dbError } = await supabase
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

    if (dbError) throw dbError;

    return NextResponse.json({ data: existingMeals || [] });
  } catch (error: any) {
    console.error("GET Recommendations Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || "generate_all";
    const specificMealType = body.meal_type || "Kahvaltı";
    const oldMealId = body.old_meal_id;

    const userId = user.id;

    // Check for 1/day limit
    const access = await checkFeatureAccess(userId, "daily_suggestions");
    if (!access.allowed && action === "generate_all") {
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("diet_type, goal, allergies")
      .eq("id", userId)
      .single();

    const diet = profile?.diet_type || "Belirtilmedi";
    const goal = profile?.goal || "Belirtilmedi";
    const allergies = profile?.allergies?.join(", ") || "Yok";
    const today = new Date().toISOString().split("T")[0];

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      schema: mealSchema,
      prompt: buildMealPrompt({
        diet,
        goal,
        allergies,
        action,
        specificMealType,
      }),
      onFinish: async ({ object }) => {
        if (!object?.meals) return;
        try {
          // Eski kayıtları temizle
          if (action === "regenerate" && oldMealId) {
            // Recommendation'dan tarif id'sini bul
            const { data: rec } = await supabase
              .from("daily_recommendations")
              .select("recipe_id")
              .eq("id", oldMealId)
              .single();

            if (rec?.recipe_id) {
              await deleteRecipeById(rec.recipe_id, userId);
            }
            await deleteRecommendationById(oldMealId, userId);
          } else {
            await deleteAllDailyRecommendations(userId, today);
            await deleteAllRecipes(userId, today);
          }

          // Recipes tablosuna upsert yap, slug→id eşlemesini al
          const slugToId = await upsertRecipes(object.meals, userId);

          // daily_recommendations tablosuna kaydet
          await insertDailyRecommendations(
            object.meals,
            slugToId,
            userId,
            today,
          );

          // Update last suggestion timestamp and increment count
          const { data: profile } = await supabase
            .from("profiles")
            .select("last_daily_suggestion_at, daily_suggestion_count")
            .eq("id", userId)
            .single();

          const now = new Date();
          const currentDayStr = now.toISOString().split("T")[0];
          const lastDate = profile?.last_daily_suggestion_at ? new Date(profile.last_daily_suggestion_at).toISOString().split("T")[0] : null;

          const newCount = (lastDate === currentDayStr) ? (profile?.daily_suggestion_count || 0) + 1 : 1;

          await supabase
            .from("profiles")
            .update({ 
              last_daily_suggestion_at: now.toISOString(),
              daily_suggestion_count: newCount
            })
            .eq("id", userId);
            
        } catch (err) {
          console.error("Recommendations DB error:", err);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("POST Recommendations Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_consumed } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("daily_recommendations")
      .update({ is_consumed })
      .eq("id", id)
      .eq("user_id", user.id)
      .select(
        `
        id,
        is_consumed,
        recipes (
          title,
          calories
        )
      `,
      )
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
