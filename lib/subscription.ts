import { createClient } from "@/lib/supabase/server";

export type Tier = "Free" | "Pro" | "Premium";

export interface SubscriptionStatus {
  tier: Tier;
  isActive: boolean;
  expiryDate: string | null;
}

/**
 * Gets the current subscription status of a user (Server Side)
 */
export const getSubscriptionStatusSnapshot = async (userId: string): Promise<SubscriptionStatus> => {
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
  const isActive = (profile.subscription_tier === "Free") || (profile.subscription_status === "active" && !isExpired);

  return {
    tier: (profile.subscription_tier as Tier) || "Free",
    isActive: !!isActive,
    expiryDate: profile.subscription_expiry,
  };
};

/**
 * Detailed Feature Access Check
 */
export const checkFeatureAccess = async (userId: string, feature: string, context?: any): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}> => {
  const sub = await getSubscriptionStatusSnapshot(userId);
  const tier = sub.tier;

  // 1. AI Recipe Generation Limit
  if (feature === "generate_recipe") {
    const limits = { Free: 3, Pro: 15, Premium: 999 };
    const limit = limits[tier];
    const current = await getDailyRecipeCount(userId);
    
    return {
      allowed: current < limit,
      reason: current >= limit ? `Günlük ${limit} tarif limitine ulaştınız. ${tier === 'Premium' ? '' : 'Yükseltme yaparak limiti artırabilirsiniz.'}` : undefined,
      limit,
      current
    };
  }

  // 2. Whatever-Cook (Buzdolabında ne var)
  if (feature === "whatever_cook") {
    const allowed = tier === "Pro" || tier === "Premium";
    return {
      allowed,
      reason: allowed ? undefined : "Buzdolabında ne var modu Pro veya Premium paket gerektirir."
    };
  }

  // 3. AI Otomatik Planlayıcı
  if (feature === "auto_planner") {
    if (tier === "Free") return { allowed: false, reason: "Otomatik planlayıcı Pro veya Premium paket gerektirir." };
    if (tier === "Premium") return { allowed: true };
    
    // Pro Tier: 1 per week
    const lastPlanAt = await getLastAutoPlanDate(userId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const isAllowed = !lastPlanAt || new Date(lastPlanAt) < oneWeekAgo;
    return {
      allowed: isAllowed,
      reason: isAllowed ? undefined : "Pro paket ile haftada sadece 1 kez otomatik plan oluşturabilirsiniz. Premium'a geçerek sınırsız kullanabilirsiniz."
    };
  }

  // 4. Daily AI Suggestions (Tier Based: 1, 5, Unlimited)
  if (feature === "daily_suggestions") {
    const limits = { Free: 1, Pro: 5, Premium: 999 };
    const limit = limits[tier];
    
    const usage = await getDailySuggestionUsage(userId);
    const isAllowed = usage.count < limit;
    
    return {
      allowed: isAllowed,
      reason: isAllowed ? undefined : `Günlük ${limit} öneri limitine ulaştınız. ${tier === 'Premium' ? '' : 'Yükseltme yaparak limiti artırabilirsiniz.'}`,
      limit,
      current: usage.count
    };
  }

  // 5. Akıllı Alışveriş Listesi
  if (feature === "shopping_list") {
    const allowed = tier === "Pro" || tier === "Premium";
    return { allowed };
  }

  // 6. Geçmiş & Analiz (History)
  if (feature === "history_access") {
    const dayLimits = { Free: 7, Pro: 30, Premium: 999 };
    return { allowed: true, limit: dayLimits[tier] };
  }

  // 7. Reklamlar
  if (feature === "ads_enabled") {
    return { allowed: tier === "Free" };
  }

  return { allowed: false, reason: "Bilinmeyen özellik." };
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
async function getDailySuggestionUsage(userId: string): Promise<{ count: number; lastDate: string | null }> {
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
