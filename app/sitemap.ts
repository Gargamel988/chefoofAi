import { createClientForStatic } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chefoodai.com";
  const lastModified = new Date();

  // Statik rotalar - Tek tek tanımlandı (Google Search Optimizasyonu)
  const staticMaps: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/weekly-plan`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/whatever-cook`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dinamik tarif rotaları
  try {
    const supabase = await createClientForStatic();
    const { data: recipes } = await supabase
      .from("recipes")
      .select("slug, updated_at")
      .eq("is_public", true);

    if (recipes) {
      const recipeMaps = recipes.map((recipe) => ({
        url: `${baseUrl}/recipe/${recipe.slug}`,
        lastModified: recipe.updated_at
          ? new Date(recipe.updated_at)
          : lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      return [...staticMaps, ...recipeMaps];
    }
  } catch (error) {
    console.error("Sitemap recipes fetch error:", error);
  }

  return staticMaps;
}
