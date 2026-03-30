import { streamObjectSchema } from "@/schema/stream-object-schemes";
import { streamObject } from "ai";
import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import {
  checkFeatureAccess,
  getSubscriptionStatusSnapshot,
} from "@/lib/subscription";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { dish, type } = await request.json();
    const isFridge = type === "fridge";

    // Auth & Profile Fetch
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 1. Subscription & Feature Access Check
    const sub = await getSubscriptionStatusSnapshot(user.id);

    // Check Whatever-Cook Access
    if (isFridge) {
      const access = await checkFeatureAccess(user.id, "whatever_cook");
      if (!access.allowed) {
        return new Response(JSON.stringify({ error: access.reason }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Check Daily Recipe Limit
    const limitCheck = await checkFeatureAccess(user.id, "generate_recipe");
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ error: limitCheck.reason }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    let profileContext = "";
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      const isFullFiler = sub.tier !== "Free";

      profileContext = `
KİŞİSEL PROFİL VE BESLENME TERCİHLERİ:
- Seçilen Diyet: ${profile.diet_type || "Belirtilmedi"}
- Alerjiler/Kaçınılanlar: ${profile.allergies?.join(", ") || "Yok (Zorunlu kısıtlama yok)"}
- Sevilen Mutfaklar: ${profile.cuisines?.join(", ") || "Farketmez"}
- Beslenme Hedefi: ${profile.goal || "Sağlıklı ve dengeli beslenme"}

!DİKKAT! Yukarıdaki alerji veya kaçınılan malzemeler listesinde geçen HİÇBİR malzemeyi tarife dahil etmemelisin (varsa). Bu hayati önem taşır!
${!isFullFiler ? "\nNOT: Ücretsiz plan kullanıcısı için temel bir tarif oluştur. Karmaşık malzeme listelerinden kaçın." : "\nNOT: Kullanıcı paketine uygun olarak maksimum detayda, gurme ve besin değerleri optimize edilmiş bir tarif oluştur."}
`;
    }

    let prompt = "";

    if (isFridge) {
      prompt = `
Sen profesyonel, yaratıcı ve pratik çözümler sunan Michelin yıldızlı bir şefsin.
Senden KULLANICININ ELİNDEKİ MALZEMELER ile yapılabilecek "Buzdolabında ne varsa" konseptine uygun, israfı önleyen, pratik ve lezzetli bir tarif oluşturman isteniyor.

ELDEKİ MALZEMELER / İSTEK: 
"${dish}"

GÖREVİN VE KESİN KURALLAR:
1. SADECE VEYA AĞIRLIKLI OLARAK kullanıcının verdiği malzemeleri kullanarak harika bir tarif oluştur. Temel mutfak malzemeleri (yağ, tuz, karabiber, su, asit vb.) eklenebilir. Ekstra alışveriş gerektiren ana malzeme ekleme.
2. MANTIKLI ÖLÇÜLER: 2 porsiyonluk bir tarif için baharatları (tuz, karabiber vb.) "1 çay kaşığı" gibi makul ölçüde ver.
3. KULLANILMAYAN MALZEME OLMASIN: Malzemeler listesinde yazan HER ŞEY (su, yağ dahil) mutlaka yapılış adımlarında spesifik olarak nerede kullanılacağı belirtilerek yer almalı.
4. ŞEFİN ÖNERİSİ: Profesyonel, mutfak bilimine dayalı teknik bir ipucu ver.
5. ÇIKTI: Tarifin başlığı iştah açıcı olsun. JSON şemasına kesinlikle uygun çıktı ver.
`;
    } else {
      prompt = `
Sen profesyonel, yaratıcı ve beslenme konusunda uzman yapay zeka şefi CheFood AI'sın.
Senden "Evde ne varsa / Ne pişirsem" konseptine uygun, aşırı lezzetli, pratik veya gurme bir tarif oluşturman isteniyor.

KULLANICININ İSTEĞİ / ELİNDEKİ MALZEMELER: 
"${dish}"
${profileContext}

GÖREVİN:
1. Kullanıcının talebine (elindeki kısıtlı malzemelere) ve profiline EN UYGUN harika bir tarif oluştur.
2. Diyet türüne (Örn: Vegan, Keto, Yüksek Protein) ve hedefe maksimum uyum sağla. Sağlıklı alternatiflere öncelik ver.
3. Alerjilere/Kaçınılanlara KESİNLİKLE saygı göster.
4. Tarifin başlığı iştah açıcı olsun.
6. Makro değerlerini porsiyon başına gerçeğe en yakın şekilde tahmin et.
7. Adımları kısa, anlaşılır ve ilham verici tut.
8. ${streamObjectSchema.description || "İstenen şema formatına"} KESİNLİKLE uygun JSON çıktısı ver.
`;
    }

    const response = streamObject({
      model: google("gemini-2.5-flash"),
      schema: streamObjectSchema,
      prompt: prompt,
    });

    return response.toTextStreamResponse();
  } catch (error: Error | unknown) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
