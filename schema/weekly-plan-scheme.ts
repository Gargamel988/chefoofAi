import { z } from "zod";

export const mealNutritionSchema = z.object({
  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),
});

export const recipeContentSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
  servings: z.number().int().min(1).max(1).describe("Her zaman 1 kişilik"),
  times: z.object({
    prepMinutes: z.number().int(),
    cookMinutes: z.number().int(),
    totalMinutes: z.number().int(),
  }),
  ingredients: z.array(
    z.object({
      name: z.string().describe("Sadece malzeme adı, parantez yok"),
      amount: z.string().describe("Sadece sayısal değer. örn: '1/2', '2'"),
      unit: z.string().describe("Sadece birim. örn: 'bardak', 'adet'"),
      notes: z
        .string()
        .default("")
        .describe("Kullanım notu veya çeşit bilgisi"),
    }),
  ),
  steps: z
    .array(
      z.object({
        description: z.string(),
        durationMinutes: z.number().int().optional(),
      }),
    )
    .min(7)
    .describe("En az 7 adım. Son adım MUTLAKA sunum/servis olmalı"),
  tips: z
    .array(z.string())
    .length(3)
    .describe("Tam 3 adet, her biri eksiksiz ve profesyonel bir cümle"),
});

// 7 Günlük Hızlı Özet Şeması (recipe_content YOK)
export const weeklyPlanSummarySchema = z.object({
  days: z
    .array(
      z.object({
        day_of_week: z
          .number()
          .int()
          .min(1)
          .max(7)
          .describe("1=Pazartesi, 7=Pazar"),
        meals: z
          .array(
            z.object({
              meal_type: z.enum(["Kahvaltı", "Öğle", "Akşam"]),
              title: z.string(),
              recipe_slug: z
                .string()
                .describe(
                  "URL uyumlu, Türkçe karakter yok. örn: 'tavuklu-kinoa-salatasi'",
                ),
              image_keyword: z
                .string()
                .describe("İngilizce, kısa. örn: 'grilled chicken salad'"),
              description: z.string().describe("1-2 cümle kısa açıklama"),
              nutrition: mealNutritionSchema,
            }),
          )
          .length(3)
          .describe("Kahvaltı, Öğle, Akşam — tam 3 öğün"),
      }),
    )
    .length(7)
    .describe("Pazartesi'den Pazar'a tam 7 gün"),
});

// Geriye dönük uyumluluk için varsayılan export (opsiyonel recipe_content ile)
export const weeklyPlanSchema = z.object({
  days: z
    .array(
      z.object({
        day_of_week: z.number().int().min(1).max(7),
        meals: z
          .array(
            z.object({
              meal_type: z.enum(["Kahvaltı", "Öğle", "Akşam"]),
              title: z.string(),
              recipe_slug: z.string(),
              image_keyword: z.string(),
              description: z.string(),
              nutrition: mealNutritionSchema,
              recipe_content: recipeContentSchema.optional(),
            }),
          )
          .length(3),
      }),
    )
    .length(7),
});
