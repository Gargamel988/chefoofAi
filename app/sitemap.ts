import { createClientForStatic } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chefoodai.com";
  const lastModified = new Date();

  // Statik rotalar
  const staticRoutes = [
    "",
    "/auth",
    "/discover",
    "/pricing",
    "/weekly-plan",
    "/whatever-cook",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const staticMaps = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

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
