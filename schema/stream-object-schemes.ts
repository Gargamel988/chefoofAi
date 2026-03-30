import { z } from "zod";

export const streamObjectSchema = z.object({
  title: z.string().describe("Tarif adı / başlık"),
  slug: z
    .string()
    .describe("URL uyumlu benzersiz kısa isim (örn: firinda-somon)"),
  servings: z.number().int().positive().describe("Kaç kişilik"),
  times: z
    .object({
      prepMinutes: z.number().int().nonnegative(),
      cookMinutes: z.number().int().nonnegative(),
      totalMinutes: z.number().int().nonnegative(),
    })
    .describe("Hazırlık, pişirme ve toplam süre (dakika)"),
  cuisine: z.string().describe("Mutfak türü (Türk, İtalyan vb.)"),
  difficulty: z.enum(["easy", "medium", "hard"]).describe("Zorluk seviyesi"),
  ingredients: z
    .array(
      z.object({
        name: z.string().describe("Malzeme adı"),
        amount: z.number().describe("Miktar"),
        unit: z.string().describe("Birim (gr, ml, adet vb.)"),
        notes: z.string().describe("Varyasyon / not"),
      }),
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
          .describe("Tahmini süre (dakika)"),
      }),
    )
    .describe("Adım adım talimatlar"),
  nutrition: z
    .object({
      calories: z.number(),
      proteinGrams: z.number().nullable(),
      fatGrams: z.number().nullable(),
      carbsGrams: z.number().nullable(),
    })
    .describe("Besin değerleri (yaklaşık)"),
  equipment: z.array(z.string()).describe("Gerekli ekipmanlar"),
  tips: z.array(z.string()).describe("İpuçları / servis önerileri"),
});
