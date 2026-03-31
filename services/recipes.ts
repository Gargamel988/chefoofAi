"use server";
import { createClient } from "@/lib/supabase/server";

export type RecipeInsert = {
  title: string;
  slug: string;
  description?: string;
  recipe_content?: any;
  meal_type?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  is_public?: boolean;
  cover_image?: string;
};

/* ─── Fetchers (SSR Safe) ─── */

export const GetPublicRecipes = async (limit = 20) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles (
      id,
        name,
        avatar_url
      ),
      recipe_interactions (
        id,
        user_id,
        type
      ),
      recipe_comments (
        recipe_id
      )
    `,
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Tarifleri çekerken hata:", JSON.stringify(error, null, 2));
    return { data: [], error };
  }

  // Transform data to flatten comment count
  const processedData = (data || []).map((recipe: any) => ({
    ...recipe,
    comments_count: recipe.recipe_comments?.length || 0,
  }));

  return { data: processedData, error: null };
};

export const GetRecipeBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles (
        id,
        name,
        avatar_url
      ),
      recipe_comments (
        recipe_id
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (data) {
    data.comments_count = data.recipe_comments?.length || 0;
  }

  return { data, error };
};

export const GetRecipesByUserId = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      ),
      recipe_comments (
        recipe_id
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Kullanıcı tariflerini çekerken hata:",
      JSON.stringify(error, null, 2),
    );
    return { data: [], error };
  }

  const processedData = (data || []).map((recipe: any) => ({
    ...recipe,
    comments_count: recipe.recipe_comments?.length || 0,
  }));

  return { data: processedData, error: null };
};

export const GetMyAllRecipes = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], error: "Giriş yapılmamış" };

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_interactions (
        id,
        type
      ),
      recipe_comments (
        recipe_id
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Kendi tariflerimi çekerken hata:", error);
    return { data: [], error };
  }

  // Aggregate interaction counts
  const processedData = data?.map((recipe: any) => ({
    ...recipe,
    likes_count:
      recipe.recipe_interactions?.filter((i: any) => i.type === "like")
        .length || 0,
    saves_count:
      recipe.recipe_interactions?.filter((i: any) => i.type === "save")
        .length || 0,
    comments_count: recipe.recipe_comments?.length || 0,
  }));

  return { data: processedData, error: null };
};

export const GetRecipeById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles (
        id,
        name,
        avatar_url
      ),
      recipe_comments (
        recipe_id
      )
    `,
    )
    .eq("id", id)
    .single();

  if (data) {
    data.comments_count = data.recipe_comments?.length || 0;
  }

  return { data, error };
};

// services/recipes.ts
export const getRecipeByIdWithAuth = async (id: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("recipes")
    .select("id,user_id")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    isOwner: user?.id === data.user_id,
  };
};

export const PublishRecipe = async (data: RecipeInsert) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Kullanıcı girişi yapılmamış." };

  const finalSlug = `${data.slug}-${Math.random().toString(36).substring(2, 6)}`;

  const { data: newRecipe, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      slug: finalSlug,
      title: data.title,
      description: data.description || "",
      meal_type: data.meal_type,
      source: "ne pişirsem ai",
      recipe_content: data.recipe_content,
      calories: data.calories ? Math.round(data.calories) : 0,
      protein: data.protein ? Math.round(data.protein) : 0,
      carbs: data.carbs ? Math.round(data.carbs) : 0,
      fat: data.fat ? Math.round(data.fat) : 0,
      is_public: data.is_public ?? true,
      cover_image: data.cover_image,
    })
    .select()
    .single();

  if (error) {
    console.error("Tarif paylaşılırken hata:", error);
    return { error };
  }
  return { data: newRecipe };
};

export const UpdateRecipe = async (id: string, data: Partial<RecipeInsert>) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Kullanıcı girişi yapılmamış." };

  const { data: updatedRecipe, error } = await supabase
    .from("recipes")
    .update({
      title: data.title,
      description: data.description,
      meal_type: data.meal_type,
      recipe_content: data.recipe_content,
      calories: data.calories ? Math.round(data.calories) : undefined,
      protein: data.protein ? Math.round(data.protein) : undefined,
      carbs: data.carbs ? Math.round(data.carbs) : undefined,
      fat: data.fat ? Math.round(data.fat) : undefined,
      is_public: data.is_public,
      cover_image: data.cover_image,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Tarif güncellenirken hata:", error);
    return { error };
  }
  return { data: updatedRecipe };
};

export const DeleteRecipe = async (id: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Kullanıcı girişi yapılmamış." };

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Tarif silinirken hata:", error);
    return { error };
  }
  return { error: null };
};
