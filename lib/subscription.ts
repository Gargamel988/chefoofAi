import { createClient } from "@/lib/supabase/server";
import { SUBSCRIPTION_CONFIG, Tier } from "@/config/subscriptions";

export interface SubscriptionStatus {
  tier: Tier;
  isActive: boolean;
  expiryDate: string | null;
}

/**
 * Gets the current subscription status of a user (Server Side)
 */
export const getSubscriptionStatusSnapshot = async (
  userId: string,
): Promise<SubscriptionStatus> => {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, subscription_expiry")
    .eq("id", userId)
    .single();

  if (!profile) return { tier: "Free", isActive: false, expiryDate: null };

  const isExpired = profile.subscription_expiry
    ? new Date(profile.subscription_expiry) < new Date()
    : false;

  // Free users are always "active" in terms of basic features, but restricted
  const isActive =
    profile.subscription_tier === "Free" ||
    (profile.subscription_status === "active" && !isExpired);

  return {
    tier: (profile.subscription_tier as Tier) || "Free",
    isActive: !!isActive,
    expiryDate: profile.subscription_expiry,
  };
};

/**
 * Detailed Feature Access Check
 */
export const checkFeatureAccess = async (
  userId: string,
  feature: string,
  context?: any,
): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> => {
  // DEV BYPASS: Local development should never hit limits
  if (process.env.NODE_ENV === "development") {
    return { allowed: true };
  }

  const sub = await getSubscriptionStatusSnapshot(userId);
  const tier = sub.tier;
  const config = SUBSCRIPTION_CONFIG[tier][feature];

  if (!config) {
    return { allowed: false, reason: "Bilinmeyen özellik." };
  }

  if (!config.allowed) {
    return { allowed: false, reason: config.message || "Bu özellik paketinizde mevcut değil." };
  }

  // Handle Usage-Based Limits
  if (config.limit && config.limit < 999) {
    let currentUsage = 0;

    if (feature === "generate_recipe") {
      currentUsage = await getDailyRecipeCount(userId);
    } else if (feature === "daily_suggestions") {
      const usage = await getDailySuggestionUsage(userId);
      currentUsage = usage.count;
    } else if (feature === "auto_planner") {
      const lastPlanAt = await getLastAutoPlanDate(userId);
      if (lastPlanAt) {
        const lastDate = new Date(lastPlanAt);
        const now = new Date();
        const diffMs = now.getTime() - lastDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        currentUsage = diffDays < 7 ? 1 : 0; // Simplified weekly check
      }
    }

    if (currentUsage >= config.limit) {
      return {
        allowed: false,
        reason: config.message || `İşlem limitine ulaştınız.`,
        limit: config.limit,
        current: currentUsage,
      };
    }

    return { allowed: true, limit: config.limit, current: currentUsage };
  }

  return { allowed: true };
};

/**
 * Counts recipes generated today
 */
export async function getDailyRecipeCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("source", "ai")
    .gte("created_at", startOfToday.toISOString());

  return count || 0;
}

/**
 * Gets the last time the user successfully saved an AI-generated weekly plan
 */
async function getLastAutoPlanDate(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("last_auto_plan_at")
    .eq("id", userId)
    .single();

  return data?.last_auto_plan_at || null;
}

/**
 * Gets current day's recommendation usage from profiles
 */
async function getDailySuggestionUsage(
  userId: string,
): Promise<{ count: number; lastDate: string | null }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("last_daily_suggestion_at, daily_suggestion_count")
    .eq("id", userId)
    .single();

  if (!data) return { count: 0, lastDate: null };

  const lastAt = data.last_daily_suggestion_at;
  if (!lastAt) return { count: 0, lastDate: null };

  const lastDate = new Date(lastAt).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  // Reset count if it's a new day
  if (lastDate !== today) {
    return { count: 0, lastDate };
  }

  return { count: data.daily_suggestion_count || 0, lastDate };
}
