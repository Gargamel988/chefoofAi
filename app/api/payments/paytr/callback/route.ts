import { NextRequest, NextResponse } from "next/server";
import { validatePayTRHash } from "@/lib/paytr";
import { createClient } from "@/lib/supabase/server";

/**
 * Step 2: Handle Standard Payment Callback Notifications (30-Day or Yearly Access)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const merchant_oid = data.merchant_oid as string;
    const status = data.status as string;
    const total_amount = data.total_amount as string;
    const hash = data.hash as string;

    // 1. Validate hash
    const isValid = validatePayTRHash(merchant_oid, status, total_amount, hash);

    if (!isValid) {
      console.error("PayTR Callback: Invalid Hash");
      return new Response("PAYTR HASH FAILED", { status: 400 });
    }

    const supabase = await createClient();

    if (status === "success") {
      // 2. Extract User ID and Period from merchant_oid
      // Format: [32-char-userid][1-char-period][timestamp]
      const userIdClean = merchant_oid.substring(0, 32);
      const periodInitial = merchant_oid.substring(32, 33);

      // Restore hyphens for UUID (8-4-4-4-12) to match Supabase
      const userId = `${userIdClean.slice(0, 8)}-${userIdClean.slice(8, 12)}-${userIdClean.slice(12, 16)}-${userIdClean.slice(16, 20)}-${userIdClean.slice(20)}`;

      console.log(`Payment success for user: ${userId}, Period: ${periodInitial}, Order: ${merchant_oid}`);

      // Calculate expiry date
      const expiryDate = new Date();
      if (periodInitial === "Y") {
        expiryDate.setDate(expiryDate.getDate() + 366); // 1 Year + 1 day grace
      } else {
        expiryDate.setDate(expiryDate.getDate() + 31); // 30 Days + 1 day grace
      }

      // Determine tier from amount (to be safe)
      let tier = "Pro";
      if (total_amount.startsWith("149")) {
        tier = "Premium";
      }

      // 3. Update user profile
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_tier: tier,
          subscription_status: "active",
          subscription_expiry: expiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Database update error:", error);
      }
    }

    // PayTR expects "OK" as response
    return new Response("OK");
  } catch (error: any) {
    console.error("PayTR Callback Error:", error);
    return new Response("Error", { status: 500 });
  }
}
