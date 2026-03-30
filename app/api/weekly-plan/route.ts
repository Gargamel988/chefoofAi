import { NextResponse } from "next/server";
import { generateObject, streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import {
  weeklyPlanSummarySchema,
  recipeContentSchema,
} from "@/schema/weekly-plan-scheme";
import {
  buildWeeklyPlanSummaryPrompt,
  buildSingleRecipePrompt,
} from "@/lib/prompts/weekly-plan-prompt";
import { checkFeatureAccess } from "@/lib/subscription";

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
    const { recipe_id } = body;

    // ─────────────────────────────────────────────────────────────────────────
    // MOD A: TEKLİ TARİF ÜRETİMİ (Eğer recipe_id varsa)
    // ─────────────────────────────────────────────────────────────────────────
    if (recipe_id) {
      // Check Daily Recipe Limit (Counts as 1 generation)
      const limitCheck = await checkFeatureAccess(user.id, "generate_recipe");
      if (!limitCheck.allowed) {
        return NextResponse.json({ error: limitCheck.reason }, { status: 403 });
      }

      const { data: recipe, error: fetchError } = await supabase
        .from("recipes")
        .select("recipe_content, title, meal_type")
        .eq("id", recipe_id)
        .eq("user_id", user.id)
        .single();

      if (fetchError || !recipe) {
        return NextResponse.json({ error: "Tarif bulunamaz" }, { status: 404 });
      }

      if (recipe.recipe_content) {
        return NextResponse.json({ data: recipe.recipe_content });
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("diet_type, goal, allergies")
        .eq("id", user.id)
        .single();

      const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: recipeContentSchema,
        prompt: buildSingleRecipePrompt({
          diet: profile?.diet_type || "Belirtilmedi",
          goal: profile?.goal || "Belirtilmedi",
          allergies: profile?.allergies?.join(", ") || "Yok",
          recipeTitle: recipe.title,
          mealType: recipe.meal_type || "Öğün",
        }),
      });

      await supabase
        .from("recipes")
        .update({ recipe_content: object })
        .eq("id", recipe_id);

      return NextResponse.json({ data: object });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MOD B: HAFTALIK ÖZET PLAN ÜRETİMİ (Hızlı Başlangıç)
    // ─────────────────────────────────────────────────────────────────────────
    
    // Check Auto-Planner Access (Weekly limit for Pro, blocked for Free)
    const access = await checkFeatureAccess(user.id, "auto_planner");
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("diet_type, goal, allergies")
      .eq("id", user.id)
      .single();

    const {
      userPrompt = "",
      mealCount = 3,
      dailyCalorieTarget = 2000,
      prepPreference = "Pratik (15-30 dk)",
    } = body;

    const result = streamObject({
      model: google("gemini-2.0-flash"),
      schema: weeklyPlanSummarySchema,
      prompt: buildWeeklyPlanSummaryPrompt({
        userPrompt,
        mealCount,
        dailyCalorieTarget,
        prepPreference,
        diet: profile?.diet_type || "Belirtilmedi",
        goal: profile?.goal || "Belirtilmedi",
        allergies: profile?.allergies?.join(", ") || "Yok",
      }),
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("🔥 [WeeklyPlan API] ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
