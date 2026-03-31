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
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  return { isFollowing: !!data };
};

export const ToggleRecipeInteraction = async (
  recipeId: string,
  actionType: "like" | "save",
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("toggle_recipe_interaction", {
    p_recipe_id: recipeId,
    p_type: actionType,
  });

  if (error) {
    console.error("[SOCIAL] RPC Error:", error);
    throw error;
  }

  return { action: data === "added" ? "added" : "removed", type: actionType };
};

export const GetRecipeInteractions = async (
  recipeId: string,
  userId?: string,
) => {
  const supabase = await createClient();
  let targetUid = userId;

  if (!targetUid) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    targetUid = user.id;
  }

  const { data, error } = await supabase
    .from("recipe_interactions")
    .select("type")
    .eq("recipe_id", recipeId)
    .eq("user_id", targetUid);

  if (error) {
    console.error("[SOCIAL] Error fetching interactions:", error);
    return [];
  }
  return (data || []).map((i) => i.type) as ("like" | "save")[];
};

export const ToggleFollowUser = async (targetUserId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("toggle_follow", {
    p_target_user_id: targetUserId,
  });

  if (error) {
    console.error("[SOCIAL] Follow RPC Error:", error);
    return { error: error.message };
  }

  // Returns 'followed', 'unfollowed', or 'self'
  return { action: data };
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
