"use server";
import { createClient } from "@/lib/supabase/server";

/* ─── Fetchers (SSR Safe) ─── */

export const getFavorites = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: favs, error } = await supabase
    .from("recipe_interactions")
    .select(
      `id, created_at, recipe:recipes(id, title, slug, recipe_content, calories, user_id, cover_image)`,
    )
    .eq("user_id", user.id)
    .eq("type", "save");

  if (error || !favs) return [];

  const ownerIds = [
    ...new Set(
      favs.map((f: any) => {
        const recipe = Array.isArray(f.recipe) ? f.recipe[0] : f.recipe;
        return recipe?.user_id;
      }),
    ),
  ].filter(Boolean) as string[];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", ownerIds);

  return favs.map((fav: any) => {
    const recipe = Array.isArray(fav.recipe) ? fav.recipe[0] : fav.recipe;
    return {
      ...fav,
      profile: profiles?.find((p) => p.id === recipe?.user_id) ?? null,
      recipe: recipe || null,
    };
  });
};

export const isFavorite = async (recipeId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from("recipe_interactions")
    .select("recipe_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .eq("type", "save");
  if (error) return false;
  return data.length > 0;
};

export const addFavorite = async (recipeId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız" };

  const { data, error } = await supabase
    .from("recipe_interactions")
    .insert({ user_id: user.id, recipe_id: recipeId, type: "save" })
    .select()
    .single();

  if (error) {
    console.error("Favori ekleme hatası:", error);
    return { error: error.message };
  }
  return { data };
};

export const removeFavorite = async (recipeId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız" };

  const { error } = await supabase
    .from("recipe_interactions")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .eq("type", "save");

  if (error) {
    console.error("Favori silme hatası:", error);
    return { error: error.message };
  }
  return { success: true };
};
