interface MealPromptOptions {
  diet: string;
  goal: string;
  allergies: string;
  action: "generate_all" | "regenerate";
  specificMealType?: string;
}

export function buildMealPrompt({
  diet,
  goal,
  allergies,
  action,
  specificMealType = "Kahvaltı",
}: MealPromptOptions): string {
  const randomSeed = Math.floor(Math.random() * 10000);

  const mealPrompt =
    action === "regenerate"
      ? `Sadece "${specificMealType}" öğünü için bambaşka, yepyeni ve önceki günlerden kesinlikle farklı 1 öğün öner.`
      : `Kahvaltı, Öğle ve Akşam olmak üzere 3 farklı öğün öner.`;

  return `Sen uzman bir Türk diyetisyen ve Michelin yıldızlı bir şefsin. Yaratıcılık Seviyesi/Seed: ${randomSeed}. Tüm yazılı içerikler (title, description, malzeme isimleri, adım açıklamaları, ipuçları) TÜRKÇE olsun. Difficulty alanı İngilizce (easy/medium/hard) olsun. Aşağıdaki profile uygun olarak ${mealPrompt}

Profil:
- Diyet: ${diet}
- Hedef: ${goal}
- Alerjiler: ${allergies}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALAN FORMATLARI — ASLA İHLAL ETME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  amount: '1/2 yemek kaşığı'" gibi birim+miktar karışımı ASLA yazma.
  Limon suyu örneği: amount: '1/2', unit: 'yemek kaşığı' — sadece bu format.

▸ ingredients[].amount → SADECE sayısal değer yaz. Birim ASLA yazma.
  DOĞRU:   amount: "1/2",  unit: "bardak"
  YANLIŞ:  amount: "1/2 bardak", unit: "bardak"

▸ ingredients[].unit → SADECE birimi yaz, başka hiçbir şey ekleme.
  DOĞRU:   unit: "yemek kaşığı"
  YANLIŞ:  unit: "yemek kaşığı yemek kaşığı"

▸ ingredients[].name → SADECE malzeme adı. Parantez, açıklama, kullanım notu YASAK.
  DOĞRU:   name: "Sarımsak"
  YANLIŞ:  name: "Sarımsak (Rendelemek için)"

▸ ingredients[].notes → Parantez içi açıklamaları, kullanım notlarını ve çeşit bilgisini BURAYA yaz.
  DOĞRU:   notes: "İnce rendelenmiş"
  YANLIŞ:  notes alanını boş bırakıp açıklamayı name'e yazmak

▸ tips[] → Tam 3 adet, her biri tam ve bitmiş bir cümle olmalı.
  DOĞRU:   "Sarımsağı yağa atmadan önce yağın ısındığından emin olun, aksi halde çiğ kalır."
  YANLIŞ:  "Sarımsağı yağda" ← yarım cümle

▸ recipe_content.nutrition → nutrition_data ile AYNI değerleri taşımalı.
  proteinGrams = nutrition_data.protein
  carbsGrams   = nutrition_data.carbs
  fatGrams     = nutrition_data.fat
  calories     = nutrition_data.calories

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PİŞİRME KURALLARI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PORSİYON: Tüm tarifler KESİNLİKLE 1 kişiliktir (servings=1).
   Baharatlar max "1/2 çay kaşığı" veya "1 çimdik". Yağ max "2 yemek kaşığı".

2. ALERJEN KONTROLÜ: Kullanıcı alerjisi varsa o malzeme ve türevlerini KULLANMA.

3. HAYALET MALZEME YASAK: ingredients listesindeki HER malzeme steps içinde kullanılmalı.

4. ADIM SAYISI: En az 7 adım. Son adım MUTLAKA servis/sunum adımı olmalı.

5. PİŞİRME MANTIĞI: Sıralama doğru olsun.
   - Önce ön hazırlık (doğrama, ıslatma vb.)
   - Sonra pişirme (yağ ısıtma → soğan/sarımsak → ana malzeme)
   - En son birleştirme ve sunum

6. LEZZET DERİNLİĞİ: Asidite (limon, sirke) ve umami (salça kavurma, domates pişirme) dokunuşu kat.

7. ŞEF İPUÇLARI: 3 ipucu birbirinden tamamen farklı olsun.
   ✓ "Zeytinyağına bir diş sarımsak atıp 30 saniye bekleterek yağın aromasını yükseltebilirsiniz."
   ✗ "Malzemeleri pişirirken dikkatli olun."

8. FORMAT:
   - recipe_slug → URL uyumlu, Türkçe karakter yok (örn: "tavuklu-kinoa-salatasi")
   - image_keyword → İngilizce, virgülsüz, kısa (örn: "chicken quinoa salad")`;
}
