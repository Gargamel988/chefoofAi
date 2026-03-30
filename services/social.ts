"use server";
import { createClient } from "@/lib/supabase/server";

export const GetFeed = async (limit: number = 20) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
  return data || [];
};

export const GetRecipeComments = async (recipeId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_comments")
    .select("*, profiles(*)")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  return data || [];
};

export const CheckIfFollowing = async (targetUserId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isFollowing: false };

  const { data } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  return { isFollowing: !!data };
};

export const ToggleRecipeInteraction = async (
  recipeId: string,
  userId: string,
  actionType: "like" | "save",
) => {
  const supabase = await createClient();

  // Check existing interaction
  const { data: existing } = await supabase
    .from("recipe_interactions")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .eq("type", actionType)
    .maybeSingle();

  if (existing) {
    // Remove interaction
    const { error: deleteError } = await supabase
      .from("recipe_interactions")
      .delete()
      .eq("id", existing.id);

    if (deleteError) throw deleteError;

    if (actionType === "like") {
      const { data: recipe } = await supabase.from("recipes").select("likes_count").eq("id", recipeId).single();
      await supabase.from("recipes").update({ likes_count: Math.max(0, (recipe?.likes_count || 0) - 1) }).eq("id", recipeId);
    }

    return { action: "removed", type: actionType };
  } else {
    // Add interaction
    const { error: insertError } = await supabase
      .from("recipe_interactions")
      .insert({ recipe_id: recipeId, user_id: userId, type: actionType });

    if (insertError) throw insertError;

    if (actionType === "like") {
      const { data: recipe } = await supabase.from("recipes").select("likes_count").eq("id", recipeId).single();
      await supabase.from("recipes").update({ likes_count: (recipe?.likes_count || 0) + 1 }).eq("id", recipeId);
    }

    return { action: "added", type: actionType };
  }
};

export const GetRecipeInteractions = async (recipeId: string, userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_interactions")
    .select("type")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching interactions:", error);
    return [];
  }
  return data.map(i => i.type) as ("like" | "save")[];
};

export const ToggleFollowUser = async (targetUserId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Giriş yapmanız gerekiyor." };
  if (user.id === targetUserId)
    return { error: "Kendinizi takip edemezsiniz." };

  const { data: existing } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    const { error: deleteErr } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    if (deleteErr) return { error: deleteErr.message };

    // Update counts via RPC
    await supabase.rpc("decrement_follow_counts", {
      follower_id_param: user.id,
      following_id_param: targetUserId,
    });

    return { action: "unfollowed" };
  } else {
    const { error: insertErr } = await supabase
      .from("user_follows")
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (insertErr) return { error: insertErr.message };

    // Update counts via RPC
    await supabase.rpc("increment_follow_counts", {
      follower_id_param: user.id,
      following_id_param: targetUserId,
    });

    return { action: "followed" };
  }
};

export const AddRecipeComment = async (recipeId: string, content: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız." };

  const { data, error } = await supabase
    .from("recipe_comments")
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      content,
    })
    .select("*, profiles(*)")
    .single();

  if (error) return { error: error.message };

  // Update comment count on recipe
  const { data: recipe } = await supabase
    .from("recipes")
    .select("comments_count")
    .eq("id", recipeId)
    .single();

  await supabase
    .from("recipes")
    .update({ comments_count: (recipe?.comments_count || 0) + 1 })
    .eq("id", recipeId);

  return { data };
};

export const CreatePost = async (data: {
  content: string;
  recipe_id?: string;
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız." };

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content: data.content,
    recipe_id: data.recipe_id,
  });

  if (error) return { error: error.message };
  return { success: true };
};
