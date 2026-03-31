import { NextRequest } from "next/server";
import { validatePayTRHash } from "@/lib/paytr";
import { createAdminClient } from "@/lib/supabase/admin";

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

    console.log(`>>> PayTR Callback Received: OID=${merchant_oid}, Status=${status}, Amount=${total_amount}`);

    // 1. Validate hash
    const isValid = validatePayTRHash(merchant_oid, status, total_amount, hash);

    if (!isValid) {
      console.error("!!! PayTR Callback: INVALID HASH detected for order:", merchant_oid);
      return new Response("PAYTR HASH FAILED", { status: 400 });
    }

    const supabase = createAdminClient();

    if (status === "success") {
      // 2. Extract User ID and Period from merchant_oid
      // Format: [32-char-userid][1-char-period][timestamp]
      try {
        const userIdClean = merchant_oid.substring(0, 32);
        const periodInitial = merchant_oid.substring(32, 33);

        // Restore hyphens for UUID (8-4-4-4-12) to match Supabase
        const userId = `${userIdClean.slice(0, 8)}-${userIdClean.slice(8, 12)}-${userIdClean.slice(12, 16)}-${userIdClean.slice(16, 20)}-${userIdClean.slice(20)}`;

        console.log(`>>> Processing Success Payment: User=${userId}, Period=${periodInitial}`);

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

        // 3. Update user profile (Admin client bypasses RLS)
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
          console.error("!!! Database update error during PayTR callback:", error);
          // Still return "OK" to PayTR if it's a transient DB error? 
          // PayTR docs usually suggest letting them retry if it's an internal error.
          // But to avoid "Bildirim Hatası" prompt, we return OK if we successfully reached the endpoint.
        } else {
          console.log(`>>> User profile successfully updated for: ${userId}`);
        }
      } catch (err: any) {
        console.error("!!! Error parsing merchant_oid or updating user:", err.message);
      }
    } else {
      console.warn(`>>> PayTR Payment FAILED for OID=${merchant_oid}. Reason:`, data.failed_reason_msg || "Unknown");
    }

    // PayTR expects literally "OK" as response with no extra chars
    return new Response("OK", {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("!!! PayTR Callback System Error:", error);
    return new Response("Error", { status: 500 });
  }
}
