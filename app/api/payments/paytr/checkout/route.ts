import { NextRequest, NextResponse } from "next/server";
import { getPayTRToken, PayTRPaymentParams } from "@/lib/paytr";
import { createClient } from "@/lib/supabase/server";

/**
 * Step 1: Generate Standard Payment Token (30-Day or Yearly Access)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { tier, period = "30-day" } = body;

    let amount = 0;
    let name = "";

    if (tier === "Pro") {
      if (period === "yearly") {
        amount = 79990; // 799.90 TL
        name = "CheFood AI Pro - 1 Yıllık Erişim";
      } else {
        amount = 7999; // 79.99 TL
        name = "CheFood AI Pro - 30 Günlük Erişim";
      }
    } else if (tier === "Premium") {
      if (period === "yearly") {
        amount = 149990; // 1499.90 TL
        name = "CheFood AI Premium - 1 Yıllık Erişim";
      } else {
        amount = 14999; // 149.99 TL
        name = "CheFood AI Premium - 30 Günlük Erişim";
      }
    } else {
      return NextResponse.json({ error: "Geçersiz plan" }, { status: 400 });
    }

    // merchant_oid: Must be alphanumeric. Remove hyphens from UUID.
    // Format: [32-char-userid][1-char-period][timestamp]
    const periodInitial = period === "yearly" ? "Y" : "M";
    const userIdClean = user.id.replace(/-/g, "");
    const merchant_oid = `${userIdClean}${periodInitial}${Date.now()}`;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const user_ip = forwardedFor ? forwardedFor.split(',')[0].trim() : "127.0.0.1";
    const user_name =
      user.user_metadata?.full_name || user.email || "Kullanıcı";

    const user_basket = Buffer.from(
      JSON.stringify([[name, (amount / 100).toFixed(2), 1]]),
    ).toString("base64");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const params: PayTRPaymentParams = {
      email: user.email!,
      payment_amount: amount,
      merchant_oid,
      user_name,
      user_address: "Not Provided",
      user_phone: "05000000000",
      merchant_ok_url: `${baseUrl}`,
      merchant_fail_url: `${baseUrl}/pricing?status=fail`,
      user_basket,
      user_ip,
      lang: "tr",
      iframe_v2: "1",
    };

    const result = await getPayTRToken(params);

    if (result.status === "success") {
      return NextResponse.json({ token: result.token });
    } else {
      console.error("PayTR Token Error:", result);
      return NextResponse.json(
        { error: result.reason || "Token oluşturulamadı" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
