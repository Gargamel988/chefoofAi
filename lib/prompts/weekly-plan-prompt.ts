// lib/prompts/weekly-plan-prompt.ts

interface WeeklyPlanPromptOptions {
  diet: string;
  goal: string;
  allergies: string;
  userPrompt?: string;
  mealCount?: number;
  dailyCalorieTarget?: number;
  prepPreference?: string;
}

// 1. Haftalık Özet Üretimi İçin Hızlı Prompt (recipe_content YOK)
export function buildWeeklyPlanSummaryPrompt({
  diet,
  goal,
  allergies,
  userPrompt = "",
  mealCount = 3,
  dailyCalorieTarget = 2000,
  prepPreference = "Pratik (15-30 dk)",
}: WeeklyPlanPromptOptions): string {
  const extraInstructions =
    userPrompt.trim().length > 0
      ? `Kullanıcının bu hafta için özel isteği: "${userPrompt.trim()}" — Bunu önceliklendir.`
      : "";

  const mealTypes =
    mealCount === 2 ? "Öğle ve Akşam" : "Kahvaltı, Öğle ve Akşam";

  return `Sen uzman bir Türk diyetisyen ve Michelin yıldızlı bir şefsin.
Aşağıdaki profile uygun, SIKICI OLMAYAN, GELENEKSEL TÜRK MUTFAĞI AĞIRLIKLI 7 günlük haftalık yemek planı özeti oluştur.
TARİF DETAYLARINI (malzemeler, adımlar) ŞİMDİLİK ÜRETME.

${extraInstructions}

Kullanıcı Profili:
- Diyet: ${diet}
- Hedef: ${goal}
- Alerjiler: ${allergies}
- Günlük Kalori Hedefi: ${dailyCalorieTarget} kcal
- Öğün Sayısı: ${mealCount} öğün (${mealTypes})
- Hazırlık Süresi Tercihi: ${prepPreference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLAN KURALLARI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GÜNLER: day_of_week 1=Pazartesi ... 7=Pazar. Sırayla üret.
2. ÖĞÜN SAYISI: Her gün tam ${mealCount} öğün — ${mealTypes}.
3. KALORİ DAĞILIMI: Her günün toplam kalorisi ${dailyCalorieTarget} kcal civarında (±100 kcal).
4. BENZERSİZLİK: ${mealCount * 7} öğünün hiçbiri birbirini tekrar etmesin.
5. PROTEİN ÇEŞİTLİLİĞİ: Her gün farklı protein kaynağı (et, tavuk, balık, baklagil vb.).

${mealCount === 3 ? `KAHVALTI: Sağlıklı Türk kahvaltısı versiyonları.` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- title: Türkçe, iştah açıcı.
- recipe_slug: İngilizce, URL-safe.
- description: Türkçe, 1-2 cümle kısa özet.
- nutrition: Kalori ve makrolar.`;
}

// 2. Tek Bir Tarif İçin Detaylı recipe_content Üretme Prompt'u (Lazy Generation)
export function buildSingleRecipePrompt({
  diet,
  goal,
  allergies,
  recipeTitle,
  mealType,
}: {
  diet: string;
  goal: string;
  allergies: string;
  recipeTitle: string;
  mealType: string;
}): string {
  return `Sen Michelin yıldızlı bir şefsin. "${recipeTitle}" (${mealType}) yemeği için profesyonel bir tarif içeriği (recipe_content) oluştur.

Kullanıcı Profili:
- Diyet: ${diet}
- Hedef: ${goal}
- Alerjiler: ${allergies} (Bunları KESİNLİKLE kullanma)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARİF KURALLARI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ingredients[].amount: SADECE sayısal (örn: "1/2", "2"). Birim yazma.
2. ingredients[].unit: SADECE birim (örn: "bardak", "yemek kaşığı").
3. ingredients[].name: SADECE malzeme adı. Parantez yasak.
4. ingredients[].notes: Açıklamaları buraya yaz.
5. steps: En az 7 profesyonel adım. Son adım servis.
6. tips: 3 adet profesyonel püf noktası.
7. servings: Her zaman 1.
8. difficulty: easy | medium | hard arasından seç.

Lütfen sadece recipeContentSchema yapısına uygun veriyi üret.`;
}

// Geriye dönük uyumluluk için (Eski fonksiyonu summary'ye yönlendiriyoruz)
export const buildWeeklyPlanPrompt = buildWeeklyPlanSummaryPrompt;
