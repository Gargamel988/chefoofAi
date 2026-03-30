export type Tier = "Free" | "Pro" | "Premium";

export interface FeatureLimit {
  allowed: boolean;
  limit?: number;
  message?: string;
  period?: "daily" | "weekly" | "monthly" | "lifetime";
}

export const SUBSCRIPTION_CONFIG: Record<Tier, Record<string, FeatureLimit>> = {
  Free: {
    ads_enabled: { allowed: true },
    generate_recipe: {
      allowed: true,
      limit: 3,
      period: "daily",
      message:
        "Günlük 3 tarif limitine ulaştınız. Pro'ya geçerek limiti 15'e çıkarabilirsiniz.",
    },
    whatever_cook: {
      allowed: false,
      message: "Buzdolabında ne var modu Pro veya Premium paket gerektirir.",
    },
    diet_filter: { allowed: true, message: "Temel filtreleme aktif." },
    manual_planner: { allowed: true },
    auto_planner: {
      allowed: false,
      message: "AI Otomatik Planlayıcı Pro veya Premium paket gerektirir.",
    },
    shopping_list: {
      allowed: false,
      message: "Akıllı Alışveriş Listesi Pro veya Premium paket gerektirir.",
    },
    macro_analysis: { allowed: true, message: "Temel makro analizi aktif." },
    daily_tracking: { allowed: true },
    history_analytics: {
      allowed: true,
      limit: 7,
      period: "daily",
      message: "Son 7 günün verilerini görebilirsiniz.",
    },
    discover_feed: { allowed: true },
    daily_suggestions: {
      allowed: true,
      limit: 1,
      period: "daily",
      message: "Günlük 1 öneri limitine ulaştınız.",
    },
  },
  Pro: {
    ads_enabled: { allowed: false },
    generate_recipe: {
      allowed: true,
      limit: 15,
      period: "daily",
      message:
        "Günlük 15 tarif limitine ulaştınız. Premium'a geçerek sınırsız kullanabilirsiniz.",
    },
    whatever_cook: { allowed: true },
    diet_filter: { allowed: true, message: "Tam filtreleme aktif." },
    manual_planner: { allowed: true },
    auto_planner: {
      allowed: true,
      limit: 1,
      period: "weekly",
      message:
        "Pro paket ile haftada sadece 1 kez otomatik plan oluşturabilirsiniz.",
    },
    shopping_list: { allowed: true },
    macro_analysis: { allowed: true, message: "Detaylı makro analizi aktif." },
    daily_tracking: { allowed: true },
    history_analytics: {
      allowed: true,
      limit: 30,
      period: "daily",
      message: "Son 30 günün verilerini görebilirsiniz.",
    },
    discover_feed: { allowed: true },
    daily_suggestions: {
      allowed: true,
      limit: 5,
      period: "daily",
      message: "Günlük 5 öneri limitine ulaştınız.",
    },
  },
  Premium: {
    ads_enabled: { allowed: false },
    generate_recipe: { allowed: true, limit: 999, period: "daily" },
    whatever_cook: { allowed: true },
    diet_filter: { allowed: true, message: "Tam filtrelemeaktif." },
    manual_planner: { allowed: true },
    auto_planner: { allowed: true, limit: 999, period: "weekly" },
    shopping_list: { allowed: true },
    macro_analysis: {
      allowed: true,
      message: "Detaylı + Trend analizi aktif.",
    },
    daily_tracking: { allowed: true },
    history_analytics: { allowed: true, limit: 999, period: "daily" },
    discover_feed: { allowed: true },
    daily_suggestions: { allowed: true, limit: 999, period: "daily" },
  },
};
