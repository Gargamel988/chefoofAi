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
  actionType: "like" | "save",
) => {
  console.log(`[DEBUG] ToggleRecipeInteraction starting: recipeId=${recipeId}, type=${actionType}`);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[DEBUG] ToggleRecipeInteraction: No user found!");
    throw new Error("Giriş yapmalısınız.");
  }
  console.log(`[DEBUG] ToggleRecipeInteraction user: ${user.id}`);

  // Check existing interaction
  const { data: existing, error: checkError } = await supabase
    .from("recipe_interactions")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .eq("type", actionType)
    .maybeSingle();

  if (checkError) {
    console.error("[DEBUG] ToggleRecipeInteraction check error:", checkError);
    throw checkError;
  }

  if (existing) {
    console.log(`[DEBUG] ToggleRecipeInteraction: Removing existing interaction ${existing.id}`);
    const { error: deleteError } = await supabase
      .from("recipe_interactions")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("[DEBUG] ToggleRecipeInteraction delete error:", deleteError);
      throw deleteError;
    }

    if (actionType === "like") {
      const { data: recipe, error: recipeErr } = await supabase.from("recipes").select("likes_count").eq("id", recipeId).single();
      if (recipeErr) console.error("[DEBUG] ToggleRecipeInteraction recipe fetch error:", recipeErr);
      const currentCount = recipe?.likes_count || 0;
      const { error: updateErr } = await supabase.from("recipes").update({ likes_count: Math.max(0, currentCount - 1) }).eq("id", recipeId);
      if (updateErr) console.error("[DEBUG] ToggleRecipeInteraction count update error:", updateErr);
    }

    return { action: "removed", type: actionType };
  } else {
    console.log(`[DEBUG] ToggleRecipeInteraction: Adding new interaction`);
    const { error: insertError } = await supabase
      .from("recipe_interactions")
      .insert({ recipe_id: recipeId, user_id: user.id, type: actionType });

    if (insertError) {
      console.error("[DEBUG] ToggleRecipeInteraction insert error:", insertError);
      throw insertError;
    }

    if (actionType === "like") {
      const { data: recipe, error: recipeErr } = await supabase.from("recipes").select("likes_count").eq("id", recipeId).single();
      if (recipeErr) console.error("[DEBUG] ToggleRecipeInteraction recipe fetch error:", recipeErr);
      const currentCount = recipe?.likes_count || 0;
      const { error: updateErr } = await supabase.from("recipes").update({ likes_count: currentCount + 1 }).eq("id", recipeId);
      if (updateErr) console.error("[DEBUG] ToggleRecipeInteraction count update error:", updateErr);
    }

    return { action: "added", type: actionType };
  }
};

export const GetRecipeInteractions = async (recipeId: string, userId?: string) => {
  const supabase = await createClient();
  let targetUid = userId;

  if (!targetUid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    targetUid = user.id;
  }

  const { data, error } = await supabase
    .from("recipe_interactions")
    .select("type")
    .eq("recipe_id", recipeId)
    .eq("user_id", targetUid);

  if (error) {
    console.error("Error fetching interactions:", error);
    return [];
  }
  return data.map(i => i.type) as ("like" | "save")[];
};

export const ToggleFollowUser = async (targetUserId: string) => {
  console.log(`[DEBUG] ToggleFollowUser starting: targetUserId=${targetUserId}`);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[DEBUG] ToggleFollowUser: No user found!");
    return { error: "Giriş yapmanız gerekiyor." };
  }
  if (user.id === targetUserId) {
    console.warn("[DEBUG] ToggleFollowUser: Self-follow attempt");
    return { error: "Kendinizi takip edemezsiniz." };
  }
  console.log(`[DEBUG] ToggleFollowUser user: ${user.id}`);

  const { data: existing, error: checkError } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (checkError) {
    console.error("[DEBUG] ToggleFollowUser check error:", checkError);
    return { error: checkError.message };
  }

  if (existing) {
    console.log(`[DEBUG] ToggleFollowUser: Unfollowing`);
    const { error: deleteErr } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    if (deleteErr) {
      console.error("[DEBUG] ToggleFollowUser delete error:", deleteErr);
      return { error: deleteErr.message };
    }

    // Update counts MANUALLY
    const { data: followerProfile, error: fErr } = await supabase.from("profiles").select("following_count").eq("id", user.id).single();
    const { data: followingProfile, error: flErr } = await supabase.from("profiles").select("followers_count").eq("id", targetUserId).single();
    
    if (fErr) console.error("[DEBUG] ToggleFollowUser: follower profile fetch error", fErr);
    if (flErr) console.error("[DEBUG] ToggleFollowUser: following profile fetch error", flErr);

    const up1 = await supabase.from("profiles").update({ following_count: Math.max(0, (followerProfile?.following_count || 0) - 1) }).eq("id", user.id);
    const up2 = await supabase.from("profiles").update({ followers_count: Math.max(0, (followingProfile?.followers_count || 0) - 1) }).eq("id", targetUserId);

    if (up1.error) console.error("[DEBUG] ToggleFollowUser: follower update error", up1.error);
    if (up2.error) console.error("[DEBUG] ToggleFollowUser: following update error", up2.error);

    return { action: "unfollowed" };
  } else {
    console.log(`[DEBUG] ToggleFollowUser: Following`);
    const { error: insertErr } = await supabase
      .from("user_follows")
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (insertErr) {
      console.error("[DEBUG] ToggleFollowUser insert error:", insertErr);
      return { error: insertErr.message };
    }

    // Update counts MANUALLY
    const { data: followerProfile, error: fErr } = await supabase.from("profiles").select("following_count").eq("id", user.id).single();
    const { data: followingProfile, error: flErr } = await supabase.from("profiles").select("followers_count").eq("id", targetUserId).single();

    if (fErr) console.error("[DEBUG] ToggleFollowUser: follower profile fetch error", fErr);
    if (flErr) console.error("[DEBUG] ToggleFollowUser: following profile fetch error", flErr);

    const up1 = await supabase.from("profiles").update({ following_count: (followerProfile?.following_count || 0) + 1 }).eq("id", user.id);
    const up2 = await supabase.from("profiles").update({ followers_count: (followingProfile?.followers_count || 0) + 1 }).eq("id", targetUserId);

    if (up1.error) console.error("[DEBUG] ToggleFollowUser: follower update error", up1.error);
    if (up2.error) console.error("[DEBUG] ToggleFollowUser: following update error", up2.error);

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
