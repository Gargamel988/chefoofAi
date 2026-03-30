"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Tier = "Free" | "Pro" | "Premium";

export function useSubscription() {
  const [subscription, setSubscription] = useState<{
    tier: Tier;
    isActive: boolean;
    loading: boolean;
    lastAutoPlanAt: string | null;
  }>({
    tier: "Free",
    isActive: false,
    loading: true,
    lastAutoPlanAt: null,
  });

  const supabase = createClient();

  useEffect(() => {
    async function getSub() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(s => ({ ...s, loading: false }));
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier, subscription_status, subscription_expiry, last_auto_plan_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        const isExpired = profile.subscription_expiry 
          ? new Date(profile.subscription_expiry) < new Date() 
          : false;
        
        setSubscription({
          tier: (profile.subscription_tier as Tier) || "Free",
          isActive: (profile.subscription_tier === "Free") || (profile.subscription_status === "active" && !isExpired),
          loading: false,
          lastAutoPlanAt: profile.last_auto_plan_at || null,
        });
      } else {
        setSubscription(s => ({ ...s, loading: false }));
      }
    }

    getSub();
  }, [supabase]);

  return subscription;
}
