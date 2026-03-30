import { z } from "zod";

export const weeklyPlanFormSchema = z.object({
  recipeTitle: z.string().min(3, "Tarif adı en az 3 karakter olmalıdır"),
  selectedMealType: z.string().min(1, "Lütfen bir öğün türü seçin"),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Malzeme adı zorunludur"),
      amount: z.string().min(1, "Miktar zorunludur"),
      unit: z.string().optional(),
    })
  ).min(1, "En az bir malzeme eklemelisiniz"),
  steps: z.array(
    z.object({
      description: z.string().min(5, "Adım açıklaması en az 5 karakter olmalıdır"),
    })
  ).min(1, "En az bir adım eklemelisiniz"),
  nutrition: z.object({
    cal: z.coerce.number().min(0).default(0),
    protein: z.coerce.number().min(0).default(0),
    carbs: z.coerce.number().min(0).default(0),
    fat: z.coerce.number().min(0).default(0),
  }),
  times: z.object({
    prep: z.coerce.number().min(0).default(0),
    cook: z.coerce.number().min(0).default(0),
  }),
});
