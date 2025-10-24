import { z } from "zod";

export const streamObjectSchema = z.object({
  title: z.string().describe("Tarif adı / başlık"),
  servings: z.number().int().positive().optional().describe("Kaç kişilik"),
  times: z
    .object({
      prepMinutes: z.number().int().nonnegative().optional(),
      cookMinutes: z.number().int().nonnegative().optional(),
      totalMinutes: z.number().int().nonnegative().optional(),
    })
    .optional()
    .describe("Hazırlık, pişirme ve toplam süre (dakika)"),
  cuisine: z.string().optional().describe("Mutfak türü (Türk, İtalyan vb.)"),
  difficulty: z
    .enum(["easy", "medium", "hard"]) 
    .optional()
    .describe("Zorluk seviyesi"),
  ingredients: z
    .array(
      z.object({
        name: z.string().describe("Malzeme adı"),
        amount: z.number().optional().describe("Miktar"),
        unit: z.string().optional().describe("Birim (gr, ml, adet vb.)"),
        notes: z.string().optional().describe("Varyasyon / not"),
      })
    )
    .describe("Malzemeler listesi"),
  steps: z
    .array(
      z.object({
        step: z.number().int().positive().describe("Adım numarası"),
        description: z.string().describe("Adım açıklaması"),
        durationMinutes: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .describe("Tahmini süre (dakika)"),
      })
    )
    .describe("Adım adım talimatlar"),
  nutrition: z
    .object({
      calories: z.number().optional(),
      proteinGrams: z.number().optional(),
      fatGrams: z.number().optional(),
      carbsGrams: z.number().optional(),
    })
    .optional()
    .describe("Besin değerleri (yaklaşık)"),
  equipment: z.array(z.string()).optional().describe("Gerekli ekipmanlar"),
  tips: z.array(z.string()).optional().describe("İpuçları / servis önerileri"),
});