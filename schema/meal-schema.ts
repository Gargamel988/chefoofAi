import { z } from "zod";

export const mealSchema = z.object({
  meals: z.array(
    z.object({
      meal_type: z.enum(["Kahvaltı", "Öğle", "Akşam"]),
      title: z.string(),
      recipe_slug: z.string(),
      description: z.string(),
      nutrition_data: z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      }),
      // Tarif detaylı içeriği
      recipe_content: z.object({
        difficulty: z.enum(["easy", "medium", "hard"]),
        servings: z
          .number()
          .int()
          .min(1)
          .max(1)
          .describe("Must always be 1 (single serving)"),
        times: z.object({
          prepMinutes: z.number(),
          cookMinutes: z.number(),
          totalMinutes: z.number(),
        }),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
            unit: z.string(),
            notes: z.string().optional(),
          }),
        ),
        steps: z
          .array(
            z.object({
              description: z.string(),
              durationMinutes: z.number().optional(),
            }),
          )
          .min(7)
          .describe(
            "At least 7 cooking steps. Last step MUST be plating/serving.",
          ),
        tips: z
          .array(z.string())
          .min(3)
          .max(3)
          .describe(
            "Exactly 3 specific professional chef tips. Each must be a complete sentence.",
          ),
        nutrition: z.object({
          calories: z.number(),
          proteinGrams: z.number(),
          carbsGrams: z.number(),
          fatGrams: z.number(),
        }),
      }),
    }),
  ),
});
