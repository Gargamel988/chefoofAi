"use server";
import { createClient } from "@/lib/supabase/server";
import { getSafePublicUrl } from "@/lib/utils/storage";

export interface Profile {
  id?: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  diet_type?: string;
  allergies?: string[];
  cuisines?: string[];
  goal?: string;
  followers_count?: number;
  following_count?: number;
  onboarding_completed?: boolean;
  is_public: boolean;
  favorites_public?: boolean;
  followers_public?: boolean;
  subscription_tier?: "Free" | "Pro" | "Premium";
  subscription_status?: "active" | "inactive" | "expired";
  subscription_expiry?: string;
  last_auto_plan_at?: string;
  created_at?: string;
}

/* ─── Fetchers (SSR Safe) ─── */

export const getMyProfile = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Profile;
};

export const GetProfileById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

export const GetPopularProfiles = async (limit = 10) => {
  const supabase = await createClient();
  
  // We fetch counts by joining with recipes. 
  // Since we can't easily order by subquery count in PostgREST .order(),
  // we fetch a larger set and sort in JS, or just fetch all if it's a small pool.
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      recipes:recipes(count)
    `);

  if (error) return { data: null, error };

  // Sort by recipe count
  const sortedData = (data || []).sort((a: any, b: any) => {
    const aCount = a.recipes?.[0]?.count || 0;
    const bCount = b.recipes?.[0]?.count || 0;
    return bCount - aCount;
  });

  return { data: sortedData.slice(0, limit), error: null };
};

export const InsertProfile = async (data: Profile) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not found" };
  }
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.user?.id,
      name: user.user?.user_metadata.full_name,
      diet_type: data.diet_type,
      allergies: data.allergies,
      cuisines: data.cuisines,
      goal: data.goal,
      onboarding_completed: true,
    },
    { onConflict: "id" },
  );
  if (error) {
    console.error(error);
    return { error };
  }
  return { error };
};

export const UpdateProfile = async ({
  id,
  ...data
}: {
  id: string;
  [key: string]: any;
}) => {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(data).eq("id", id);
  if (error) {
    console.error(error);
    return { error };
  }
  return { error };
};

export const DeleteProfile = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    console.error(error);
    return { error };
  }
  return { error };
};

export const UpdateEmail = async (email: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw error;
  return { success: true };
};

export const UpdatePassword = async (password: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return { success: true };
};

export const UploadAvatar = async ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) => {
  if (!userId || !file) throw new Error("userId veya dosya eksik");

  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatar")
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatar").getPublicUrl(path);

  const safeUrl = getSafePublicUrl(publicUrl);
  const urlWithBust = `${safeUrl}?t=${Date.now()}`;

  // Also update the profile record
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlWithBust })
    .eq("id", userId);

  if (updateError) throw updateError;

  return urlWithBust;
};
